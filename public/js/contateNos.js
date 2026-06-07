// Liga o envio do formulário à função que grava o contato no banco.
document.getElementById("form-contato").addEventListener("submit", enviar);

async function enviar(event) {
    // Impede o recarregamento da página e envia o formulário por fetch.
    event.preventDefault();
    // Monta o corpo com os mesmos nomes esperados pelo suporteController.
    const dados = {
        // trim remove espaços acidentais no começo e no fim dos textos.
        nomeServer: document.getElementById("inptNome").value.trim(),
        emailServer: document.getElementById("inptEmail").value.trim(),
        // O banco recebe somente os dígitos do telefone, sem máscara.
        telefoneServer: document.getElementById("inptTelefone").value.replace(/\D/g, ""),
        assuntoServer: document.getElementById("inptAssunto").value.trim(),
        mensagemServer: document.getElementById("inptMensagem").value.trim()
    };
    // Impede uma requisição incompleta antes de consultar o backend.
    if (!dados.nomeServer || !dados.emailServer || !dados.assuntoServer || !dados.mensagemServer) {
        alert("Preencha os campos obrigatórios.");
        return;
    }
    // Aceita telefone vazio ou os formatos nacionais com 10 e 11 dígitos.
    if (dados.telefoneServer && ![10, 11].includes(dados.telefoneServer.length)) {
        alert("Informe um telefone válido.");
        return;
    }
    // A rota grava os dados na tabela lead_contato.
    const resposta = await fetch("/suportes/contatar", {
        // POST cria um novo registro de contato.
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Serializa os dados para o express.json conseguir interpretá-los.
        body: JSON.stringify(dados)
    });
    // Qualquer resposta fora da faixa de sucesso mantém o formulário preenchido.
    if (!resposta.ok) {
        // Se não houver JSON válido, usa um objeto vazio e mantém a mensagem padrão.
        const erro = await resposta.json().catch(() => ({}));
        alert(erro.mensagem || "Não foi possível enviar a mensagem.");
        return;
    }
    // Limpa o formulário somente depois da confirmação do backend.
    event.target.reset();
    alert("Contato enviado com sucesso.");
}
