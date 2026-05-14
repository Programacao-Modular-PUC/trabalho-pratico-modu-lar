package hospedagem.model;

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

    // getters e setters
}