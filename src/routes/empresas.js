var express = require("express");
var router = express.Router();

var empresaController = require("../controllers/empresaController");

router.post("/cadastrar", function (req, res) {
  empresaController.cadastrar(req, res);
})

router.post("/cadastrarEndereco", function (req, res) {
  empresaController.cadastrarEndereco(req, res);
})

router.get("/buscar/:cnpj", function (req, res) {
  empresaController.buscarPorCnpj(req, res);
});

router.post("/buscarEndereco", function (req, res) {
  empresaController.buscarEndereco(req, res);
});

router.get("/listar", function (req, res) {
  empresaController.listar(req, res);
});

router.delete("/deletarEmpresa/:id", function
  (req, res) {
    empresaController.deletarEmpresa(req, res);
});

router.delete("/deletarEndereco/:id", function
  (req, res) {
    empresaController.deletarEndereco(req, res);
});

module.exports = router;