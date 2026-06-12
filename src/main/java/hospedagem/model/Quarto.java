package hospedagem.model;

import hospedagem.model.TipoQuarto;
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

    @Enumerated(EnumType.STRING)
    private TipoQuarto tipo;

    public abstract double calcularDiaria();

    public Long getId() {
        return id;
    }

    public double getValorBase() {
        return valorBase;
    }

    public void setValorBase(double valorBase) {
        this.valorBase = valorBase;
    }

    public boolean isPossuiAR() {
        return possuiAR;
    }

    public void setPossuiAR(boolean possuiAR) {
        this.possuiAR = possuiAR;
    }

    public boolean isPossuiHidro() {
        return possuiHidro;
    }

    public void setPossuiHidro(boolean possuiHidro) {
        this.possuiHidro = possuiHidro;
    }

    public TipoQuarto getTipo() {
        if (tipo != null) {
            return tipo;
        }

        if (this instanceof QuartoIndividual) {
            return TipoQuarto.INDIVIDUAL;
        }
        if (this instanceof QuartoDuplo) {
            return TipoQuarto.DUPLO;
        }
        if (this instanceof QuartoFamilia) {
            return TipoQuarto.FAMILIA;
        }

        return null;
    }

    public void setTipo(TipoQuarto tipo) {
        this.tipo = tipo;
    }
}