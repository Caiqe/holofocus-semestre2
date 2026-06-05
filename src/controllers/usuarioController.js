var usuarioModel = require("../models/usuarioModel");

function autenticar(req, res) {
    var email = req.body.emailServer;
    var senha = req.body.senhaServer;

    usuarioModel.autenticar(email, senha)
        .then(
            function (resultadoAutenticar) {
                if (resultadoAutenticar.length == 1) {
                    console.log(resultadoAutenticar);
                    res.json({
                        id: resultadoAutenticar[0].id_usuario,
                        nome: resultadoAutenticar[0].nome,
                        email: resultadoAutenticar[0].email,
                        empresaId: resultadoAutenticar[0].empresaId,
                        nivelAcesso: resultadoAutenticar[0].nivelAcesso,
                        contratoAtivo: resultadoAutenticar[0].contratoAtivo,
                        perfilId: resultadoAutenticar[0].perfilId
                    })
                } else if (resultadoAutenticar.length == 0) {
                    res.status(403).send("Email e/ou senha inválido(s)");
                } else {
                    res.status(403).send("Mais de um usuário com o mesmo login e senha!");
                }
            }
        ).catch(
            function (erro) {
                console.log(erro);
                console.log("\nHouve um erro ao realizar o login! Erro: ", erro.sqlMessage);
                res.status(500).json(erro.sqlMessage);
            }
        );
}

function cadastrar(req, res) {
    var nome = req.body.nomeServer;
    var telefone = req.body.telefoneServer;
    var email = req.body.emailServer;
    var senha = req.body.senhaServer;
    var fkEmpresa = req.body.idEmpresaServer;

    if (nome == undefined) {
        res.status(400).send("Seu nome está undefined!");
    } else if (email == undefined) {
        res.status(400).send("Seu nome está undefined!");
    } else if (telefone == undefined) {
        res.status(400).send("Seu telefone está undefined!");
    } else if (senha == undefined) {
        res.status(400).send("Sua senha está undefined!");
    } else if (fkEmpresa == undefined) {
        res.status(400).send("Sua empresa a vincular está undefined!");
    } else {
        usuarioModel.cadastrar(nome, telefone, email, senha, fkEmpresa)
            .then(
                function (resultado) {
                    res.json(resultado);
                }
            ).catch(
                function (erro) {
                    console.log(erro);
                    console.log(
                        "\nHouve um erro ao realizar o cadastro! Erro: ",
                        erro.sqlMessage
                    );
                    res.status(500).json(erro.sqlMessage);
                }
            );
    }
}
function buscarPerfil(req, res) {

    var idUsuario = req.body.idUsuario;

    usuarioModel.buscarPerfil(idUsuario)
        .then(function(resultado){

            if(resultado.length > 0){
                res.json(resultado[0]);
            } else {
                res.status(404).send("Usuário não encontrado");
            }

        })
        .catch(function(erro){
            console.log(erro);
            res.status(500).json(erro);
        });
}
function editar(req, res) {

    var idUsuario = req.body.idUsuario;
    var nome = req.body.nome;
    var email = req.body.email;
    var telefone = req.body.telefone;
    var senha = req.body.senha;
    var fkNivelAcesso = req.body.fkNivelAcesso;

    usuarioModel.editar(
        idUsuario,
        nome,
        email,
        telefone,
        senha,
        fkNivelAcesso
    )
    .then(function(resultado){
        res.status(200).json(resultado);
    })
    .catch(function(erro){
        console.log(erro);
        res.status(500).json(erro);
    });
}

module.exports = {
    cadastrar,
    autenticar,
    editar,
    buscarPerfil
};