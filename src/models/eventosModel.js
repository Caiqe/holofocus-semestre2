const { listar } = require('../controllers/eventosController');
var database = require('../database/config');

function criarEvento(nomeEvento, data, artista, genero,investimento,lucro,lotacaoCasa,lotacaoEvento) {
    const instrucao = `
        INSERT INTO evento 
        (nome_evento, data_evento, investimento_evento, retorno_evento, total_pessoas, fk_empresa, fk_artista, fk_genero)
        VALUES 
        ('${nomeEvento}',${data},${investimento}, ${lucro} ,
         ${lotacaoEvento},${artista},${genero});
    `;
    return database.executar(instrucao);
}

function listarEvento() {

    const instrucao = `
        SELECT
            id_evento,
            nome_evento,
            data_evento,
            investimento_evento,
            retorno_evento,
            total_pessoas
        FROM evento;
    `;

    return database.executar(instrucao);

}

function editarEvento(nomeEvento, data, artista, genero,investimento,lucro,lotacaoCasa,lotacaoEvento) {
    const instrucao = `
        UPDATE evento SET
            nome_evento = '${nomeEvento}',
            data_evento = '${data}',
            investimento_evento = ${investimento},
            retorno_evento = ${lucro},
            total_pessoas = ${lotacaoEvento},
            fk_artista = ${artista},
            fk_genero = ${genero}
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
    listarEvento,
    editarEvento,
    excluirEvento
};