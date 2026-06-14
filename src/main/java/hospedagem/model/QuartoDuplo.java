package hospedagem.model;

import jakarta.persistence.Entity;

@Entity
public class QuartoDuplo extends Quarto {

    private String tipoCama; // casal, queen, king
    private boolean possuiBerco;

    @Override
    public double calcularDiaria() {

        double total = valorBase;

        if (tipoCama == null || tipoCama.isBlank()) {
            throw new IllegalArgumentException("Tipo de cama deve ser informado");
        }

        if (tipoCama.equalsIgnoreCase("casal")) {
            total += 80;
        }

        if (tipoCama.equalsIgnoreCase("queen")
                || tipoCama.equalsIgnoreCase("king")) {

            total += 150;
        }

        if (possuiBerco) {
            total += 40;
        }

        return total;
    }

    @Override
    public int getLimiteHospedes() {
        return 2;
    }

    public String getTipoCama() {
        return tipoCama;
    }

    public void setTipoCama(String tipoCama) {
        this.tipoCama = tipoCama;
    }

    public boolean isPossuiBerco() {
        return possuiBerco;
    }

    public void setPossuiBerco(boolean possuiBerco) {
        this.possuiBerco = possuiBerco;
    }
}
