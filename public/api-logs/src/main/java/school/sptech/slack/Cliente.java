package school.sptech.slack;

public class Cliente extends Usuario {

    private static final String URL = "https://hooks.slack.com/services/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";

    public Cliente(String nome, String email) {
        super(nome, email, URL);
    }
}