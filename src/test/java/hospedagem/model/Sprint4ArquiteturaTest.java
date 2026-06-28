package hospedagem.model;

import hospedagem.notificacao.CanalSms;
import hospedagem.notificacao.EventoNotificacao;
import hospedagem.notificacao.GerenciadorNotificacoes;
import hospedagem.tarifa.GerenciadorTarifas;
import hospedagem.tarifa.TarifaAltaTemporada;
import hospedagem.tarifa.TarifaBaixaTemporada;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;

import java.time.LocalDate;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertSame;

public class Sprint4ArquiteturaTest {

    @AfterEach
    public void limparSingletons() {
        GerenciadorTarifas.getInstance().limparRegras();
        GerenciadorNotificacoes.getInstance().limpar();
    }

    @Test
    public void tarifaFlexivel_aplicaStrategyDeAltaTemporada() {
        QuartoIndividual quarto = new QuartoIndividual();
        quarto.valorBase = 100.0;
        quarto.setQuantidadeCamasSolteiro(1);

        Aluguel aluguel = new Aluguel();
        aluguel.setDataEntrada(LocalDate.of(2026, 1, 10));
        aluguel.setDataSaida(LocalDate.of(2026, 1, 12));
        aluguel.setQuarto(quarto);

        GerenciadorTarifas.getInstance().definirRegras(List.of(new TarifaAltaTemporada(0.20)));

        assertEquals(240.0, aluguel.calcularValorTotal(), 0.001);
    }

    @Test
    public void tarifaFlexivel_permiteTrocarStrategySemAlterarAluguel() {
        QuartoIndividual quarto = new QuartoIndividual();
        quarto.valorBase = 100.0;
        quarto.setQuantidadeCamasSolteiro(1);

        Aluguel aluguel = new Aluguel();
        aluguel.setDataEntrada(LocalDate.of(2026, 4, 1));
        aluguel.setDataSaida(LocalDate.of(2026, 4, 3));
        aluguel.setQuarto(quarto);

        GerenciadorTarifas.getInstance().definirRegras(List.of(new TarifaBaixaTemporada(0.10)));

        assertEquals(180.0, aluguel.calcularValorTotal(), 0.001);
    }

    @Test
    public void gerenciadores_utilizamSingleton() {
        assertSame(GerenciadorTarifas.getInstance(), GerenciadorTarifas.getInstance());
        assertSame(GerenciadorNotificacoes.getInstance(), GerenciadorNotificacoes.getInstance());
    }

    @Test
    public void centralNotificacoes_enviaMensagemParaCanaisRegistrados() {
        GerenciadorNotificacoes gerenciador = GerenciadorNotificacoes.getInstance();
        CanalSms sms = new CanalSms();
        gerenciador.registrarCanal(sms);

        gerenciador.notificar(
                EventoNotificacao.RESERVA_CRIADA,
                "cliente",
                "Reserva criada com sucesso"
        );

        assertEquals(1, gerenciador.getHistorico().size());
        assertEquals(1, sms.getEnviadas().size());
        assertEquals(EventoNotificacao.RESERVA_CRIADA, sms.getEnviadas().get(0).getEvento());
    }
}
