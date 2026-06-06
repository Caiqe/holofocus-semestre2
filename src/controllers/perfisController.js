var perfisModel = require("../models/perfisModel");

function cadastrar(req, res) {
    // O questionário envia finalScores; o modal envia os campos diretamente.
    let dados = {
        // Aceita "id" do questionário ou "idEmpresa" do modal.
        idEmpresa: req.body.id || req.body.idEmpresa,
        // O questionário não envia nome, então cria o perfil Principal.
        nome: req.body.nome || "Principal",
        // Faixas de popularidade são enviadas somente pelo modal.
        taxaMinima: req.body.taxaMinima,
        taxaMaxima: req.body.taxaMaxima,
        // Gênero também é opcional no questionário inicial.
        idGenero: req.body.idGenero,
        // Escolhe o formato de pontuação conforme a origem da requisição.
        scoreE1: req.body.finalScores ? req.body.finalScores.E1 : req.body.scoreE1,
        scoreE2: req.body.finalScores ? req.body.finalScores.E2 : req.body.scoreE2,
        scoreE3: req.body.finalScores ? req.body.finalScores.E3 : req.body.scoreE3,
        scoreE4: req.body.finalScores ? req.body.finalScores.E4 : req.body.scoreE4,
        // Sigla calculada no questionário ou digitada no modal.
        perfil: req.body.perfil
    }

    // Envia o objeto normalizado para uma única função de cadastro.
    perfisModel.cadastrar(dados).then((resultado) => {
        // Confirma a criação e devolve o insertId.
        res.status(201).json(resultado);
    }).catch((erro) => {
        // Trata erros de gênero ou empresa inexistente.
        res.status(500).json({ mensagem: erro.sqlMessage || erro.message })
    })
}

function atualizarPerfilCad(req, res) {
    // Obtém o ID da empresa pela URL.
    let id = req.params.id

    // Após o questionário, devolve o último ID criado para salvar no sessionStorage.
    perfisModel.atualizarPerfilCad(id).then((resul) => {
        // A resposta continua como lista porque vem de um SELECT.
        res.status(200).json(resul)
    })
}

function listar(req, res) {
    // Lista somente os perfis pertencentes à empresa logada.
    perfisModel.listar(req.params.idEmpresa).then((resultado) => {
        // Entrega os perfis e seus gêneros para o modal.
        res.status(200).json(resultado)
    }).catch((erro) => {
        // Devolve falha da consulta.
        res.status(500).json({ mensagem: erro.sqlMessage || erro.message })
    })
}

function deletar(req, res) {
    // O model protege o perfil Principal e só permite excluir os adicionais.
    perfisModel.deletar(req.params.idPerfil, req.params.idEmpresa).then((resultado) => {
        // Zero linhas pode significar perfil inexistente ou Principal protegido.
        if (!resultado.affectedRows) return res.status(404).json({ mensagem: "Perfil não encontrado" })
        // Confirma a exclusão.
        res.status(200).json(resultado)
    }).catch((erro) => {
        // Trata falhas do DELETE.
        res.status(500).json({ mensagem: erro.sqlMessage || erro.message })
    })
}

module.exports = {
    cadastrar,
    atualizarPerfilCad,
    listar,
    deletar
}
