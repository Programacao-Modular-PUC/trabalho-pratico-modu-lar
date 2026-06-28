package hospedagem.tarifa;

import hospedagem.model.Aluguel;

public class TarifaPadrao implements TarifaStrategy {

    @Override
    public double aplicar(double valorAtual, Aluguel aluguel) {
        return valorAtual;
    }

    @Override
    public String getDescricao() {
        return "Tarifa padrao";
    }
}
