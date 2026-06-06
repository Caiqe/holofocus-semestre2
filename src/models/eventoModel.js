var database = require("../database/config");

function listarPorEmpresa(idEmpresa) {
    // JOIN traz os nomes de artista e gênero junto com os dados do evento.
    return database.executar(`
        -- Seleciona os campos usados na tabela e nos formulários.
        SELECT e.id_evento, e.nome_evento, e.data_evento,
               e.investimento_evento, e.retorno_evento, e.total_pessoas,
               e.fk_empresa, e.fk_artista, e.fk_genero,
               a.artista_nome, g.titulo_genero
        -- Usa evento como tabela principal da consulta.
        FROM evento e
        -- Relaciona a chave do artista ao respectivo nome.
        INNER JOIN artista a ON a.id_artista = e.fk_artista
        -- Relaciona a chave do gênero ao respectivo título.
        INNER JOIN genero g ON g.id_genero = e.fk_genero
        -- Limita o resultado à empresa que está usando a tela.
        WHERE e.fk_empresa = ?
        -- Exibe os eventos mais recentes primeiro.
        ORDER BY e.data_evento DESC, e.id_evento DESC
    `, [idEmpresa]);
}

function buscarPorId(idEvento) {
    // Retorna todos os campos necessários para preencher a edição.
    return database.executar(`
        -- Procura somente o evento cujo ID foi selecionado.
        SELECT * FROM evento WHERE id_evento = ?
    `, [idEvento]);
}

function cadastrar(dados) {
    // As chaves estrangeiras associam o evento à empresa, ao artista e ao gênero.
    return database.executar(`
        -- Define as colunas que receberão os dados do formulário.
        INSERT INTO evento
            (nome_evento, data_evento, investimento_evento, retorno_evento,
             total_pessoas, fk_empresa, fk_artista, fk_genero)
        -- Cada interrogação será substituída por um item do array abaixo.
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [
        // Salva o nome digitado.
        dados.nomeEvento,
        // Salva a data escolhida.
        dados.dataEvento,
        // Salva o valor investido.
        dados.investimento,
        // Salva o retorno informado.
        dados.retorno,
        // Salva a quantidade de pessoas.
        dados.totalPessoas,
        // Vincula o evento à empresa da sessão.
        dados.idEmpresa,
        // Vincula o evento ao artista selecionado.
        dados.idArtista,
        // Vincula o evento ao gênero selecionado.
        dados.idGenero
    ]);
}

function editar(idEvento, dados) {
    // A empresa participa do WHERE para manter a alteração no vínculo correto.
    return database.executar(`
        -- Atualiza os campos editáveis do evento.
        UPDATE evento
        SET nome_evento = ?, data_evento = ?, investimento_evento = ?,
            retorno_evento = ?, total_pessoas = ?, fk_artista = ?, fk_genero = ?
        -- Exige que o ID e a empresa correspondam ao mesmo registro.
        WHERE id_evento = ? AND fk_empresa = ?
    `, [
        // Novos valores enviados pelo formulário de edição.
        dados.nomeEvento,
        dados.dataEvento,
        dados.investimento,
        dados.retorno,
        dados.totalPessoas,
        dados.idArtista,
        dados.idGenero,
        // Identifica o evento que será alterado.
        idEvento,
        // Confirma que o evento pertence à empresa logada.
        dados.idEmpresa
    ]);
}

function deletar(idEvento, idEmpresa) {
    // Exclui somente quando evento e empresa correspondem.
    return database.executar(
        // As duas condições evitam excluir um registro de outra empresa.
        "DELETE FROM evento WHERE id_evento = ? AND fk_empresa = ?",
        // Valores usados nas duas condições do DELETE.
        [idEvento, idEmpresa]
    );
}

function listarArtistas() {
    // Consulta simples usada apenas para preencher o select.
    return database.executar(
        // Retorna o ID como value e o nome como texto da opção.
        "SELECT id_artista, artista_nome FROM artista ORDER BY artista_nome"
    );
}

module.exports = {
    listarPorEmpresa,
    buscarPorId,
    cadastrar,
    editar,
    deletar,
    listarArtistas
};
