const toggle = document.getElementById("menuHamburguer");
const header = document.getElementById("header");

if (toggle && header) {
    toggle.addEventListener("change", function () {
        header.classList.toggle("ativo");
    });
}

const pegarNomeUsuario = () => {
    validarSessao();
};

document.addEventListener("DOMContentLoaded", pegarNomeUsuario);

const logout = () => {
    sessionStorage.clear();
    window.location.href = "/";
}

const isAdm = () => {

    validarSessao();
    
    const permissao = sessionStorage.getItem('NIVEL_ACESSO');

    if (permissao == null || permissao != "1") {
        logout();
    }
    return;
}

function validarSessao() {
    var email = sessionStorage.EMAIL_USUARIO;
    var nome = sessionStorage.NOME_USUARIO;

    const elemento = document.getElementById("nome_usuario");

    if (elemento && email != null && nome != null) {
        elemento.innerHTML = nome;
    } else {
        logout();
    }
}
