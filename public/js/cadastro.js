const pt1 = document.getElementById('divParte1')
const pt2 = document.getElementById('divParte2')
const cnpjsCadastrados = []

let inpRazao = document.getElementById('inptRazaoSocial')
let inpCnpj = document.getElementById('inptCNPJ')
let inpCep = document.getElementById('inptCEP')
let inpEndereco = document.getElementById('inptEndereco')
let inpNumero = document.getElementById('inptNumero')
let inpComplemento = document.getElementById('inptComplemento')

let razaoVar
let cnpjVar
let cepVar
let enderecoVar
let numeroVar
let complementoVar
let nomeVar
let emailVar
let celularVar
let senhaVar

function validarEmail(email) {
    let arroba = email.indexOf("@")
    let ponto = email.lastIndexOf(".")

    if (arroba > 0 && ponto > arroba + 1 && ponto < email.length - 1) {
        return true
    }
    return false
}

function validarSenha(senha) {
    let temMaiuscula = /[A-Z]/.test(senha)
    let temMinuscula = /[a-z]/.test(senha)
    let temNumero = /[0-9]/.test(senha)
    let temEspecial = /[^A-Za-z0-9]/.test(senha)

    if (temMaiuscula && temMinuscula && temNumero && temEspecial && senha.length >= 8) {
        return true
    }

    return false
}

function validarCelular(celular) {
    let numeros = celular.replace(/\D/g, "")
    return numeros.length >= 10
}

function validarCnpj(cnpj) {
    let numeros = cnpj.replace(/\D/g, "")
    return numeros.length == 14
}

function proximo() {
    inpRazao = document.getElementById('inptRazaoSocial')
    razaoVar = inpRazao.value
    inpCnpj = document.getElementById('inptCNPJ')
    cnpjVar = inpCnpj.value
    inpCep = document.getElementById('inptCEP')
    inpEndereco = document.getElementById('inptEndereco')
    enderecoVar = inpEndereco.value
    inpNumero = document.getElementById('inptNumero')
    numeroVar = inpNumero.value
    inpComplemento = document.getElementById('inptComplemento')
    complementoVar = inpComplemento.value

    let cnpj = inpCnpj.value.replaceAll('.', '') 
    cnpj = cnpj.replaceAll('/', '') 
    cnpjVar = cnpj.replaceAll('-', '')

    cepVar = inpCep.value.replace(/\D/g, "")

    if (razaoVar.trim() !== "" &&
     validarCnpj(inpCnpj.value) &&
     cepVar.trim().length === 8 &&
     inpEndereco.value.trim() !== "" &&
     inpNumero.value.trim() !== "") {
        // if (!buscarPorCnpj(inpCnpj.value)) {

            pt1.style.display = 'none'
            pt2.style.display = 'flex'
            document.getElementById("divFundo").style.backgroundImage = 'url("../assets/imgs/fundo-cadastro-parte-2.jpg")'
            return

        // } else {
            // erro("4000", 'CNPJ já cadastrado')
            // return
        // }    
    }
    erro("2000", "Erro", "Por favor revise os campos e preencha os dados corretamente")
}

function voltar() {
    pt2.style.display = 'none'
    pt1.style.display = 'flex'
    document.getElementById("divFundo").style.backgroundImage = 'url("../assets/imgs/fundo-cadastro-parte-1.jpg")'        
}

let inpNome = document.getElementById('inptNome')
let inpEmail = document.getElementById('inptEmail')
let inpCelular = document.getElementById('inptCelular')
let inpSenha = document.getElementById('inptSenha')
let inpConfirma = document.getElementById('inptConfirmaSenha')

async function cadastrar() {
    inpNome = document.getElementById('inptNome')
    nomeVar = inpNome.value
    inpEmail = document.getElementById('inptEmail')
    emailVar = inpEmail.value
    inpCelular = document.getElementById('inptCelular')
    celularVar = inpCelular.value
    inpSenha = document.getElementById('inptSenha')
    senhaVar = inpSenha.value
    inpConfirma = document.getElementById('inptConfirmaSenha')

    if (nomeVar !== "" &&
     validarEmail(emailVar) &&
     validarCelular(celularVar) &&
     validarSenha(senhaVar) &&
     senhaVar === inpConfirma.value) {

        // const respCadEmpresa = await fetch("/empresas/cadastrar", {
        //     method: "POST",
        //     headers: {
        //         "Content-Type": "application/json",
        //     },
        //     body: JSON.stringify({
        //         razaoServer: razaoVar,
        //         cnpjServer: cnpjVar,
        //         cepServer: cepVar,
        //         enderecoServer: enderecoVar,
        //         numeroServer: numeroVar,
        //         cepServer: cepVar
        //     }),
        // })

        // if (!respCadEmpresa.ok) {
        //     erro("2000", 'Verifique se as informações foram digitadas corretamente')
        //     return
        // }

        // let idCnpjAtual = buscarPorCnpj(cnpjVar)

        // if (idCnpjAtual == null) {
        //     erro("4000", "Erro interno, peça ajuda ao nosso suporte")
        //     return
        // }

        // const respCadUsuario = await fetch('/usuarios/cadastrar', {
        //     method: "POST",
        //     headers: { "Content-Type": "application/json" },
        //     body: JSON.stringify({
        //         idEmpresaServer: idCnpjAtual,
        //         nomeServer: nomeVar,
        //         celularServer: celularVar,
        //         emailServer: emailVar,
        //         senhaServer: senhaVar
        //     })
        // })

        // if (!respCadUsuario.ok) {
        //     erro("3000", "Erro ao cadastrar o usuario, verifique as informações inseridas")

        //     await fetch(`/empresas/deletarEmpresa/${idCnpjAtual}`, {
        //         method: "DELETE",
        //         headers: {"Content-Type": "aplication/json"}
        //     })

        //     return
        // }

        erro("2000", "Sucesso", 'Cadastro realizado com sucesso')

        setTimeout(() => {
            window.location = "login.html";
        }, "5000");
        return
    }

    erro("2000", "Erro", 'Por favor revise os campos e preencha os dados corretamente')
}

function erro(tempo, titulo, texto) {
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

    document.getElementById('titulo').innerHTML = titulo
    document.getElementById('spnErro').innerHTML = texto

    setTimeout(() => {
        document.getElementById('divFundoErro').style.display = 'none'
    }, tempo);
    return
}

function buscarPorCnpj(cnpj) {
    fetch("/empresas/buscar", {
        method: "GET",
    })
        .then(function (resposta) {
            resposta.json().then((resposta) => {
                if (resposta.length > 0) {
                    return null
                } else {
                    return resposta.id
                }
            });
        })
        .catch(function (resposta) {
            console.log(`#ERRO: ${resposta}`);
        });
}

function mascaraCnpj(input) {
    let valor = input.value.replace(/\D/g, "")

    valor = valor.replace(/^(\d{2})(\d)/, "$1.$2")
    valor = valor.replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
    valor = valor.replace(/\.(\d{3})(\d)/, ".$1/$2")
    valor = valor.replace(/(\d{4})(\d)/, "$1-$2")

    input.value = valor
}

function mascaraCep(input) {
    let valor = input.value.replace(/\D/g, "")

    valor = valor.replace(/^(\d{5})(\d)/, "$1-$2")

    input.value = valor
}

function mascaraCelular(input) {
    let valor = input.value.replace(/\D/g, "")

    valor = valor.replace(/^(\d{2})(\d)/g, "($1) $2")
    valor = valor.replace(/(\d{5})(\d)/, "$1-$2")

    input.value = valor
}

document.getElementById("inptCNPJ").addEventListener("input", function() {
    mascaraCnpj(this)
})

document.getElementById("inptCEP").addEventListener("input", function() {
    mascaraCep(this)
})

document.getElementById("inptCelular").addEventListener("input", function() {
    mascaraCelular(this)
})