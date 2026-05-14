package hospedagem.model;

import jakarta.persistence.Entity;

@Entity
public class QuartoDuplo extends Quarto {

    private String tipoCama; // casal, queen, king
    private boolean possuiBerco;

    @Override
    public double calcularDiaria() {

        double total = valorBase;

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

    // getters e setters
}