package hospedagem.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
public class Aluguel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDate dataEntrada;
    private LocalDate dataSaida;

    @ManyToOne
    private Cliente cliente;

    @ManyToOne
    private Quarto quarto;

    public double calcularValorTotal() {

        long dias = dataSaida.toEpochDay() - dataEntrada.toEpochDay();

        return dias * quarto.calcularDiaria();
    }

    // getters e setters
}