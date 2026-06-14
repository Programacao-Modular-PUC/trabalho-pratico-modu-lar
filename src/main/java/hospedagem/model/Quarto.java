package hospedagem.model;

import hospedagem.exception.CapacidadeExcedidaException;
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

    public abstract int getLimiteHospedes();

    public void validarCapacidade(int quantidadeHospedes) {
        if (quantidadeHospedes <= 0) {
            throw new IllegalArgumentException("A quantidade de hospedes deve ser maior que zero");
        }

        if (quantidadeHospedes > getLimiteHospedes()) {
            throw new CapacidadeExcedidaException("Capacidade do quarto excedida");
        }
    }

    public void validarRecursosPermitidos() {
    }

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
