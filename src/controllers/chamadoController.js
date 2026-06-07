var model = require("../models/chamadoModel");

async function listar(req, res) {
    try {
        // Os três valores definem quais chamados o usuário pode visualizar.
        res.status(200).json(await model.listar(
            // Empresa usada no filtro de GESTOR e USER.
            req.query.idEmpresa,
            // Usuário usado para limitar o nível USER.
            req.query.idUsuario,
            // Nível que decide qual filtro SQL será montado.
            req.query.nivelAcesso
        ));
    } catch (erro) {
        // Retorna ao frontend a mensagem gerada durante a consulta.
        res.status(500).json({ mensagem: erro.sqlMessage || erro.message });
    }
}

async function cadastrar(req, res) {
    // Assunto, descrição, usuário e empresa formam o vínculo mínimo do chamado.
    if (!req.body.assunto || !req.body.descricao || !req.body.idUsuario || !req.body.idEmpresa) {
        // Informa erro de preenchimento antes de tentar inserir no banco.
        return res.status(400).json({ mensagem: "Preencha os campos obrigatórios" });
    }
    try {
        // Envia todos os dados validados para o model.
        res.status(201).json(await model.cadastrar(req.body));
    } catch (erro) {
        // Trata falhas do INSERT, incluindo relacionamentos inválidos.
        res.status(500).json({ mensagem: erro.sqlMessage || erro.message });
    }
}

async function editarStatus(req, res) {
    // Impede salvar no banco um status fora dos valores usados pela aplicação.
    const validos = ["ABERTO", "EM_ANDAMENTO", "CONCLUIDO", "ENCERRADO"];
    // Compara o valor recebido com a lista permitida.
    if (!validos.includes(req.body.status)) {
        // Não envia status desconhecido para o banco.
        return res.status(400).json({ mensagem: "Status inválido" });
    }
    try {
        // Atualiza status, responsável e possível data de fechamento.
        const resultado = await model.editarStatus(req.params.idChamado, req.body);
        // Detecta quando o ID informado não corresponde a nenhum chamado.
        if (!resultado.affectedRows) return res.status(404).json({ mensagem: "Chamado não encontrado" });
        // Confirma a atualização para a tela recarregar a lista.
        res.status(200).json(resultado);
    } catch (erro) {
        // Devolve erros da atualização.
        res.status(500).json({ mensagem: erro.sqlMessage || erro.message });
    }
}

async function deletar(req, res) {
    try {
        // O model decide se o suporte pode excluir qualquer chamado ou apenas o próprio.
        const resultado = await model.deletar(
            // Identifica o chamado escolhido.
            req.params.idChamado,
            // Identifica quem está solicitando a exclusão.
            req.query.idUsuario,
            // Define se a exclusão pode alcançar qualquer chamado.
            req.query.nivelAcesso
        );
        // Informa quando o chamado não existe ou não pertence ao usuário.
        if (!resultado.affectedRows) return res.status(404).json({ mensagem: "Chamado não encontrado" });
        // Confirma a exclusão realizada.
        res.status(200).json(resultado);
    } catch (erro) {
        // Trata falhas da operação DELETE.
        res.status(500).json({ mensagem: erro.sqlMessage || erro.message });
    }
}

module.exports = { listar, cadastrar, editarStatus, deletar };
