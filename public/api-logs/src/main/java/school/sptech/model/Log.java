package school.sptech.model;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

public class Log {

    private String dataHora;
    private String titulo;
    private String tipo;
    //todo
    //adicionar o atributo artefato

    public Log( String titulo, String tipo) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("YYYY-MM-DD HH:mm:ss");
        this.dataHora = LocalDateTime.now().format(formatter);
        this.titulo = titulo;
        this.tipo = tipo;
    }

    public String getTipo() {
        return tipo;
    }

    @Override
    public String toString() {
        return "["+dataHora+"] - ["+tipo+"] - ["+titulo+"]";
    }
}
