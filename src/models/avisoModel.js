var database = require("../database/config");

// Trecho compartilhado pelas listagens para não repetir o mesmo JOIN.
// A senha do usuário não é retornada porque não é necessária para avisos.
const selecao = `
    -- Seleciona dados do aviso e dados públicos do autor.
    SELECT a.id AS idAviso, a.titulo, a.descricao,
           a.data_publicacao, a.fk_usuario,
           u.id_usuario AS idUsuario, u.nome, u.email
    -- Usa aviso como tabela principal.
    FROM aviso a
    -- Relaciona o aviso ao usuário pelo nome correto da chave primária.
    INNER JOIN usuario u ON a.fk_usuario = u.id_usuario
`;

function listar() {
    // Acrescenta somente a ordenação ao SELECT compartilhado.
    return database.executar(`${selecao} ORDER BY a.data_publicacao DESC`);
}

function pesquisarDescricao(texto) {
    // Os sinais de porcentagem permitem encontrar o texto em qualquer posição.
    return database.executar(
        // Acrescenta o filtro de descrição ao SELECT compartilhado.
        `${selecao} WHERE a.descricao LIKE ? ORDER BY a.data_publicacao DESC`,
        // Monta o padrão usado pelo operador LIKE.
        [`%${texto}%`]
    );
}

function listarPorUsuario(idUsuario) {
    // Filtra avisos pelo id_usuario do autor.
    return database.executar(
        `${selecao} WHERE u.id_usuario = ? ORDER BY a.data_publicacao DESC`,
        // Substitui o parâmetro pelo usuário solicitado.
        [idUsuario]
    );
}

function publicar(titulo, descricao, idUsuario) {
    // Vincula o aviso ao id_usuario correto da tabela usuario.
    return database.executar(`
        -- Define título, descrição e autor do aviso.
        INSERT INTO aviso (titulo, descricao, fk_usuario)
        -- Recebe os três valores separados da consulta.
        VALUES (?, ?, ?)
    `, [titulo, descricao, idUsuario]);
}

function editar(novaDescricao, idAviso) {
    // Atualiza somente a descrição do aviso selecionado.
    return database.executar(
        "UPDATE aviso SET descricao = ? WHERE id = ?",
        // Primeiro envia o texto novo e depois o ID.
        [novaDescricao, idAviso]
    );
}

function deletar(idAviso) {
    // Exclui somente o aviso cujo ID foi informado.
    return database.executar(
        "DELETE FROM aviso WHERE id = ?",
        // Substitui a interrogação pelo ID.
        [idAviso]
    );
}

module.exports = {
    listar,
    listarPorUsuario,
    pesquisarDescricao,
    publicar,
    editar,
    deletar
};
