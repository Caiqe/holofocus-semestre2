var database = require('../database/config');

function criarEvento(evento) {
    const instrucao = `
        INSERT INTO evento 
        (nome_evento, data_evento, investimento_evento, retorno_evento, total_pessoas, fk_empresa, fk_artista, fk_genero)
        VALUES 
        ('${evento.nome}', '${evento.data}', ${evento.investimento}, ${evento.retorno}, ${evento.pessoas},
         ${evento.empresa}, ${evento.artista}, ${evento.genero});
    `;
    return database.executar(instrucao);
}

function editarEvento(id, evento) {
    const instrucao = `
        UPDATE evento SET
            nome_evento = '${evento.nome}',
            data_evento = '${evento.data}',
            investimento_evento = ${evento.investimento},
            retorno_evento = ${evento.retorno},
            total_pessoas = ${evento.pessoas},
            fk_artista = ${evento.artista},
            fk_genero = ${evento.genero}
        WHERE id_evento = ${id};
    `;
    return database.executar(instrucao);
}

function excluirEvento(id) {
    const instrucao = `DELETE FROM evento WHERE id_evento = ${id}`;
    return database.executar(instrucao);
}


module.exports = {
    criarEvento,
    editarEvento,
    excluirEvento
};