// Mantém localmente os perfis retornados pelo banco para listar e editar sem nova busca.
var perfisSonoros = [];
// Mantém os gêneros disponíveis para preencher os selects dos dois formulários.
var generosSonoros = [];

function buscarGeneros() {
    // Reutiliza a rota de PF que já listava os gêneros do banco.
    return fetch("/PF/buscar").then(function (resposta) {
        // Transforma a resposta HTTP na lista de registros retornada pelo model.
        return resposta.json();
    }).then(function (generos) {
        // Guarda a lista para também reutilizá-la quando o modal for aberto.
        generosSonoros = generos;
        // Cria a opção inicial que representa nenhuma seleção.
        var opcoes = '<option value="">Selecione o gênero</option>';

        for (var i = 0; i < generos.length; i++) {
            // Cada option relaciona o ID do banco ao título mostrado na tela.
            opcoes += '<option value="' + generos[i].id_genero + '">' +
                generos[i].titulo_genero + '</option>';
        }

        // Atualiza o select fixo da página com os gêneros do banco.
        document.getElementById("select__genero").innerHTML = opcoes;
    });
}

// Busca os perfis vinculados à empresa logada.
function carregarPerfisSonoros() {
    // Usa a empresa autenticada para não misturar perfis de estabelecimentos diferentes.
    return fetch("/perfis/listar/" + sessionStorage.EMPRESA)
        .then(function (resposta) {
            // Converte o JSON retornado pela rota em uma lista JavaScript.
            return resposta.json();
        }).then(function (perfis) {
            // Substitui o estado local pelos dados atuais do banco.
            perfisSonoros = perfis;
            // Reconstrói a lista e o select depois de cada consulta ou alteração.
            mostrarPerfisSonoros();
        });
}

function mostrarPerfisSonoros() {
    // Atualiza ao mesmo tempo a lista de edição e o select de preferência.
    var lista = document.getElementById("div__lista_perfis");
    var select = document.getElementById("select__perfil-sonoro");
    var html = "";
    var opcoes = '<option value="">Selecione o perfil</option>';

    for (var i = 0; i < perfisSonoros.length; i++) {
        // Facilita o uso dos campos do perfil atual na montagem do HTML.
        var perfil = perfisSonoros[i];
        // O botão envia o ID para o modal localizar o registro correto.
        html += '<div class="flex flex-col gap-1"><div class="flex justify-between">' +
            '<h3 class="font-light">' + perfil.nome + '</h3>' +
            '<button onclick="modal(' + perfil.id_perfil + ')" class="button__editar bg-black text-white font-light hover:cursor-pointer">Editar</button>' +
            '</div><hr class="w-1/1"></div>';
        // O select usa o ID do perfil como valor e o nome como identificação.
        opcoes += '<option value="' + perfil.id_perfil + '">' + perfil.nome + '</option>';
    }

    // Substitui uma lista vazia por uma mensagem compreensível.
    if (!perfisSonoros.length) {
        html = "<p>Nenhum perfil sonoro cadastrado.</p>";
    }

    // Aplica de uma vez os conteúdos montados para evitar atualizações a cada repetição.
    lista.innerHTML = html;
    select.innerHTML = opcoes;
}

// Consulta a empresa e conta os eventos diretamente no banco.
function carregarEstabelecimento() {
    // A empresa da sessão define qual resumo será consultado.
    return fetch("/empresas/estabelecimento/" + sessionStorage.EMPRESA)
        .then(function (resposta) {
            // Converte o resumo retornado pela rota em objeto JavaScript.
            return resposta.json();
        }).then(function (empresa) {
            // Usa a sigla do perfil e aceita o nome como alternativa para bancos antigos.
            document.getElementById("span__perfil_principal").innerText =
                empresa.sigla_perfil_principal || empresa.nome_perfil_principal || "Não cadastrado";
            // Mostra a razão social como identificação atual do estabelecimento.
            document.getElementById("span__tipo_estabelecimento").innerText =
                empresa.razao_social || "Não cadastrado";
            // Exibe zero quando a empresa ainda não possui eventos.
            document.getElementById("span__eventos-realizados").innerText =
                empresa.total_eventos || 0;
        });
}

function selecionarPerfilSonoro() {
    // Mostra gênero e faixa de popularidade do perfil escolhido.
    // Number normaliza o valor textual vindo do select para comparar com o ID do banco.
    var idPerfil = Number(document.getElementById("select__perfil-sonoro").value);
    // Começa sem seleção e só recebe um perfil quando o ID for encontrado.
    var perfilSelecionado = null;

    for (var i = 0; i < perfisSonoros.length; i++) {
        // Procura o objeto completo correspondente à opção escolhida.
        if (perfisSonoros[i].id_perfil == idPerfil) {
            perfilSelecionado = perfisSonoros[i];
        }
    }

    // Limpa os detalhes quando o usuário volta para a opção inicial.
    if (!perfilSelecionado) {
        document.getElementById("select__genero").value = "";
        document.getElementById("select__indice_popularidade").innerHTML =
            '<option value="">Selecione um perfil</option>';
        return;
    }

    // Seleciona o gênero relacionado ao perfil no banco.
    document.getElementById("select__genero").value = perfilSelecionado.fk_genero || "";
    // Monta uma opção informativa com os limites de popularidade cadastrados.
    document.getElementById("select__indice_popularidade").innerHTML =
        '<option>' + (perfilSelecionado.taxa_minima || 0) + '% até ' +
        (perfilSelecionado.taxa_maxima || 0) + '%</option>';
}

function modal(idPerfil) {
    // Sem ID o modal cadastra; com ID ele localiza e edita o perfil existente.
    var perfilAtual = null;

    for (var i = 0; i < perfisSonoros.length; i++) {
        // Um ID existente muda o modal do modo cadastro para o modo edição.
        if (perfisSonoros[i].id_perfil == idPerfil) {
            perfilAtual = perfisSonoros[i];
        }
    }

    // Cria o modal dinamicamente para não manter dois formulários duplicados no HTML.
    var div = document.createElement("div");
    div.id = "perfilSonoro";
    div.innerHTML =
        '<button id="btn-close" class="btn-close">X</button>' +
        '<h2>' + (perfilAtual ? "Editar" : "Cadastrar") + ' Perfil Sonoro</h2>' +
        '<label>Nome</label><input type="text" id="nomePerfil">' +
        '<label>Gênero</label><select id="generoPerfil"></select>' +
        '<label>Taxa mínima de popularidade</label><input type="number" id="taxaMin" min="0" max="100">' +
        '<label>Taxa máxima de popularidade</label><input type="number" id="taxaMax" min="0" max="100">' +
        '<label>Aspecto 1</label><select id="aspecto1"><option value="1">1</option><option value="0">0</option></select>' +
        '<label>Aspecto 2</label><select id="aspecto2"><option value="1">1</option><option value="0">0</option></select>' +
        '<label>Aspecto 3</label><select id="aspecto3"><option value="1">1</option><option value="0">0</option></select>' +
        '<label>Aspecto 4</label><select id="aspecto4"><option value="1">1</option><option value="0">0</option></select>' +
        '<label>Perfil</label><input type="text" id="siglaPerfil" maxlength="4">' +
        '<button id="btn-salvar" class="btn-salvar">SALVAR</button>' +
        (perfilAtual && perfilAtual.nome != "Principal" ?
            // O perfil Principal não recebe botão de exclusão.
            '<button id="btn-excluir" class="btn-salvar">EXCLUIR</button>' : '');

    // Insere o modal pronto no final do documento.
    document.body.appendChild(div);

    // Recria no modal as opções de gênero já carregadas do banco.
    var opcoes = '<option value="">Selecione o gênero</option>';
    for (var j = 0; j < generosSonoros.length; j++) {
        opcoes += '<option value="' + generosSonoros[j].id_genero + '">' +
            generosSonoros[j].titulo_genero + '</option>';
    }
    document.getElementById("generoPerfil").innerHTML = opcoes;

    // Na edição, os valores do banco são colocados nos campos.
    if (perfilAtual) {
        document.getElementById("nomePerfil").value = perfilAtual.nome || "";
        document.getElementById("generoPerfil").value = perfilAtual.fk_genero || "";
        document.getElementById("taxaMin").value = perfilAtual.taxa_minima || 0;
        document.getElementById("taxaMax").value = perfilAtual.taxa_maxima || 0;
        document.getElementById("aspecto1").value = perfilAtual.scoreE1 || 0;
        document.getElementById("aspecto2").value = perfilAtual.scoreE2 || 0;
        document.getElementById("aspecto3").value = perfilAtual.scoreE3 || 0;
        document.getElementById("aspecto4").value = perfilAtual.scoreE4 || 0;
        document.getElementById("siglaPerfil").value = perfilAtual.perfil || "";
    }

    document.getElementById("btn-close").onclick = function () {
        // Remove o elemento inteiro para não deixar modal oculto duplicado.
        div.remove();
    };
    document.getElementById("btn-salvar").onclick = function () {
        // Envia também o perfil localizado para decidir entre POST e PUT.
        salvarPerfilSonoro(perfilAtual, div);
    };

    // Só registra exclusão quando o botão foi realmente criado.
    if (document.getElementById("btn-excluir")) {
        document.getElementById("btn-excluir").onclick = function () {
            excluirPerfilSonoro(perfilAtual.id_perfil, div);
        };
    }
}

function salvarPerfilSonoro(perfilAtual, div) {
    // Lê os campos do modal e converte números antes de enviar.
    var dados = {
        // Relaciona novos perfis à empresa autenticada.
        idEmpresa: Number(sessionStorage.EMPRESA),
        nome: document.getElementById("nomePerfil").value,
        idGenero: Number(document.getElementById("generoPerfil").value),
        taxaMinima: Number(document.getElementById("taxaMin").value),
        taxaMaxima: Number(document.getElementById("taxaMax").value),
        scoreE1: Number(document.getElementById("aspecto1").value),
        scoreE2: Number(document.getElementById("aspecto2").value),
        scoreE3: Number(document.getElementById("aspecto3").value),
        scoreE4: Number(document.getElementById("aspecto4").value),
        perfil: document.getElementById("siglaPerfil").value
    };

    // Reutiliza as rotas que já existiam para cadastro e edição de perfil.
    // A edição precisa informar empresa e perfil para localizar um único registro.
    var rota = perfilAtual ?
        "/PF/editar?fk=" + sessionStorage.EMPRESA + "&id=" + perfilAtual.id_perfil :
        "/perfis/cadastrar";
    // Perfil encontrado usa PUT; ausência de perfil usa POST.
    var metodo = perfilAtual ? "PUT" : "POST";
    // Cada rota existente espera nomes de propriedades diferentes.
    var corpo = perfilAtual ? {
        nome: dados.nome,
        genero: dados.idGenero,
        taxa_min: dados.taxaMinima,
        taxa_max: dados.taxaMaxima,
        aspecto1: dados.scoreE1,
        aspecto2: dados.scoreE2,
        aspecto3: dados.scoreE3,
        aspecto4: dados.scoreE4,
        perfil: dados.perfil
    } : dados;

    fetch(rota, {
        method: metodo,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(corpo)
    }).then(function (resposta) {
        // Impede fechar o modal quando a gravação falhar.
        if (!resposta.ok) throw new Error("Não foi possível salvar o perfil");
        // Fecha o modal somente após a confirmação do backend.
        div.remove();
        // Consulta novamente para refletir IDs e valores realmente gravados.
        return carregarPerfisSonoros();
    }).catch(function (erro) {
        // Mostra ao usuário falhas de validação, banco ou conexão.
        alert(erro.message);
    });
}

function excluirPerfilSonoro(idPerfil, div) {
    // A proteção do perfil Principal também é aplicada no SQL.
    fetch("/perfis/" + idPerfil + "/" + sessionStorage.EMPRESA, {
        // DELETE solicita a remoção definitiva do perfil selecionado.
        method: "DELETE"
    }).then(function (resposta) {
        // Mantém o modal aberto quando o backend recusar a exclusão.
        if (!resposta.ok) throw new Error("Não foi possível excluir o perfil");
        div.remove();
        // Atualiza a tela para retirar o registro que acabou de ser excluído.
        return carregarPerfisSonoros();
    }).catch(function (erro) {
        alert(erro.message);
    });
}

function iniciarEstabelecimento() {
    // Encadeia as consultas necessárias quando a página é aberta.
    isAdm();
    buscarGeneros()
        // Depois dos gêneros, carrega o resumo da empresa.
        .then(carregarEstabelecimento)
        // Por último, carrega os perfis que dependem das opções de gênero.
        .then(carregarPerfisSonoros)
        .catch(function () {
            // Uma única mensagem cobre falhas em qualquer consulta da inicialização.
            alert("Não foi possível carregar os dados do estabelecimento");
        });
}

// Atualiza os detalhes sempre que o usuário escolhe outro perfil.
document.getElementById("select__perfil-sonoro").onchange = selecionarPerfilSonoro;
