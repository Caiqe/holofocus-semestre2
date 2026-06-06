package school.sptech.slack;

import java.io.IOException;

public class Suporte extends Usuario {

    public Suporte(String nome, String email) {
        super(nome, email, getSlackUrl());
    }

    private static String getSlackUrl() {
        String url = System.getenv("SLACK_SUPORTE_URL");
        if (url == null || url.isBlank()) {
            throw new IllegalArgumentException("ERRO: Variável SLACK_SUPORTE_URL não configurada!");
        }
        return url;
    }

    @Override
    public void enviarMensagem() throws IOException, InterruptedException {
        String mensagem = "Olá, " + getNome() + "! Ocorreram erros na aplicação Java. Acesse os Logs para acompanhar.";
            Slack.enviarMensagem(mensagem, getSlackUrl());
    }
}