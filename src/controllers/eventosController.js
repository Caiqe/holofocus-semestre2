var eventosModel = require('../models/eventosModel');

function criar(req, res) {
    const evento = req.body;

    if (!evento.nomeEvento || !evento.data) {
        return res.status(400).send("Dados incompletos");
    }

    eventosModel.criarEvento(evento.nomeEvento,
    evento.data,
    evento.artista,
    evento.genero)
        .then(resultado => res.status(201).json(resultado))
        .catch(erro => {
            console.log(erro);
            res.status(500).json(erro);
        });
    }
function listar(req, res) {

    eventosModel.listarEvento()
        .then(function(resultado) {
            res.status(200).json(resultado);
        })
        .catch(function(erro) {
            console.log(erro);
            res.status(500).json(erro.sqlMessage);
        });

    }

function editar(req, res) {
    const id = req.params.id;
    const evento = req.body;

    eventosModel.editarEvento( id,
    evento.nomeEvento,
    evento.data,
    evento.artista,
    evento.genero)
        .then(resultado => res.json(resultado))
        .catch(erro => {
            console.log(erro);
            res.status(500).json(erro);
        });
}

function excluir(req, res) {
    const id = req.params.id;

    eventosModel.excluirEvento(id)
        .then(resultado => res.json(resultado))
        .catch(erro => {
            console.log(erro);
            res.status(500).json(erro);
        });
}


module.exports = {
    criar,
    listar,
    editar,
    excluir
};