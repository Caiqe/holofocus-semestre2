// ─── Listar Usuários da Empresa ───────────────────────────────────────────────

document.addEventListener("DOMContentLoaded", function () {
    carregarUsuarios();
});

async function carregarUsuarios() {
    const empresaId = sessionStorage.EMPRESA;

    if (!empresaId) {
        console.error("ID da empresa não encontrado no sessionStorage.");
        alert("Sessão inválida. Faça login novamente.");
        window.location.href = "./index.html";
        return;
    }

    try {
        const resposta = await fetch(`/usuarios/listar?fkEmpresa=${empresaId}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" }
        });

        if (resposta.ok) {
            const usuarios = await resposta.json();
            preencherTabela(usuarios);
        } else if (resposta.status === 404) {
            console.warn("Nenhum usuário encontrado para esta empresa.");
            preencherTabela([]);
        } else {
            const erro = await resposta.text();
            console.error("Erro ao listar usuários:", erro);
            alert("Erro ao carregar usuários. Tente novamente.");
        }

    } catch (erro) {
        console.error("Falha na requisição:", erro);
        alert("Não foi possível conectar ao servidor.");
    }
}

function preencherTabela(usuarios) {
    const tbody = document.getElementById("tbodyUsuarios");
    tbody.innerHTML = "";

    if (usuarios.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="4" style="text-align: center; padding: 20px;">
                    Nenhum usuário cadastrado.
                </td>
            </tr>`;
        return;
    }

    usuarios.forEach(function (usuario) {
        const tr = document.createElement("tr");

        tr.innerHTML = `
    <td>${usuario.nome}</td>
    <td>${usuario.telefone ?? "—"}</td>
    <td>${usuario.email}</td>
    <td>
        <button style="background-color:#EFD38D; padding: 6px 14px; border-radius: 8px; border: none; display: inline-flex; align-items: center; gap: 6px; cursor: pointer; font-size: 14px; font-weight: 500;" class="btn-editar" onclick="abrirModal('editar')" title="Editar usuário">
            <img src="./assets/imgs/IconLapis.png" alt="Editar" style="width: 16px; height: 16px;">
            Editar
        </button>
    </td>`;

        tbody.appendChild(tr);
    });
}