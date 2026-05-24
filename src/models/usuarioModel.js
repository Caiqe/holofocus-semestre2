var database = require("../database/config")

    function autenticar(email, senha) {
        console.log("ACESSEI O USUARIO MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function entrar(): ", email, senha)
        var instrucaoSql = `
    SELECT 
        u.id_usuario,
        u.nome,
        u.email,
        u.fk_empresa AS empresaId,
        u.fk_nivel_acesso AS nivelAcesso,
        e.contrato_ativo AS contratoAtivo,
        p.id_perfil AS perfilId
    FROM usuario u
    JOIN empresa e 
        ON u.fk_empresa = e.id_empresa
    LEFT JOIN perfil p 
        ON p.id_perfil = (
            SELECT p2.id_perfil
            FROM perfil p2
            WHERE p2.fk_empresa = u.fk_empresa
            ORDER BY p2.id_perfil ASC
            LIMIT 1
        )
    WHERE u.email = '${email}' 
    AND u.senha = '${senha}';`;
        console.log("Executando a instrução SQL: \n" + instrucaoSql);
        return database.executar(instrucaoSql);
    }

function cadastrar(nome, telefone, email, senha, fkEmpresa) {
    console.log("ACESSEI O USUARIO MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function cadastrar():", nome, telefone, email, senha, fkEmpresa);
    var instrucaoSql = `
        INSERT INTO usuario (nome, telefone, email, senha, fk_empresa, fk_nivel_acesso) VALUES ('${nome}', '${telefone}', '${email}', '${senha}', '${fkEmpresa}', 1);
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

module.exports = {
    autenticar,
    cadastrar
};