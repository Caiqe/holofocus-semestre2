var express = require("express");
var router = express.Router();

var dashboardController = require('../controllers/dashboard-marketingController.js')

router.get('/kpis', function (req, res) {
    dashboardController.carregarKpis(req, res)
})

router.get('/grafico-barras', function (req, res) {
    dashboardController.carregarGraficoBarras(req, res)
})

router.get('/grafico-linhas/:id_empresa', function (req, res) {
    dashboardController.carregarGraficoLinhas(req, res)
})

router.get('/oportunidades', function (req, res) {
    dashboardController.carregarOportunidades(req, res)
})

router.get('/tabela/:id_genero', function (req, res) {
    dashboardController.carregarTabela(req, res)
})

router.get('/generos', function (req, res) {
    dashboardController.carregarGenerosSelect(req, res);
});

router.get('/ultima-atualizacao', function (req, res) {
    dashboardController.carregarUltimaAtualizacao(req, res);
});



module.exports = router;