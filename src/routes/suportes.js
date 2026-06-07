var express = require("express");
var router = express.Router();

var suportesController = require('../controllers/suportesController.js')

// Recebe o formulário público de contato.
// Encaminha os dados para o controller de suporte.
router.post('/contatar', function (req, res) {
    suportesController.contatar(req, res)
})

module.exports = router;
