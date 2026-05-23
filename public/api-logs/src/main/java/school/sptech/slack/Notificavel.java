package school.sptech.slack;

import java.io.IOException;

public interface Notificavel {
    void enviarMensagem(String mensagem) throws IOException, InterruptedException;
    String getNome();
    String getEmail();
    Boolean getAtivo();
}