package hospedagem.tarifa;

import hospedagem.model.Aluguel;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class GerenciadorTarifas {

    private static final GerenciadorTarifas INSTANCE = new GerenciadorTarifas();

    private final List<TarifaStrategy> regras = new ArrayList<>();

    private GerenciadorTarifas() {
        regras.add(new TarifaPadrao());
    }

    public static GerenciadorTarifas getInstance() {
        return INSTANCE;
    }

    public double calcular(double valorBase, Aluguel aluguel) {
        double valorAtual = valorBase;

        for (TarifaStrategy regra : regras) {
            valorAtual = regra.aplicar(valorAtual, aluguel);
        }

        return valorAtual;
    }

    public void definirRegras(List<TarifaStrategy> novasRegras) {
        regras.clear();

        if (novasRegras == null || novasRegras.isEmpty()) {
            regras.add(new TarifaPadrao());
            return;
        }

        regras.addAll(novasRegras);
    }

    public void adicionarRegra(TarifaStrategy regra) {
        if (regra != null) {
            regras.add(regra);
        }
    }

    public void limparRegras() {
        regras.clear();
        regras.add(new TarifaPadrao());
    }

    public List<TarifaStrategy> getRegras() {
        return Collections.unmodifiableList(regras);
    }
}
