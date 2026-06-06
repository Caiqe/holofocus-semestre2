var express = require("express");
var router = express.Router();

var perfisController = require("../controllers/perfisController");

// O mesmo cadastro atende o questionário inicial e o modal de perfil sonoro.
// Recebe os dados e cria um registro na tabela perfil.
router.post('/cadastrar', function (req, res) {
    perfisController.cadastrar(req, res)
})

// Busca o ID do perfil criado mais recentemente para a empresa.
router.get('/atualizarPerfilCad/:id', function (req, res) {
    perfisController.atualizarPerfilCad(req, res)
})

// Lista todos os perfis sonoros da empresa.
router.get('/listar/:idEmpresa', function (req, res) {
    perfisController.listar(req, res)
})

// Exclui um perfil adicional, mas preserva o Principal.
router.delete('/:idPerfil/:idEmpresa', function (req, res) {
    perfisController.deletar(req, res)
})

module.exports = router;
