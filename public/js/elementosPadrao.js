const toggle = document.getElementById("menuHamburguer");
const header = document.getElementById("header");

toggle.addEventListener("change", function () {
    header.classList.toggle("ativo");
});

const pegarNomeUsuario = () =>{
    const elemento = document.getElementById('#nome_usuario');
    let nome = sessionStorage.getItem(NOME_USUARIO);
    if(nome == null){
        elemento.style.display = "none"; 
        return;
    }
    elemento.innerHTML = nome;
    return;
};