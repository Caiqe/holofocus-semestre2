package school.sptech.slack;

import java.io.IOException;

public interface Notificavel {
    void enviarMensagem() throws IOException, InterruptedException;
    String getNome();
    String getEmail();
    Boolean getAtivo();
}