async function login() {
    let email = document.getElementById('inptEmail').value
    let senha = document.getElementById('inptSenha').value

    if (email.trim() != "" && email != null && senha.trim() != "" && senha != null) {
        const resposta = await fetch('/usuarios/autenticar', {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                emailServer: email,
                senhaServer: senha
            })
        })

        if (resposta.ok) {
            let resp = resposta.json()
            sessionStorage.EMAIL_USUARIO = resp.email;
            sessionStorage.NOME_USUARIO = resp.nome;
            sessionStorage.ID_USUARIO = resp.id;

            setTimeout(() => {
                window.location = "./dashboard/dashboard.html";
            }, "2000");
            return
        }
    }

    erro("3000", "Erro", "Usuário e/ou Senha incorretos")
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