var express = require('express');
var router = express.Router();

var dashboardController = require('../controllers/dashboardCuradorController');

router.get('/artistas', function(req, res) {
    dashboardController.buscarArtistas(req, res);
});

router.get('/top-musicas-artistas', function(req, res) {
    dashboardController.buscarTopMusicasArtistas(req, res);
    }
);

router.get('/distribuicao/:idArtista', function(req, res) {
    dashboardController.buscarDistribuicao(req, res);
});

router.get('/filtros', function(req, res) {
    dashboardController.buscarFiltros(req, res);
});

router.get('/crescimento/:idArtista', function(req, res) {
    dashboardController.buscarCrescimentoArtista(req, res);
});

module.exports = router;