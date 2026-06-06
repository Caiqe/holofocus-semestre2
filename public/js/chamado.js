// Mantém a lista carregada e o chamado selecionado para edição.
const chamadosState = { lista: [], atual: null };

// Executa as chamadas do módulo e apresenta a mensagem enviada pelo backend.
async function apiChamado(url, options) {
    // Executa a chamada com a rota e as opções recebidas.
    const response = await fetch(url, options);
    // Converte o corpo em JSON quando ele existir.
    const body = await response.json().catch(() => ({}));
    // Interrompe o fluxo quando o backend responder com erro.
    if (!response.ok) throw new Error(body.mensagem || "Erro na operação");
    // Devolve os dados processados.
    return body;
}

// Envia empresa, usuário e nível para o backend aplicar o filtro de visualização.
function parametrosChamado() {
    // Envia a empresa da sessão.
    return "idEmpresa=" + sessionStorage.EMPRESA +
        // Envia o usuário da sessão.
        "&idUsuario=" + sessionStorage.ID_USUARIO +
        // Envia o nível usado pelo filtro SQL.
        "&nivelAcesso=" + sessionStorage.NIVEL_ACESSO;
}

// Converte os registros recebidos em linhas da tabela.
function renderChamados(lista = chamadosState.lista) {
    // Atualiza o corpo da tabela.
    document.getElementById("corpo-chamados").innerHTML = lista.length ?
        // Converte cada chamado em uma linha.
        lista.map(c => `
            <tr>
                <td>${c.razao_social} - ${c.assunto}</td>
                <td>${new Date(c.data_abertura).toLocaleDateString("pt-BR")}</td>
                <td>${c.status_chamado.replace("_", " ")}</td>
                <td><button class="visu" onclick="abrirChamado(${c.id_chamado})">Visualizar</button></td>
            </tr>
        `).join("") :
        '<tr><td colspan="4">Nenhum chamado cadastrado.</td></tr>';
}

// Consulta novamente o backend após cada cadastro, edição ou exclusão.
async function carregarChamados() {
    // Busca os chamados permitidos para a sessão atual.
    chamadosState.lista = await apiChamado(`/chamados?${parametrosChamado()}`);
    // Exibe os registros retornados.
    renderChamados();
}

// Preenche o modal com o chamado selecionado.
function abrirChamado(id) {
    // Encontra o chamado correspondente ao botão clicado.
    const chamado = chamadosState.lista.find(item => item.id_chamado === id);
    // Guarda o registro para editar ou excluir.
    chamadosState.atual = chamado;

    // Preenche o conteúdo do modal.
    document.getElementById("visualizar-chamado-assunto").value = chamado.assunto;
    document.getElementById("visualizar-chamado-descricao").value = chamado.descricao;
    document.getElementById("visualizar-chamado-status").value = chamado.status_chamado;

    // Somente o nível SUPORTE pode alterar o status pela interface.
    document.getElementById("visualizar-chamado-status").disabled =
        sessionStorage.NIVEL_ACESSO !== "2";
    // Mostra o modal de visualização.
    abrirModal("Visualizar");
}

document.getElementById("form-cadastrar-chamado").addEventListener("submit", async event => {
    // Impede o envio tradicional.
    event.preventDefault();
    // Envia o novo chamado ao backend.
    await apiChamado("/chamados", {
        // POST cria o registro.
        method: "POST",
        // Define o formato do corpo.
        headers: { "Content-Type": "application/json" },
        // Monta os dados esperados pelo controller.
        body: JSON.stringify({
            // Lê o assunto.
            assunto: document.getElementById("chamado-assunto").value.trim(),
            // Lê a descrição.
            descricao: document.getElementById("chamado-descricao").value.trim(),
            // Vincula o usuário logado.
            idUsuario: Number(sessionStorage.ID_USUARIO),
            // Vincula a empresa logada.
            idEmpresa: Number(sessionStorage.EMPRESA)
        })
    });
    // Limpa o formulário.
    event.target.reset();
    // Fecha o modal.
    fecharModal("cadastrar");
    // Atualiza a lista.
    await carregarChamados();
});

document.getElementById("form-chamado-status").addEventListener("submit", async event => {
    // Impede o envio tradicional.
    event.preventDefault();
    // Bloqueia a operação para níveis diferentes de SUPORTE.
    if (sessionStorage.NIVEL_ACESSO !== "2") return;

    // Envia a atualização parcial.
    await apiChamado(`/chamados/${chamadosState.atual.id_chamado}/status`, {
        // PATCH altera apenas parte do registro.
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            // Lê o status escolhido.
            status: document.getElementById("visualizar-chamado-status").value,
            // Registra o suporte atual como responsável.
            idResponsavel: Number(sessionStorage.ID_USUARIO)
        })
    });
    // Fecha o modal e atualiza a lista.
    fecharModal("Visualizar");
    await carregarChamados();
});

document.getElementById("excluir-chamado").addEventListener("click", async () => {
    // Envia ID, usuário e nível para validação da exclusão.
    await apiChamado(
        `/chamados/${chamadosState.atual.id_chamado}?idUsuario=${sessionStorage.ID_USUARIO}&nivelAcesso=${sessionStorage.NIVEL_ACESSO}`,
        { method: "DELETE" }
    );
    // Fecha o modal após excluir.
    fecharModal("Visualizar");
    // Atualiza a tabela.
    await carregarChamados();
});

// Pesquisa local: não executa uma consulta nova a cada tecla.
document.getElementById("pesquisa-chamado").addEventListener("input", event => {
    // Compara o assunto com o texto pesquisado.
    renderChamados(chamadosState.lista.filter(c =>
        c.assunto.toLowerCase().includes(event.target.value.toLowerCase())
    ));
});

carregarChamados().catch(error => {
    // Exibe falhas de carregamento dentro da tabela.
    document.getElementById("corpo-chamados").innerHTML =
        `<tr><td colspan="4">${error.message}</td></tr>`;
});
