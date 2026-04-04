package school.sptech;

import org.springframework.jdbc.core.JdbcTemplate;
import school.sptech.database.Conexao;
import school.sptech.model.Artista;
import school.sptech.model.Log;
import school.sptech.model.Musica;

import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {

        Conexao conexao = new Conexao();
        JdbcTemplate template = new JdbcTemplate(conexao.getConexao());
        Scanner sc = new Scanner(System.in);
        int acaoDesejada = -1;
        List<Log> logsBD = new ArrayList<Log>();
        Log log;

        //BASE DE DADOS
        String nomeArquivo = "holofocus-bdd.xlsx";
        do{
            System.out.println("SELECIONE A AÇÃO DESEJADA");
            System.out.println("""
                    (1) - Ler base de dados
                    (2) - Encerrar programa 
                    Digite  opção desejada:
                    """);
            acaoDesejada = sc.nextInt();
            sc.nextLine();
            if(acaoDesejada<1 || acaoDesejada>2){
                System.out.println("Selecione uma ação válida!");
            }
        }while(acaoDesejada<1 || acaoDesejada>2);
        switch (acaoDesejada){
            case 1: {
                // Extraindo os dados do arquivo
                System.out.println("Aguarde...");
                LeitorExcel leitorExcel = new LeitorExcel();
                List<Artista> dadosExtraidos = leitorExcel.extrairDados(nomeArquivo);
                leitorExcel.gerarRelatorio();

                int menu2 = -1;
                do{
                    System.out.println("""
                            DESEJA INSERIR  A LEITURA NO BANCO DE DADOS?
                            (1) - SIM
                            (2) - NÃO
                            Digite  opção desejada:
                            """);
                    menu2 = sc.nextInt();
                    sc.nextLine();
                    if(menu2<1 || menu2>2){
                        System.out.println("Digite uma opção válida!");
                    }
                }while(menu2<1 || menu2>2);
                switch (menu2){
                    case 1:{
                        System.out.println("Aguarde...");
                        /*
                        * INSERINDO PAISES NO BANCO DE DACOS
                        * */
                        log = new Log("INICIANDO INSERÇÃO DE PAISES", "INFO");
                        System.out.println(log);
                        logsBD.add(log);
                        List<String> paises = new ArrayList<>();
                        for (int i = 0; i < dadosExtraidos.size(); i++) {
                            if(!paises.contains(dadosExtraidos.get(i).getPais())){
                                paises.add(dadosExtraidos.get(i).getPais());
                            }
                        }
                        String queryPais = "INSERT INTO pais (nome) VALUES ";
                        for (int i = 0; i < paises.size(); i++) {
                            if(i != 0){
                                queryPais+=",\n('"+paises.get(i)+"')";
                            }else{
                                queryPais+="\n('"+paises.get(i)+"')";
                            }
                        }
                        queryPais+=";";
                        template.update(queryPais); //ENVIANDO QUERY
                        log = new Log("INSERÇÃO DE PAISES FINALIZADA", "SUCESSO");
                        System.out.println(log);
                        logsBD.add(log);


                        /*
                        * INSERINDO ARTISTAS NO BANCO DE DADOS
                        * */
                        log = new Log("INICIANDO INSERÇÃO DE ARTISTAS", "INFO");
                        System.out.println(log);
                        logsBD.add(log);
                        String queryArtista = "INSERT INTO artista (artista_nome, fk_pais) VALUES ";
                        for (int i = 0; i < dadosExtraidos.size(); i++) {
                            if(i != 0){
                                queryArtista+=",\n('"+dadosExtraidos.get(i).getNome()+"', (SELECT id_pais FROM pais WHERE nome = '"+dadosExtraidos.get(i).getPais()+"'))";
                            }else{
                                queryArtista+="\n('"+dadosExtraidos.get(i).getNome()+"', (SELECT id_pais FROM pais WHERE nome = '"+dadosExtraidos.get(i).getPais()+"'))";
                            }
                        }
                        queryArtista+=";";
                        template.update(queryArtista); //ENVIANDO QUERY
                        log = new Log("INSERÇÃO DE ARTISTAS FINALIZADA", "SUCESSO");
                        System.out.println(log);
                        logsBD.add(log);


                        /*
                        * INSERINDO GÊNEROS
                        * */
                        List<String> generos = new ArrayList<>();
                        log = new Log("INICIANDO INSERÇÃO DE GENEROS", "INFO");
                        System.out.println(log);
                        logsBD.add(log);
                        for (int i = 0; i < dadosExtraidos.size(); i++) {
                            for (int i1 = 0; i1 < dadosExtraidos.get(i).getMusicas().size(); i1++) {
                                if(!generos.contains(dadosExtraidos.get(i).getMusicas().get(i1).getGenero())){
                                    generos.add(dadosExtraidos.get(i).getMusicas().get(i1).getGenero());
                                }
                            }
                        }
                        String queryGenero = "INSERT INTO genero (titulo_genero) VALUES ";
                        for (int i = 0; i < generos.size(); i++) {
                            if(i != 0){
                                queryGenero+=",\n('"+generos.get(i)+"')";
                            }else{
                                queryGenero+="\n('"+generos.get(i)+"')";
                            }
                        }
                        queryGenero+=";";
                        template.update(queryGenero);
                        log = new Log("INSERÇÃO DE GENEROS FINALIZADA", "SUCESSO");
                        System.out.println(log);
                        logsBD.add(log);

                        /*
                         * INSERINDO MÚSICAS parte 1
                         * */
                        log = new Log("INICIANDO INSERÇÃO DE MUSICAS", "INFO");
                        System.out.println(log);
                        logsBD.add(log);
                        Musica musica;
                        String queryMusica = "INSERT INTO musica (titulo_musica, data_lancamento, duracao, popularidade, dancabilidade, explicita, contagem_streams, energia, volume, tempo, instrumentabilidade, fk_artista, fk_genero) VALUES ";
                        for (int i = 0; i < 30000; i++) {
                            for (int i1 = 0; i1 < dadosExtraidos.get(i).getMusicas().size(); i1++) {
                                musica = dadosExtraidos.get(i).getMusicas().get(i1);
                                int id_genero = 1+generos.indexOf(musica.getGenero());
                                int id_artista = i+1;
                                if(i != 0){
                                    queryMusica+= ",\n('"+musica.getTitulo_musica()+"', '"+musica.getData_lancamento()+"', "+ musica.getDuracao()+", "+ musica.getPopularidade()+", "+ musica.getDancabilidade()+", "+ musica.getIsExplicita()+", "+ musica.getContagem_streams()+", "+musica.getEnergia()+", "+musica.getVolume()+", "+ musica.getTempo()+", "+ musica.getInstrumentabilidade()+", "+id_artista+", "+id_genero+")";
                                }else {
                                    queryMusica += "\n('"+musica.getTitulo_musica()+"', '"+musica.getData_lancamento()+"', "+ musica.getDuracao()+", "+ musica.getPopularidade()+", "+ musica.getDancabilidade()+", "+ musica.getIsExplicita()+", "+ musica.getContagem_streams()+", "+musica.getEnergia()+", "+musica.getVolume()+", "+ musica.getTempo()+", "+ musica.getInstrumentabilidade()+", "+id_artista+", "+id_genero+")";
                                }
                            }
                        }
                        queryMusica+=";";
                        template.update(queryMusica);

                        /*
                         * INSERINDO MÚSICAS parte 2
                         * */
                        queryMusica = "INSERT INTO musica (titulo_musica, data_lancamento, duracao, popularidade, dancabilidade, explicita, contagem_streams, energia, volume, tempo, instrumentabilidade, fk_artista, fk_genero) VALUES ";
                        for (int i = 30000; i < dadosExtraidos.size(); i++) {
                            for (int i1 = 0; i1 < dadosExtraidos.get(i).getMusicas().size(); i1++) {
                                musica = dadosExtraidos.get(i).getMusicas().get(i1);
                                int id_genero = 1+generos.indexOf(musica.getGenero());
                                int id_artista = i+1;
                                if(i != 30000){
                                    queryMusica+= ",\n('"+musica.getTitulo_musica()+"', '"+musica.getData_lancamento()+"', "+ musica.getDuracao()+", "+ musica.getPopularidade()+", "+ musica.getDancabilidade()+", "+ musica.getIsExplicita()+", "+ musica.getContagem_streams()+", "+musica.getEnergia()+", "+musica.getVolume()+", "+ musica.getTempo()+", "+ musica.getInstrumentabilidade()+", "+id_artista+", "+id_genero+")";
                                }else {
                                    queryMusica += "\n('"+musica.getTitulo_musica()+"', '"+musica.getData_lancamento()+"', "+ musica.getDuracao()+", "+ musica.getPopularidade()+", "+ musica.getDancabilidade()+", "+ musica.getIsExplicita()+", "+ musica.getContagem_streams()+", "+musica.getEnergia()+", "+musica.getVolume()+", "+ musica.getTempo()+", "+ musica.getInstrumentabilidade()+", "+id_artista+", "+id_genero+")";
                                }
                            }
                        }
                        queryMusica+=";";
                        template.update(queryMusica);
                        log = new Log("INSERÇÃO DE MUSICAS FINALIZADA", "SUCESSO");
                        System.out.println(log);
                        logsBD.add(log);
                    }

                }

            }

        }

        System.out.println("Programa encerrado.");
        sc.close();

    }
}
