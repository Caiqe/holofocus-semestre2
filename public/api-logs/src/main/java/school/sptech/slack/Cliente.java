package school.sptech.slack;

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
}