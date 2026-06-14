package hospedagem.model;

import hospedagem.exception.CapacidadeExcedidaException;
import hospedagem.exception.DataInvalidaException;
import hospedagem.exception.QuartoIndisponivelException;
import hospedagem.exception.RecursoNaoPermitidoException;
import org.junit.jupiter.api.Test;

import java.lang.reflect.Field;
import java.time.LocalDate;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

public class AluguelTest {

    @Test
    public void calculaValorTotal_quartoIndividual() throws Exception {
        QuartoIndividual q = new QuartoIndividual();
        q.valorBase = 100.0;

        Field f = QuartoIndividual.class.getDeclaredField("quantidadeCamasSolteiro");
        f.setAccessible(true);
        f.setInt(q, 1);

        Aluguel a = new Aluguel();
        a.setDataEntrada(LocalDate.of(2025, 4, 10));
        a.setDataSaida(LocalDate.of(2025, 4, 13));
        a.setQuarto(q);

        assertEquals(300.0, a.calcularValorTotal(), 0.001);
    }

    @Test
    public void calculaValorTotal_quartoDuplo_comBerco_eQueen() throws Exception {
        QuartoDuplo q = new QuartoDuplo();
        q.valorBase = 150.0;

        Field tipo = QuartoDuplo.class.getDeclaredField("tipoCama");
        tipo.setAccessible(true);
        tipo.set(q, "queen");

        Field berco = QuartoDuplo.class.getDeclaredField("possuiBerco");
        berco.setAccessible(true);
        berco.setBoolean(q, true);

        Aluguel a = new Aluguel();
        a.setDataEntrada(LocalDate.of(2025, 5, 1));
        a.setDataSaida(LocalDate.of(2025, 5, 3)); // 2 diárias
        a.setQuarto(q);

        // diaria = 150 + 150 (queen) + 40 (berço) = 340 -> total 680
        assertEquals(680.0, a.calcularValorTotal(), 0.001);
    }

    @Test
    public void calculaDiaria_quartoFamilia_desconto_proporcional() throws Exception {
        QuartoFamilia q = new QuartoFamilia();
        q.valorBase = 200.0;

        Field qtd = QuartoFamilia.class.getDeclaredField("quantidadeHospedes");
        qtd.setAccessible(true);
        qtd.setInt(q, 5);

        Aluguel a = new Aluguel();
        a.setDataEntrada(LocalDate.of(2025, 6, 10));
        a.setDataSaida(LocalDate.of(2025, 6, 11)); // 1 diária
        a.setQuarto(q);

        // diaria = 200 + (5*70)=350 => 550 * 0.9 = 495
        assertEquals(495.0, a.calcularValorTotal(), 0.001);
    }

    @Test
    public void limiteHospedes_quartoIndividual() throws Exception {
        QuartoIndividual q = new QuartoIndividual();

        Field f = QuartoIndividual.class.getDeclaredField("quantidadeCamasSolteiro");
        f.setAccessible(true);
        f.setInt(q, 2);

        assertEquals(2, q.getLimiteHospedes());
    }

    @Test
    public void verifica_conflito_disponibilidade() {
        Aluguel existente = new Aluguel();
        existente.setDataEntrada(LocalDate.of(2025, 7, 10));
        existente.setDataSaida(LocalDate.of(2025, 7, 15));

        LocalDate novaEntrada = LocalDate.of(2025, 7, 14);
        LocalDate novaSaida = LocalDate.of(2025, 7, 18);

        boolean conflito = novaEntrada.isBefore(existente.getDataSaida()) && novaSaida.isAfter(existente.getDataEntrada());

        assertTrue(conflito, "Deveria detectar conflito de datas para disponibilidade");
    }

    @Test
    public void validarDisponibilidade_lancaExcecao_quandoQuartoJaEstaAlugado() {
        QuartoIndividual q = new QuartoIndividual();
        q.setQuantidadeCamasSolteiro(1);

        Aluguel existente = new Aluguel();
        existente.setDataEntrada(LocalDate.of(2025, 7, 10));
        existente.setDataSaida(LocalDate.of(2025, 7, 15));
        existente.setQuarto(q);

        Aluguel novoAluguel = new Aluguel();
        novoAluguel.setDataEntrada(LocalDate.of(2025, 7, 14));
        novoAluguel.setDataSaida(LocalDate.of(2025, 7, 18));
        novoAluguel.setQuarto(q);

        assertThrows(QuartoIndisponivelException.class,
                () -> novoAluguel.validarDisponibilidade(List.of(existente)));
    }

    @Test
    public void validarCapacidade_lancaExcecao_quandoQuantidadeHospedesPassaDoLimite() {
        QuartoDuplo q = new QuartoDuplo();

        assertThrows(CapacidadeExcedidaException.class, () -> q.validarCapacidade(3));
    }

    @Test
    public void validarDatas_lancaExcecao_quandoSaidaNaoForPosteriorAEntrada() {
        Aluguel aluguel = new Aluguel();
        aluguel.setDataEntrada(LocalDate.of(2025, 8, 10));
        aluguel.setDataSaida(LocalDate.of(2025, 8, 10));

        assertThrows(DataInvalidaException.class, aluguel::validarDatas);
    }

    @Test
    public void solicitarBerco_lancaExcecao_paraQuartoIndividual() {
        QuartoIndividual q = new QuartoIndividual();

        assertThrows(RecursoNaoPermitidoException.class, () -> q.solicitarBerco(true));
    }
}
