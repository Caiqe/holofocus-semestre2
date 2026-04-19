
var database = require("../database/config");


function buscar(email) {
    console.log("ACESSEI O USUARIO MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function buscar(): ", email)
    var instrucaoSql = `
        SELECT * FROM usuario WHERE email = '${email}';
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}
function editar(id, genero, taxa, aspecto1, aspecto2, aspecto3, aspecto4) {
    console.log("ACESSEI O USUARIO MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function buscar(): ", id, genero, taxa, aspecto1, aspecto2, aspecto3, aspecto4)
    var instrucaoSql = `
        UPDATE perfil SET genero = '${genero}',
         taxa = ${taxa},
          aspectoUm = '${aspecto1}', 
          aspectoDois = '${aspecto2}',
           aspectoTres = '${aspecto3}',
            aspectoQuatro = '${aspecto4}'  WHERE fkUsuario = ${id};
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}





module.exports = {
   buscar, editar
};