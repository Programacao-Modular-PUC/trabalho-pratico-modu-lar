package hospedagem.tarifa;

import hospedagem.model.Aluguel;

public class TarifaBaixaTemporada implements TarifaStrategy {

    private final double percentualDesconto;

    public TarifaBaixaTemporada() {
        this(0.10);
    }

    public TarifaBaixaTemporada(double percentualDesconto) {
        this.percentualDesconto = percentualDesconto;
    }

    @Override
    public double aplicar(double valorAtual, Aluguel aluguel) {
        return valorAtual * (1 - percentualDesconto);
    }

    @Override
    public String getDescricao() {
        return "Tarifa de baixa temporada";
    }
}
