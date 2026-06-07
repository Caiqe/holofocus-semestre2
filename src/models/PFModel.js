var database = require("../database/config");

function buscar() {
    // Retorna o ID real do gênero; o frontend não deve criar IDs por contador.
    return database.executar(`
        -- Seleciona ID e título para montar as opções.
        SELECT id_genero, titulo_genero
        -- Consulta a tabela de gêneros.
        FROM genero
        -- Organiza os nomes alfabeticamente.
        ORDER BY titulo_genero
    `);
}

function editar(nome, genero, taxaMin, taxaMax, aspecto1, aspecto2, aspecto3, aspecto4, perfil, idPerfil, fkEmpresa) {
    // idPerfil e fkEmpresa juntos identificam exatamente o perfil que será alterado.
    return database.executar(`
        -- Atualiza todos os campos disponíveis no modal.
        UPDATE perfil
        SET nome = ?, fk_genero = ?, taxa_minima = ?, taxa_maxima = ?,
            scoreE1 = ?, scoreE2 = ?, scoreE3 = ?, scoreE4 = ?, perfil = ?
        -- Exige correspondência entre perfil e empresa.
        WHERE id_perfil = ? AND fk_empresa = ?
    `, [
        // Novos valores do perfil.
        nome,
        genero || null,
        taxaMin,
        taxaMax,
        aspecto1,
        aspecto2,
        aspecto3,
        aspecto4,
        perfil,
        // Valores que identificam a linha.
        idPerfil,
        fkEmpresa
    ]);
}

module.exports = { buscar, editar };
