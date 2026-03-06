package school.sptech;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

public class auxiliar {

    private DateTimeFormatter formato;

    public auxiliar() {
        formato = DateTimeFormatter.ofPattern("dd-MM-yyyy:HH:mm:ss");
    }

    public void registrar(String registro, String acao) {

        String dataHora = LocalDateTime.now().format(formato);

        String log = "[" + dataHora + "] - [" + registro + "]: " + acao + " ;";

        System.out.println(log);
    }
}