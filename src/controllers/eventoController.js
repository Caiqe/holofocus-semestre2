var eventoModel = require("../models/eventoModel");

// Os relacionamentos com empresa, artista e gênero são obrigatórios no banco.
function validar(dados) {
    // Confirma que o evento possui nome.
    return dados.nomeEvento && dados.dataEvento && dados.idEmpresa &&
        // Confirma também os vínculos obrigatórios com artista e gênero.
        dados.idArtista && dados.idGenero;
}

async function listar(req, res) {
    try {
        // Cada empresa visualiza somente seus próprios eventos.
        const resultado = await eventoModel.listarPorEmpresa(req.params.idEmpresa);
        // Envia a lista encontrada em formato JSON.
        res.status(200).json(resultado);
    } catch (erro) {
        // Retorna ao frontend a mensagem fornecida pelo MySQL ou pelo JavaScript.
        res.status(500).json({ mensagem: erro.sqlMessage || erro.message });
    }
}

async function buscar(req, res) {
    try {
        // Busca individual usada para preencher o modal de edição.
        const resultado = await eventoModel.buscarPorId(req.params.idEvento);
        // Retorna 404 quando a consulta não encontra nenhuma linha.
        if (!resultado.length) return res.status(404).json({ mensagem: "Evento não encontrado" });
        // Como a busca é por ID, devolve somente o primeiro registro.
        res.status(200).json(resultado[0]);
    } catch (erro) {
        // Informa erro interno quando a consulta não pode ser executada.
        res.status(500).json({ mensagem: erro.sqlMessage || erro.message });
    }
}

async function cadastrar(req, res) {
    // Interrompe o cadastro quando algum vínculo obrigatório está ausente.
    if (!validar(req.body)) return res.status(400).json({ mensagem: "Preencha os campos obrigatórios" });
    try {
        // O model devolve o insertId gerado pelo MySQL.
        const resultado = await eventoModel.cadastrar(req.body);
        // O código 201 indica que um novo registro foi criado.
        res.status(201).json(resultado);
    } catch (erro) {
        // Devolve a falha do banco para o tratamento do fetch.
        res.status(500).json({ mensagem: erro.sqlMessage || erro.message });
    }
}

async function editar(req, res) {
    // A edição exige os mesmos campos obrigatórios do cadastro.
    if (!validar(req.body)) return res.status(400).json({ mensagem: "Preencha os campos obrigatórios" });
    try {
        // affectedRows igual a zero indica que o evento não foi encontrado.
        const resultado = await eventoModel.editar(req.params.idEvento, req.body);
        // Evita retornar sucesso quando nenhum registro foi alterado.
        if (!resultado.affectedRows) return res.status(404).json({ mensagem: "Evento não encontrado" });
        // Devolve o resultado da operação de atualização.
        res.status(200).json(resultado);
    } catch (erro) {
        // Encaminha erros de relacionamento ou execução SQL.
        res.status(500).json({ mensagem: erro.sqlMessage || erro.message });
    }
}

async function deletar(req, res) {
    try {
        // O id da empresa também é enviado para não excluir evento de outra empresa.
        const resultado = await eventoModel.deletar(req.params.idEvento, req.query.idEmpresa);
        // Retorna 404 se o par evento/empresa não for encontrado.
        if (!resultado.affectedRows) return res.status(404).json({ mensagem: "Evento não encontrado" });
        // Confirma a exclusão para o frontend recarregar a lista.
        res.status(200).json(resultado);
    } catch (erro) {
        // Retorna erros como restrições de chave estrangeira.
        res.status(500).json({ mensagem: erro.sqlMessage || erro.message });
    }
}

async function listarArtistas(req, res) {
    try {
        // Alimenta os selects de artista dos formulários.
        res.status(200).json(await eventoModel.listarArtistas());
    } catch (erro) {
        // Informa quando a lista de artistas não pode ser consultada.
        res.status(500).json({ mensagem: erro.sqlMessage || erro.message });
    }
}

module.exports = { listar, buscar, cadastrar, editar, deletar, listarArtistas };
