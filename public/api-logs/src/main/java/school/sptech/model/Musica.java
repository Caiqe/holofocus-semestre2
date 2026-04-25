package school.sptech.model;

import java.time.LocalDate;

public class Musica {

    private String titulo_musica;
    private LocalDate data_lancamento;
    private Integer duracao;
    private Integer popularidade;
    private Double dancabilidade;
    private Integer isExplicita;
    private Integer contagem_streams;
    private Double energia;
    private String genero;
    private Double volume;
    private Double tempo;
    private Double instrumentabilidade;

    public Musica(String titulo_musica,
                  LocalDate data_lancamento,
                  Integer duracao,
                  Integer popularidade,
                  Double dancabilidade,
                  Integer isExplicita,
                  Integer contagem_streams,
                  Double energia, String genero,
                  Double volume,
                  Double tempo,
                  Double instrumentabilidade) {
        this.titulo_musica = titulo_musica;
        this.data_lancamento = data_lancamento;
        this.duracao = duracao;
        this.popularidade = popularidade;
        this.dancabilidade = dancabilidade;
        this.isExplicita = isExplicita;
        this.contagem_streams = contagem_streams;
        this.energia = energia;
        this.genero = genero;
        this.volume = volume;
        this.tempo = tempo;
        this.instrumentabilidade = instrumentabilidade;
    }

    public String getGenero(){
        return genero;
    }

    public String getTitulo_musica() {
        return titulo_musica;
    }

    public LocalDate getData_lancamento() {
        return data_lancamento;
    }

    public Integer getDuracao() {
        return duracao;
    }

    public Integer getPopularidade() {
        return popularidade;
    }

    public Double getDancabilidade() {
        return dancabilidade;
    }

    public Integer getIsExplicita() {
        return isExplicita;
    }

    public Integer getContagem_streams() {
        return contagem_streams;
    }

    public Double getEnergia() {
        return energia;
    }

    public Double getVolume() { return volume; }

    public Double getTempo() { return tempo; }

    public Double getInstrumentabilidade() { return instrumentabilidade; }

    @Override
    public String toString() {
        return  "\n - Título: " + titulo_musica +
                " | Lançamento: " + data_lancamento +
                " | Duracao: " + duracao +
                " | Popularidade: " + popularidade +
                " | Dancabilidade: " + dancabilidade +
                " | isExplicita: " + isExplicita +
                " | Nº Streams: " + contagem_streams +
                " | Energia: " + energia +
                " | Gênero: "+ genero +
                " | Volume: "+ volume +
                " | Tempo: "+ tempo +
                " | Instrumentabilidade: "+ instrumentabilidade ;
    }
}
