var express = require("express");
var router = express.Router();
var controller = require("../controllers/chamadoController");

// CRUD de chamados; a edição permitida é a mudança de status.
// Lista os chamados conforme empresa, usuário e nível enviados na query string.
router.get("/", controller.listar);
// Cadastra um novo chamado.
router.post("/", controller.cadastrar);
// Altera somente o status e o responsável pelo chamado.
router.patch("/:idChamado/status", controller.editarStatus);
// Exclui um chamado conforme as permissões aplicadas no model.
router.delete("/:idChamado", controller.deletar);

module.exports = router;
