var express = require("express");
var router = express.Router();
var controller = require("../controllers/usuarioController");

// Autenticação, cadastro e CRUD usado pelas telas de usuários e perfil pessoal.
// Cria um usuário vinculado a uma empresa e a um nível.
router.post("/cadastrar", controller.cadastrar);
// Confere e-mail e senha.
router.post("/autenticar", controller.autenticar);
// Lista usuários da empresa indicada.
router.get("/listar/:idEmpresa", controller.listar);
// Entrega os três níveis usados nos selects.
router.get("/niveis", controller.listarNiveis);
// Busca os dados de um usuário específico.
router.get("/:idUsuario", controller.buscar);
// Atualiza os dados do usuário específico.
router.put("/:idUsuario", controller.editar);
// Exclui o usuário específico.
router.delete("/:idUsuario", controller.deletar);

module.exports = router;
