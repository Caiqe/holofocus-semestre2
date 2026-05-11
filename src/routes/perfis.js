var express = require("express");
var router = express.Router();

var perfisController = require("../controllers/perfisController");

router.post('/cadastrar', function (req, res) {
    perfisController.cadastrar(req, res)
})

router.get('/atualizarPerfilCad/:id', function (req, res) {
    perfisController.atualizarPerfilCad(req, res)
})

module.exports = router;