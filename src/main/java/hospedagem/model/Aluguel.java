package hospedagem.model;

import hospedagem.exception.DataInvalidaException;
import hospedagem.exception.QuartoIndisponivelException;
import hospedagem.tarifa.GerenciadorTarifas;
import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.List;
import java.util.Objects;

@Entity
public class Aluguel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDate dataEntrada;
    private LocalDate dataSaida;
    private boolean cancelado = false;

    @ManyToOne
    private Cliente cliente;

    @ManyToOne
    private Quarto quarto;

    public double calcularValorTotal() {
        validarDatas();
        long dias = dataSaida.toEpochDay() - dataEntrada.toEpochDay();
        double valorBase = dias * quarto.calcularDiaria();
        return GerenciadorTarifas.getInstance().calcular(valorBase, this);
    }

    public void validarDatas() {
        if (dataEntrada == null || dataSaida == null) {
            throw new DataInvalidaException("Data de entrada e data de saida devem ser informadas");
        }

        if (!dataSaida.isAfter(dataEntrada)) {
            throw new DataInvalidaException("Data de saida deve ser posterior a data de entrada");
        }
    }

    public void validarDisponibilidade(List<Aluguel> alugueisExistentes) {
        validarDatas();

        if (quarto == null || alugueisExistentes == null) {
            return;
        }

        boolean quartoOcupado = alugueisExistentes.stream()
                .filter(aluguel -> !aluguel.isCancelado())
                .filter(aluguel -> mesmoQuarto(aluguel.getQuarto()))
                .anyMatch(this::datasSobrepostas);

        if (quartoOcupado) {
            throw new QuartoIndisponivelException("Quarto indisponivel para o periodo informado");
        }
    }

    private boolean mesmoQuarto(Quarto outroQuarto) {
        if (outroQuarto == null) {
            return false;
        }

        if (quarto.getId() != null && outroQuarto.getId() != null) {
            return Objects.equals(quarto.getId(), outroQuarto.getId());
        }

        return quarto == outroQuarto;
    }

    private boolean datasSobrepostas(Aluguel aluguelExistente) {
        return dataEntrada.isBefore(aluguelExistente.getDataSaida())
                && dataSaida.isAfter(aluguelExistente.getDataEntrada());
    }

    public Long getId() {
        return id;
    }

    public LocalDate getDataEntrada() {
        return dataEntrada;
    }

    public void setDataEntrada(LocalDate dataEntrada) {
        this.dataEntrada = dataEntrada;
    }

    public LocalDate getDataSaida() {
        return dataSaida;
    }

    public void setDataSaida(LocalDate dataSaida) {
        this.dataSaida = dataSaida;
    }

    public boolean isCancelado() {
        return cancelado;
    }

    public void setCancelado(boolean cancelado) {
        this.cancelado = cancelado;
    }

    public Cliente getCliente() {
        return cliente;
    }

    public void setCliente(Cliente cliente) {
        this.cliente = cliente;
    }

    public Quarto getQuarto() {
        return quarto;
    }

    public void setQuarto(Quarto quarto) {
        this.quarto = quarto;
    }
}
