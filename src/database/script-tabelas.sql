CREATE DATABASE holofocus;

USE holofocus;

-- TABELAS --------------------------------------------------------------------------------------------*
-- Seção Organizacional
CREATE TABLE endereco (
    id_endereco INT PRIMARY KEY AUTO_INCREMENT,
    cep VARCHAR(8) NOT NULL,
    logradouro VARCHAR(60)  NOT NULL,
    numero VARCHAR(10)  NOT NULL,
    complemento VARCHAR(60)
);

CREATE TABLE nivel_acesso (
    id_nivel_acesso INT PRIMARY KEY AUTO_INCREMENT,
    tipo_acesso VARCHAR(7) NOT NULL,
    descricao VARCHAR(100)  NOT NULL
);

CREATE TABLE empresa (
	id_empresa INT PRIMARY KEY AUTO_INCREMENT,
	razao_social VARCHAR(80) NOT NULL UNIQUE,
    lotacao INT,
	cnpj CHAR(14) NOT NULL UNIQUE,
    perfil_artistas VARCHAR(14),
    fk_endereco INT NOT NULL,
	CONSTRAINT fk_empresa_endereco
    FOREIGN KEY (fk_endereco) REFERENCES endereco(id_endereco)
);


CREATE TABLE usuario (
    id_usuario INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(60) NOT NULL,
    email VARCHAR(60) NOT NULL UNIQUE,
    telefone VARCHAR(11) NOT NULL UNIQUE,
    senha VARCHAR(40) NOT NULL,
    fk_nivel_acesso INT NOT NULL,
    fk_empresa INT NOT NULL,
    CONSTRAINT fk_usuario_nivel
    FOREIGN KEY (fk_nivel_acesso) REFERENCES nivel_acesso(id_nivel_acesso),
    CONSTRAINT fk_usuario_empresa
    FOREIGN KEY (fk_empresa) REFERENCES empresa(id_empresa)

);





-- Seção Base de dados
CREATE TABLE genero (
    id_genero INT PRIMARY KEY AUTO_INCREMENT,
    titulo_genero VARCHAR(30) NOT NULL
);

CREATE TABLE pais(
    id_pais INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    nome VARCHAR(30)
);

CREATE TABLE artista (
    id_artista INT PRIMARY KEY AUTO_INCREMENT,
    artista_nome VARCHAR(60) NOT NULL,
    fk_pais INT NOT NULL,
    CONSTRAINT fk_artista_pais
    Foreign Key (fk_pais) REFERENCES pais(id_pais)
);

CREATE TABLE musica (
    id_musica INT PRIMARY KEY AUTO_INCREMENT,
    titulo_musica VARCHAR(80) NOT NULL,
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
    CONSTRAINT fk_musica_artista
    FOREIGN KEY (fk_artista) REFERENCES artista(id_artista),
    CONSTRAINT fk_musica_genero
    FOREIGN KEY (fk_genero) REFERENCES genero(id_genero)
);

CREATE TABLE evento (
    id_evento INT PRIMARY KEY AUTO_INCREMENT,
    nome_evento VARCHAR(60),
    data_evento DATE,
    investimento_evento DOUBLE(10,2),
    retorno_evento DOUBLE(10,2),
    total_pessoas INT,
    fk_empresa INT NOT NULL,
    fk_artista INT NOT NULL,
    fk_genero INT NOT NULL,
    CONSTRAINT fk_empresa_evento
    FOREIGN KEY (fk_empresa) REFERENCES empresa(id_empresa),
    CONSTRAINT fk_evento_artista
    FOREIGN KEY (fk_artista) REFERENCES artista(id_artista),
    CONSTRAINT fk_evento_genero
    FOREIGN KEY (fk_genero) REFERENCES genero(id_genero)
);




-- Seção logs
CREATE TABLE tipo_log (
    id_tipo_log INT PRIMARY KEY AUTO_INCREMENT,
    tipo_log VARCHAR(20)
);

CREATE TABLE logs_site (
    id_logs_site INT PRIMARY KEY AUTO_INCREMENT,
    data_hora DATETIME,
    titulo VARCHAR(20),
    fk_tipo INT NOT NULL,
    CONSTRAINT fk_logs_tipo
    FOREIGN KEY (fk_tipo) REFERENCES tipo_log(id_tipo_log)
);


-- Seção Preferencias
CREATE TABLE perfil (
    id_perfil INT AUTO_INCREMENT,
    fk_empresa INT NOT NULL,
    cpk_perfil_empresa PRIMARY KEY (id_perfil, fk_empresa),
    scoreE1 TINYINT,
    scoreE2 TINYINT,
    scoreE3 TINYINT,
    scoreE4 TINYINT,
    perfil CHAR(4),
    CONSTRAINT fk_perfil_empresa
    FOREIGN KEY (fk_empresa) REFERENCES empresa(id_empresa)
);