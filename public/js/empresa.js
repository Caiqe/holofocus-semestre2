// Guarda as empresas carregadas e a empresa aberta no modal.
const empresasState = { lista: [], atual: null };

async function apiEmpresa(url, options) {
    // Executa a rota recebida.
    const response = await fetch(url, options);
    // Lê o JSON retornado.
    const body = await response.json().catch(() => ({}));
    // Interrompe quando o backend retorna erro.
    if (!response.ok) throw new Error(body.mensagem || "Erro na operação");
    // Retorna os dados processados.
    return body;
}

// Exibe os contadores de usuários e eventos calculados pelo backend.
function renderEmpresas(lista = empresasState.lista) {
    // Atualiza o corpo da tabela.
    document.getElementById("corpo-empresas").innerHTML = lista.length ?
        // Transforma cada empresa em uma linha.
        lista.map(empresa => `
            <tr>
                <td>${empresa.razao_social}</td>
                <td>${empresa.total_usuarios}</td>
                <td>${empresa.total_eventos}</td>
                <td>
                    <button class="edit" onclick="abrirEdicaoEmpresa(${empresa.id_empresa})">
                        <img src="assets/imgs/IconLapis.png" alt=""> Editar
                    </button>
                </td>
            </tr>
        `).join("") :
        '<tr><td colspan="4">Nenhuma empresa cadastrada.</td></tr>';
}

async function carregarEmpresas() {
    // Solicita a lista completa ao backend.
    empresasState.lista = await apiEmpresa("/empresas/listar");
    // Exibe os registros recebidos.
    renderEmpresas();
}

// Preenche empresa e endereço no mesmo modal, embora sejam tabelas diferentes.
function abrirEdicaoEmpresa(id) {
    // Localiza a empresa escolhida.
    const empresa = empresasState.lista.find(item => item.id_empresa === id);
    // Guarda a empresa para editar ou excluir.
    empresasState.atual = empresa;

    // Preenche dados da empresa.
    document.getElementById("empresa-razao").value = empresa.razao_social;
    document.getElementById("empresa-cnpj").value = empresa.cnpj;
    document.getElementById("empresa-lotacao").value = empresa.lotacao || 0;
    // Preenche dados do endereço.
    document.getElementById("empresa-logradouro").value = empresa.logradouro;
    document.getElementById("empresa-cep").value = empresa.cep;
    document.getElementById("empresa-numero").value = empresa.numero;
    document.getElementById("empresa-complemento").value = empresa.complemento || "";
    // Abre o modal preenchido.
    abrirModal("editar");
}

document.getElementById("form-editar-empresa").addEventListener("submit", async event => {
    // Impede o envio tradicional.
    event.preventDefault();
    // Recupera a empresa selecionada.
    const empresa = empresasState.atual;

    // Primeiro atualiza a tabela empresa.
    await apiEmpresa(`/empresas/${empresa.id_empresa}`, {
        // Atualiza o registro existente.
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            // Lê e normaliza cada campo da empresa.
            razaoSocial: document.getElementById("empresa-razao").value.trim(),
            cnpj: document.getElementById("empresa-cnpj").value.replace(/\D/g, ""),
            lotacao: Number(document.getElementById("empresa-lotacao").value || 0)
        })
    });

    // Depois atualiza o endereço vinculado.
    await apiEmpresa(`/empresas/enderecos/${empresa.fk_endereco}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            // Lê e normaliza cada campo do endereço.
            cep: document.getElementById("empresa-cep").value.replace(/\D/g, ""),
            logradouro: document.getElementById("empresa-logradouro").value.trim(),
            numero: document.getElementById("empresa-numero").value.trim(),
            complemento: document.getElementById("empresa-complemento").value.trim()
        })
    });

    // Fecha o modal e recarrega os dados.
    fecharModal("editar");
    await carregarEmpresas();
});

document.getElementById("excluir-empresa").addEventListener("click", async () => {
    // Recupera a empresa selecionada.
    const empresa = empresasState.atual;

    // A empresa deve ser removida antes do endereço por causa da chave estrangeira.
    await apiEmpresa(`/empresas/deletarEmpresa/${empresa.id_empresa}`, { method: "DELETE" });
    // Remove o endereço após remover a referência da empresa.
    await apiEmpresa(`/empresas/deletarEndereco/${empresa.fk_endereco}`, { method: "DELETE" });
    // Fecha e atualiza a lista.
    fecharModal("editar");
    await carregarEmpresas();
});

// Pesquisa local sobre as empresas já retornadas pelo banco.
document.getElementById("pesquisa-empresa").addEventListener("input", event => {
    // Filtra pelo nome sem diferenciar letras maiúsculas.
    renderEmpresas(empresasState.lista.filter(empresa =>
        empresa.razao_social.toLowerCase().includes(event.target.value.toLowerCase())
    ));
});

carregarEmpresas().catch(error => {
    // Exibe o erro no corpo da tabela.
    document.getElementById("corpo-empresas").innerHTML =
        `<tr><td colspan="4">${error.message}</td></tr>`;
});
