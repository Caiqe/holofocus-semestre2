var database = require("../database/config");

function carregarKpis() {
    var instrucaoSql = `SELECT genero, media_energia, musica_mais_ouvida FROM vw_kpi_genero_popular;`;
    
    return database.executar(instrucaoSql);
}

function carregarGraficoBarras(){
    var instrucaoSql = `SELECT titulo_genero, media_popularidade, media_energia FROM vw_top5_generos;`;
    
    return database.executar(instrucaoSql);
}

function carregarGraficoLinhas(id){
    var instrucaoSql = `SELECT mes_label, total_eventos FROM vw_eventos_ultimos_12_meses WHERE fk_empresa = ? ORDER BY mes_ano;`;
    
    return database.executar(instrucaoSql, [id]);
}

function carregarOportunidades(){
    var instrucaoSql = `SELECT genero, media_popularidade, media_energia FROM vw_oportunidade_investimento;`;

    return database.executar(instrucaoSql);
}

function carregarTabela(id) {
    var instrucaoSql = `
        SELECT titulo_musica, artista_nome, popularidade, pais
        FROM (
            SELECT * FROM vw_top3_musicas_por_genero
            WHERE id_genero = ?
        ) AS sub
        WHERE ranking <= 3
        ORDER BY ranking;
    `;

    return database.executar(instrucaoSql, [id]);
}

function carregarGenerosSelect() {
    var instrucaoSql = `SELECT DISTINCT id_genero, titulo_genero FROM vw_top3_musicas_por_genero ORDER BY titulo_genero;`;

    return database.executar(instrucaoSql);
}


function carregarUltimaAtualizacao() {
    var instrucaoSql = `SELECT ultima_atualizacao FROM vw_ultima_atualizacao;`;

    return database.executar(instrucaoSql);
}

module.exports = { carregarUltimaAtualizacao, carregarGenerosSelect, carregarGraficoBarras, carregarKpis, carregarGraficoLinhas, carregarOportunidades, carregarTabela };