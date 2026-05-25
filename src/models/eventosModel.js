var database = require('../database/config');

function criarEvento(nomeEvento, data, artista, genero,investimento,lucroEsperado,lucro,lotacaoCasa,lotacaoEvento) {
    const instrucao = `
        INSERT INTO evento 
        (nome_evento, data_evento, investimento_evento, retorno_evento, total_pessoas, fk_empresa, fk_artista, fk_genero)
        VALUES 
        ('${nomeEvento}',${data},${investimento}, ${lucro}, ${lucroEsperado} ,
         ${lotacaoEvento},${artista},${genero});
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