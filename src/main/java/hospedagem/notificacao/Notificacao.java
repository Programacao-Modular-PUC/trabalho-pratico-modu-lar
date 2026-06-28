package hospedagem.notificacao;

import java.time.LocalDateTime;

public class Notificacao {

    private final EventoNotificacao evento;
    private final String destinatario;
    private final String mensagem;
    private final LocalDateTime criadaEm;

    public Notificacao(EventoNotificacao evento, String destinatario, String mensagem) {
        this.evento = evento;
        this.destinatario = destinatario;
        this.mensagem = mensagem;
        this.criadaEm = LocalDateTime.now();
    }

    public EventoNotificacao getEvento() {
        return evento;
    }

    public String getDestinatario() {
        return destinatario;
    }

    public String getMensagem() {
        return mensagem;
    }

    public LocalDateTime getCriadaEm() {
        return criadaEm;
    }
}
