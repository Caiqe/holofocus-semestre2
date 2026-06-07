
var database = require("../database/config");

function listar() {
    // JOIN traz o endereço; LEFT JOIN permite contar usuários e eventos mesmo quando o total é zero.
    return database.executar(`
        -- Seleciona dados da empresa e do endereço.
        SELECT e.id_empresa, e.razao_social, e.lotacao, e.cnpj,
               e.perfil_artistas, e.fk_endereco, e.contrato_ativo,
               en.cep, en.logradouro, en.numero, en.complemento,
               COUNT(DISTINCT u.id_usuario) AS total_usuarios,
               COUNT(DISTINCT ev.id_evento) AS total_eventos
        -- Usa empresa como tabela principal.
        FROM empresa e
        -- Toda empresa deve possuir um endereço.
        INNER JOIN endereco en ON en.id_endereco = e.fk_endereco
        -- LEFT JOIN mantém empresas que ainda não possuem usuários.
        LEFT JOIN usuario u ON u.fk_empresa = e.id_empresa
        -- LEFT JOIN mantém empresas que ainda não possuem eventos.
        LEFT JOIN evento ev ON ev.fk_empresa = e.id_empresa
        -- Agrupa para que os COUNT retornem um total por empresa.
        GROUP BY e.id_empresa, en.id_endereco
        -- Exibe as empresas em ordem alfabética.
        ORDER BY e.razao_social
    `);
}

function buscarPorCnpj(cnpj) {
    // Usado na validação do cadastro para impedir CNPJ duplicado.
    return database.executar(
        // Procura correspondência exata de CNPJ.
        "SELECT * FROM empresa WHERE cnpj = ?",
        // Substitui o parâmetro do SELECT.
        [cnpj]
    );
}

function buscarPorId(idEmpresa) {
    // Reúne empresa e endereço em um único objeto para preencher o formulário.
    return database.executar(`
        -- Seleciona todas as colunas da empresa e os campos do endereço.
        SELECT e.*, en.cep, en.logradouro, en.numero, en.complemento
        FROM empresa e
        -- Relaciona a empresa ao endereço cadastrado.
        INNER JOIN endereco en ON en.id_endereco = e.fk_endereco
        -- Limita ao ID escolhido.
        WHERE e.id_empresa = ?
    `, [idEmpresa]);
}

function buscarEstabelecimento(idEmpresa) {
    // Resume a empresa, conta eventos e localiza primeiro o perfil chamado Principal.
    return database.executar(`
        -- Seleciona os dados usados nos cartões da página.
        SELECT e.id_empresa, e.razao_social, e.lotacao, e.perfil_artistas,
               COUNT(DISTINCT ev.id_evento) AS total_eventos,
               p.id_perfil AS id_perfil_principal,
               p.nome AS nome_perfil_principal,
               p.perfil AS sigla_perfil_principal
        FROM empresa e
        -- Permite contar zero eventos.
        LEFT JOIN evento ev ON ev.fk_empresa = e.id_empresa
        -- Perfil pode ainda não existir antes do questionário.
        LEFT JOIN perfil p ON p.id_perfil = (
            -- Escolhe o perfil Principal; se não houver, escolhe o primeiro.
            SELECT p2.id_perfil
            FROM perfil p2
            WHERE p2.fk_empresa = e.id_empresa
            ORDER BY (p2.nome = 'Principal') DESC, p2.id_perfil
            LIMIT 1
        )
        -- Busca a empresa informada.
        WHERE e.id_empresa = ?
        -- Agrupa campos não agregados para funcionar com ONLY_FULL_GROUP_BY.
        GROUP BY e.id_empresa, e.razao_social, e.lotacao, e.perfil_artistas,
                 p.id_perfil, p.nome, p.perfil
    `, [idEmpresa]);
}

function buscarEndereco(cep, numero, complemento) {
    // Trata complemento vazio como NULL para a comparação funcionar no MySQL.
    return database.executar(`
        -- Compara CEP e número de forma exata.
        SELECT * FROM endereco
        WHERE cep = ? AND numero = ?
          -- Considera iguais dois complementos nulos.
          AND (complemento = ? OR (complemento IS NULL AND ? IS NULL))
    `, [cep, numero, complemento || null, complemento || null]);
}

function cadastrar(razaoSocial, cnpj, idEndereco) {
    // A empresa é vinculada ao endereço criado ou encontrado anteriormente.
    return database.executar(`
        -- Cadastra os dados básicos da empresa.
        INSERT INTO empresa (razao_social, cnpj, fk_endereco, contrato_ativo)
        -- Novos contratos começam inativos.
        VALUES (?, ?, ?, 0)
    `, [razaoSocial, cnpj, idEndereco]);
}

function cadastrarEndereco(cep, logradouro, numero, complemento) {
    // Converte complemento vazio em NULL para manter o padrão da tabela.
    return database.executar(`
        -- Insere o endereço recebido.
        INSERT INTO endereco (cep, logradouro, numero, complemento)
        VALUES (?, ?, ?, ?)
    `, [cep, logradouro, numero, complemento || null]);
}

function editar(idEmpresa, dados) {
    // Não altera contrato ou endereço porque esses dados têm fluxos separados.
    return database.executar(`
        -- Atualiza os campos editáveis da empresa.
        UPDATE empresa
        SET razao_social = ?, cnpj = ?, lotacao = ?
        -- Limita a atualização à empresa selecionada.
        WHERE id_empresa = ?
    `, [dados.razaoSocial, dados.cnpj, dados.lotacao || null, idEmpresa]);
}

function editarEndereco(idEndereco, dados) {
    // Atualiza o registro de endereço vinculado à empresa selecionada.
    return database.executar(`
        -- Atualiza todos os campos do endereço.
        UPDATE endereco
        SET cep = ?, logradouro = ?, numero = ?, complemento = ?
        -- Limita ao endereço selecionado.
        WHERE id_endereco = ?
    `, [dados.cep, dados.logradouro, dados.numero, dados.complemento || null, idEndereco]);
}

function deletarEmpresa(id) {
    // Usa parâmetro para excluir somente a empresa informada.
    return database.executar("DELETE FROM empresa WHERE id_empresa = ?", [id]);
}

function deletarEndereco(id) {
    // Usa parâmetro para excluir somente o endereço informado.
    return database.executar("DELETE FROM endereco WHERE id_endereco = ?", [id]);
}

module.exports = {
    buscarPorCnpj,
    buscarPorId,
    buscarEstabelecimento,
    buscarEndereco,
    cadastrar,
    cadastrarEndereco,
    listar,
    editar,
    editarEndereco,
    deletarEmpresa,
    deletarEndereco
};
