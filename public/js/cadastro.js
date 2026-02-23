const pt1 = document.getElementById('divParte1')
const pt2 = document.getElementById('divParte2')
const cnpjsCadastrados = []

let inpRazao = document.getElementById('inptRazaoSocial')
let inpCnpj = document.getElementById('inptCNPJ')
let inpCep = document.getElementById('inptCEP')
let inpEndereco = document.getElementById('inptEndereco')
let inpNumero = document.getElementById('inptNumero')
let inpComplemento = document.getElementById('inptComplemento')

function proximo() {
    inpRazao = document.getElementById('inptRazaoSocial')
    inpCnpj = document.getElementById('inptCNPJ')
    inpCep = document.getElementById('inptCEP')
    inpEndereco = document.getElementById('inptEndereco')
    inpNumero = document.getElementById('inptNumero')
    inpComplemento = document.getElementById('inptComplemento')

    let cnpj = inpCnpj.value.replaceAll('.','')
    cnpj = cnpj.replaceAll('/','')
    cnpj = cnpj.replaceAll('-','')

    let cep = inpCep.value.replaceAll('-','')

    if (inpRazao.value.trim() != "" && cnpj.trim().length == 14 && cep.trim().length == 8 && inpEndereco.value.trim() != "" && inpNumero.value.trim() != "") {
        if (!buscarPorCnpj(inpCnpj.value)) {
            pt1.style.display = 'none'
            pt2.style.display = 'flex'
            return
        } else {
            'cnpj já cadastrado'
            return
        }
    }
    erro()
}

function voltar() {
    pt2.style.display = 'none'
    pt1.style.display = 'flex'
}

let inpNome = document.getElementById('inptNome')
let inpEmail = document.getElementById('inptEmail')
let inpCelular = document.getElementById('inptCelular')
let inpSenha = document.getElementById('inptSenha')
let inpConfirma = document.getElementById('inptConfirmaSenha')

function cadastrar() {
    inpNome = document.getElementById('inptNome')
    inpEmail = document.getElementById('inptEmail')
    inpCelular = document.getElementById('inptCelular')
    inpSenha = document.getElementById('inptSenha')
    inpConfirma = document.getElementById('inptConfirmaSenha')

    if (inpNome.value != "" && inpEmail.value != "" && inpCelular.value != "" && inpSenha.value != "" && inpSenha.value == inpConfirma.value) {


        setTimeout(() => {
            window.location = "login.html";
        }, "2000");
        return
    }

    erro()
}

function erro() {
    document.getElementById('divFundoErro').style.display = 'flex'

    if (inpRazao.value == '') {
        document.getElementById('spnRazao').style.color = 'red'
    } else {
        document.getElementById('spnRazao').style.color = 'white'
    }
    if (inpCnpj.value == '') {
        document.getElementById('spnCnpj').style.color = 'red'
    } else {
        document.getElementById('spnCnpj').style.color = 'white'
    }
    if (inpCep.value == '') {
        document.getElementById('spnCep').style.color = 'red'
    } else {
        document.getElementById('spnCep').style.color = 'white'
    }
    if (inpEndereco.value == '') {
        document.getElementById('spnEndereco').style.color = 'red'
    } else {
        document.getElementById('spnEndereco').style.color = 'white'
    }
    if (inpNumero.value == '') {
        document.getElementById('spnNumero').style.color = 'red'
    } else {
        document.getElementById('spnNumero').style.color = 'white'
    }
    if (inpNome.value == '') {
        document.getElementById('spnNome').style.color = 'red'
    } else {
        document.getElementById('spnNome').style.color = 'white'
    }
    if (inpEmail.value == '') {
        document.getElementById('spnEmail').style.color = 'red'
    } else {
        document.getElementById('spnEmail').style.color = 'white'
    }
    if (inpCelular.value == '') {
        document.getElementById('spnCelular').style.color = 'red'
    } else {
        document.getElementById('spnCelular').style.color = 'white'
    }
    if (inpSenha.value == '') {
        document.getElementById('spnSenha').style.color = 'red'
    } else {
        document.getElementById('spnSenha').style.color = 'white'
    }
    if (inpConfirma.value == '') {
        document.getElementById('spnConfirma').style.color = 'red'
    } else {
        document.getElementById('spnConfirma').style.color = 'white'
    }

    setTimeout(() => {
        document.getElementById('divFundoErro').style.display = 'none'
    }, "2000");
    return
}

function buscarPorCnpj(cnpj) {
    fetch("/empresas/buscar", {
        method: "GET",
    })
        .then(function (resposta) {
            resposta.json().then((resposta) => {
                if (resposta.length > 0) {
                    return false
                } else {
                    return true
                }
            });
        })
        .catch(function (resposta) {
            console.log(`#ERRO: ${resposta}`);
        });
}