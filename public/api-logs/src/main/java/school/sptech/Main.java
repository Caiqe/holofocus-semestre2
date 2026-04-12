package school.sptech;

import org.springframework.jdbc.core.JdbcTemplate;
import school.sptech.database.Conexao;
import school.sptech.model.Artista;
import school.sptech.model.Log;
import school.sptech.model.Musica;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {

        Conexao conexaoo = new Conexao();
        JdbcTemplate template = new JdbcTemplate(conexaoo.getConexao());
        Scanner sc = new Scanner(System.in);
        int acaoDesejada = -1;
        List<Log> logsBD = new ArrayList<Log>();
        Log log;


        String url = "jdbc:mysql://127.0.0.1:3306/holofocus";
        String usuario = "root";
        String senha = "123456";

        String sqlPais = "INSERT INTO pais (nome) VALUES (?);" ;
        String sqlArtista = "INSERT INTO artista (artista_nome, fk_pais) VALUES (?, ?)";
        String sqlGenero = "INSERT INTO genero (titulo_genero) VALUES (?)";
        String sqlMusica = "INSERT INTO musica (titulo_musica, data_lancamento, duracao, popularidade, dancabilidade, explicita, contagem_streams, energia, volume, tempo, instrumentabilidade, fk_artista, fk_genero) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);";

        //BASE DE DADOS
        String nomeBucket = "holofocus";
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
                List<Artista> dadosExtraidos = leitorExcel.extrairDados(nomeBucket, nomeArquivo);
                leitorExcel.gerarRelatorio();


                System.out.println("Inserindo Logs no Banco de dados...");
                // Inserindo logs no BD
                List<Log> logs = leitorExcel.getLogs();
                String queryLogs = "INSERT INTO log (data_hora, titulo, fk_tipo, fk_artefato) VALUES ";
                for (int i = 0; i < 30000; i++) {
                    int tipo = logs.get(i).getTipo().equals("INFO") ? 1 : logs.get(i).getTipo().equals("SUCESSO") ? 2 : 3 ;
                    int artefato = logs.get(i).getArtefato().equals("BASE DE DADOS") ? 1 : 2;

                    if(i != 0){
                        queryLogs += ",\n('"+logs.get(i).getDataHora()+"', '"+logs.get(i).getTitulo()+"', "+tipo+", "+artefato+")";
                    }else{
                        queryLogs += "\n('"+logs.get(i).getDataHora()+"', '"+logs.get(i).getTitulo()+"', "+tipo+", "+artefato+")";
                    }
                }
                queryLogs+=";";
                template.update(queryLogs);

                queryLogs = "INSERT INTO log (data_hora, titulo, fk_tipo, fk_artefato) VALUES ";
                for (int i = 30000; i < logs.size(); i++) {
                    int tipo = logs.get(i).getTipo().equals("INFO") ? 1 : logs.get(i).getTipo().equals("SUCESSO") ? 2 : 3 ;
                    int artefato = logs.get(i).getArtefato().equals("BASE DE DADOS") ? 1 : 2;

                    if(i != 30000){
                        queryLogs += ",\n('"+logs.get(i).getDataHora()+"', '"+logs.get(i).getTitulo()+"', "+tipo+", "+artefato+")";
                    }else{
                        queryLogs += "\n('"+logs.get(i).getDataHora()+"', '"+logs.get(i).getTitulo()+"', "+tipo+", "+artefato+")";
                    }
                }
                queryLogs+=";";
                template.update(queryLogs);

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
                        log = new Log("INICIANDO INSERÇÃO DE PAISES", "INFO", "BANCO DE DADOS");
                        System.out.println(log);
                        logsBD.add(log);
                        List<String> paises = new ArrayList<>();
                        for (int i = 0; i < dadosExtraidos.size(); i++) {
                            if(!paises.contains(dadosExtraidos.get(i).getPais())){
                                paises.add(dadosExtraidos.get(i).getPais());
                            }
                        }
                        try(Connection conexao = DriverManager.getConnection(url,usuario,senha);
                        PreparedStatement stmt = conexao.prepareStatement(sqlPais)){
                            conexao.setAutoCommit(false);
                            for (int i = 0; i < paises.size(); i++) {
                                stmt.setString(1, paises.get(i));
                                stmt.addBatch();
                            }
                            stmt.executeBatch();
                            conexao.commit();
                            log = new Log("INSERÇÃO DE PAISES FINALIZADA", "SUCESSO", "BANCO DE DADOS");
                            System.out.println(log);
                            logsBD.add(log);
                        }catch (SQLException e){
                            log = new Log("ERRO AO INSERIR PAÍSES", "ERRO", "BANCO DE DADOS");
                            System.out.println(log);
                            logsBD.add(log);
                            System.out.println(e);
                        }

                        try(Connection conexao = DriverManager.getConnection(url,usuario,senha);
                        PreparedStatement stmt = conexao.prepareStatement(sqlArtista)){

                            conexao.setAutoCommit(false);

                            for (int i = 0; i < dadosExtraidos.size(); i++) {
                                Artista artista = dadosExtraidos.get(i);
                                stmt.setString(1, dadosExtraidos.get(i).getNome());
                                int idPais = paises.indexOf(artista.getPais())+1;
                                stmt.setInt(2, idPais);
                                stmt.addBatch();
                            }
                            stmt.executeBatch();
                            conexao.commit();

                            log = new Log("INSERÇÃO DE ARTISTAS FINALIZADA", "SUCESSO", "BANCO DE DADOS");
                            System.out.println(log);
                            logsBD.add(log);

                        }catch (SQLException e){
                            log = new Log("ERRO NA INSERÇÃO DE ARTISTAS", "ERRO", "BANCO DE DADOS");
                            System.out.println(log);
                            logsBD.add(log);
                            System.out.println(e);
                        }
//
//                        /*
//                        * INSERINDO GÊNEROS
//                        * */
                        List<String> generos = new ArrayList<>();
                        log = new Log("INICIANDO INSERÇÃO DE GENEROS", "INFO", "BANCO DE DADOS");
                        System.out.println(log);
                        logsBD.add(log);
                        for (int i = 0; i < dadosExtraidos.size(); i++) {
                            for (int i1 = 0; i1 < dadosExtraidos.get(i).getMusicas().size(); i1++) {
                                if(!generos.contains(dadosExtraidos.get(i).getMusicas().get(i1).getGenero())){
                                    generos.add(dadosExtraidos.get(i).getMusicas().get(i1).getGenero());
                                }
                            }
                        }

                          try(Connection conexao = DriverManager.getConnection(url, usuario, senha);
                          PreparedStatement stmt = conexao.prepareStatement(sqlGenero)){

                              conexao.setAutoCommit(false);

                              for (int i = 0; i < generos.size(); i++) {
                                  stmt.setString(1, generos.get(i));
                                  stmt.addBatch();
                              }
                              stmt.executeBatch();
                              conexao.commit();

                              log = new Log("INSERÇÃO DE GENEROS FINALIZADA", "SUCESSO", "BANCO DE DADOS");
                              System.out.println(log);
                              logsBD.add(log);

                          }catch (SQLException e){
                              log = new Log("ERRO NA INSERÇÃO DE GENEROS", "ERRO", "BANCO DE DADOS");
                              System.out.println(log);
                              logsBD.add(log);
                              System.out.println(e);
                          }

//                        /*
//                         * INSERINDO MÚSICAS parte 1
//                         * */
                        log = new Log("INICIANDO INSERÇÃO DE MUSICAS", "INFO", "BANCO DE DADOS");
                        System.out.println(log);
                        logsBD.add(log);
                        Musica musica;

                        try(Connection conexao = DriverManager.getConnection(url,usuario,senha);
                        PreparedStatement stmt = conexao.prepareStatement(sqlMusica)){

                            conexao.setAutoCommit(false);


                            for (int i = 0; i < dadosExtraidos.size(); i++) {
                                for (int i1 = 0; i1 < dadosExtraidos.get(i).getMusicas().size(); i1++) {
                                    musica = dadosExtraidos.get(i).getMusicas().get(i1);
                                    int id_genero = 1+generos.indexOf(musica.getGenero());
                                    int id_artista = i+1;
                                    stmt.setString(1, musica.getTitulo_musica());
                                    stmt.setObject(2, musica.getData_lancamento());
                                    stmt.setInt(3, musica.getDuracao());
                                    stmt.setDouble(4, musica.getPopularidade());
                                    stmt.setDouble(5, musica.getDancabilidade());
                                    stmt.setInt(6, musica.getIsExplicita());
                                    stmt.setInt(7, musica.getContagem_streams());
                                    stmt.setDouble(8, musica.getEnergia());
                                    stmt.setDouble(9, musica.getVolume());
                                    stmt.setDouble(10, musica.getTempo());
                                    stmt.setDouble(11, musica.getInstrumentabilidade());
                                    stmt.setInt(12,id_artista);
                                    stmt.setInt(13,id_genero);
                                    stmt.addBatch();
                                }
                            }
                            stmt.executeBatch();
                            conexao.commit();

                        }catch (SQLException e){
                            System.out.println(e);
                        }


                        //INSERINDO LOGS NO BD
                        System.out.println("Inserindo Logs no Banco de dados...");
                        queryLogs = "INSERT INTO log (data_hora, titulo, fk_tipo, fk_artefato) VALUES ";
                        for (int i = 0; i < logsBD.size(); i++) {
                            int tipo = logsBD.get(i).getTipo().equals("INFO") ? 1 : logsBD.get(i).getTipo().equals("SUCESSO") ? 2 : 3 ;
                            int artefato = logsBD.get(i).getArtefato().equals("BASE DE DADOS") ? 1 : 2;

                            if(i != 0){
                                queryLogs += ",\n('"+logsBD.get(i).getDataHora()+"', '"+logsBD.get(i).getTitulo()+"', "+tipo+", "+artefato+")";
                            }else{
                                queryLogs += "\n('"+logsBD.get(i).getDataHora()+"', '"+logsBD.get(i).getTitulo()+"', "+tipo+", "+artefato+")";
                            }
                        }
                        queryLogs+=";";
                        template.update(queryLogs);
                   }

                }

            }

        }

        System.out.println("Programa encerrado.");
        sc.close();

    }
}
