const toggle = document.getElementById("menuHamburguer");
const header = document.getElementById("header");

if (toggle && header) {
    toggle.addEventListener("change", function () {
        header.classList.toggle("ativo");
    });
}


const logout = () => {
    sessionStorage.clear()
    navigation.navigate("/")
}

const validarSessao = () => {
    var email = sessionStorage.EMAIL_USUARIO;
    var nome = sessionStorage.NOME_USUARIO;

    const elemento = document.getElementById('nome_usuario');

    if (email != null && nome != null) {
        elemento.innerHTML = nome;
    } else {
        logout();
    }
}

const isAdm = () =>{

    validarSessao();
    
    const permissao = sessionStorage.getItem('NIVEL_ACESSO');

    if(permissao == null || permissao != '1'){
        logout();
    }
    return;
}

