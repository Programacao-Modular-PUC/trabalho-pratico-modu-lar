package hospedagem.tarifa;

import hospedagem.model.Aluguel;

public interface TarifaStrategy {

    double aplicar(double valorAtual, Aluguel aluguel);

    String getDescricao();
}
