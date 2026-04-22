var perfisModel = require("../models/perfisModel");

function cadastrar(req, res) {
    let id = req.body.id
    let scoreE1 = req.body.finalScores.E1
    let scoreE2 = req.body.finalScores.E2
    let scoreE3 = req.body.finalScores.E3
    let scoreE4 = req.body.finalScores.E4
    let perfil = req.body.perfil

    perfisModel.cadastrar(id,scoreE1,scoreE2,scoreE3,scoreE4,perfil).then((resultado) => {
        res.status(201).json(resultado);
    })
}

module.exports = {cadastrar}