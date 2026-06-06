var database = require("../database/config");

function contatar(nome, email, telefone, assunto, mensagem) {
    // O formulário público é salvo na tabela lead_contato.
    return database.executar(`
        -- Define as colunas preenchidas pelo formulário.
        INSERT INTO lead_contato (nome, email, telefone, assunto, mensagem)
        -- Recebe os cinco valores separados do SQL.
        VALUES (?, ?, ?, ?, ?)
    `, [nome, email, telefone, assunto, mensagem]);
}

module.exports = { contatar };
