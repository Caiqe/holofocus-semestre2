package school.sptech.slack;

import io.github.cdimascio.dotenv.Dotenv;

public class Suporte extends Usuario {

    private static final String URL = Dotenv.configure()
            .directory("C:/Users/Lneve/Downloads/githolofocus/holofocus-semestre2")
            .load()
            .get("SLACK_SUPORTE_URL");

    public Suporte(String nome, String email) {
        super(nome, email, URL);
    }
}