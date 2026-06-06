var usuarioModel = require("../models/usuarioModel");

async function autenticar(req, res) {
    try {
        // Confere e-mail e senha e devolve os dados necessários para a sessão do frontend.
        const resultado = await usuarioModel.autenticar(
            // E-mail digitado na tela de login.
            req.body.emailServer,
            // Senha digitada na tela de login.
            req.body.senhaServer
        );
        // Nenhuma linha significa que as credenciais não correspondem.
        if (resultado.length === 0) {
            return res.status(403).send("Email e/ou senha inválido(s)");
        }
        // Mais de uma linha indicaria dados duplicados indevidos.
        if (resultado.length > 1) {
            return res.status(403).send("Mais de um usuário com o mesmo login e senha");
        }
        // Guarda a única linha encontrada para montar a resposta.
        const usuario = resultado[0];
        // Retorna somente os dados necessários para sessão e navegação.
        res.json({
            // ID usado em chamados, perfil pessoal e outras operações.
            id: usuario.id_usuario,
            // Nome exibido na navegação.
            nome: usuario.nome,
            // E-mail mantido na sessão.
            email: usuario.email,
            // Empresa usada para filtrar dados.
            empresaId: usuario.empresaId,
            // Nível usado para menu e redirecionamento.
            nivelAcesso: usuario.nivelAcesso,
            // Contrato decide se o usuário pode seguir para a plataforma.
            contratoAtivo: usuario.contratoAtivo,
            // Perfil decide se o questionário inicial já foi respondido.
            perfilId: usuario.perfilId
        });
    } catch (erro) {
        // Trata indisponibilidade do banco ou erro da consulta.
        res.status(500).json({ mensagem: erro.sqlMessage || erro.message });
    }
}

async function cadastrar(req, res) {
    // Aceita o mesmo formato de campos usado pelo cadastro original do projeto.
    const dados = {
        // Nome recebido dos formulários de cadastro.
        nome: req.body.nomeServer,
        // Telefone recebido sem formatação.
        telefone: req.body.telefoneServer,
        // E-mail que será único no banco.
        email: req.body.emailServer,
        // Senha mantida sem hash conforme solicitado.
        senha: req.body.senhaServer,
        // Empresa à qual o usuário pertence.
        idEmpresa: req.body.idEmpresaServer,
        // Nível escolhido; usa GESTOR quando o cadastro antigo não enviar valor.
        nivelAcesso: req.body.nivelAcessoServer || 1
    };
    // Confere os campos obrigatórios antes do INSERT.
    if (!dados.nome || !dados.telefone || !dados.email || !dados.senha || !dados.idEmpresa) {
        return res.status(400).send("Preencha os campos obrigatórios");
    }
    try {
        // Envia cada valor na ordem esperada pelo model.
        const resultado = await usuarioModel.cadastrar(
            dados.nome,
            dados.telefone,
            dados.email,
            dados.senha,
            dados.idEmpresa,
            dados.nivelAcesso
        );
        // Confirma a criação do novo usuário.
        res.status(201).json(resultado);
    } catch (erro) {
        // Trata e-mail ou telefone duplicado e demais erros SQL.
        res.status(500).json({ mensagem: erro.sqlMessage || erro.message });
    }
}

async function listar(req, res) {
    try {
        // A lista de usuários é sempre filtrada pela empresa.
        res.status(200).json(await usuarioModel.listarPorEmpresa(req.params.idEmpresa));
    } catch (erro) {
        res.status(500).json({ mensagem: erro.sqlMessage || erro.message });
    }
}

// Busca os dados que serão preenchidos na tela de edição do perfil pessoal.
async function buscar(req, res) {
    try {
        // A busca usa ID do usuário e ID da empresa.
        const resultado = await usuarioModel.buscarPorId(
            req.params.idUsuario,
            req.query.idEmpresa
        );
        // Retorna 404 quando o usuário não existe nessa empresa.
        if (!resultado.length) {
            return res.status(404).json({ mensagem: "Usuário não encontrado" });
        }
        // A consulta por ID devolve somente uma linha útil.
        res.status(200).json(resultado[0]);
    } catch (erro) {
        // Devolve falhas da consulta para o frontend.
        res.status(500).json({ mensagem: erro.sqlMessage || erro.message });
    }
}

async function editar(req, res) {
    // A senha é opcional para permitir que o usuário edite apenas os dados pessoais.
    const dados = {
        // Campos comuns à lista administrativa e ao perfil pessoal.
        nome: req.body.nome,
        telefone: req.body.telefone,
        email: req.body.email,
        nivelAcesso: req.body.nivelAcesso,
        idEmpresa: req.body.idEmpresa,
        // Pode ficar vazio quando o usuário não deseja trocar a senha.
        senha: req.body.senha
    };
    // Senha não participa desta validação porque é opcional.
    if (!dados.nome || !dados.telefone || !dados.email || !dados.nivelAcesso || !dados.idEmpresa) {
        return res.status(400).json({ mensagem: "Preencha os campos obrigatórios" });
    }
    try {
        // O model escolhe o UPDATE com ou sem senha.
        const resultado = await usuarioModel.editar(req.params.idUsuario, dados);
        // Nenhuma linha alterada indica ID ou empresa incompatível.
        if (!resultado.affectedRows) {
            return res.status(404).json({ mensagem: "Usuário não encontrado" });
        }
        // Confirma a alteração realizada.
        res.status(200).json(resultado);
    } catch (erro) {
        // Trata duplicidade e outros erros de atualização.
        res.status(500).json({ mensagem: erro.sqlMessage || erro.message });
    }
}

async function deletar(req, res) {
    // Evita que a pessoa logada remova a própria conta pela tela administrativa.
    if (String(req.params.idUsuario) === String(req.query.usuarioLogado)) {
        // Retorna erro antes de executar o DELETE.
        return res.status(400).json({ mensagem: "Você não pode excluir o próprio usuário" });
    }
    try {
        // Envia usuário escolhido e empresa para o model.
        const resultado = await usuarioModel.deletar(
            req.params.idUsuario,
            req.query.idEmpresa
        );
        // ID inexistente ou empresa diferente não afeta nenhuma linha.
        if (!resultado.affectedRows) {
            return res.status(404).json({ mensagem: "Usuário não encontrado" });
        }
        // Confirma a exclusão.
        res.status(200).json(resultado);
    } catch (erro) {
        // Trata restrições que impeçam excluir o usuário.
        res.status(500).json({ mensagem: erro.sqlMessage || erro.message });
    }
}

async function listarNiveis(req, res) {
    // Mantém no frontend os mesmos códigos de nível definidos no banco.
    res.status(200).json([
        // Código 1 representa o gestor.
        { id_nivel_acesso: 1, tipo_acesso: "GESTOR", descricao: "Gestor de eventos" },
        // Código 2 representa a equipe de suporte.
        { id_nivel_acesso: 2, tipo_acesso: "SUPORTE", descricao: "Atendimento de chamados" },
        // Código 3 representa o usuário comum.
        { id_nivel_acesso: 3, tipo_acesso: "USER", descricao: "Usuário padrão" }
    ]);
}

module.exports = { autenticar, cadastrar, listar, buscar, editar, deletar, listarNiveis };
