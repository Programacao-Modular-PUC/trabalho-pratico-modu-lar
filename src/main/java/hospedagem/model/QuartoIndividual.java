package hospedagem.model;

import hospedagem.exception.RecursoNaoPermitidoException;
import jakarta.persistence.Entity;

@Entity
public class QuartoIndividual extends Quarto {

    private int quantidadeCamasSolteiro;

    public double calcularDiaria() {

        double adicional = 0;

        if (quantidadeCamasSolteiro > 1) {
            adicional = (quantidadeCamasSolteiro - 1) * 50;
        }

        return valorBase + adicional;
    }

    public int getLimiteHospedes() {
        return quantidadeCamasSolteiro;
    }

    public int getQuantidadeCamasSolteiro() {
        return quantidadeCamasSolteiro;
    }

    public void setQuantidadeCamasSolteiro(int quantidadeCamasSolteiro) {
        this.quantidadeCamasSolteiro = quantidadeCamasSolteiro;
    }

    public void solicitarBerco(boolean possuiBerco) {
        if (possuiBerco) {
            throw new RecursoNaoPermitidoException("Berco nao permitido em quarto individual");
        }
    }
}
