var database = require("../database/config");

function buscarArtistas(filtros) {
    let instrucaoSql = filtros.perfil
        ? `
            SELECT *
            FROM vw_match_artista_perfil
            WHERE id_perfil = ${Number(filtros.perfil)}
        `
        : `
            SELECT *
            FROM vw_dashboard_artista
            WHERE 1 = 1
        `;
    if (filtros.empresa && filtros.perfil) {
        instrucaoSql += `
            AND fk_empresa = ${Number(filtros.empresa)}
        `;
    }
    if (filtros.genero) {
        instrucaoSql += `
            AND genero = '${filtros.genero}'
        `;
    }
    if (filtros.pais) {
        instrucaoSql += `
            AND pais = '${filtros.pais}'
        `;
    }
    if (filtros.popularidade) {
        let faixa = filtros.popularidade.split('-');
        instrucaoSql += `
            AND popularidade BETWEEN ${Number(faixa[0])} AND ${Number(faixa[1])}
        `;
    }
    if (filtros.perfil) {
        instrucaoSql += `
            ORDER BY distancia_perfil ASC, streams DESC
            LIMIT 5
        `;
    } else {
        instrucaoSql += `
            ORDER BY
                (
                    (popularidade * 0.35) +
                    ((streams / (SELECT MAX(streams) FROM vw_dashboard_artista)) * 100 * 0.35) +
                    (dancabilidade * 0.10) +
                    (energia * 0.10) +
                    (valence * 0.05) +
                    (acousticness * 0.05)
                ) DESC
            LIMIT 5
        `;
    }
    return database.executar(instrucaoSql);
}

function buscarTopMusicasArtistas(idsArtistas) {
    if (!idsArtistas) {
        return Promise.resolve([]);
    }

    let instrucaoSql = `
        SELECT
            a.id_artista,
            a.artista_nome,
            m.titulo_musica,
            m.contagem_streams
        FROM artista a
        JOIN musica m
            ON m.fk_artista = a.id_artista
        WHERE a.id_artista IN (${idsArtistas})
        ORDER BY
            a.artista_nome,
            m.contagem_streams DESC;
    `;

    return database.executar(instrucaoSql);
}

function buscarDistribuicao(idArtista) {
    let instrucaoSql = `
        SELECT
            CASE
                WHEN popularidade BETWEEN 0 AND 25 THEN '0-25'
                WHEN popularidade BETWEEN 26 AND 50 THEN '26-50'
                WHEN popularidade BETWEEN 51 AND 70 THEN '51-70'
                ELSE '71-100'
            END AS faixa,
            COUNT(*) AS quantidade
        FROM musica
        WHERE fk_artista = ${idArtista}
            AND data_lancamento BETWEEN '2025-10-01' AND '2025-12-31'
        GROUP BY faixa
        ORDER BY faixa;
    `;

    return database.executar(instrucaoSql);
}

function buscarFiltros(filtros) {
    let instrucaoSqlGenero = `
        SELECT DISTINCT
            g.titulo_genero AS genero
        FROM genero g
        ORDER BY g.titulo_genero;
    `;
    let instrucaoSqlPais = `
        SELECT DISTINCT
            p.nome AS pais
        FROM pais p
        ORDER BY p.nome;
    `;
    let instrucaoSqlPerfil = `
        SELECT
            id_perfil,
            fk_empresa,
            nome,
            perfil
        FROM perfil
        WHERE 1 = 1
    `;

    if (filtros.empresa) {
        instrucaoSqlPerfil += `
            AND fk_empresa = ${Number(filtros.empresa)}
        `;
    }

    instrucaoSqlPerfil += `
        ORDER BY nome;
    `;
    return Promise.all([
        database.executar(instrucaoSqlGenero),
        database.executar(instrucaoSqlPais),
        database.executar(instrucaoSqlPerfil)
    ]);
}

function buscarCrescimentoArtista(idArtista) {
    let instrucaoSql = `
        SELECT
            (
                SELECT SUM(contagem_streams)
                FROM musica
                WHERE fk_artista = ${idArtista}
                    AND data_lancamento BETWEEN '2025-10-01' AND '2025-12-31'
            ) AS streams_atual,
            (
                SELECT SUM(contagem_streams)
                FROM musica
                WHERE fk_artista = ${idArtista}
                    AND data_lancamento BETWEEN '2025-07-01' AND '2025-09-30'
            ) AS streams_anterior,
            (
                SELECT AVG(popularidade)
                FROM musica
                WHERE fk_artista = ${idArtista}
                    AND data_lancamento BETWEEN '2025-10-01' AND '2025-12-31'
            ) AS popularidade_atual,
            (
                SELECT AVG(popularidade)
                FROM musica
                WHERE fk_artista = ${idArtista}
                    AND data_lancamento BETWEEN '2025-07-01' AND '2025-09-30'
            ) AS popularidade_anterior;
    `;

    return database.executar(instrucaoSql);
}
module.exports = {
    buscarArtistas,
    buscarTopMusicasArtistas,
    buscarDistribuicao,
    buscarFiltros,
    buscarCrescimentoArtista
};
