package hospedagem.tarifa;

import hospedagem.model.Aluguel;

public class TarifaAltaTemporada implements TarifaStrategy {

    private final double percentualAcrescimo;

    public TarifaAltaTemporada() {
        this(0.20);
    }

    public TarifaAltaTemporada(double percentualAcrescimo) {
        this.percentualAcrescimo = percentualAcrescimo;
    }

    @Override
    public double aplicar(double valorAtual, Aluguel aluguel) {
        return valorAtual * (1 + percentualAcrescimo);
    }

    @Override
    public String getDescricao() {
        return "Tarifa de alta temporada";
    }
}
