var suportesModel = require('../models/suportesModel')

function contatar(req, res) {
    // Lê os campos enviados pelo formulário público.
    let nome = req.body.nomeServer
    let email = req.body.emailServer
    let telefone = req.body.telefoneServer
    let assunto = req.body.assuntoServer
    let mensagem = req.body.mensagemServer

    // Telefone é opcional, mas os demais campos são necessários para registrar o lead.
    if (!nome || !email || !assunto || !mensagem) {
        return res.status(400).json({ mensagem: "Preencha os campos obrigatórios" });
    }

    suportesModel.contatar(nome, email, telefone, assunto, mensagem)
        .then(
            function (resp) {
                // Confirma que um novo lead foi criado.
                res.status(201).json(resp)
            }
        ).catch(
            function (erro) {
                // Registra o erro no terminal do servidor.
                console.log(erro);
                console.log(
                    "\nHouve um erro ao registrar a mensagem! Erro: ",
                    erro.sqlMessage
                );
                // Retorna erro interno para o formulário.
                res.status(500).json(erro.sqlMessage);
            }
        )
}

module.exports = {
    contatar
}
