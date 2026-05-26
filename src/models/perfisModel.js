var database = require("../database/config");

function cadastrar(id, scoreE1, scoreE2, scoreE3, scoreE4, perfil) {
    var instrucaoSql = `INSERT INTO perfil (nome, fk_empresa, scoreE1, scoreE2, scoreE3, scoreE4, perfil) VALUES 
    ('Principal', ${id}, ${scoreE1}, ${scoreE2}, ${scoreE3}, ${scoreE4}, '${perfil}')`;

    return database.executar(instrucaoSql);
}

function atualizarPerfilCad(id) {
    var instrucaoSql = `SELECT id_perfil FROM perfil WHERE fk_empresa = ${id} ORDER BY id_perfil DESC LIMIT 1`;
    
    return database.executar(instrucaoSql);
}

function editarPerfil(usuario, nome, email, celular, senha, permissao) {
    var instrucaoSql = `UPDATE usuario SET nome = '${nome}', celular = '${celular}', senha = '${senha}', fk_nivel_acesso = '${permissao}' WHERE id_usuario = '${usuario}'`;

    return database.executar(instrucaoSql);
}

function buscarPerfilAtual(usuario) {
    var instrucaoSql = `SELECT nome, email, celular, senha, permissao FROM usuario WHERE id_usuario = '${usuario}'`;

    return database.executar(instrucaoSql);
}

module.exports = { cadastrar, atualizarPerfilCad, editarPerfil, buscarPerfilAtual };