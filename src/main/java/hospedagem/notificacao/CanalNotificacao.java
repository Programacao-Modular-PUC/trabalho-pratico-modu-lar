package hospedagem.notificacao;

public interface CanalNotificacao {

    void enviar(Notificacao notificacao);

    String getNome();
}
