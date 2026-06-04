package school.sptech.slack;

import org.json.JSONObject;

import java.io.IOException;

public class App {
    public static void main(String[] args) throws IOException, InterruptedException {
        String mensagem = "boa noite cliente!";
        String mensagem2 = "boa noite suporte!";

        Notificavel cliente = new Cliente("lucas", "lucas@yahoo.com");
        cliente.enviarMensagem();
        Notificavel suporte = new Suporte("serjao", "serjao.berrante@constructor.com");
        suporte.enviarMensagem();

    }
}
