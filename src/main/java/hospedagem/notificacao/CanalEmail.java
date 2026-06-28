package hospedagem.notificacao;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class CanalEmail implements CanalNotificacao {

    private final List<Notificacao> enviadas = new ArrayList<>();

    @Override
    public void enviar(Notificacao notificacao) {
        enviadas.add(notificacao);
    }

    @Override
    public String getNome() {
        return "E-mail";
    }

    public List<Notificacao> getEnviadas() {
        return Collections.unmodifiableList(enviadas);
    }
}
