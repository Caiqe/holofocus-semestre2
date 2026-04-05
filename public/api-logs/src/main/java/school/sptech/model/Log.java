package school.sptech.model;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

public class Log {

    private String dataHora;
    private String titulo;
    private String tipo;
    private String artefato;
    //todo
    //adicionar o atributo artefato

    public Log( String titulo, String tipo, String artefato) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("YYYY-MM-dd HH:mm:ss");
        this.dataHora = LocalDateTime.now().format(formatter);
        this.titulo = titulo;
        this.tipo = tipo;
        this.artefato = artefato;
    }

    public String getTipo() {
        return tipo;
    }
    public String getArtefato() { return artefato; }
    public String getDataHora() { return dataHora; }
    public String getTitulo() { return titulo; }

    @Override
    public String toString() {
        return "["+dataHora+"] - ["+tipo+"] - ["+titulo+"] - ["+artefato+"]";
    }
}
