package school.sptech.slack;

import java.io.IOException;

public class Usuario implements Notificavel {
    private String nome;
    private String email;
    private Boolean ativo;
    private final String url;

    public Usuario(String nome, String email, String url) {
        this.nome = nome;
        this.email = email;
        this.ativo = true;
        this.url = url;
    }

    @Override
    public void enviarMensagem(String mensagem) throws IOException, InterruptedException {
        Slack.enviarMensagem(mensagem, this.url);
    }

    @Override
    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }

    @Override
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    @Override
    public Boolean getAtivo() { return ativo; }
    public void setAtivo(Boolean ativo) { this.ativo = ativo; }
}