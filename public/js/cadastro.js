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

    let cepVar = inpCep.value.replaceAll('-', '')

    if (razaoVar.trim() != "" && cnpjVar.trim().length == 14 && cepVar.trim().length == 8 && inpEndereco.value.trim() != "" && inpNumero.value.trim() != "") {
        if (!buscarPorCnpj(inpCnpj.value)) {
            pt1.style.display = 'none'
            pt2.style.display = 'flex'
            return
        } else {
            erro("4000", 'CNPJ já cadastrado')
            return
        }
    }
    erro("2000", 'Por favor revise os campos e preencha os dados corretamente')
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

    if (nomeVar != "" && emailVar != "" && celularVar != "" && senhaVar != "" && senhaVar == inpConfirma.value) {

        const respCadEmpresa = await fetch("/empresas/cadastrar", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                razaoServer: razaoVar,
                cnpjServer: cnpjVar,
                cepServer: cepVar,
                enderecoServer: enderecoVar,
                numeroServer: numeroVar,
                cepServer: cepVar
            }),
        })

        if (!respCadEmpresa.ok) {
            erro("2000", 'Verifique se as informações foram digitadas corretamente')
            return
        }

        let idCnpjAtual = buscarPorCnpj(cnpjVar)

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
                celularServer: celularVar,
                emailServer: emailVar,
                senhaServer: senhaVar
            })
        })

        if (!respCadUsuario.ok) {
            erro("3000", "Erro ao cadastrar o usuario, verifique as informações inseridas")

            await fetch(`/empresas/deletarEmpresa/${idCnpjAtual}`, {
                method: "DELETE",
                headers: {"Content-Type": "aaplication/json"}
            })

            return
        }

        setTimeout(() => {
            window.location = "login.html";
        }, "2000");
        return
    }

    erro("2000", 'Por favor revise os campos e preencha os dados corretamente')
}

function erro(tempo, texto) {
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
        document.getElementById('spnErro').innerHTML = texto
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