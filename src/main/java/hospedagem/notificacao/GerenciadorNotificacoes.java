package hospedagem.notificacao;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class GerenciadorNotificacoes {

    private static final GerenciadorNotificacoes INSTANCE = new GerenciadorNotificacoes();

    private final List<CanalNotificacao> canais = new ArrayList<>();
    private final List<Notificacao> historico = new ArrayList<>();

    private GerenciadorNotificacoes() {
        canais.add(new CanalEmail());
    }

    public static GerenciadorNotificacoes getInstance() {
        return INSTANCE;
    }

    public void registrarCanal(CanalNotificacao canal) {
        if (canal != null) {
            canais.add(canal);
        }
    }

    public void notificar(EventoNotificacao evento, String destinatario, String mensagem) {
        Notificacao notificacao = new Notificacao(evento, destinatario, mensagem);
        historico.add(notificacao);

        for (CanalNotificacao canal : canais) {
            canal.enviar(notificacao);
        }
    }

    public void limpar() {
        canais.clear();
        historico.clear();
        canais.add(new CanalEmail());
    }

    public List<CanalNotificacao> getCanais() {
        return Collections.unmodifiableList(canais);
    }

    public List<Notificacao> getHistorico() {
        return Collections.unmodifiableList(historico);
    }
}
