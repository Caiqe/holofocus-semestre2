var dashboardModel = require('../models/dashboardCuradorModel');

function buscarArtistas(req, res) {
    let filtros = {
        genero: req.query.genero || "",
        pais: req.query.pais || "",
        popularidade: req.query.popularidade || ""
    };
    dashboardModel.buscarArtistas(filtros)
        .then(resultado => {
            res.json(resultado);
        })
        .catch(erro => {
            console.log(erro);
            res.status(500).json(erro.sqlMessage);
        });
}

function buscarTopMusicasArtistas(req, res) {
    let idsArtistas = req.query.ids;
    dashboardModel.buscarTopMusicasArtistas(idsArtistas)
        .then(resultado => {
            res.json(resultado);
        })
        .catch(erro => {
            console.log(erro);
            res.status(500).json(erro.sqlMessage);
        });
}

function buscarDistribuicao(req, res) {
    let idArtista = req.params.idArtista;
    dashboardModel.buscarDistribuicao(idArtista)
        .then(resultado => {
            res.json(resultado);
        })
        .catch(erro => {
            console.log(erro);
            res.status(500).json(erro.sqlMessage);
        });
}

module.exports = {
    buscarArtistas,
    buscarTopMusicasArtistas,
    buscarDistribuicao
};