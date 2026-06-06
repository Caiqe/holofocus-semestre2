// Estado local usado para renderizar e editar usuários da empresa logada.
const usuariosState = { lista: [], atual: null };
// Retorna a empresa salva no login.
const empresaUsuario = () => sessionStorage.EMPRESA;

async function apiUsuario(url, options) {
    // Executa a chamada recebida.
    const response = await fetch(url, options);
    // Converte a resposta em JSON.
    const body = await response.json().catch(() => ({}));
    // Interrompe quando o backend retorna erro.
    if (!response.ok) throw new Error(body.mensagem || "Erro na operação");
    // Retorna os dados processados.
    return body;
}

// Preenche os selects com os mesmos códigos de nível usados no banco.
async function carregarNiveis() {
    // Busca os níveis disponíveis.
    const niveis = await apiUsuario("/usuarios/niveis");
    // Converte cada nível em uma opção.
    const html = '<option value="">Selecionar</option>' +
        niveis.map(nivel =>
            `<option value="${nivel.id_nivel_acesso}">${nivel.tipo_acesso}</option>`
        ).join("");

    // Preenche cadastro e edição com as mesmas opções.
    document.getElementById("usuario-nivel").innerHTML = html;
    document.getElementById("editar-usuario-nivel").innerHTML = html;
}

function renderUsuarios(lista = usuariosState.lista) {
    // Traduz os números armazenados no banco.
    const nomesNiveis = { 1: "GESTOR", 2: "SUPORTE", 3: "USER" };
    // Atualiza a tabela.
    document.getElementById("corpo-usuarios").innerHTML = lista.length ?
        // Transforma cada usuário em uma linha.
        lista.map(usuario => `
            <tr>
                <td>${usuario.nome}</td>
                <td>${usuario.telefone}</td>
                <td>${usuario.email}</td>
                <td>${nomesNiveis[usuario.fk_nivel_acesso]}</td>
                <td>
                    <button class="edit" onclick="abrirEdicaoUsuario(${usuario.id_usuario})">
                        <img src="assets/imgs/IconLapis.png" alt=""> Editar
                    </button>
                </td>
            </tr>
        `).join("") :
        '<tr><td colspan="5">Nenhum usuário cadastrado.</td></tr>';
}

// O backend filtra a consulta pela empresa armazenada na sessão.
async function carregarUsuarios() {
    // Consulta usuários da empresa da sessão.
    usuariosState.lista = await apiUsuario(`/usuarios/listar/${empresaUsuario()}`);
    // Exibe os usuários encontrados.
    renderUsuarios();
}

function abrirEdicaoUsuario(id) {
    // Localiza o usuário escolhido.
    const usuario = usuariosState.lista.find(item => item.id_usuario === id);
    // Guarda o usuário para editar ou excluir.
    usuariosState.atual = usuario;

    // Preenche os campos do modal.
    document.getElementById("editar-usuario-nome").value = usuario.nome;
    document.getElementById("editar-usuario-email").value = usuario.email;
    document.getElementById("editar-usuario-telefone").value = usuario.telefone;
    document.getElementById("editar-usuario-nivel").value = usuario.fk_nivel_acesso;
    // Abre o modal preenchido.
    abrirModal("editar");
}

document.getElementById("form-cadastrar-usuario").addEventListener("submit", async event => {
    // Impede o envio tradicional.
    event.preventDefault();

    if (document.getElementById("usuario-senha").value !==
        document.getElementById("usuario-confirmar").value) {
        alert("As senhas não conferem");
        return;
    }

    await apiUsuario("/usuarios/cadastrar", {
        // Cria um novo usuário.
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            // Mantém os nomes esperados pelo cadastro original.
            nomeServer: document.getElementById("usuario-nome").value.trim(),
            emailServer: document.getElementById("usuario-email").value.trim(),
            telefoneServer: document.getElementById("usuario-telefone").value.replace(/\D/g, ""),
            senhaServer: document.getElementById("usuario-senha").value,
            idEmpresaServer: empresaUsuario(),
            nivelAcessoServer: Number(document.getElementById("usuario-nivel").value)
        })
    });

    // Limpa, fecha e atualiza a lista.
    event.target.reset();
    fecharModal("cadastrar");
    await carregarUsuarios();
});

document.getElementById("form-editar-usuario").addEventListener("submit", async event => {
    // Impede o envio tradicional.
    event.preventDefault();

    // Atualiza o usuário selecionado.
    await apiUsuario(`/usuarios/${usuariosState.atual.id_usuario}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            // Lê os valores atuais do modal.
            nome: document.getElementById("editar-usuario-nome").value.trim(),
            email: document.getElementById("editar-usuario-email").value.trim(),
            telefone: document.getElementById("editar-usuario-telefone").value.replace(/\D/g, ""),
            nivelAcesso: Number(document.getElementById("editar-usuario-nivel").value),
            idEmpresa: Number(empresaUsuario())
        })
    });

    // Fecha o modal e recarrega a lista.
    fecharModal("editar");
    await carregarUsuarios();
});

document.getElementById("excluir-usuario").addEventListener("click", async () => {
    // usuarioLogado permite ao backend impedir a exclusão da própria conta.
    await apiUsuario(
        `/usuarios/${usuariosState.atual.id_usuario}?idEmpresa=${empresaUsuario()}&usuarioLogado=${sessionStorage.ID_USUARIO}`,
        { method: "DELETE" }
    );
    // Fecha o modal e atualiza a lista.
    fecharModal("editar");
    await carregarUsuarios();
});

// Pesquisa local; não consulta o banco novamente a cada caractere.
document.getElementById("pesquisa-usuario").addEventListener("input", event => {
    // Compara o nome com o texto pesquisado.
    renderUsuarios(usuariosState.lista.filter(usuario =>
        usuario.nome.toLowerCase().includes(event.target.value.toLowerCase())
    ));
});

async function iniciarUsuarios() {
    // Prepara os níveis primeiro.
    await carregarNiveis();
    // Carrega os usuários depois.
    await carregarUsuarios();
}

// Inicia o módulo.
iniciarUsuarios().catch(error => {
    // Mostra falhas de inicialização na tabela.
    document.getElementById("corpo-usuarios").innerHTML =
        `<tr><td colspan="5">${error.message}</td></tr>`;
});
