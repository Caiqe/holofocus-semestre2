var express = require("express");
var router = express.Router();
var controller = require("../controllers/eventoController");

// Lista os eventos pertencentes à empresa informada na URL.
router.get("/listar/:idEmpresa", controller.listar);
// Lista os artistas cadastrados para preencher o campo de seleção.
router.get("/artistas", controller.listarArtistas);
// Busca um evento específico para preencher o formulário de edição.
router.get("/:idEvento", controller.buscar);
// Recebe os dados do formulário e cadastra um evento.
router.post("/", controller.cadastrar);
// Atualiza o evento identificado pelo parâmetro idEvento.
router.put("/:idEvento", controller.editar);
// Exclui o evento identificado pelo parâmetro idEvento.
router.delete("/:idEvento", controller.deletar);

module.exports = router;
