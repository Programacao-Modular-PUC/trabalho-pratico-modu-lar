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

    @Override
    public int getLimiteHospedes() {
        return quantidadeHospedes;
    }

    public int getQuantidadeHospedes() {
        return quantidadeHospedes;
    }

    public void setQuantidadeHospedes(int quantidadeHospedes) {
        this.quantidadeHospedes = quantidadeHospedes;
    }

    public int getQuantidadeAmbientes() {
        return quantidadeAmbientes;
    }

    public void setQuantidadeAmbientes(int quantidadeAmbientes) {
        this.quantidadeAmbientes = quantidadeAmbientes;
    }
}
