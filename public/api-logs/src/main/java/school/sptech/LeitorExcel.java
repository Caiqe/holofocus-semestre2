package school.sptech;

import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.apache.commons.logging.LogFactory;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import school.sptech.model.Artista;
import school.sptech.model.Log;
import school.sptech.model.Musica;

public class LeitorExcel {

    private static final org.apache.commons.logging.Log log = LogFactory.getLog(LeitorExcel.class);
    private List<Log> logs = new ArrayList<>();
    private Long tempoDecorrido;

    public List<Artista> extrairDados(String nomeArquivo) {
        List<Artista> artistas = new ArrayList<Artista>();
        Log log;

        try (
                InputStream arquivo = new FileInputStream(nomeArquivo);
                Workbook workbook = new XSSFWorkbook(arquivo) // caso seja .xls troque para HSSFWorkbook
        ) {
            log = new Log("INICIANDO LEITURA BASE DE DADOS", "INFO", "BASE DE DADOS");
            logs.add(log);
            System.out.println(log);

            Sheet sheet = workbook.getSheetAt(0);
            LocalDateTime horaInicio = LocalDateTime.now();
            for (Row row : sheet) {
                if (row.getRowNum() == 0) {
                    printarCabecalho(row);
                    continue;
                }

                // Extraindo valor das células e criando objeto Artista e Musica
                log = new Log("LENDO LINHA "+row.getRowNum(), "SUCESSO", "BASE DE DADOS");
                logs.add(log);
                System.out.println(log);


                String nomeArtista = row.getCell(2).getStringCellValue();
                String paisArtista = row.getCell(16).getStringCellValue();
                Artista artista = new Artista (nomeArtista, paisArtista);
                Boolean isNewArtistas = true;
                int index = 0;

                if(row.getRowNum() == 1){
                    artistas.add(artista);
                }else{
                    for (Artista artista1 : artistas) {
                        if(artista.getNome().equals(artista1.getNome())){
                            isNewArtistas = false;
                            index = artistas.indexOf(artista1);
                        }
                    }
                    if(isNewArtistas){
                        artistas.add(artista);
                    }else{
                        artista = artistas.get(index);
                    }
                }


                String titulo = row.getCell(1).getStringCellValue();
                LocalDate data = row.getCell(4).getLocalDateTimeCellValue().toLocalDate();
                Integer duracao = (int) row.getCell(6).getNumericCellValue();
                Integer popularidade = (int) row.getCell(7).getNumericCellValue();
                Double dancabilidade = row.getCell(8).getNumericCellValue()/100;
                Integer isExplicita = (int) row.getCell(17).getNumericCellValue();
                Integer contagem = (int) row.getCell(15).getNumericCellValue();
                Double energia = row.getCell(9).getNumericCellValue()/100;
                String genero = row.getCell(5).getStringCellValue();

                Double volume = row.getCell(11).getNumericCellValue()/100;
                Double tempo = row.getCell(14).getNumericCellValue()<1000 ? row.getCell(14).getNumericCellValue() : row.getCell(14).getNumericCellValue()/100;
                Double instrumentabilidade = row.getCell(13).getNumericCellValue()/1000;

                Musica musica = new Musica(titulo, data, duracao, popularidade, dancabilidade,isExplicita,contagem,energia, genero, volume,tempo,instrumentabilidade);
                artista.adicionarMusica(musica);

            }
            LocalDateTime horaTermino = LocalDateTime.now();
            Duration duracao = Duration.between(horaInicio, horaTermino);
            tempoDecorrido = duracao.getSeconds();
            log = new Log("LEITURA BASE DE DADOS FINALIZADA", "SUCESSO", "BASE DE DADOS");
            logs.add(log);
            System.out.println(log);
            log = new Log("TEMPO DECORRIDO: "+tempoDecorrido+" segundos", "INFO", "BASE DE DADOS");
            logs.add(log);
            System.out.println(log);

            return artistas;
        } catch (IOException e) {
            log = new Log("FALHA AO LER BASE DE DADOS", "ERRO", "BASE DE DADOS");
            logs.add(log);
            System.out.println(log);
            LocalDateTime horaTermino = LocalDateTime.now();
            return artistas;
        }


    }

    private void printarCabecalho(Row row) {
        printarLinhas();
        System.out.println("Lendo cabeçalho");
        for (int i = 0; i < 18; i++) {
            String coluna = row.getCell(i).getStringCellValue();
            System.out.println("Coluna " + i + ": " + coluna);
        }
        printarLinhas();
    }

    private void printarLinhas() {
        System.out.println("-".repeat(20));
    }

    public void gerarRelatorio(){
        Integer contSucesso = 0;
        Integer contErro = 0;
        Integer contInfo = 0;

        for (Log log1 : logs) {
            if(log1.getTipo().equals("INFO")){
                contInfo++;
            }else if(log1.getTipo().equals("SUCESSO")){
                contSucesso++;
            }else {
                contErro++;
            }
        }
        System.out.printf("""
                |------| RELATÓRIO LOGS |------
                |- LOGS ERRO: %d
                |- LOGS SUCESSO: %d
                |- LOGS INFORMAÇÕES: %d
                |- Nº de logs: %d
                |- Duração: %d segundos
                |------------------------------
                """, contErro,contSucesso,contInfo, logs.size(), tempoDecorrido);
    }

    public List<Log> getLogs(){
        return logs;
    }
}
