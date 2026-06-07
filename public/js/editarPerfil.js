const voltar = () => {
    const nivelAcesso = sessionStorage.NIVEL_ACESSO;

    if (nivelAcesso == null || nivelAcesso == "") {
        sessionStorage.clear()
        window.location.href = "/";
    } else if (nivelAcesso == 1) {
        window.location.href = "/dashmarketing.html"
    } else if (nivelAcesso == 2) {
        window.location.href = "/dashboard-curador.html"
    }
}

const formulario = document.getElementById("formEditarPerfil");

formulario.addEventListener("submit", editarPerfil);

async function editarPerfil(event) {
    event.preventDefault();

    const usuario = sessionStorage.ID_USUARIO;
    const nome = document.getElementById("inputNome").value;
    const email = document.getElementById("inputEmail").value;
    const celular = document.getElementById("inputCelular").value;
    const senha = document.getElementById("inputSenha").value;
    const confirmarSenha = document.getElementById("inputConfirmarSenha").value;
    const permissao = document.getElementById("selectPermissao").value;

    if (senha !== confirmarSenha) {
        alert("As senhas não coincidem");
        return;
    }

    const dadosPerfil = {
        usuario,
        nome,
        email,
        celular,
        senha,
        permissao
    };

    try {
        const resposta = await fetch("/perfis/editarPerfil", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(dadosPerfil)
        });

        const resultado = await resposta.json();

        if (resposta.ok) {
            alert("Perfil atualizado com sucesso!");
            console.log(resultado);
        } else {
            alert(resultado.mensagem || "Erro ao atualizar perfil");
        }

    } catch (erro) {
        console.error("Erro na requisição:", erro);
        alert("Erro ao conectar com o servidor");
    }
} 

async function carregarDadosPerfil() {
    const usuario = sessionStorage.ID_USUARIO;
    try {
        const resposta = await fetch(`/perfis/buscarPerfilAtual/${usuario}`);
        const resultado = await resposta.json();

        if (resposta.ok && resultado.length > 0) {
            const perfil = resultado[0];

            document.getElementById("inputNome").value = perfil.nome;
            document.getElementById("inputEmail").value = perfil.email;
            document.getElementById("inputCelular").value = perfil.celular;
            document.getElementById("inputSenha").value = perfil.senha;
            document.getElementById("inputConfirmarSenha").value = perfil.senha;

            const select = document.getElementById("selectPermissao");
            for (let option of select.options) {
                if (option.value === perfil.permissao) {
                    option.selected = true;
                    break;
                }
            }
        } else {
            alert("Erro ao carregar dados do perfil");
        }

    } catch (erro) {
        console.error("Erro ao buscar perfil:", erro);
        alert("Erro ao conectar com o servidor");
    }
}

window.addEventListener("DOMContentLoaded", carregarDadosPerfil);