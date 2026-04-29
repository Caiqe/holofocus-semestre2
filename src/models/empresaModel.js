var database = require("../database/config");


function listar() {
  var instrucaoSql = `SELECT cnpj FROM empresa;`;

  return database.executar(instrucaoSql);
}

function buscarPorCnpj(cnpj) {
  var instrucaoSql = `SELECT * FROM empresa WHERE cnpj = '${cnpj}'`;

  return database.executar(instrucaoSql);
}

function buscarEndereco(cep, numero, complemento) {
  var instrucaoSql = `SELECT * FROM endereco WHERE cep = '${cep}' AND numero = '${numero}' AND complemento = '${complemento}'`;

  return database.executar(instrucaoSql);
}

function cadastrar(razaoSocial, cnpj, idEndereco) {
  var instrucaoSql = `INSERT INTO empresa (razao_social, cnpj, fk_endereco, contrato_ativo) VALUES ('${razaoSocial}', '${cnpj}', '${idEndereco}', 0)`;

  return database.executar(instrucaoSql);
}

function cadastrarEndereco(cep, logradouro, numero, complemento) {
  var instrucaoSql = `INSERT INTO endereco (cep, logradouro, numero, complemento) VALUES ('${cep}', '${logradouro}', '${numero}', '${complemento}')`;

  return database.executar(instrucaoSql);
}

function deletarEmpresa(id) {
  let instrucaoSql = `DELETE FROM empresa WHERE id_empresa = ${id};`

  return database.executar(instrucaoSql);
}

function deletarEndereco(id) {
  let instrucaoSql = `DELETE FROM endereco WHERE id_endereco = ${id};`

  return database.executar(instrucaoSql);
}

module.exports = { buscarPorCnpj, buscarEndereco, cadastrar, cadastrarEndereco, listar, deletarEmpresa, deletarEndereco };
