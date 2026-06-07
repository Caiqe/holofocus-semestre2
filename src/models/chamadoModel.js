var database = require("../database/config");

function listar(idEmpresa, idUsuario, nivelAcesso) {
    // SUPORTE (2) vê todos; os outros níveis são limitados à empresa.
    var filtro = Number(nivelAcesso) === 2 ? "" : "AND c.fk_empresa = ?";
    // SUPORTE não precisa de parâmetro inicial; os outros enviam a empresa.
    var parametros = Number(nivelAcesso) === 2 ? [] : [idEmpresa];
    // USER (3) é limitado também aos chamados abertos por ele.
    if (Number(nivelAcesso) === 3) {
        // Acrescenta a condição de usuário ao SQL.
        filtro += " AND c.fk_usuario = ?";
        // Acrescenta o ID que substituirá a nova interrogação.
        parametros.push(idUsuario);
    }
    // Executa a consulta com o filtro montado para o nível atual.
    return database.executar(`
        -- Seleciona dados do chamado e nomes relacionados.
        SELECT c.id_chamado, c.assunto, c.descricao, c.status_chamado,
               c.data_abertura, c.data_fechamento, c.fk_usuario,
               c.fk_empresa, c.fk_responsavel, e.razao_social,
               u.nome AS usuario_nome, r.nome AS responsavel_nome
        -- Usa chamado como tabela principal.
        FROM chamado c
        -- Busca o nome da empresa do chamado.
        INNER JOIN empresa e ON e.id_empresa = c.fk_empresa
        -- Busca o nome do usuário que abriu o chamado.
        INNER JOIN usuario u ON u.id_usuario = c.fk_usuario
        -- Responsável pode ser nulo enquanto ninguém assumir o chamado.
        LEFT JOIN usuario r ON r.id_usuario = c.fk_responsavel
        -- O 1 = 1 permite acrescentar os filtros dinâmicos com AND.
        WHERE 1 = 1 ${filtro}
        -- Exibe primeiro os chamados abertos mais recentemente.
        ORDER BY c.data_abertura DESC
    `, parametros);
}

function cadastrar(dados) {
    // O status inicial e a data de abertura usam os padrões definidos na tabela.
    return database.executar(`
        -- Cadastra o conteúdo e os dois vínculos obrigatórios.
        INSERT INTO chamado (assunto, descricao, fk_usuario, fk_empresa)
        -- Valores recebidos do formulário.
        VALUES (?, ?, ?, ?)
    `, [dados.assunto, dados.descricao, dados.idUsuario, dados.idEmpresa]);
}

function editarStatus(idChamado, dados) {
    // Registra a data de fechamento somente nos estados finais.
    var dataFechamento = ["CONCLUIDO", "ENCERRADO"].includes(dados.status) ?
        // Usa o momento atual quando o atendimento terminou.
        new Date() : null;
    // Atualiza o chamado selecionado.
    return database.executar(`
        -- Define novo status, responsável e data de fechamento.
        UPDATE chamado
        SET status_chamado = ?, fk_responsavel = ?, data_fechamento = ?
        -- Limita a alteração ao ID recebido.
        WHERE id_chamado = ?
    `, [dados.status, dados.idResponsavel || null, dataFechamento, idChamado]);
}

function deletar(idChamado, idUsuario, nivelAcesso) {
    // SUPORTE pode excluir qualquer chamado; demais usuários somente os próprios.
    if (Number(nivelAcesso) === 2) {
        // Para SUPORTE, o ID do chamado é suficiente.
        return database.executar("DELETE FROM chamado WHERE id_chamado = ?", [idChamado]);
    }
    // Para outros níveis, exige também que o chamado pertença ao usuário.
    return database.executar(
        "DELETE FROM chamado WHERE id_chamado = ? AND fk_usuario = ?",
        [idChamado, idUsuario]
    );
}

module.exports = { listar, cadastrar, editarStatus, deletar };
