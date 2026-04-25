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

async function proximo() {
    inpRazao = document.getElementById('inptRazaoSocial')
    razaoVar = inpRazao.value.trim()
    inpCnpj = document.getElementById('inptCNPJ')
    cnpjVar = inpCnpj.value.replace(/\D/g, "")
    inpCep = document.getElementById('inptCEP')
    inpEndereco = document.getElementById('inptEndereco')
    enderecoVar = inpEndereco.value.trim()
    inpNumero = document.getElementById('inptNumero')
    numeroVar = inpNumero.value.trim()
    inpComplemento = document.getElementById('inptComplemento')
    complementoVar = inpComplemento.value.trim()

    cepVar = inpCep.value.replace(/\D/g, "").trim()

    if (razaoVar !== "" &&
        validarCnpj(inpCnpj.value) &&
        cepVar.length === 8 &&
        inpEndereco.value !== "" &&
        inpNumero.value !== "") {

        const cnpjExiste = await buscarPorCnpj(cnpjVar)
        const enderecoExiste = await buscarEndereco(cepVar, numeroVar, complementoVar)

        if (cnpjExiste) {
            erro("4000", "CNPJ já cadastrado")
            return
        }

        if (enderecoExiste) {
            erro("4000", "Endereço já cadastrado")
            return
        }

        pt1.style.display = 'none'
        pt2.style.display = 'flex'
        document.getElementById("divFundo").style.backgroundImage = 'url("../assets/imgs/fundo-cadastro-parte-2.jpg")'
        return
    }
    erro("2000", "Por favor revise os campos e preencha os dados corretamente")
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
    nomeVar = inpNome.value.trim()
    inpEmail = document.getElementById('inptEmail')
    emailVar = inpEmail.value.trim()
    inpCelular = document.getElementById('inptCelular')
    celularVar = inpCelular.value.replace(/\D/g, "").trim()
    inpSenha = document.getElementById('inptSenha')
    senhaVar = inpSenha.value.trim()
    inpConfirma = document.getElementById('inptConfirmaSenha')

    if (enderecoVar !== "" &&
        cepVar !== "" &&
        numeroVar !== ""
    ) {
        const respCadEndereco = await fetch("/empresas/cadastrarEndereco", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                cepServer: cepVar,
                logradouroServer: enderecoVar,
                numeroServer: numeroVar,
                complementoServer: complementoVar
            })
        })

        if (!respCadEndereco.ok) {
            erro("2000", "Verifique se as informações foram digitadas corretamente")
            return
        }

        let idEndereco = await obterEndereco(cepVar, numeroVar, complementoVar)

        if (idEndereco == null) {
            erro("4000", "Erro interno, peça ajuda ao nosso suporte")
            return
        }

        if (nomeVar !== "" &&
            validarEmail(emailVar) &&
            validarCelular(celularVar) &&
            validarSenha(senhaVar) &&
            senhaVar === inpConfirma.value) {

            const respCadEmpresa = await fetch("/empresas/cadastrar", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    idEnderecoServer: idEndereco,
                    razaoServer: razaoVar,
                    cnpjServer: cnpjVar
                }),
            })

            if (!respCadEmpresa.ok) {
                erro("2000", 'Verifique se as informações foram digitadas corretamente')

                await fetch(`/empresas/deletarEndereco/${idEndereco}`, {
                    method: "DELETE",
                    headers: { "Content-Type": "application/json" }
                })

                return
            }

            let idCnpjAtual = await obterEmpresaPorCnpj(cnpjVar)

            if (idCnpjAtual == null) {
                erro("4000", "Erro interno, peça ajuda ao nosso suporte")
                return
            }

            const respCadUsuario = await fetch('/usuarios/cadastrar', {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    idEmpresaServer: idCnpjAtual,
                    nomeServer: nomeVar,
                    telefoneServer: celularVar,
                    emailServer: emailVar,
                    senhaServer: senhaVar
                })
            })

            if (!respCadUsuario.ok) {
                erro("3000", "Erro ao cadastrar o usuario, verifique as informações inseridas")

                await fetch(`/empresas/deletarEmpresa/${idCnpjAtual}`, {
                    method: "DELETE",
                    headers: { "Content-Type": "application/json" }
                })

                await fetch(`/empresas/deletarEndereco/${idEndereco}`, {
                    method: "DELETE",
                    headers: { "Content-Type": "application/json" }
                })

                return
            }

            erro("2000", 'Cadastro realizado com sucesso')

            setTimeout(() => {
                window.location = "login.html";
            }, "3000");
            return
        }

        erro("2000", 'Por favor revise os campos e preencha os dados corretamente')
    } else {
        erro("2000", "Preencha os dados de endereço corretamente")
        return
    }
}


function erro(tempo, titulo) {
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

    setTimeout(() => {
        document.getElementById('divFundoErro').style.display = 'none'
    }, tempo);
    return
}

async function buscarPorCnpj(cnpj) {
    try {
        const resposta = await fetch(`/empresas/buscar/${cnpj}`)
        const dados = await resposta.json()

        return dados.length > 0
    } catch (erro) {
        console.log("#ERRO:", erro)
        return false
    }
}

async function obterEmpresaPorCnpj(cnpj) {
    const resposta = await fetch(`/empresas/buscar/${cnpj}`)
    const dados = await resposta.json()

    return dados[0]?.id_empresa || null
}

async function obterEndereco(cep, numero, complemento) {
    const resposta = await fetch(`/empresas/buscarEndereco`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            cepServer: cep,
            numeroServer: numero,
            complementoServer: complemento
        })
    })

    const dados = await resposta.json()
    return dados[0]?.id_endereco || null
}

async function buscarEndereco(cep, numero, complemento) {
    try {
        const resposta = await fetch(`/empresas/buscarEndereco`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                cepServer: cep,
                numeroServer: numero,
                complementoServer: complemento
            })
        })

        const dados = await resposta.json()

        return dados.length > 0
    } catch (erro) {
        console.log("#ERRO:", erro)
        return false
    }
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

document.getElementById("inptCNPJ").addEventListener("input", function () {
    mascaraCnpj(this)
})

document.getElementById("inptCEP").addEventListener("input", function () {
    mascaraCep(this)
})

document.getElementById("inptCelular").addEventListener("input", function () {
    mascaraCelular(this)
})