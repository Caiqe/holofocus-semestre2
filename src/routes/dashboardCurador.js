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

module.exports = router;