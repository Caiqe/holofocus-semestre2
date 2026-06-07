// Guarda os dados carregados para renderizar e editar sem nova busca desnecessária.
const eventosState = { lista: [], atual: null, artistas: [], generos: [] };
// Lê da sessão o ID da empresa usado nas rotas de evento.
const empresaEvento = () => sessionStorage.EMPRESA;

// Centraliza o fetch e transforma respostas de erro em exceções legíveis.
async function apiEvento(url, options) {
    // Executa a rota e o método recebidos.
    const response = await fetch(url, options);
    // Tenta converter a resposta em JSON; usa objeto vazio quando não houver corpo.
    const body = await response.json().catch(() => ({}));
    // Interrompe o fluxo quando o backend retorna status de erro.
    if (!response.ok) throw new Error(body.mensagem || "Erro na operação");
    // Devolve o JSON para a função que chamou a API.
    return body;
}

function options(select, itens, value, label) {
    // Usa os IDs reais retornados pelo banco como value de cada option.
    // Começa sempre com a opção neutra de seleção.
    select.innerHTML = '<option value="">Selecionar</option>' +
        // Transforma cada registro do banco em uma option.
        itens.map(item => `<option value="${item[value]}">${item[label]}</option>`).join("");
}

async function carregarOpcoesEvento() {
    // Artistas e gêneros vêm de tabelas diferentes e alimentam os dois formulários.
    // Busca os artistas cadastrados.
    eventosState.artistas = await apiEvento("/eventos/artistas");
    // Reutiliza a rota existente que lista gêneros.
    eventosState.generos = await apiEvento("/PF/buscar");
    // Preenche os selects de artista do cadastro e da edição.
    ["evento-artista", "editar-evento-artista"].forEach(id =>
        options(document.getElementById(id), eventosState.artistas, "id_artista", "artista_nome"));
    // Preenche os selects de gênero do cadastro e da edição.
    ["evento-genero", "editar-evento-genero"].forEach(id =>
        options(document.getElementById(id), eventosState.generos, "id_genero", "titulo_genero"));
}

function renderEventos(lista = eventosState.lista) {
    const corpo = document.getElementById("corpo-eventos");
    const nivelAcesso = sessionStorage.NIVEL_ACESSO;

    corpo.innerHTML = lista.length ? lista.map(item => `
        <tr><td>${item.nome_evento}</td><td>${item.total_pessoas || 0}</td>
        <td>${new Date(item.data_evento).toLocaleDateString("pt-BR")}</td>
        <td>
            ${nivelAcesso === "1"
                ? `<button class="edit" onclick="abrirEdicaoEvento(${item.id_evento})"><img src="assets/imgs/IconLapis.png" alt=""> Editar</button>`
                : `<button class="edit" onclick="abrirEdicaoEvento(${item.id_evento})">Visualizar</button>`
            }
        </td></tr>
    `).join("") : '<tr><td colspan="4">Nenhum evento cadastrado.</td></tr>';
}

async function carregarEventos() {
    // Consulta somente os eventos vinculados à empresa da sessão.
    eventosState.lista = await apiEvento(`/eventos/listar/${empresaEvento()}`);
    // Renderiza a lista atualizada.
    renderEventos();
}

function lerEvento(prefix = "") {
    // O prefixo permite reutilizar a leitura nos formulários de cadastro e edição.
    return {
        // Lê e limpa espaços do nome.
        nomeEvento: document.getElementById(`${prefix}evento-nome`).value.trim(),
        // Lê a data no formato enviado pelo input date.
        dataEvento: document.getElementById(`${prefix}evento-data`).value,
        // Converte investimento para número e usa zero quando vazio.
        investimento: Number(document.getElementById(`${prefix}evento-investimento`).value || 0),
        // Converte retorno para número e usa zero quando vazio.
        retorno: Number(document.getElementById(`${prefix}evento-retorno`).value || 0),
        // Converte público para número e usa zero quando vazio.
        totalPessoas: Number(document.getElementById(`${prefix}evento-publico`).value || 0),
        // Vincula o evento à empresa logada.
        idEmpresa: Number(empresaEvento()),
        // Converte o ID selecionado do artista.
        idArtista: Number(document.getElementById(`${prefix}evento-artista`).value),
        // Converte o ID selecionado do gênero.
        idGenero: Number(document.getElementById(`${prefix}evento-genero`).value)
    };
}

async function abrirEdicaoEvento(id) {
    // Busca o registro completo antes de preencher o modal.
    // Salva o evento escolhido como estado atual.
    const item = eventosState.atual = await apiEvento(`/eventos/${id}`);
    // Preenche cada campo com o valor retornado pelo banco.
    document.getElementById("editar-evento-nome").value = item.nome_evento;
    // Retira hora e fuso para manter somente YYYY-MM-DD.
    document.getElementById("editar-evento-data").value = String(item.data_evento).slice(0, 10);
    document.getElementById("editar-evento-investimento").value = item.investimento_evento || 0;
    document.getElementById("editar-evento-retorno").value = item.retorno_evento || 0;
    document.getElementById("editar-evento-publico").value = item.total_pessoas || 0;
    document.getElementById("editar-evento-artista").value = item.fk_artista;
    document.getElementById("editar-evento-genero").value = item.fk_genero;
    // Exibe o modal já preenchido.
    abrirModal("editar");
}

document.getElementById("form-cadastrar-evento").addEventListener("submit", async event => {
    // Impede o envio tradicional do formulário.
    event.preventDefault();
    // Envia os dados lidos para o endpoint de cadastro.
    await apiEvento("/eventos", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(lerEvento()) });
    // Limpa os campos depois do cadastro.
    event.target.reset(); fecharModal("cadastrar"); await carregarEventos();
});
document.getElementById("form-editar-evento").addEventListener("submit", async event => {
    // Impede recarregar a página.
    event.preventDefault();
    // Envia os dados do formulário de edição para o evento selecionado.
    await apiEvento(`/eventos/${eventosState.atual.id_evento}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(lerEvento("editar-")) });
    // Fecha o modal e busca novamente os dados do banco.
    fecharModal("editar"); await carregarEventos();
});
document.getElementById("excluir-evento").addEventListener("click", async () => {
    // Envia ID do evento e empresa para a exclusão protegida.
    await apiEvento(`/eventos/${eventosState.atual.id_evento}?idEmpresa=${empresaEvento()}`, { method: "DELETE" });
    // Fecha o modal e recarrega a lista.
    fecharModal("editar"); await carregarEventos();
});
document.getElementById("pesquisa-evento").addEventListener("input", event =>
    // A pesquisa filtra localmente a lista que já veio do banco.
    // Compara o nome em letras minúsculas com o texto digitado.
    renderEventos(eventosState.lista.filter(item => item.nome_evento.toLowerCase().includes(event.target.value.toLowerCase()))));

async function iniciarEventos() {
    // Primeiro prepara os selects e depois carrega a tabela.
    await carregarOpcoesEvento();
    // Só carrega a lista depois que os formulários estiverem preparados.
    await carregarEventos();
}

// Inicia o módulo assim que o script é carregado.
iniciarEventos().catch(error => {
    // Mostra na própria tabela qualquer erro de inicialização.
    document.getElementById("corpo-eventos").innerHTML = `<tr><td colspan="4">${error.message}</td></tr>`;
});
