package hospedagem.model;

import jakarta.persistence.*;

@Entity
@Inheritance(strategy = InheritanceType.JOINED)
public abstract class Quarto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    protected double valorBase;
    protected boolean possuiAR;
    protected boolean possuiHidro;

    public abstract double calcularDiaria();

    // getters e setters
}