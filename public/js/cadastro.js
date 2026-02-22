const pt1 = document.getElementById('divParte1')
const pt2 = document.getElementById('divParte2')
const cnpjsCadastrados = []

let inpRazao = document.getElementById('inptRazaoSocial').value
let inpCnpj = document.getElementById('inptCNPJ').value
let inpCep = document.getElementById('inptCEP').value
let inpEndereco = document.getElementById('inptEndereco').value
let inpNumero = document.getElementById('inptNumero').value
let inpComplemento = document.getElementById('inptComplemento').value

function proximo() {
    inpRazao = document.getElementById('inptRazaoSocial').value
    inpCnpj = document.getElementById('inptCNPJ').value
    inpCep = document.getElementById('inptCEP').value
    inpEndereco = document.getElementById('inptEndereco').value
    inpNumero = document.getElementById('inptNumero').value
    inpComplemento = document.getElementById('inptComplemento').value

    if (inpRazao.trim() != "" && inpCnpj.trim().length == 14 && inpCep.trim().length == 8 && inpEndereco.trim() != "" && inpNumero.trim() != "") {
        pt1.style.display = 'none'
        pt2.style.display = 'flex'
        return
    }

    erro()
}

function voltar() {
    pt2.style.display = 'none'
    pt1.style.display = 'flex'
}

let inpNome = document.getElementById('inptNome').value
let inpEmail = document.getElementById('inptEmail').value
let inpCelular = document.getElementById('inptCelular').value
let inpSenha = document.getElementById('inptSenha').value
let inpConfirma = document.getElementById('inptConfirmaSenha').value

function cadastrar() {
    inpNome = document.getElementById('inptNome').value
    inpEmail = document.getElementById('inptEmail').value
    inpCelular = document.getElementById('inptCelular').value
    inpSenha = document.getElementById('inptSenha').value
    inpConfirma = document.getElementById('inptConfirmaSenha').value

    if (inpNome != "" && inpEmail != "" && inpCelular != "" && inpSenha != "" && inpSenha == inpConfirma) {

        setTimeout(() => {
            window.location = "login.html";
        }, "2000");
        return
    }

    erro()
}