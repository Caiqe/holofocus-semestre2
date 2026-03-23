var express = require("express");
var router = express.Router();

var suportesController = require('../controllers/suportesController.js')

router.post('/suportes', function (req, res) {
    suportesController.contatar(req, res)
})

module.exports = router;