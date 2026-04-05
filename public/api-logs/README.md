# API-ETL

O **API-ETL** é um sistema de Extração, Transformação e Carga desenvolvido em Java. Ele faz parte do ecossistema do projeto **Holofocus** e tem como objetivo principal automatizar a leitura de dados, registrar o fluxo de execução e persistir essas informações em um banco de dados.

---

## 🚀 Funcionalidades

O sistema realiza as seguintes atividades principais:

* **Extração de Dados:** Leitura de dados provenientes de arquivos Excel utilizando a biblioteca Apache POI.
* **Geração de Logs:** Criação de logs detalhados para o rastreamento e monitoramento de todas as etapas ocorridas durante a execução do sistema.
* **Persistência de Dados:** Inserção e armazenamento das informações extraídas diretamente no banco de dados.

---

## 🛠️ Tecnologias Utilizadas

* **Linguagem:** Java 21
* **Manipulação de Arquivos:** Apache POI

---

## 📂 Estrutura do Projeto

A lógica do sistema foi modularizada nas seguintes classes principais para facilitar a manutenção:

* `LeitorExcel`: Responsável por toda a rotina de extração e leitura dos dados utilizando o Apache POI.
* `Conexao`: Responsável por estabelecer e gerenciar a comunicação com o banco de dados.
* `Main`: Classe principal onde a lógica de negócio está construída e que orquestra o fluxo de execução do sistema.

---

## ⚙️ Como Executar

### Pré-requisitos

Certifique-se de ter o **Java 21** instalado e configurado nas variáveis de ambiente da sua máquina.

### Execução

Para rodar a aplicação, abra o terminal no diretório onde o arquivo `.jar` foi gerado e execute o seguinte comando:

```bash
java -jar api-logs-1.0-SNAPSHOT.jar