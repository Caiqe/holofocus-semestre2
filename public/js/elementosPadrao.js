const toggle = document.getElementById("menuHamburguer");
const header = document.getElementById("header");

toggle.addEventListener("change", function () {
    header.classList.toggle("ativo");
});