const aguardar = () => {
    div_aguardar.style.display = "block";
}
const fimAguardar = () => {
    div_aguardar.style.display = "none";
}

async function login() {
    let email = document.getElementById('inptEmail').value
    let senha = document.getElementById('inptSenha').value

    if (email != null && email.trim() != ""  && senha != null && senha.trim() != "") {
        const resposta = await fetch('/usuarios/autenticar', {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                emailServer: email,
                senhaServer: senha
            })
        })
        aguardar();
        if (await resposta.ok) {
            let resp =  await resposta.json()
            sessionStorage.EMAIL_USUARIO = resp.email;
            sessionStorage.NOME_USUARIO = resp.nome;
            sessionStorage.ID_USUARIO = resp.id;
            sessionStorage.NIVEL_ACESSO = resp.nivelAcesso;
            sessionStorage.EMPRESA = resp.empresaId;

            setTimeout(() => {
                window.location = "./dashboard/dashboard.html";
            }, 2000);
            return
        }else{
            console.log("Erro ao logar", await resposta)
        }
    }
    fimAguardar();
    erro("1000", "Erro", "Usuário e/ou Senha incorretos")
}


function erro(tempo, titulo, texto) {
    document.getElementById('titulo').innerHTML = titulo
    document.getElementById('spnErro').innerHTML = texto

    document.getElementById('divFundoErro').style.display = 'flex'
    setTimeout(() => {
        document.getElementById('divFundoErro').style.display = 'none'
    }, tempo);
    return
}