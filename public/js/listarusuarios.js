var express = require("express");
var router = express.Router();

var usuarioController = require("../../src/controllers/usuarioController");

router.post("/listar", function (req, res) {
    usuarioController.listar(req, res);
})



if (email.trim() != "" && email != null && senha.trim() != "" && senha != null) {
        const resposta = await fetch('/usuarios/autenticar', {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                emailServer: email,
                senhaServer: senha
            })
        })

        if (resposta.ok) {
            let resp = resposta.json()
            sessionStorage.EMAIL_USUARIO = resp.email;
            sessionStorage.NOME_USUARIO = resp.nome;
            sessionStorage.ID_USUARIO = resp.id;

            setTimeout(() => {
                window.location = "./dashboard/dashboard.html";
            }, "2000");
            return
        }
    }

module.exports = router;