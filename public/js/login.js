// Exibe a camada visual de carregamento durante a autenticação.
const aguardar = () => {
    div_aguardar.style.display = "block";
}
// Oculta a camada quando a tentativa termina sem redirecionamento.
const fimAguardar = () => {
    div_aguardar.style.display = "none";
}

async function login() {
    // Lê as credenciais digitadas no formulário.
    let email = document.getElementById('inptEmail').value
    let senha = document.getElementById('inptSenha').value

    // Só consulta o banco quando os dois campos possuem conteúdo.
    if (email != null && email.trim() != ""  && senha != null && senha.trim() != "") {
        // Envia as credenciais para a consulta parametrizada de autenticação.
        const resposta = await fetch('/usuarios/autenticar', {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                // Mantém os nomes que o usuarioController já espera.
                emailServer: email,
                senhaServer: senha
            })
        })
        // Mostra o carregamento enquanto a resposta é processada.
        aguardar();
        // Uma resposta 2xx indica que o usuário e a senha foram encontrados.
        if (await resposta.ok) {
            // Converte os dados da autenticação em objeto JavaScript.
            let resp =  await resposta.json()
            // Esses valores identificam usuário, empresa, nível e perfil nas demais telas.
            sessionStorage.EMAIL_USUARIO = resp.email;
            sessionStorage.NOME_USUARIO = resp.nome;
            sessionStorage.ID_USUARIO = resp.id;
            sessionStorage.NIVEL_ACESSO = resp.nivelAcesso;
            sessionStorage.EMPRESA = resp.empresaId;
            sessionStorage.PERFIL = resp.perfilId;
            sessionStorage.CONTRATO = resp.contratoAtivo;

            // Mantém por dois segundos o carregamento visual que já existia na tela.
            setTimeout(() => {

                // Contrato e perfil são verificados antes do redirecionamento por nível.
                if (resp.contratoAtivo == 0) {
                    // Empresa sem contrato ativo aguarda contato comercial.
                    window.location = "./dashboard/aguarde-contato.html";
                } else if (resp.perfilId == null) {
                    // Empresa sem perfil principal precisa responder o questionário.
                    window.location = "./dashboard/questionario.html";
                } else if (resp.nivelAcesso == 1) {
                    // GESTOR entra na área administrativa.
                    window.location = "./dashmarketing.html";
                } else if (resp.nivelAcesso == 2) {
                    // SUPORTE entra diretamente na fila de chamados.
                    window.location = "./lista-chamados.html";
                } else {
                    // USER entra no dashboard comum.
                    window.location = "./dashboard.html";
                }
            }, 2000);
            return
        }else{
            // Registra no console a resposta recusada para ajudar no diagnóstico.
            console.log("Erro ao logar", await resposta)
        }
    }
    // Campos vazios e credenciais inválidas terminam no mesmo aviso visual.
    fimAguardar();
    erro("1000", "Erro", "Usuário e/ou Senha incorretos")
}


function erro(tempo, titulo, texto) {
    // Preenche o conteúdo do aviso reutilizado pela tela de login.
    document.getElementById('titulo').innerHTML = titulo
    document.getElementById('spnErro').innerHTML = texto

    // Torna o aviso visível pelo período recebido em milissegundos.
    document.getElementById('divFundoErro').style.display = 'flex'
    setTimeout(() => {
        document.getElementById('divFundoErro').style.display = 'none'
    }, tempo);
    return
}
