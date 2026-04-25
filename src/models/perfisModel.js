var database = require("../database/config");

function cadastrar(id, scoreE1, scoreE2, scoreE3, scoreE4, perfil) {
    var instrucaoSql = `INSERT INTO perfil (fk_empresa, scoreE1, scoreE2, scoreE3, scoreE4, perfil) VALUES 
    (${id}, ${scoreE1}, ${scoreE2}, ${scoreE3}, ${scoreE4}, '${perfil}')`;

    return database.executar(instrucaoSql);
}

module.exports = { cadastrar };