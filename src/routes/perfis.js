var express = require("express");
var router = express.Router();

var perfisController = require("../controllers/perfisController");

router.post('/cadastrar', function (req, res) {
    perfisController.cadastrar(req, res)
})

module.exports = router;