CREATE DATABASE IF NOT EXISTS holofocus;

USE holofocus;

-- TABELAS --------------------------------------------------------------------------------------------*
-- Seção Organizacional
CREATE TABLE IF NOT EXISTS endereco (
    id_endereco INT PRIMARY KEY AUTO_INCREMENT,
    cep VARCHAR(8) NOT NULL,
    logradouro VARCHAR(60)  NOT NULL,
    numero VARCHAR(10)  NOT NULL,
    complemento VARCHAR(60)
);

CREATE TABLE IF NOT EXISTS nivel_acesso (
    id_nivel_acesso INT PRIMARY KEY AUTO_INCREMENT,
    tipo_acesso VARCHAR(7) NOT NULL,
    descricao VARCHAR(100)  NOT NULL
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
    fk_nivel_acesso INT NOT NULL,
    fk_empresa INT NOT NULL,
    CONSTRAINT fk_usuario_nivel
    FOREIGN KEY (fk_nivel_acesso) REFERENCES nivel_acesso(id_nivel_acesso),
    CONSTRAINT fk_usuario_empresa
    FOREIGN KEY (fk_empresa) REFERENCES empresa(id_empresa)
);

CREATE TABLE IF NOT EXISTS slack(
id_mensagem INT PRIMARY KEY,
mensagem VARCHAR(150),
hora DATETIME, 
fk_usuario INT,
FOREIGN KEY (fk_usuario)
REFERENCES usuario(id_usuario)
);


-- Seção Base de dados
CREATE TABLE IF NOT EXISTS genero (
    id_genero INT PRIMARY KEY AUTO_INCREMENT,
    titulo_genero VARCHAR(30) NOT NULL
);

CREATE TABLE IF NOT EXISTS pais(
    id_pais INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    nome VARCHAR(30)
);

CREATE TABLE IF NOT EXISTS artista (
    id_artista INT PRIMARY KEY AUTO_INCREMENT,
    artista_nome VARCHAR(60) NOT NULL,
    fk_pais INT NOT NULL,
    CONSTRAINT fk_artista_pais
    Foreign Key (fk_pais) REFERENCES pais(id_pais)
);

CREATE TABLE IF NOT EXISTS musica (
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
    CONSTRAINT fk_empresa_evento
    FOREIGN KEY (fk_empresa) REFERENCES empresa(id_empresa),
    CONSTRAINT fk_evento_artista
    FOREIGN KEY (fk_artista) REFERENCES artista(id_artista),
    CONSTRAINT fk_evento_genero
    FOREIGN KEY (fk_genero) REFERENCES genero(id_genero)
);




-- Seção logs
CREATE TABLE IF NOT EXISTS tipo_log (
    id_tipo_log INT PRIMARY KEY AUTO_INCREMENT,
    tipo_log VARCHAR(20)
);
INSERT INTO tipo_log (tipo_log) VALUES
('INFO'),
('SUCESSO'),
('ERRO');

CREATE TABLE IF NOT EXISTS artefato (
id_artefato INT PRIMARY KEY AUTO_INCREMENT,
nome VARCHAR(20)
);

INSERT INTO artefato (nome) VALUES 
('BASE DE DADOS'),
('BANCO DE DADOS');

CREATE TABLE IF NOT EXISTS log (
    id_log INT PRIMARY KEY AUTO_INCREMENT,
    data_hora DATETIME,
    titulo VARCHAR(60),
    fk_tipo INT NOT NULL,
    CONSTRAINT fk_logs_tipo
    FOREIGN KEY (fk_tipo) REFERENCES tipo_log(id_tipo_log),
    fk_artefato INT NOT NULL,
    FOREIGN KEY (fk_artefato)
    REFERENCES artefato(id_artefato)
);


-- Seção Preferencias
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
    CONSTRAINT fk_perfil_empresa
    FOREIGN KEY (fk_empresa) REFERENCES empresa(id_empresa),
    CONSTRAINT fk_perfil_genero
    FOREIGN KEY (fk_genero) REFERENCES genero(id_genero)
);


-- Populando dados
/*
INSERT INTO endereco (cep, logradouro, numero, complemento) VALUES
('01001000', 'Praça da Sé', '100', 'Sala 1'),
('20040002', 'Rua da Quitanda', '45', NULL),
('30140071', 'Av. Afonso Pena', '1500', 'Andar 5');
*/
INSERT INTO nivel_acesso (tipo_acesso, descricao) VALUES
('GESTOR', 'Gestor de eventos'),
('ADMIN', 'Administrador do sistema'),
('USER', 'Usuário padrão');
/*
INSERT INTO empresa (razao_social, lotacao, cnpj, perfil_artistas, fk_endereco, contrato_ativo) VALUES
('Casa de Shows Vibra SP', 5000, '12345678000101', 'PEDA', 1, 1),
('Bar Cultural Rio Beats', 800, '22345678000102', 'PSCA', 2, 1),
('Arena BH Music', 12000, '32345678000103', 'ISCP', 3, 1);

INSERT INTO usuario (nome, email, telefone, senha, fk_nivel_acesso, fk_empresa) VALUES
('João Silva', 'joao@vibra.com', '11999999999', '123456', 1, 1),
('Maria Souza', 'maria@riobeats.com', '21988888888', '123456', 2, 2),
('Carlos Lima', 'carlos@arenabh.com', '31977777777', '123456', 3, 3);

INSERT INTO genero (titulo_genero) VALUES
('Pop'),
('Rock'),
('Eletrônica'),
('Hip Hop'),
('Sertanejo');

INSERT INTO pais (nome) VALUES
('Brasil'),
('Estados Unidos'),
('Reino Unido');

INSERT INTO artista (artista_nome, fk_pais) VALUES
('Anitta', 1),
('Drake', 2),
('Coldplay', 3),
('Alok', 1),
('Jorge & Mateus', 1);

INSERT INTO musica 
(titulo_musica, data_lancamento, popularidade, contagem_streams, duracao, dancabilidade, energia, volume, tempo, instrumentabilidade, explicita, fk_artista, fk_genero)
VALUES
('Envolver', '2022-03-01', 95, 1500000000, 180, 0.85, 0.80, -5.20, 120.00, 0.010, 0, 1, 1),
('God''s Plan', '2018-01-19', 98, 2000000000, 198, 0.75, 0.65, -6.00, 77.00, 0.000, 1, 2, 4),
('Yellow', '2000-06-26', 90, 1800000000, 266, 0.60, 0.70, -4.50, 87.00, 0.050, 0, 3, 2),
('Hear Me Now', '2016-10-21', 88, 900000000, 190, 0.80, 0.90, -4.00, 122.00, 0.020, 0, 4, 3),
('Propaganda', '2018-01-01', 85, 700000000, 210, 0.70, 0.75, -5.80, 100.00, 0.000, 0, 5, 5);

INSERT INTO evento 
(nome_evento, data_evento, investimento_evento, retorno_evento, total_pessoas, fk_empresa, fk_artista, fk_genero)
VALUES
('Festival Vibra Pop', '2025-07-10', 50000.00, 120000.00, 4500, 1, 1, 1),
('Noite Hip Hop RJ', '2025-08-15', 20000.00, 50000.00, 700, 2, 2, 4),
('Rock Arena BH', '2025-09-20', 80000.00, 200000.00, 10000, 3, 3, 2);


INSERT INTO perfil 
(fk_empresa, nome, taxa_minima, taxa_maxima, fk_genero, scoreE1, scoreE2, scoreE3, scoreE4, perfil)
VALUES
(1, 'Perfil Pop Alta Energia', 30000, 120000, 1, 5, 3, 4, 2, 'PEDA'),
(1, 'Perfil Eletrônico Premium', 50000, 150000, 3, 4, 4, 5, 3, 'PSDA'),
(2, 'Perfil Hip Hop Urbano', 10000, 40000, 4, 2, 5, 3, 3, 'PECA'),
(2, 'Perfil Pop Alternativo', 8000, 30000, 1, 3, 4, 2, 4, 'IEDP'),
(3, 'Perfil Rock Arena', 60000, 200000, 2, 5, 2, 4, 5, 'IECP'),
(3, 'Perfil Sertanejo Massa', 40000, 180000, 5, 4, 3, 5, 4, 'PEDA');
*/

-- ============================================
-- Criação de usuários do banco holofocus
-- ============================================

-- ============================================
-- 1. web_user — permissão CRUD
--    Tabelas: empresa, endereco, evento, 
--             perfil, usuario
-- ============================================

CREATE USER IF NOT EXISTS 'web_user'@'%' IDENTIFIED BY 'sua_senha_aqui';

GRANT SELECT, INSERT, UPDATE, DELETE ON holofocus.empresa   TO 'web_user'@'%';
GRANT SELECT, INSERT, UPDATE, DELETE ON holofocus.endereco  TO 'web_user'@'%';
GRANT SELECT, INSERT, UPDATE, DELETE ON holofocus.evento    TO 'web_user'@'%';
GRANT SELECT, INSERT, UPDATE, DELETE ON holofocus.perfil    TO 'web_user'@'%';
GRANT SELECT, INSERT, UPDATE, DELETE ON holofocus.usuario   TO 'web_user'@'%';

-- ============================================
-- 2. java_user — permissão CR (SELECT, INSERT)
--    Tabelas: artistas, genero, log, musica,
--             pais, usuario
-- ============================================

CREATE USER IF NOT EXISTS 'java_user'@'%' IDENTIFIED BY 'sua_senha_aqui';

GRANT SELECT, INSERT ON holofocus.artista TO 'java_user'@'%';
GRANT SELECT, INSERT ON holofocus.genero   TO 'java_user'@'%';
GRANT SELECT, INSERT ON holofocus.log      TO 'java_user'@'%';
GRANT SELECT, INSERT ON holofocus.musica   TO 'java_user'@'%';
GRANT SELECT, INSERT ON holofocus.pais     TO 'java_user'@'%';
GRANT SELECT, INSERT ON holofocus.usuario  TO 'java_user'@'%';
GRANT SELECT, INSERT ON holofocus.slack  TO 'java_user'@'%';

-- ============================================
-- Aplicar permissões
-- ============================================

FLUSH PRIVILEGES;

-- ========================================================================
-- VIEWS

use holofocus;

-- ============================================================
-- VIEWS - DASHBOARD HOLOFOCUS
-- Ordem de criação importa: vw_media_por_genero deve ser
-- criada antes das views que dependem dela.
-- ============================================================


-- ============================================================
-- VIEW 1 | BASE: Médias por gênero
-- ============================================================
CREATE OR REPLACE VIEW vw_media_por_genero AS
SELECT
    g.id_genero,
    g.titulo_genero,
    ROUND(AVG(m.popularidade), 2)        AS media_popularidade,
    ROUND(AVG(m.energia) * 100, 2)       AS media_energia,
    ROUND(AVG(m.contagem_streams), 0)    AS media_streams,
    SUM(m.contagem_streams)              AS total_streams
FROM genero g
JOIN musica m ON m.fk_genero = g.id_genero
GROUP BY g.id_genero, g.titulo_genero;


-- ============================================================
-- VIEW 2 | KPIs: Gênero com maior popularidade
-- Uso: SELECT genero, media_energia, musica_mais_ouvida
--      FROM vw_kpi_genero_popular;
-- ============================================================

CREATE OR REPLACE VIEW vw_kpi_genero_popular AS
SELECT
    g.id_genero,
    g.titulo_genero                              AS genero,
    ROUND(AVG(m.popularidade), 2)                AS media_popularidade,
    COALESCE(SUM(m.contagem_streams), 0)         AS total_streams,
    MIN(m.data_lancamento)                       AS data_inicio,
    MAX(m.data_lancamento)                       AS data_fim,
    (
        SELECT CONCAT(m2.titulo_musica, ' - ', a2.artista_nome)
        FROM musica m2
        JOIN artista a2 ON a2.id_artista = m2.fk_artista
        WHERE m2.fk_genero = g.id_genero
        ORDER BY m2.contagem_streams DESC
        LIMIT 1
    ) AS musica_mais_ouvida
FROM genero g
JOIN musica m ON m.fk_genero = g.id_genero
GROUP BY g.id_genero, g.titulo_genero
ORDER BY media_popularidade DESC
LIMIT 1;
SELECT * FROM vw_kpi_genero_popular;
-- ============================================================
-- VIEW 3 | GRÁFICO DE BARRAS: TOP 5 gêneros
-- Uso: SELECT titulo_genero, media_popularidade, media_energia
--      FROM vw_top5_generos;
-- ============================================================
CREATE OR REPLACE VIEW vw_top5_generos AS
SELECT
    titulo_genero,
    media_popularidade,
    media_energia,
    media_streams
FROM vw_media_por_genero
ORDER BY media_popularidade DESC, media_streams DESC
LIMIT 5;


-- ============================================================
-- VIEW 4 | GRÁFICO DE LINHAS: Eventos por mês (últimos 12)
--
-- CROSS JOIN com empresa garante que todos os meses apareçam
-- para todas as empresas. O filtro de empresa fica no JOIN
-- e não no WHERE — isso preserva os meses com 0 eventos.
--
-- Uso: SELECT mes_label, total_eventos
--      FROM vw_eventos_ultimos_12_meses
--      WHERE fk_empresa = ?     ← id vindo do sessionStorage
--      ORDER BY mes_ano;
-- ============================================================
CREATE OR REPLACE VIEW vw_eventos_ultimos_12_meses AS
SELECT
    emp.id_empresa          AS fk_empresa,
    mes.mes_label,
    mes.mes_ano,
    COUNT(e.id_evento)      AS total_eventos
FROM (
    SELECT
        DATE_FORMAT(DATE_SUB(CURDATE(), INTERVAL n MONTH), '%Y-%m')    AS mes_ano,
        DATE_FORMAT(DATE_SUB(CURDATE(), INTERVAL n MONTH), '%m/%Y')    AS mes_label,
        DATE_FORMAT(DATE_SUB(CURDATE(), INTERVAL n MONTH), '%Y-%m-01') AS mes_inicio,
        LAST_DAY(DATE_SUB(CURDATE(), INTERVAL n MONTH))                AS mes_fim
    FROM (
        SELECT 0  AS n UNION ALL SELECT 1  UNION ALL SELECT 2
        UNION ALL SELECT 3  UNION ALL SELECT 4  UNION ALL SELECT 5
        UNION ALL SELECT 6  UNION ALL SELECT 7  UNION ALL SELECT 8
        UNION ALL SELECT 9  UNION ALL SELECT 10 UNION ALL SELECT 11
    ) nums
) mes
CROSS JOIN empresa emp
LEFT JOIN evento e
    ON  e.data_evento BETWEEN mes.mes_inicio AND mes.mes_fim
    AND e.fk_empresa = emp.id_empresa
GROUP BY
    emp.id_empresa,
    mes.mes_ano,
    mes.mes_label;


-- ============================================================
-- VIEW 5 | TABELA: TOP 3 músicas mais ouvidas por gênero
-- Uso: SELECT titulo_musica, artista_nome, popularidade, pais
--      FROM vw_top3_musicas_por_genero
--      WHERE id_genero = ? AND ranking <= 3
--      ORDER BY ranking;
-- ============================================================
CREATE OR REPLACE VIEW vw_top3_musicas_por_genero AS
SELECT
    g.id_genero,
    g.titulo_genero,
    m.titulo_musica,
    a.artista_nome,
    m.popularidade,
    p.nome AS pais,
    (
        SELECT COUNT(*) + 1
        FROM musica m2
        WHERE m2.fk_genero = m.fk_genero
          AND m2.contagem_streams > m.contagem_streams
    ) AS ranking
FROM musica  m
JOIN genero  g ON g.id_genero  = m.fk_genero
JOIN artista a ON a.id_artista = m.fk_artista
JOIN pais    p ON p.id_pais    = a.fk_pais
WHERE (
    SELECT COUNT(*)
    FROM musica m2
    WHERE m2.fk_genero = m.fk_genero
      AND m2.contagem_streams > m.contagem_streams
) < 3;


-- ============================================================
-- VIEW 6 | CARD: Oportunidade de Investimento
-- Uso: SELECT genero, media_popularidade, media_energia
--      FROM vw_oportunidade_investimento;
-- ============================================================
CREATE OR REPLACE VIEW vw_oportunidade_investimento AS
SELECT
    g.titulo_genero                              AS genero,
    ROUND(AVG(m.popularidade), 2)                AS media_popularidade,
    ROUND(AVG(m.energia) * 100, 2)               AS media_energia,
    COALESCE(SUM(m.contagem_streams), 0)         AS total_streams,
    COUNT(DISTINCT CASE 
        WHEN e.data_evento >= DATE_SUB(CURDATE(), INTERVAL 6 MONTH) 
        THEN e.id_evento 
    END)                                         AS total_eventos
FROM genero g
LEFT JOIN musica m ON m.fk_genero = g.id_genero
LEFT JOIN evento e ON e.fk_genero = g.id_genero
GROUP BY g.id_genero, g.titulo_genero;

SELECT * FROM vw_oportunidade_investimento LIMIT 1;


CREATE OR REPLACE VIEW vw_ultima_atualizacao AS
SELECT DATE_FORMAT(MAX(data_hora), '%d/%m/%Y às %H:%i') AS ultima_atualizacao
FROM log
WHERE fk_tipo     = 2
  AND fk_artefato = 1;