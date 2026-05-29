var database = require("../database/config");

function buscarArtistas(filtros) {
    let instrucaoSql = `
        SELECT
            a.id_artista,
            a.artista_nome AS nome,
            p.nome AS pais,

        MAX(g.titulo_genero) AS genero,
        ROUND(AVG(m.popularidade)) AS popularidade,
        SUM(m.contagem_streams) AS streams,
        ROUND(AVG(m.dancabilidade) * 100) AS dancabilidade,
        ROUND(AVG(m.energia) * 100) AS energia,
        ROUND((AVG(m.volume) + 60) * 2) AS valence,
        ROUND(AVG(m.instrumentabilidade) * 100) AS acousticness,
        COUNT(m.id_musica) AS lancamentos

        FROM artista a
            JOIN pais p
            ON p.id_pais = a.fk_pais

            JOIN musica m
            ON m.fk_artista = a.id_artista

            JOIN genero g
            ON g.id_genero = m.fk_genero

        WHERE 1 = 1`;

    if (filtros.genero != "") {
        instrucaoSql += `
            AND g.titulo_genero = '${filtros.genero}'`;
    }

    if (filtros.pais != "") {
        instrucaoSql += `
            AND p.nome = '${filtros.pais}'`;
    }

    if (filtros.popularidade != "") {
        let faixa = filtros.popularidade.split('-');
        instrucaoSql += `
        GROUP BY
            a.id_artista,
            a.artista_nome,
            p.nome

        HAVING ROUND(AVG(m.popularidade))
            BETWEEN ${faixa[0]}
            AND ${faixa[1]}`;
    } else {
        instrucaoSql += `
        GROUP BY
            a.id_artista,
            a.artista_nome,
            p.nome`;
    }

    instrucaoSql += `
        ORDER BY streams DESC
        LIMIT 5;`;
    console.log(instrucaoSql);
    return database.executar(instrucaoSql);
}

function buscarTopMusicasArtistas(idsArtistas) {

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
                WHEN popularidade BETWEEN 0 AND 25
                    THEN '0-25'
                WHEN popularidade BETWEEN 26 AND 50
                    THEN '26-50'
                WHEN popularidade BETWEEN 51 AND 75
                    THEN '51-75'
                ELSE '76-100'
            END AS faixa,
            COUNT(*) AS quantidade
        FROM musica
        WHERE fk_artista = ${idArtista}
        GROUP BY faixa;`;
    return database.executar(instrucaoSql);
}

module.exports = {
    buscarArtistas,
    buscarTopMusicasArtistas,
    buscarDistribuicao
};