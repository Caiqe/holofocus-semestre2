var dashboardModel = require('../models/dashboardCuradorModel');

function buscarArtistas(req, res) {
    let filtros = {
        genero: req.query.genero || "",
        pais: req.query.pais || "",
        popularidade: req.query.popularidade || "",
        perfil: req.query.perfil || "",
        empresa: req.query.empresa || ""
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

function buscarFiltros(req, res) {
    let filtros = {
        empresa: req.query.empresa || ""
    };

    dashboardModel.buscarFiltros(filtros)
        .then(resultado => {
            res.json({
                generos: resultado[0],
                paises: resultado[1],
                perfis: resultado[2]
            });
        }).catch(erro => {
            console.log(erro);
            res.status(500).json(
                erro.sqlMessage
            );
        });
}

function buscarCrescimentoArtista(req, res) {
    let idArtista = req.params.idArtista;

    dashboardModel.buscarCrescimentoArtista(idArtista)
        .then(resultado => {
            res.json(resultado[0]);
        })
        .catch(erro => {
            console.log(erro);
            res.status(500).json(erro.sqlMessage);
        });
}

module.exports = {
    buscarArtistas,
    buscarTopMusicasArtistas,
    buscarDistribuicao,
    buscarFiltros,
    buscarCrescimentoArtista
};
