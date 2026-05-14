package hospedagem.model;

import jakarta.persistence.Entity;

@Entity
public class QuartoFamilia extends Quarto {

    private int quantidadeHospedes;
    private int quantidadeAmbientes;

    @Override
    public double calcularDiaria() {

        double total = valorBase;

        // adicional proporcional ao número de hóspedes
        total += quantidadeHospedes * 70;

        // desconto progressivo
        if (quantidadeHospedes >= 5) {
            total *= 0.90;
        }

        return total;
    }

    // getters e setters
}