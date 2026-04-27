
var database = require("../database/config");


function buscar() {
    console.log("ACESSEI O USUARIO MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function buscar(): ")
    var instrucaoSql = `
        SELECT titulo_genero FROM genero;
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}
function editar( genero, taxa_min, taxa_max, aspecto1, aspecto2, aspecto3, aspecto4, perfil, idPerfil, fkEmpresa) {
    console.log("ACESSEI O USUARIO MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function buscar(): ",genero, taxa_min, taxa_max, aspecto1, aspecto2, aspecto3, aspecto4, perfil, idPerfil, fkEmpresa)
    var instrucaoSql = `
        UPDATE perfil SET fk_genero = ${genero},
         taxa_minima = ${taxa_min},
         taxa_maxima = ${taxa_max},
          scoreE1 = '${aspecto1}', 
          scoreE2 = '${aspecto2}',
           scoreE3 = '${aspecto3}',
            scoreE4 = '${aspecto4}',
            perfil = '${perfil}'  WHERE id_perfil = ${idPerfil} AND fk_empresa = ${fkEmpresa};
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}





module.exports = {
   buscar, editar
};