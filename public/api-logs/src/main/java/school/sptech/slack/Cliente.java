package school.sptech.slack;

import io.github.cdimascio.dotenv.Dotenv;

public class Cliente extends Usuario {

    private static final String URL = Dotenv.configure()
            .directory("C:/Users/Lneve/Downloads/githolofocus/holofocus-semestre2")
            .load()
            .get("SLACK_CLIENTE_URL");

    public Cliente(String nome, String email) {
        super(nome, email, URL);
    }
}