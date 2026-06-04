package school.sptech.slack;

import java.io.IOException;

public class Cliente extends Usuario {

    public Cliente(String nome, String email) {
        super(nome, email, getSlackUrl());
    }

    private static String getSlackUrl() {
        String url = System.getenv("SLACK_CLIENTE_URL");
        if (url == null || url.isBlank()) {
            throw new IllegalArgumentException("ERRO: Variável SLACK_CLIENTE_URL não configurada!");
        }
        return url;
    }

    @Override
    public void enviarMensagem() throws IOException, InterruptedException {
        String mensagem = "Olá, " + getNome() + "! Temos novidades por aqui. " +
                "Acesse a plataforma holofocus e fique por dentro das novas tendências!";
        Slack.enviarMensagem(mensagem, getSlackUrl());
    }
}