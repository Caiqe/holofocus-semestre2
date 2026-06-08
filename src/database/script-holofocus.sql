CREATE DATABASE IF NOT EXISTS holofocus;
USE holofocus;

-- TABELAS
CREATE TABLE IF NOT EXISTS endereco (
    id_endereco INT PRIMARY KEY AUTO_INCREMENT,
    cep VARCHAR(8) NOT NULL,
    logradouro VARCHAR(60) NOT NULL,
    numero VARCHAR(10) NOT NULL,
    complemento VARCHAR(60)
);

CREATE TABLE IF NOT EXISTS nivel_acesso (
    id_nivel_acesso INT PRIMARY KEY AUTO_INCREMENT,
    tipo_acesso VARCHAR(7) NOT NULL UNIQUE,
    descricao VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS empresa (
    id_empresa INT PRIMARY KEY AUTO_INCREMENT,
    razao_social VARCHAR(80) NOT NULL UNIQUE,
    lotacao INT,
    cnpj CHAR(14) NOT NULL UNIQUE,
    perfil_artistas VARCHAR(14),
    fk_endereco INT NOT NULL,
    contrato_ativo TINYINT NOT NULL,
    CONSTRAINT fk_empresa_endereco
    FOREIGN KEY (fk_endereco) REFERENCES endereco(id_endereco)
);

CREATE TABLE IF NOT EXISTS usuario (
    id_usuario INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(60) NOT NULL,
    email VARCHAR(60) NOT NULL UNIQUE,
    telefone VARCHAR(11) NOT NULL UNIQUE,
    senha VARCHAR(40) NOT NULL,
    podeNotificar TINYINT,
    fk_nivel_acesso INT NOT NULL,
    fk_empresa INT NOT NULL,
    FOREIGN KEY (fk_nivel_acesso) REFERENCES nivel_acesso(id_nivel_acesso),
    FOREIGN KEY (fk_empresa) REFERENCES empresa(id_empresa)
    
    
);


CREATE TABLE IF NOT EXISTS lead_contato (
    id_lead INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(60) NOT NULL,
    email VARCHAR(100) NOT NULL,
    telefone VARCHAR(14),
    assunto VARCHAR(100) NOT NULL,
    mensagem TEXT NOT NULL,
    data_contato DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);



CREATE TABLE IF NOT EXISTS chamado (
    id_chamado INT PRIMARY KEY AUTO_INCREMENT,
    assunto VARCHAR(100) NOT NULL,
    descricao TEXT NOT NULL,
    status_chamado ENUM('ABERTO', 'EM_ANDAMENTO', 'CONCLUIDO', 'ENCERRADO')
        NOT NULL DEFAULT 'ABERTO',
    data_abertura DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    data_fechamento DATETIME,
    fk_usuario INT NOT NULL,
    fk_empresa INT NOT NULL,
    fk_responsavel INT,
    CONSTRAINT fk_chamado_usuario
        FOREIGN KEY (fk_usuario) REFERENCES usuario(id_usuario),
    CONSTRAINT fk_chamado_empresa
        FOREIGN KEY (fk_empresa) REFERENCES empresa(id_empresa),
    CONSTRAINT fk_chamado_responsavel
        FOREIGN KEY (fk_responsavel) REFERENCES usuario(id_usuario)
);

CREATE TABLE IF NOT EXISTS slack (
    id_mensagem INT PRIMARY KEY AUTO_INCREMENT,
    mensagem VARCHAR(150),
    hora DATETIME,
    fk_usuario INT,
    FOREIGN KEY (fk_usuario) REFERENCES usuario(id_usuario)
);

CREATE TABLE IF NOT EXISTS genero (
    id_genero INT PRIMARY KEY AUTO_INCREMENT,
    titulo_genero VARCHAR(30) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS pais (
    id_pais INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(30) UNIQUE
);

CREATE TABLE IF NOT EXISTS artista (
    id_artista INT PRIMARY KEY AUTO_INCREMENT,
    artista_nome VARCHAR(60) NOT NULL UNIQUE,
    fk_pais INT NOT NULL,
    FOREIGN KEY (fk_pais) REFERENCES pais(id_pais)
);

CREATE TABLE IF NOT EXISTS musica (
    id_musica INT PRIMARY KEY AUTO_INCREMENT,
    titulo_musica VARCHAR(80) NOT NULL UNIQUE,
    data_lancamento DATE,
    popularidade INT NOT NULL,
    contagem_streams INT NOT NULL,
    duracao INT,
    dancabilidade DOUBLE(3,2),
    energia DOUBLE(3,2),
    volume DOUBLE(4,2),
    tempo DOUBLE(5,2),
    instrumentabilidade DOUBLE(4,3),
    explicita TINYINT NOT NULL,
    fk_artista INT NOT NULL,
    fk_genero INT NOT NULL,
    FOREIGN KEY (fk_artista) REFERENCES artista(id_artista),
    FOREIGN KEY (fk_genero) REFERENCES genero(id_genero)
);

CREATE TABLE IF NOT EXISTS evento (
    id_evento INT PRIMARY KEY AUTO_INCREMENT,
    nome_evento VARCHAR(60),
    data_evento DATE,
    investimento_evento DOUBLE(10,2),
    retorno_evento DOUBLE(10,2),
    total_pessoas INT,
    fk_empresa INT NOT NULL,
    fk_artista INT NOT NULL,
    fk_genero INT NOT NULL,
    FOREIGN KEY (fk_empresa) REFERENCES empresa(id_empresa),
    FOREIGN KEY (fk_artista) REFERENCES artista(id_artista),
    FOREIGN KEY (fk_genero) REFERENCES genero(id_genero)
);

CREATE TABLE IF NOT EXISTS tipo_log (
    id_tipo_log INT PRIMARY KEY AUTO_INCREMENT,
    tipo_log VARCHAR(20) UNIQUE
);

CREATE TABLE IF NOT EXISTS artefato (
    id_artefato INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(20) UNIQUE
);

CREATE TABLE IF NOT EXISTS log (
    id_log INT PRIMARY KEY AUTO_INCREMENT,
    data_hora DATETIME,
    titulo VARCHAR(60),
    fk_tipo INT NOT NULL,
    fk_artefato INT NOT NULL,
    FOREIGN KEY (fk_tipo) REFERENCES tipo_log(id_tipo_log),
    FOREIGN KEY (fk_artefato) REFERENCES artefato(id_artefato)
);

CREATE TABLE IF NOT EXISTS perfil (
    id_perfil INT AUTO_INCREMENT,
    fk_empresa INT NOT NULL,
    PRIMARY KEY (id_perfil, fk_empresa),
    nome VARCHAR(45),
    taxa_minima FLOAT,
    taxa_maxima FLOAT,
    fk_genero INT,
    scoreE1 TINYINT,
    scoreE2 TINYINT,
    scoreE3 TINYINT,
    scoreE4 TINYINT,
    perfil CHAR(4),
    FOREIGN KEY (fk_empresa) REFERENCES empresa(id_empresa),
    FOREIGN KEY (fk_genero) REFERENCES genero(id_genero)
);

-- DADOS FIXOS
INSERT INTO tipo_log (tipo_log)
VALUES ('INFO'), ('SUCESSO'), ('ERRO');

INSERT INTO artefato (nome)
VALUES ('BASE DE DADOS'), ('BANCO DE DADOS');

INSERT INTO endereco (cep, logradouro, numero, complemento)
VALUES
('01001000', 'Praça da Sé', '100', 'Sala 1'),
('20040002', 'Rua da Quitanda', '45', NULL),
('30140071', 'Av. Afonso Pena', '1500', 'Andar 5');

INSERT INTO nivel_acesso (tipo_acesso, descricao)
VALUES
('GESTOR', 'Gestor de eventos'),
('SUPORTE', 'Administrador do sistema'),
('USER', 'Usuário padrão');

INSERT INTO empresa
(razao_social, lotacao, cnpj, perfil_artistas, fk_endereco, contrato_ativo)
VALUES
('Casa de Shows Vibra SP', 5000, '12345678000101', 'PEDA', 1, 1);

INSERT INTO usuario
(nome, email, telefone, senha, fk_nivel_acesso, fk_empresa, podeNotificar)
VALUES
('Maycon', 'maycon@vibra.com', '11999999999', '123456', 1, 1, 1),
('Roger Elias', 'roger@holofocus.com', '11888888888', '123456', 2, 1, 1),
('Marcelliny', 'marcelliny@vibra.com', '21988888888', '123456', 3, 1, 1);

INSERT INTO genero (titulo_genero) VALUES
('Pop'),
('Rock'),
('Eletrônica'),
('Hip Hop'),
('Sertanejo');

-- USUÁRIOS MYSQL
CREATE USER IF NOT EXISTS 'web_user'@'%'
IDENTIFIED BY 'web_123456';

CREATE USER IF NOT EXISTS 'java_user'@'%'
IDENTIFIED BY 'java_123456';

-- PERMISSÕES WEB
GRANT SELECT ON holofocus.artista TO 'web_user'@'%';
GRANT SELECT ON holofocus.genero TO 'web_user'@'%';
GRANT SELECT ON holofocus.musica TO 'web_user'@'%';
GRANT SELECT ON holofocus.pais TO 'web_user'@'%';

GRANT SELECT, INSERT, UPDATE, DELETE ON holofocus.empresa TO 'web_user'@'%';
GRANT SELECT, INSERT, UPDATE, DELETE ON holofocus.endereco TO 'web_user'@'%';
GRANT SELECT, INSERT, UPDATE, DELETE ON holofocus.evento TO 'web_user'@'%';
GRANT SELECT, INSERT, UPDATE, DELETE ON holofocus.perfil TO 'web_user'@'%';
GRANT SELECT, INSERT, UPDATE, DELETE ON holofocus.usuario TO 'web_user'@'%';

GRANT SELECT, INSERT ON holofocus.lead_contato TO 'web_user'@'%';
GRANT SELECT, INSERT, UPDATE, DELETE ON holofocus.aviso TO 'web_user'@'%';
GRANT SELECT, INSERT, UPDATE, DELETE ON holofocus.chamado TO 'web_user'@'%';
GRANT SELECT, DELETE ON holofocus.lead_contato TO 'web_user'@'%';

-- PERMISSÕES JAVA
GRANT SELECT ON holofocus.artefato TO 'java_user'@'%';
GRANT SELECT ON holofocus.usuario TO 'java_user'@'%';

GRANT INSERT, UPDATE, DELETE ON holofocus.artista TO 'java_user'@'%';
GRANT INSERT, UPDATE ON holofocus.genero TO 'java_user'@'%';
GRANT INSERT, UPDATE ON holofocus.log TO 'java_user'@'%';
GRANT INSERT, UPDATE ON holofocus.musica TO 'java_user'@'%';
GRANT INSERT, UPDATE, DELETE ON holofocus.pais TO 'java_user'@'%';
GRANT INSERT, UPDATE ON holofocus.slack TO 'java_user'@'%';



FLUSH PRIVILEGES;

select * from endereco;
select email from usuario;



select * from chamado;
