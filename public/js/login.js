async function login() {
    let email = document.getElementById('inptEmail').value
    let senha = document.getElementById('inptSenha').value

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

    console.log('erro interno')
}