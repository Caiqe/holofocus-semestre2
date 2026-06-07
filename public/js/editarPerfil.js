// Carrega os níveis de acesso usados no cadastro de usuários.
function carregarNiveisPerfil() {
    // Solicita ao backend os níveis cadastrados na tabela nivel_acesso.
    return fetch("/usuarios/niveis").then(function (resposta) {
        // Converte o corpo HTTP em uma lista de níveis utilizável pelo JavaScript.
        return resposta.json();
    }).then(function (niveis) {
        // Mantém uma opção vazia para obrigar uma escolha válida no formulário.
        var opcoes = '<option value="">Selecionar</option>';

        for (var i = 0; i < niveis.length; i++) {
            // Usa o ID como valor enviado e o tipo de acesso como texto visível.
            opcoes += '<option value="' + niveis[i].id_nivel_acesso + '">' +
                niveis[i].tipo_acesso + '</option>';
        }

        // Coloca no select as opções montadas com os registros do banco.
        document.getElementById("perfil-nivel").innerHTML = opcoes;
    });
}

// Busca no banco o usuário salvo na sessão do navegador.
function carregarPerfilPessoal() {
    // Recupera o usuário autenticado para montar a URL de consulta.
    var idUsuario = sessionStorage.ID_USUARIO;
    // Informa também a empresa para impedir a leitura de usuário de outra empresa.
    var idEmpresa = sessionStorage.EMPRESA;

    // Consulta somente o usuário da sessão dentro da empresa da sessão.
    return fetch("/usuarios/" + idUsuario + "?idEmpresa=" + idEmpresa)
        .then(function (resposta) {
            // Interrompe o preenchimento se o backend não encontrar ou rejeitar a consulta.
            if (!resposta.ok) {
                throw new Error("Não foi possível carregar o perfil");
            }
            // Converte o registro retornado pelo backend em objeto JavaScript.
            return resposta.json();
        }).then(function (usuario) {
            // Preenche cada campo editável com seu valor atual no banco.
            document.getElementById("perfil-nome").value = usuario.nome;
            document.getElementById("perfil-email").value = usuario.email;
            document.getElementById("perfil-telefone").value = usuario.telefone;
            document.getElementById("perfil-nivel").value = usuario.fk_nivel_acesso;
        });
}

document.getElementById("form-editar-perfil").addEventListener("submit", function (evento) {
    // Evita que o navegador recarregue a página antes do PUT terminar.
    evento.preventDefault();

    // Lê separadamente as senhas para conferir a confirmação antes do envio.
    var senha = document.getElementById("perfil-senha").value;
    var confirmarSenha = document.getElementById("perfil-confirmar-senha").value;

    // Não permite enviar duas senhas diferentes ao backend.
    if (senha != confirmarSenha) {
        alert("As senhas não conferem");
        return;
    }

    // Monta o mesmo formato esperado pelo PUT /usuarios/:idUsuario.
    var dados = {
        // Os nomes correspondem aos campos esperados pelo usuarioController.
        nome: document.getElementById("perfil-nome").value,
        email: document.getElementById("perfil-email").value,
        // Remove máscara e envia apenas os dígitos do telefone.
        telefone: document.getElementById("perfil-telefone").value.replace(/\D/g, ""),
        // Converte IDs vindos do HTML e da sessão para números.
        nivelAcesso: Number(document.getElementById("perfil-nivel").value),
        idEmpresa: Number(sessionStorage.EMPRESA),
        // Uma string vazia sinaliza ao model que a senha atual deve ser preservada.
        senha: senha
    };

    // Atualiza a tabela usuario; senha vazia mantém a senha atual.
    fetch("/usuarios/" + sessionStorage.ID_USUARIO, {
        // PUT representa a alteração do registro já existente.
        method: "PUT",
        // Avisa ao Express que o corpo está em JSON.
        headers: { "Content-Type": "application/json" },
        // Converte o objeto para o texto enviado no corpo HTTP.
        body: JSON.stringify(dados)
    }).then(function (resposta) {
        // Tenta aproveitar a mensagem de validação enviada pelo backend.
        if (!resposta.ok) {
            return resposta.json().then(function (erro) {
                throw new Error(erro.mensagem || "Erro ao editar perfil");
            });
        }

        // Atualiza a sessão para navbar e redirecionamentos refletirem os novos dados.
        sessionStorage.NOME_USUARIO = dados.nome;
        sessionStorage.EMAIL_USUARIO = dados.email;
        sessionStorage.NIVEL_ACESSO = dados.nivelAcesso;
        // Só informa sucesso depois que o backend confirmou a atualização.
        alert("Perfil atualizado com sucesso");
        voltar();
    }).catch(function (erro) {
        // Exibe falhas HTTP, validações do backend ou problemas de conexão.
        alert(erro.message);
    });
});

function voltar() {
    // Retorna cada nível para sua página principal.
    var nivelAcesso = sessionStorage.NIVEL_ACESSO;

    // Sem nível válido, limpa uma possível sessão incompleta e volta ao início.
    if (!nivelAcesso) {
        sessionStorage.clear();
        window.location.href = "/";
    // GESTOR acessa a área administrativa.
    } else if (nivelAcesso == 1) {
        window.location.href = "/dashmarketing.html";
    // SUPORTE retorna à lista usada para atender chamados.
    } else if (nivelAcesso == 2) {
        window.location.href = "/lista-chamados.html";
    // USER retorna ao dashboard comum.
    } else {
        window.location.href = "/dashboard.html";
    }
}

// Os níveis devem ser carregados antes para que o valor atual possa ser selecionado.
carregarNiveisPerfil()
    // Aguarda o select existir para conseguir selecionar o nível atual do usuário.
    .then(carregarPerfilPessoal)
    .catch(function (erro) {
        // Centraliza o erro de qualquer uma das duas consultas iniciais.
        alert(erro.message);
    });
