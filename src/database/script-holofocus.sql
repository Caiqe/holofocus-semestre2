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
    tipo_acesso VARCHAR(7) NOT NULL UNIQUE,
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
    podeNotificar TINYINT,
    fk_nivel_acesso INT NOT NULL,
    fk_empresa INT NOT NULL,
    CONSTRAINT fk_usuario_nivel
    FOREIGN KEY (fk_nivel_acesso) REFERENCES nivel_acesso(id_nivel_acesso),
    CONSTRAINT fk_usuario_empresa
    FOREIGN KEY (fk_empresa) REFERENCES empresa(id_empresa)
);

-- Seção Base de dados
CREATE TABLE IF NOT EXISTS genero (
    id_genero INT PRIMARY KEY AUTO_INCREMENT,
    titulo_genero VARCHAR(30) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS pais(
    id_pais INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    nome VARCHAR(30) UNIQUE
);

CREATE TABLE IF NOT EXISTS artista (
    id_artista INT PRIMARY KEY AUTO_INCREMENT,
    artista_nome VARCHAR(60) NOT NULL UNIQUE,
    fk_pais INT NOT NULL,
    CONSTRAINT fk_artista_pais
    Foreign Key (fk_pais) REFERENCES pais(id_pais)
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
    tipo_log VARCHAR(20) UNIQUE
);
INSERT INTO tipo_log (tipo_log) VALUES
('INFO'),
('SUCESSO'),
('ERRO');

CREATE TABLE IF NOT EXISTS artefato (
id_artefato INT PRIMARY KEY AUTO_INCREMENT,
nome VARCHAR(20) UNIQUE
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
INSERT INTO endereco (cep, logradouro, numero, complemento) VALUES
('01001000', 'Praça da Sé', '100', 'Sala 1'),
('20040002', 'Rua da Quitanda', '45', NULL),
('30140071', 'Av. Afonso Pena', '1500', 'Andar 5');

INSERT INTO nivel_acesso (tipo_acesso, descricao) VALUES
('GESTOR', 'Gestor de eventos'),
('SUPORTE', 'Administrador do sistema'),
('USER', 'Usuário padrão');

INSERT INTO empresa (razao_social, lotacao, cnpj, perfil_artistas, fk_endereco, contrato_ativo) VALUES
('Casa de Shows Vibra SP', 5000, '12345678000101', 'PEDA', 1, 1);

INSERT INTO usuario (nome, email, telefone, senha, fk_nivel_acesso, fk_empresa, podeNotificar) VALUES
('Maycon', 'maycon@vibra.com', '11999999999', '123456', 1, 1, 1),
('Roger Elias', 'roger@holofocus.com', '11999999999', '123456', 2, 1, 1),
('Marcelliny', 'marcelliny@vibra.com', '21988888888', '123456', 3, 1, 1);


-- ============================================================

-- ============================================================
-- VIEWS - DASHBOARD HOLOFOCUS
-- Versão final consolidada
--
-- ORDEM DE EXECUÇÃO OBRIGATÓRIA:
-- 1. vw_media_por_genero         (base para outras views)
-- 2. vw_kpi_genero_popular
-- 3. vw_top5_generos             (depende de vw_media_por_genero)
-- 4. vw_eventos_ultimos_12_meses
-- 5. vw_top3_musicas_por_genero
-- 6. vw_oportunidade_investimento
-- 7. vw_ultima_atualizacao
-- ============================================================


-- ============================================================
-- VIEW 1 | BASE: Médias por gênero
-- Usada internamente por vw_top5_generos e
-- vw_oportunidade_investimento. Não consultar diretamente.
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
-- Retorna 1 linha com os dados dos 3 cards do topo.
--
-- Campos:
--   id_genero           → usado para pre-selecionar o select
--   genero              → KPI 1: nome do gênero
--   media_popularidade  → KPI 1: média de popularidade
--   total_streams       → KPI 2: total de streams do gênero
--   data_inicio         → KPI 2: ano da música mais antiga do gênero
--   data_fim            → KPI 2: ano da música mais recente do gênero
--   musica_mais_ouvida  → KPI 3: título - artista
--
-- OBS: data_inicio e data_fim capturam automaticamente o
-- intervalo real dos dados — se novos anos forem inseridos
-- pelo Java, o período se atualiza sem alterar a view.
--
-- Uso: SELECT * FROM vw_kpi_genero_popular;
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


-- ============================================================
-- VIEW 3 | REFERÊNCIA: TOP 5 gêneros (sem filtro temporal)
-- Substituída no gráfico de barras por query parametrizada
-- no model (carregarGraficoBarras) que aceita o filtro de
-- meses vindo do <select> do frontend.
-- Mantida aqui apenas como referência.
--
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
-- CROSS JOIN com empresa garante todos os meses para todas
-- as empresas. Filtro de empresa no JOIN preserva meses com
-- 0 eventos (nunca retorna NULL).
--
-- Uso: SELECT mes_label, total_eventos
--      FROM vw_eventos_ultimos_12_meses
--      WHERE fk_empresa = ?
--      ORDER BY mes_ano;
-- ============================================================
CREATE OR REPLACE VIEW vw_eventos_ultimos_12_meses AS
WITH meses AS (
    SELECT
        DATE_FORMAT(DATE_SUB(CURDATE(), INTERVAL n MONTH), '%Y-%m') AS mes_ano,
        DATE_FORMAT(DATE_SUB(CURDATE(), INTERVAL n MONTH), '%m/%Y') AS mes_label
    FROM (
        SELECT 0  AS n UNION ALL SELECT 1  UNION ALL SELECT 2
        UNION ALL SELECT 3  UNION ALL SELECT 4  UNION ALL SELECT 5
        UNION ALL SELECT 6  UNION ALL SELECT 7  UNION ALL SELECT 8
        UNION ALL SELECT 9  UNION ALL SELECT 10 UNION ALL SELECT 11
    ) nums
)
SELECT
    emp.id_empresa                      AS fk_empresa,
    mes.mes_label,
    mes.mes_ano,
    COALESCE(COUNT(e.id_evento), 0)     AS total_eventos
FROM meses mes
CROSS JOIN empresa emp
LEFT JOIN evento e
    ON  DATE_FORMAT(e.data_evento, '%Y-%m') = mes.mes_ano
    AND e.fk_empresa = emp.id_empresa
GROUP BY emp.id_empresa, mes.mes_ano, mes.mes_label
ORDER BY mes.mes_ano ASC;


-- ============================================================
-- VIEW 5 | TABELA + SELECT: TOP 3 músicas por gênero
-- ROW_NUMBER rankeia por contagem_streams dentro de cada
-- gênero. Filtre na query da aplicação.
--
-- Uso (tabela):
--   SELECT titulo_musica, artista_nome, popularidade, pais
--   FROM vw_top3_musicas_por_genero
--   WHERE id_genero = ? AND ranking <= 3
--   ORDER BY ranking;
--
-- Uso (popular o <select>):
--   SELECT DISTINCT id_genero, titulo_genero
--   FROM vw_top3_musicas_por_genero
--   ORDER BY titulo_genero;
-- ============================================================
CREATE OR REPLACE VIEW vw_top3_musicas_por_genero AS
SELECT
    g.id_genero,
    g.titulo_genero,
    m.titulo_musica,
    a.artista_nome,
    m.popularidade,
    p.nome AS pais,
    ROW_NUMBER() OVER (
        PARTITION BY m.fk_genero
        ORDER BY m.contagem_streams DESC
    ) AS ranking
FROM musica  m
JOIN genero  g ON g.id_genero  = m.fk_genero
JOIN artista a ON a.id_artista = m.fk_artista
JOIN pais    p ON p.id_pais    = a.fk_pais;


-- ============================================================
-- VIEW 6 | CARD: Oportunidade de Investimento
--
-- Lógica de negócio:
--   - Popularidade e energia: calculadas sobre toda a base
--     (atributos históricos consolidados do gênero)
--   - Total de streams: calculado sobre toda a base
--   - Total de eventos: apenas os últimos 6 meses via
--     CASE WHEN (eventos antigos não indicam saturação atual)
--
-- O score é calculado no JS via média ponderada normalizada:
--   score = (streams/maxStreams × 0.5)
--         + (popularidade/maxPop × 0.3)
--         - (eventos/maxEventos × 0.2)
--
-- Uso: SELECT * FROM vw_oportunidade_investimento;
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


-- ============================================================
-- VIEW 7 | KPIs: Última atualização do banco
-- Busca o log de sucesso mais recente da base de dados.
-- O Java deve inserir um registro nessa tabela após cada
-- atualização bem-sucedida.
--
-- Insert que o Java deve fazer:
--   INSERT INTO log (data_hora, titulo, fk_tipo, fk_artefato)
--   VALUES (NOW(), 'Atualização da base de dados realizada', 2, 1);
--
-- Uso: SELECT ultima_atualizacao FROM vw_ultima_atualizacao;
-- ============================================================
CREATE OR REPLACE VIEW vw_ultima_atualizacao AS
SELECT
    DATE_FORMAT(MAX(data_hora), '%d/%m/%Y às %H:%i') AS ultima_atualizacao
FROM log
WHERE fk_tipo     = 2   -- 2 = SUCESSO
  AND fk_artefato = 1;  -- 1 = BASE DE DADOS
  
  -- View artista resumo ----------------------------------------------------------------------------------------------
CREATE OR REPLACE VIEW vw_artista_resumo AS
SELECT
    a.id_artista,
    a.artista_nome,
    p.nome AS pais,

    (
        SELECT g2.titulo_genero
        FROM musica m2
        JOIN genero g2
            ON g2.id_genero = m2.fk_genero
        WHERE m2.fk_artista = a.id_artista
            AND m2.data_lancamento BETWEEN '2025-10-01' AND '2025-12-31'
        GROUP BY g2.id_genero
        ORDER BY COUNT(*) DESC
        LIMIT 1
    ) AS genero_dominante,

    (
        SELECT COUNT(*)
        FROM musica m3
        WHERE m3.fk_artista = a.id_artista
            AND m3.data_lancamento BETWEEN '2025-01-01' AND '2025-12-31'
    ) AS total_musicas,

    ROUND(AVG(m.popularidade)) AS popularidade_media,
    SUM(m.contagem_streams) AS streams,
    ROUND(AVG(m.dancabilidade) * 100) AS dancabilidade,
    ROUND(AVG(m.energia) * 100) AS energia,
    ROUND((AVG(m.volume) + 60) * 2) AS valence,
    ROUND(AVG(m.instrumentabilidade) * 100) AS acousticness

FROM artista a
JOIN pais p
    ON p.id_pais = a.fk_pais
JOIN musica m
    ON m.fk_artista = a.id_artista
WHERE m.data_lancamento BETWEEN '2025-10-01' AND '2025-12-31'
GROUP BY
    a.id_artista,
    a.artista_nome,
    p.nome;
    
    
    -- Popularidade artista ----------------------------------------------------------------------------------------------
CREATE OR REPLACE VIEW vw_popularidade_artista AS
SELECT
    a.id_artista,
    SUM(
        CASE
            WHEN m.popularidade BETWEEN 0 AND 25
            THEN 1 ELSE 0
        END
    ) AS faixa_0_25,
    SUM(
        CASE
            WHEN m.popularidade BETWEEN 26 AND 50
            THEN 1 ELSE 0
        END
    ) AS faixa_26_50,
    SUM(
        CASE
            WHEN m.popularidade BETWEEN 51 AND 70
            THEN 1 ELSE 0
        END
    ) AS faixa_51_70,
    SUM(
        CASE
            WHEN m.popularidade BETWEEN 71 AND 100
            THEN 1 ELSE 0
        END
    ) AS faixa_71_100,
    CASE
        WHEN
            SUM(CASE WHEN m.popularidade BETWEEN 0 AND 25 THEN 1 ELSE 0 END)
            >=
            GREATEST(
                SUM(CASE WHEN m.popularidade BETWEEN 26 AND 50 THEN 1 ELSE 0 END),
                SUM(CASE WHEN m.popularidade BETWEEN 51 AND 70 THEN 1 ELSE 0 END),
                SUM(CASE WHEN m.popularidade BETWEEN 71 AND 100 THEN 1 ELSE 0 END)
            )
        THEN '0-25'
        WHEN
            SUM(CASE WHEN m.popularidade BETWEEN 26 AND 50 THEN 1 ELSE 0 END)
            >=
            GREATEST(
                SUM(CASE WHEN m.popularidade BETWEEN 0 AND 25 THEN 1 ELSE 0 END),
                SUM(CASE WHEN m.popularidade BETWEEN 51 AND 70 THEN 1 ELSE 0 END),
                SUM(CASE WHEN m.popularidade BETWEEN 71 AND 100 THEN 1 ELSE 0 END)
            )
        THEN '26-50'
        WHEN
            SUM(CASE WHEN m.popularidade BETWEEN 51 AND 70 THEN 1 ELSE 0 END)
            >=
            GREATEST(
                SUM(CASE WHEN m.popularidade BETWEEN 0 AND 25 THEN 1 ELSE 0 END),
                SUM(CASE WHEN m.popularidade BETWEEN 26 AND 50 THEN 1 ELSE 0 END),
                SUM(CASE WHEN m.popularidade BETWEEN 71 AND 100 THEN 1 ELSE 0 END)
            )
        THEN '51-70'
        ELSE '71-100'
    END AS faixa_dominante
FROM artista a
JOIN musica m
    ON m.fk_artista = a.id_artista
GROUP BY a.id_artista;

-- View dashboard artista ----------------------------------------------------------------------------------------------
CREATE OR REPLACE VIEW vw_dashboard_artista AS
SELECT
    r.id_artista,
    r.artista_nome AS nome,
    r.genero_dominante AS genero,
    r.pais,
    r.total_musicas AS lancamentos,
    r.popularidade_media AS popularidade,
    r.streams,

    r.dancabilidade,
    r.energia,
    r.valence,
    r.acousticness,

    pop.faixa_dominante
FROM vw_artista_resumo r
JOIN vw_popularidade_artista pop
    ON pop.id_artista = r.id_artista;
    

-- View perfil sonoro ----------------------------------------------------------------------------------------------
CREATE OR REPLACE VIEW vw_perfil_sonoro AS
SELECT
    p.id_perfil,
    p.fk_empresa,
    p.nome,
    p.perfil,
    p.fk_genero,
    p.taxa_minima,
    p.taxa_maxima,

    ROUND(((p.scoreE1 + 5) / 10) * 100) AS valence_alvo,
    ROUND(((p.scoreE2 + 7) / 14) * 100) AS energia_alvo,
    ROUND(((p.scoreE3 + 4) / 8) * 100) AS dancabilidade_alvo,

    ROUND(100 - (((p.scoreE4 + 5) / 10) * 100)) AS acousticness_alvo
FROM perfil p;

-- View match perfil sonoro ----------------------------------------------------------------------------------------------
CREATE OR REPLACE VIEW vw_match_artista_perfil AS
SELECT
    a.id_artista,
    a.nome,
    a.genero,
    a.pais,
    a.lancamentos,
    a.popularidade,
    a.streams,

    a.dancabilidade,
    a.energia,
    a.valence,
    a.acousticness,

    a.faixa_dominante,

    p.id_perfil,
    p.fk_empresa,
    p.nome AS nome_perfil,
    p.perfil AS codigo_perfil,

    p.dancabilidade_alvo,
    p.energia_alvo,
    p.valence_alvo,
    p.acousticness_alvo,

    (
        ABS(a.dancabilidade - p.dancabilidade_alvo) +
        ABS(a.energia - p.energia_alvo) +
        ABS(a.valence - p.valence_alvo) +
        ABS(a.acousticness - p.acousticness_alvo)
    ) AS distancia_perfil,

    ROUND(
        100 - LEAST(100, (
            ABS(a.dancabilidade - p.dancabilidade_alvo) +
            ABS(a.energia - p.energia_alvo) +
            ABS(a.valence - p.valence_alvo) +
            ABS(a.acousticness - p.acousticness_alvo)
        ) / 4)
    ) AS match_perfil

FROM vw_dashboard_artista a
JOIN vw_perfil_sonoro p;

-- Criar usuários
CREATE USER 'web_user'@'%' IDENTIFIED BY 'web_123456';
CREATE USER 'java_user'@'%' IDENTIFIED BY 'java_123456';

USE holofocus;

-- =====================================================
-- PERMISSÕES WEB_USER
-- =====================================================

-- Leitura
GRANT SELECT ON holofocus.artista TO 'web_user'@'%';
GRANT SELECT ON holofocus.genero TO 'web_user'@'%';
GRANT SELECT ON holofocus.musica TO 'web_user'@'%';
GRANT SELECT ON holofocus.pais TO 'web_user'@'%';

-- CRUD
GRANT SELECT, INSERT, UPDATE, DELETE ON holofocus.empresa TO 'web_user'@'%';
GRANT SELECT, INSERT, UPDATE, DELETE ON holofocus.endereco TO 'web_user'@'%';
GRANT SELECT, INSERT, UPDATE, DELETE ON holofocus.evento TO 'web_user'@'%';
GRANT SELECT, INSERT, UPDATE, DELETE ON holofocus.perfil TO 'web_user'@'%';
GRANT SELECT, INSERT, UPDATE, DELETE ON holofocus.usuario TO 'web_user'@'%';

-- Views
GRANT SELECT, INSERT, UPDATE, DELETE ON holofocus.vw_eventos_ultimos_12_meses TO 'web_user'@'%';
GRANT SELECT, INSERT, UPDATE, DELETE ON holofocus.vw_kpi_genero_popular TO 'web_user'@'%';
GRANT SELECT, INSERT, UPDATE, DELETE ON holofocus.vw_media_por_genero TO 'web_user'@'%';
GRANT SELECT, INSERT, UPDATE, DELETE ON holofocus.vw_oportunidade_investimento TO 'web_user'@'%';
GRANT SELECT, INSERT, UPDATE, DELETE ON holofocus.vw_top3_musicas_por_genero TO 'web_user'@'%';
GRANT SELECT, INSERT, UPDATE, DELETE ON holofocus.vw_top5_generos TO 'web_user'@'%';
GRANT SELECT, INSERT, UPDATE, DELETE ON holofocus.vw_ultima_atualizacao TO 'web_user'@'%';
GRANT SELECT ON holofocus.vw_match_artista_perfil TO 'web_user'@'%';
GRANT SELECT ON holofocus.vw_dashboard_artista TO 'web_user'@'%';

-- =====================================================
-- PERMISSÕES JAVA_USER
-- =====================================================

-- Apenas leitura
GRANT SELECT ON holofocus.artefato TO 'java_user'@'%';
GRANT SELECT ON holofocus.usuario TO 'java_user'@'%';

-- Create + Update
GRANT INSERT, UPDATE ON holofocus.artista TO 'java_user'@'%';
GRANT INSERT, UPDATE ON holofocus.genero TO 'java_user'@'%';
GRANT INSERT, UPDATE ON holofocus.log TO 'java_user'@'%';
GRANT INSERT, UPDATE ON holofocus.musica TO 'java_user'@'%';
GRANT INSERT, UPDATE ON holofocus.pais TO 'java_user'@'%';

-- Aplicar alterações
FLUSH PRIVILEGES;

INSERT INTO evento (nome_evento, data_evento, investimento_evento, retorno_evento, total_pessoas, fk_empresa, fk_artista, fk_genero) VALUES
('Festival Pop Verão',        '2025-06-15', 85000.00,  142000.00, 3200, 1, 1547,  1),
('Pop Hits Night',            '2025-07-08', 40000.00,   67500.00, 1800, 1, 3821,  1),
('Pop Stars ao Vivo',         '2025-08-20', 62000.00,   98000.00, 2500, 1, 7203,  1),
('Noite das Estrelas Pop',    '2026-02-20', 91000.00,  155000.00, 4200, 1, 2033,  1),
('Grande Festival Vibra SP',  '2026-06-04', 200000.00, 380000.00, 5000, 1, 8899,  1),
('Metal Inferno',             '2025-08-05', 72000.00,  110000.00, 2900, 1, 2178,  2),
('Heavy Metal Festival',      '2025-10-13', 88000.00,  135000.00, 3500, 1, 9041,  2),
('EDM vs Metal Showdown',     '2026-05-29', 115000.00, 195000.00, 4900, 1, 4521,  2),
('Rock in Vibra',             '2025-07-22', 95000.00,  158000.00, 4100, 1,  892,  3),
('Classic Rock Night',        '2025-09-10', 55000.00,   89000.00, 2200, 1, 5634,  3),
('Rock Revolution',           '2025-06-28', 98000.00,  163000.00, 4300, 1, 4477,  3),
('Hard Rock Night',           '2025-08-09', 87000.00,  145000.00, 3900, 1, 2265,  3),
('Rock Garage Festival',      '2025-10-04', 76000.00,  128000.00, 3400, 1, 8830,  3),
('Vibra Rock Open Air',       '2026-01-25', 105000.00, 178000.00, 4600, 1,  619,  3),
('Rock Legends Vibra',        '2026-03-03', 102000.00, 170000.00, 4500, 1, 6789,  3),
('Rock Anthem Show',          '2026-04-12', 92000.00,  154000.00, 4100, 1, 7356,  3),
('R&B Soul Night',            '2025-09-07', 48000.00,   79000.00, 2000, 1, 1093,  4),
('Ritmo & Blues ao Vivo',     '2025-12-03', 53000.00,   87000.00, 2100, 1, 8456,  4),
('Jazz & Blues Evening',      '2025-06-18', 30000.00,   52000.00, 1200, 1, 4367,  5),
('Noite de Jazz Clássico',    '2025-11-25', 25000.00,   44000.00,  950, 1, 6812,  5),
('Indie Vibes Festival',      '2025-07-01', 44000.00,   71000.00, 1750, 1, 3309,  6),
('Indie Underground Night',   '2025-10-19', 38000.00,   60000.00, 1500, 1, 7621,  6),
('Country Roads Show',        '2025-08-26', 35000.00,   58000.00, 1400, 1, 2984,  7),
('Nashville Vibra Night',     '2025-11-06', 42000.00,   69000.00, 1650, 1, 5117,  7),
('Classical Gala Concert',    '2025-06-30', 28000.00,   47000.00,  800, 1, 9832,  8),
('Sinfonia ao Vivo',          '2025-12-08', 32000.00,   51000.00,  900, 1, 1276,  8),
('Hip-Hop Summit',            '2025-07-22', 67000.00,  115000.00, 3000, 1, 6543,  9),
('Rap Battle Vibra',          '2025-09-30', 74000.00,  122000.00, 3300, 1, 4890,  9),
('Hip-Hop & R&B Fusion',      '2026-04-16', 79000.00,  130000.00, 3400, 1, 1864,  9),
('EDM Explosion',             '2025-06-25', 110000.00, 190000.00, 4800, 1,  731, 10),
('Electric Night Festival',   '2025-10-21', 120000.00, 205000.00, 5000, 1, 8274, 10),
('EDM Rave Vibra',            '2025-07-05', 125000.00, 215000.00, 4950, 1, 3082, 10),
('Bass Drop Festival',        '2025-08-23', 118000.00, 202000.00, 4800, 1, 6741, 10),
('Neon EDM Night',            '2025-10-31', 132000.00, 225000.00, 5000, 1, 1398, 10),
('Electronic Pulse Show',     '2026-02-14', 109000.00, 188000.00, 4700, 1, 9503, 10),
('Vibra EDM Closing Party',   '2026-05-23', 145000.00, 248000.00, 5000, 1, 4867, 10),
('Reggaeton Fuego',           '2025-08-14', 58000.00,   96000.00, 2700, 1, 3658, 11),
('Latin Vibes Night',         '2026-01-11', 63000.00,  104000.00, 2900, 1, 7145, 11),
('Folk Stories Concert',      '2025-09-19', 22000.00,   38000.00,  700, 1, 5402, 12),
('Folk Roots Festival',       '2025-11-05', 27000.00,   45000.00,  850, 1, 9267, 12),
('Folk Tales Night',          '2025-06-20', 24000.00,   41000.00,  780, 1, 3341, 12),
('Acoustic Folk Session',     '2025-07-14', 19000.00,   33000.00,  620, 1, 7892, 12),
('Folk & Roots Festival',     '2025-09-02', 31000.00,   52000.00,  910, 1, 1654, 12),
('Folk Unplugged Vibra',      '2025-11-18', 26000.00,   44000.00,  760, 1, 5523, 12),
('Heartland Folk Show',       '2026-02-07', 22000.00,   38000.00,  690, 1, 9114, 12);

