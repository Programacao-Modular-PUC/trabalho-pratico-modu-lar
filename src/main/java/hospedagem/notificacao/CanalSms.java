package hospedagem.notificacao;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class CanalSms implements CanalNotificacao {

    private final List<Notificacao> enviadas = new ArrayList<>();

    @Override
    public void enviar(Notificacao notificacao) {
        enviadas.add(notificacao);
    }

    @Override
    public String getNome() {
        return "SMS";
    }

    public List<Notificacao> getEnviadas() {
        return Collections.unmodifiableList(enviadas);
    }
}
