var express = require("express");
var router = express.Router();

var empresaController = require("../controllers/empresaController");

// Mantém separadas as etapas de cadastro de endereço e empresa usadas pela tela original.
// Cadastra a empresa depois que o endereço já foi obtido.
router.post("/cadastrar", function (req, res) {
  empresaController.cadastrar(req, res);
})

// Cadastra o endereço que será referenciado pela empresa.
router.post("/cadastrarEndereco", function (req, res) {
  empresaController.cadastrarEndereco(req, res);
})

// Verifica se já existe empresa com o CNPJ informado.
router.get("/buscar/:cnpj", function (req, res) {
  empresaController.buscarPorCnpj(req, res);
});

// Procura endereço igual antes de criar outro registro.
router.post("/buscarEndereco", function (req, res) {
  empresaController.buscarEndereco(req, res);
});

// Lista empresas com endereço e contagens.
router.get("/listar", function (req, res) {
  empresaController.listar(req, res);
});

// Rotas acrescentadas para preencher Meu estabelecimento e o modal de edição.
// Retorna o resumo exibido em Meu estabelecimento.
router.get("/estabelecimento/:id", empresaController.buscarEstabelecimento);
// Retorna empresa e endereço pelo ID.
router.get("/:id", empresaController.buscarPorId);
// Atualiza os campos da tabela empresa.
router.put("/:id", empresaController.editar);
// Atualiza os campos da tabela endereco.
router.put("/enderecos/:id", empresaController.editarEndereco);

// Exclui o registro da empresa.
router.delete("/deletarEmpresa/:id", function
  (req, res) {
    empresaController.deletarEmpresa(req, res);
});

// Exclui o endereço depois que ele deixa de ser usado.
router.delete("/deletarEndereco/:id", function
  (req, res) {
    empresaController.deletarEndereco(req, res);
});

module.exports = router;
