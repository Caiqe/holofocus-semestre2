package school.sptech.slack;

public class Suporte extends Usuario {

    private static final String URL = "https://hooks.slack.com/services/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";

    public Suporte(String nome, String email) {
        super(nome, email, URL);
    }
}