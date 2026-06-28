package hospedagem.tarifa;

import hospedagem.model.Aluguel;

public class DescontoClienteFrequente implements TarifaStrategy {

    private final double percentualDesconto;

    public DescontoClienteFrequente() {
        this(0.15);
    }

    public DescontoClienteFrequente(double percentualDesconto) {
        this.percentualDesconto = percentualDesconto;
    }

    @Override
    public double aplicar(double valorAtual, Aluguel aluguel) {
        return valorAtual * (1 - percentualDesconto);
    }

    @Override
    public String getDescricao() {
        return "Desconto para cliente frequente";
    }
}
