const { listar } = require('../controllers/eventosController');
var database = require('../database/config');

function criarEvento(nomeEvento, data, artista, genero) {
    const instrucao = `
        INSERT INTO evento 
        (nome_evento, data_evento, fk_empresa, fk_artista, fk_genero)
        VALUES 
        ('${nomeEvento}','${data}', 1,'${artista}','${genero}');
    `;
    return database.executar(instrucao);
}

function listarEvento() {

    const instrucao = `
        SELECT
            id_evento,
            nome_evento as nomeEvento,
            titulo_genero as genero,
            data_evento as data
        FROM evento join genero on id_genero = fk_genero;
    `;

    return database.executar(instrucao);

}

function editarEvento(id,nomeEvento, data, artista, genero) {
    const instrucao = `
        UPDATE evento SET
            nome_evento = '${nomeEvento}' as nome,
            data_evento = '${data}' as data,
            fk_artista = ${artista} artista,
            fk_genero = ${genero} as genero
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