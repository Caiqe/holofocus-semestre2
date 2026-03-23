var suportesModel = require('../models/suportesModel')

function contatar(req, res) {
    let nome = req.body.nomeServer
    let email = req.body.emailServer
    let telefone = req.body.telefoneServer
    let assunto = req.body.assuntoServer
    let mensagem = req.body.mensagemServer

    suportesModel.contatar(nome, email, telefone, assunto, mensagem)
        .then(
            function (resp) {
                res.json(resp)
            }
        ).catch(
            function (erro) {
                console.log(erro);
                console.log(
                    "\nHouve um erro ao registrar a mensagem! Erro: ",
                    erro.sqlMessage
                );
                res.status(500).json(erro.sqlMessage);
            }
        )
}

module.exports = {
    contatar
}