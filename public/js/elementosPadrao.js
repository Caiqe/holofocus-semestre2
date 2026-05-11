const toggle = document.getElementById("menuHamburguer");
const header = document.getElementById("header");

if (toggle && header) {
    toggle.addEventListener("change", function () {
        header.classList.toggle("ativo");
    });
}

const pegarNomeUsuario = () => {
    const elemento = document.getElementById("nome_usuario");

    // Paginas publicas nao possuem esse elemento; nao deve forcar redirecionamento.
    if (!elemento) return;

    validarSessao(true);
};

document.addEventListener("DOMContentLoaded", pegarNomeUsuario);

const logout = () => {
    sessionStorage.clear();
    window.location.href = "/";
};

const isAdm = () => {
    validarSessao(true);
    const permissao = sessionStorage.getItem("NIVEL_ACESSO");

    if (permissao == null || permissao != "1") {
        logout();
    }
    return;
};

function validarSessao(redirecionarSeInvalido = false) {
    var email = sessionStorage.EMAIL_USUARIO;
    var nome = sessionStorage.NOME_USUARIO;

    const elemento = document.getElementById("nome_usuario");

    if (!elemento) return;

    if (email != null && nome != null) {
        elemento.innerHTML = nome;
    } else if (redirecionarSeInvalido) {
        logout();
    } else {
        elemento.innerHTML = "";
    }
}
