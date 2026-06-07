var database = require("../database/config");

function autenticar(email, senha) {
    // Além do usuário, retorna empresa, contrato e primeiro perfil para decidir o redirecionamento.
    return database.executar(`
        -- Seleciona dados pessoais e informações de navegação.
        SELECT u.id_usuario, u.nome, u.email,
               u.fk_empresa AS empresaId,
               u.fk_nivel_acesso AS nivelAcesso,
               e.contrato_ativo AS contratoAtivo,
               p.id_perfil AS perfilId
        -- Parte da tabela de usuários.
        FROM usuario u
        -- Busca o estado do contrato da empresa.
        JOIN empresa e ON u.fk_empresa = e.id_empresa
        -- Perfil pode não existir antes do questionário, por isso usa LEFT JOIN.
        LEFT JOIN perfil p ON p.id_perfil = (
            -- Procura o primeiro perfil vinculado à empresa.
            SELECT p2.id_perfil
            FROM perfil p2
            WHERE p2.fk_empresa = u.fk_empresa
            ORDER BY p2.id_perfil ASC
            LIMIT 1
        )
        -- Compara as credenciais recebidas.
        WHERE u.email = ? AND u.senha = ?
    `, [email, senha]);
}

function cadastrar(nome, telefone, email, senha, fkEmpresa, nivelAcesso = 1) {
    // O nível recebido permite cadastrar gestor, suporte ou usuário comum.
    return database.executar(`
        -- Define as colunas preenchidas no cadastro.
        INSERT INTO usuario
            (nome, telefone, email, senha, fk_empresa, fk_nivel_acesso)
        -- Recebe seis valores separados do SQL.
        VALUES (?, ?, ?, ?, ?, ?)
    `, [nome, telefone, email, senha, fkEmpresa, nivelAcesso]);
}

function listarPorEmpresa(idEmpresa) {
    // Não retorna senha; a listagem precisa somente dos dados exibidos na tabela.
    return database.executar(`
        -- Seleciona somente os campos apresentados na lista.
        SELECT u.id_usuario, u.nome, u.telefone, u.email,
               u.fk_nivel_acesso
        -- Consulta a tabela de usuários.
        FROM usuario u
        -- Limita o resultado à empresa logada.
        WHERE u.fk_empresa = ?
        -- Organiza a tabela por nome.
        ORDER BY u.nome
    `, [idEmpresa]);
}

function buscarPorId(idUsuario, idEmpresa) {
    // Confirma também a empresa antes de devolver os dados do perfil pessoal.
    return database.executar(`
        -- Não retorna senha para o formulário.
        SELECT id_usuario, nome, telefone, email, fk_nivel_acesso, fk_empresa
        -- Exige correspondência de usuário e empresa.
        FROM usuario
        WHERE id_usuario = ? AND fk_empresa = ?
    `, [idUsuario, idEmpresa]);
}

function editar(idUsuario, dados) {
    // A senha só é alterada quando o usuário preencher uma nova senha.
    if (dados.senha) {
        // Usa este UPDATE somente quando uma nova senha foi preenchida.
        return database.executar(`
            -- Atualiza dados pessoais, nível e senha.
            UPDATE usuario
            SET nome = ?, telefone = ?, email = ?, fk_nivel_acesso = ?, senha = ?
            -- Confirma o usuário e sua empresa.
            WHERE id_usuario = ? AND fk_empresa = ?
        `, [
            // Novos valores do formulário.
            dados.nome,
            dados.telefone,
            dados.email,
            dados.nivelAcesso,
            dados.senha,
            // Valores que identificam a linha.
            idUsuario,
            dados.idEmpresa
        ]);
    }

    // Quando a senha está vazia, usa um UPDATE que não modifica essa coluna.
    return database.executar(`
        -- Atualiza somente dados pessoais e nível.
        UPDATE usuario
        SET nome = ?, telefone = ?, email = ?, fk_nivel_acesso = ?
        -- Confirma o usuário e a empresa.
        WHERE id_usuario = ? AND fk_empresa = ?
    `, [
        dados.nome,
        dados.telefone,
        dados.email,
        dados.nivelAcesso,
        idUsuario,
        dados.idEmpresa
    ]);
}

function deletar(idUsuario, idEmpresa) {
    // A empresa no WHERE evita remover um usuário de outro estabelecimento.
    return database.executar(
        // Exige correspondência das duas chaves recebidas.
        "DELETE FROM usuario WHERE id_usuario = ? AND fk_empresa = ?",
        // Substitui as duas interrogações da consulta.
        [idUsuario, idEmpresa]
    );
}

function listar() {

    var instrucaoSql = `
        SELECT id, nome, telefone, email
        FROM usuario;
    `;

    console.log("Executando a instrução SQL: \n" + instrucaoSql);

    return database.executar(instrucaoSql);
}

module.exports = {
    autenticar,
    cadastrar,
    listarPorEmpresa,
    buscarPorId,
    editar,
    deletar
};
