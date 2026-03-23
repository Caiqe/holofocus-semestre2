let inpNome = document.getElementById("inptNome")
let inpEmail = document.getElementById("inptEmail")
let inpTelefone = document.getElementById("inptTelefone")
let inpAssunto = document.getElementById("inptAssunto")
let inpMensagem = document.getElementById("inptMensagem")

async function enviar() {
    let nome = inpNome.value.trim()
    let email = inpEmail.value.trim()
    let telefone = inpTelefone.value.replace(/\D/g, "").trim()
    let assunto = inpAssunto.value.trim()
    let mensagem = inpMensagem.value.trim()

    if (nome !== "" && nome !== null &&
        email !== "" && email !== null &&
        telefone !== "" && telefone !== null
        && telefone.length == 14 &&
        assunto !== "" && assunto !== null &&
        mensagem !== "" && mensagem !== null) {

        const respContato = await fetch('/suportes/contatar', {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                nomeServer: nome,
                emailServer: email,
                telefoneServer: telefone,
                assuntoServer: assunto,
                mensagemServer: mensagem
            })
        })

        if (respContato.ok) {
            resposta()
            return
        }
    }
}