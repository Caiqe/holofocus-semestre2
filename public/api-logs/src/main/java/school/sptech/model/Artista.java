package school.sptech.model;

import java.util.ArrayList;
import java.util.List;

public class Artista {
    private String nome;
    private String pais;
    private List<Musica> musicas;

    public Artista( String nome, String pais) {
        this.nome = nome;
        this.pais = pais;
        musicas = new ArrayList<>();

    }

    public void adicionarMusica(Musica musica){
        musicas.add(musica);
    }

    public String getPais(){
        return pais;
    }

    public String getNome() {
        return nome;
    }

    public List<Musica> getMusicas(){
        return musicas;
    }

    @Override
    public String toString() {
        String artista =" Artista: " + nome + " | País: " + pais+ " | Nº de músicas: "+musicas.size()+"\n{\n";
        for (Musica musica : musicas) {
            artista+=musica;
        }
        return artista+"\n}";
    }


}
