var express = require("express");
var router = express.Router();

var perfilController = require("../controllers/perfilController");

router.post('/cadastrar', function (req, res) {
    perfilController.cadastrar(req, res)
})

module.exports = router;