var database = require("../database/config");

function cadastrar(dados) {
    // Campos ausentes no questionário viram NULL; o modal envia todos os campos.
    return database.executar(`
        -- Define todas as colunas que podem compor um perfil.
        INSERT INTO perfil
            (nome, fk_empresa, taxa_minima, taxa_maxima, fk_genero,
             scoreE1, scoreE2, scoreE3, scoreE4, perfil)
        -- Recebe os valores normalizados pelo controller.
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
        // Nome Principal ou nome digitado no modal.
        dados.nome,
        // Empresa proprietária do perfil.
        dados.idEmpresa,
        // Valores opcionais são convertidos para NULL.
        dados.taxaMinima || null,
        dados.taxaMaxima || null,
        dados.idGenero || null,
        // Pontuações dos quatro eixos.
        dados.scoreE1,
        dados.scoreE2,
        dados.scoreE3,
        dados.scoreE4,
        // Sigla de quatro letras.
        dados.perfil
    ]);
}

function atualizarPerfilCad(id) {
    // Retorna o perfil criado mais recentemente para a empresa.
    var instrucaoSql = `SELECT id_perfil FROM perfil WHERE fk_empresa = ? ORDER BY id_perfil DESC LIMIT 1`;
    
    // Substitui o parâmetro pelo ID da empresa.
    return database.executar(instrucaoSql, [id]);
}

function listar(idEmpresa) {
    // LEFT JOIN mantém perfis sem gênero e acrescenta o título quando existe.
    return database.executar(`
        -- Seleciona todos os campos usados no modal.
        SELECT p.id_perfil, p.fk_empresa, p.nome, p.taxa_minima,
               p.taxa_maxima, p.fk_genero, p.scoreE1, p.scoreE2,
               p.scoreE3, p.scoreE4, p.perfil, g.titulo_genero
        -- Usa perfil como tabela principal.
        FROM perfil p
        -- Gênero é opcional.
        LEFT JOIN genero g ON g.id_genero = p.fk_genero
        -- Limita os perfis à empresa da sessão.
        WHERE p.fk_empresa = ?
        -- Coloca o perfil Principal antes dos adicionais.
        ORDER BY (p.nome = 'Principal') DESC, p.id_perfil
    `, [idEmpresa]);
}

function deletar(idPerfil, idEmpresa) {
    // A condição pelo nome impede apagar o perfil principal criado pelo questionário.
    return database.executar(
        // Exige ID, empresa e nome diferente de Principal.
        "DELETE FROM perfil WHERE id_perfil = ? AND fk_empresa = ? AND nome <> 'Principal'",
        // Substitui ID do perfil e ID da empresa.
        [idPerfil, idEmpresa]
    );
}

module.exports = {
    cadastrar,
    atualizarPerfilCad,
    listar,
    deletar
};
