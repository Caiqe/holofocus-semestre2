var eventosModel = require('../models/eventosModel');

function criar(req, res) {
    const evento = req.body;

    if (!evento.nome || !evento.data) {
        return res.status(400).send("Dados incompletos");
    }

    eventosModel.criarEvento(evento)
        .then(resultado => res.status(201).json(resultado))
        .catch(erro => {
            console.log(erro);
            res.status(500).json(erro);
        });
}

function editar(req, res) {
    const id = req.params.id;
    const evento = req.body;

    eventosModel.editarEvento(id, evento)
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
    editar,
    excluir
};