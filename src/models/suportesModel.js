var database = require('../database/config')

function contatar(nome, email, telefone, assunto, mensagem) {
    var instrucaoSql = `INSERT INTO Lead (nome, email, telefone, assunto, mensagem) values ('${nome}', '${email}', '${telefone}', '${assunto}', '${mensagem}');`

    return database.executar(instrucaoSql);
}

module.exports = {contatar}