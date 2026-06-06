var mysql = require("mysql2");

// CONEXÃO DO BANCO MYSQL SERVER
var mySqlConfig = {
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT
};

// Recebe o SQL e, opcionalmente, os valores que substituem cada "?" da consulta.
function executar(instrucao, parametros = []) {

    // Aceita somente os dois ambientes previstos pela estrutura original.
    if (process.env.AMBIENTE_PROCESSO !== "producao" && process.env.AMBIENTE_PROCESSO !== "desenvolvimento") {
        // Exibe no terminal qual configuração está faltando.
        console.log("\nO AMBIENTE (produção OU desenvolvimento) NÃO FOI DEFINIDO EM .env OU dev.env OU app.js\n");
        // Interrompe a função devolvendo uma Promise rejeitada.
        return Promise.reject("AMBIENTE NÃO CONFIGURADO EM .env");
    }

    // Mantém o padrão assíncrono esperado pelos controllers e models.
    return new Promise(function (resolve, reject) {
        // Abre uma conexão individual para esta consulta, sem utilizar pool.
        var conexao = mysql.createConnection(mySqlConfig);
        // Testa a conexão antes de executar a instrução.
        conexao.connect(function (erro) {
            // Trata falhas de credencial, rede ou indisponibilidade do MySQL.
            if (erro) {
                // Destrói a conexão que não conseguiu ser estabelecida.
                conexao.destroy();
                // Entrega o erro para o catch do controller.
                reject(erro);
                return;
            }
        });
        // execute separa os valores do texto SQL e evita concatenar dados do usuário.
        conexao.execute(instrucao, parametros, function (erro, resultados) {
            // Encerra a conexão depois que a consulta responde.
            conexao.end();
            // Verifica se o MySQL recusou ou não conseguiu executar a instrução.
            if (erro) {
                // Entrega a falha para quem chamou database.executar.
                reject(erro);
                return;
            }
            // Resolve a Promise com as linhas ou informações da operação.
            resolve(resultados);
        });
        // Também captura erros emitidos pela conexão fora do callback principal.
        conexao.on('error', function (erro) {
            reject(erro);
        });
    });
}

module.exports = {
    executar
};
