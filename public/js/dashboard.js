let graficoBarras;
let graficoMusicas;
let graficoRadar;
let graficoHistograma;

let artistasFiltrados = [];

async function iniciarDashboard() {
    validarSessao();
    inicializarGraficos();
    await carregarFiltros();
    await filtrarDashboard();
}

async function carregarFiltros() {
    const empresa = sessionStorage.EMPRESA || "";
    const parametros = new URLSearchParams({
        empresa
    });

    const resposta = await fetch(`/dashboard/filtros?${parametros.toString()}`);
    const dados = await resposta.json();

    selectGenero.innerHTML =
        `<option value="">Selecionar</option>`;

    dados.generos.forEach(genero => {
        selectGenero.innerHTML += `
            <option value="${genero.genero}">
                ${genero.genero}
            </option>
        `;
    });

    selectPais.innerHTML =
        `<option value="">Selecionar</option>`;

    dados.paises.forEach(pais => {
        selectPais.innerHTML += `
            <option value="${pais.pais}">
                ${pais.pais}
            </option>
        `;
    });

    selectPerfilSonoro.innerHTML =
        '<option value="">Selecionar</option>';

    dados.perfis.forEach(item => {
        selectPerfilSonoro.innerHTML += `
            <option value="${item.id_perfil}">
                ${item.nome}
                (${item.perfil})
            </option>
        `;
    });

    const perfilRegistrado = sessionStorage.PERFIL || "";

    const perfilRegistradoExiste = dados.perfis.some(
        item => String(item.id_perfil) === String(perfilRegistrado)
    );

    if (perfilRegistradoExiste) {
        selectPerfilSonoro.value = perfilRegistrado;
    } else if (dados.perfis.length > 0) {
        selectPerfilSonoro.value = dados.perfis[0].id_perfil;
    }
}

async function filtrarDashboard() {
    const genero = selectGenero.value;
    const pais = selectPais.value;
    const popularidade = selectPopularidade.value;
    let perfilSonoro = selectPerfilSonoro.value;

    if (perfilSonoro == "" && selectPerfilSonoro.options.length > 1) {
        perfilSonoro = selectPerfilSonoro.options[1].value;
        selectPerfilSonoro.value = perfilSonoro;
    }

    const empresa = sessionStorage.EMPRESA || "";

    const parametros = new URLSearchParams({
        genero,
        pais,
        popularidade,
        perfil: perfilSonoro,
        empresa
    });

    const resposta = await fetch(
        `/dashboard/artistas?${parametros.toString()}`
    );

    artistasFiltrados = await resposta.json();

    atualizarGraficoBarras();
    atualizarGraficoMusicas();
    carregarListaArtistas();

    if (artistasFiltrados.length > 0) {
        const primeiroArtista =
            artistasFiltrados[0];
        await selecionarArtista(
            primeiroArtista.id_artista
        );
    } else {
        limparDashboard();
    }
}

function inicializarGraficos() {
    // GRAFICO BARRAS ------------------------------------------------------------------------
    graficoBarras = new Chart(
        document.getElementById('graficoBarras'),
        {
            type: 'bar',
            data: {
                labels: [],
                datasets: [
                    {
                        label: 'Streams',
                        data: [],
                        backgroundColor: '#FF7300',
                        borderRadius: 5,
                        barPercentage: 1,
                        categoryPercentage: 0.7
                    },
                    {
                        label: 'Popularidade',
                        data: [],
                        backgroundColor: '#FF00B8',
                        borderRadius: 5,
                        barPercentage: 1,
                        categoryPercentage: 0.7
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                        align: 'start',
                        labels: {
                            color: '#DA9EF7',
                            boxWidth: 14,
                            boxHeight: 14,
                            padding: 20,
                            font: {
                                size: 14
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        ticks: {
                            color: '#DA9EF7',
                            font: {
                                size: 14
                            }
                        },
                        grid: {
                            color: '#413F3F',
                            borderDash: [5, 5]
                        }
                    },
                    x: {
                        ticks: {
                            color: '#DA9EF7'
                        },
                        grid: {
                            display: false
                        }
                    }
                }
            }
        }
    );

    // GRAFICO MUSICAS ----------------------------------------------------------------------------------------
    graficoMusicas = new Chart(
        document.getElementById('graficoMusicas'),
        {
            type: 'bar',
            data: {
                labels: [],
                datasets: []
            },
            options: {
                indexAxis: 'y',
                maintainAspectRatio: false,
                responsive: true,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: function (context) {
                                const artista =
                                    context.dataset.artista[
                                    context.dataIndex
                                    ];
                                return `${artista} - ${context.raw}M streams`;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        display: false,
                        grid: {
                            display: false
                        }
                    },
                    y: {
                        ticks: {
                            color: '#D9A8FF',
                            font: {
                                size: 12
                            }
                        },
                        grid: {
                            display: false
                        }
                    }
                }
            }
        }
    );
    // HISTOGRAMA ------------------------------------------------------------------------------------------
    graficoHistograma = new Chart(
        document.getElementById('graficoHistograma'),
        {
            type: 'bar',
            data: {
                labels: [
                    '0-25',
                    '26-50',
                    '51-70',
                    '71-100'
                ],
                datasets: [
                    {
                        type: 'bar',
                        label: 'Quantidade de músicas',
                        data: [0, 0, 0, 0],
                        backgroundColor: [
                            '#FF00B8',
                            '#FF6D03',
                            '#97B7A2',
                            '#B587D1'
                        ],
                        borderRadius: 4,
                        barPercentage: 1,
                        categoryPercentage: 0.9
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    x: {
                        ticks: {
                            color: '#D8B4FE',
                            font: {
                                size: 11
                            }
                        },
                        grid: {
                            display: false
                        }
                    },
                    y: {
                        ticks: {
                            display: false
                        }
                    }
                }
            }
        }
    );
    graficoRadar = new Chart(
        document.getElementById('graficoRadar'),
        {
            type: 'radar',
            data: {
                labels: [
                    'Danceabilidade',
                    'Energia',
                    'Valence',
                    'Acousticness'
                ],
                datasets: []
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                        align: 'start',
                        labels: {
                            color: '#D8B4FE',
                            boxWidth: 12,
                            boxHeight: 12,
                            padding: 15,
                            font: {
                                size: 12
                            }
                        }
                    }
                },
                scales: {
                    r: {
                        min: 0,
                        max: 100,
                        ticks: {
                            display: false
                        },
                        grid: {
                            color: '#6D5A7E'
                        },
                        angleLines: {
                            color: '#6D5A7E'
                        },
                        pointLabels: {
                            color: '#D8B4FE',
                            font: {
                                size: 12
                            }
                        }
                    }
                }
            }
        }
    );
}

function atualizarGraficoBarras() {
    if (artistasFiltrados.length == 0) {
        graficoBarras.data.labels = [];
        graficoBarras.data.datasets[0].data = [];
        graficoBarras.data.datasets[1].data = [];
        graficoBarras.update();
        return;
    }
    graficoBarras.data.labels =
        artistasFiltrados.map(
            artista => artista.nome
        );
    const maiorStream = Math.max(
        ...artistasFiltrados.map(
            artista => Number(artista.streams)
        )
    );
    const streamsReais =
        artistasFiltrados.map(
            artista => Number(artista.streams)
        );
    graficoBarras.data.datasets[0].data =
        artistasFiltrados.map(
            artista =>
                Math.round(
                    (Number(artista.streams) / maiorStream) * 100
                )
        );
    graficoBarras.data.datasets[0].streamsReais = streamsReais;
    graficoBarras.data.datasets[1].data =
        artistasFiltrados.map(
            artista => Number(artista.popularidade)
        );
    graficoBarras.options.plugins.tooltip = {
        callbacks: {
            label: function (context) {
                if (context.dataset.label == 'Streams') {
                    const streams =
                        context.dataset.streamsReais[
                        context.dataIndex
                        ];
                    return `Streams: ${Number(streams).toLocaleString('pt-BR')}`;
                }
                if (context.dataset.label == 'Popularidade') {
                    return `Popularidade: ${context.raw}`;
                }
                return `${context.dataset.label} - ${context.raw}`;
            }
        }
    };

    graficoBarras.update();
}

async function atualizarGraficoMusicas() {
    if (artistasFiltrados.length == 0) {
        graficoMusicas.data.labels = [];
        graficoMusicas.data.datasets = [];
        graficoMusicas.update();
        return;
    }
    const ids = artistasFiltrados
        .map(artista => artista.id_artista)
        .join(',');
    const resposta = await fetch(
        `/dashboard/top-musicas-artistas?ids=${ids}`
    );

    const musicas = await resposta.json();

    graficoMusicas.data.labels =
        artistasFiltrados.map(
            artista => artista.nome
        );
    const cores = [
        '#FF6D03',
        '#FF00B8',
        '#97B7A2',
        '#B587D1',
        '#EFD38D'
    ];

    let datasets = [];

    for (let posicao = 0; posicao < 5; posicao++) {
        let dados = [];
        let nomesMusicas = [];
        let streamsReais = [];
        artistasFiltrados.forEach(artista => {
            const musicasArtista = musicas
                .filter(
                    musica =>
                        musica.id_artista == artista.id_artista
                )
                .sort(
                    (a, b) =>
                        Number(b.contagem_streams) -
                        Number(a.contagem_streams)
                );
            const maiorStreamArtista = Math.max(
                ...musicasArtista.map(
                    musica => Number(musica.contagem_streams)
                )
            );
            const musica = musicasArtista[posicao];
            if (musica) {
                const streamMusica =
                    Number(musica.contagem_streams);
                dados.push(
                    Math.max(
                        2,
                        Math.round(
                            (streamMusica / maiorStreamArtista) * 100
                        )
                    )
                );
                nomesMusicas.push(
                    musica.titulo_musica
                );
                streamsReais.push(streamMusica);
            } else {
                dados.push(0);
                nomesMusicas.push('Sem música');
                streamsReais.push(0);
            }
        });
        datasets.push({
            label: `Top ${posicao + 1}`,
            data: dados,
            nomesMusicas: nomesMusicas,
            streamsReais: streamsReais,
            backgroundColor: cores[posicao],
            borderRadius: 5,
            barThickness: 8,
            categoryPercentage: 0.55,
            barPercentage: 0.9
        });
    }

    graficoMusicas.data.datasets = datasets;

    graficoMusicas.options.plugins.tooltip = {
        callbacks: {
            label: function (context) {
                const nomeMusica =
                    context.dataset.nomesMusicas[
                    context.dataIndex
                    ];
                const streams =
                    context.dataset.streamsReais[
                    context.dataIndex
                    ];
                return ` ${nomeMusica} - ${Number(streams).toLocaleString('pt-BR')} streams`;
            }
        }
    };
    graficoMusicas.update();
}

function carregarListaArtistas() {
    listaArtistas.innerHTML = `
        <div class="top5Titulo text-[#EFD38D] text-center mt-4 font-bold h-[7%]">
            <h1>Top 5 artistas</h1>
        </div>
    `;
    artistasFiltrados.forEach(artista => {
        listaArtistas.innerHTML += `
            <label class="linha">
                <input
                    type="radio"
                    name="artista"
                    onchange="selecionarArtista(${artista.id_artista})"
                >
                <div class="radio-custom"></div>
                <span>${artista.nome}</span>
            </label>
        `;
    });
}

async function selecionarArtista(idArtista) {
    const artista =
        artistasFiltrados.find(
            a => a.id_artista == idArtista
        );

    if (!artista) {
        return;
    }

    nomeArtistaSelecionado.innerHTML = artista.nome;
    kpiGenero.innerHTML = artista.genero;

    kpiStreams.innerHTML =
        Number(
            artista.streams
        ).toLocaleString('pt-BR');

    kpiPopularidade.innerHTML = artista.popularidade;
    kpiLancamentos.innerHTML = artista.lancamentos || 0;

    await atualizarCrescimentoArtista(idArtista);

    atualizarRadar(artista);
    await atualizarHistograma(idArtista);
}

function atualizarRadar(artista) {
    let datasets = [
        {
            label: artista.nome,
            data: [
                artista.dancabilidade,
                artista.energia,
                artista.valence,
                artista.acousticness
            ],
            borderColor: '#FF6D03',
            backgroundColor: 'rgba(255,109,3,0.2)',
            pointBackgroundColor: '#FF6D03',
            pointBorderColor: '#FF6D03',
            pointRadius: 4,
            borderWidth: 2
        }
    ];

    if (
        artista.dancabilidade_alvo != null &&
        artista.energia_alvo != null &&
        artista.valence_alvo != null &&
        artista.acousticness_alvo != null
    ) {
        datasets.push({
            label: artista.nome_perfil || 'Perfil musical da casa',
            data: [
                artista.dancabilidade_alvo,
                artista.energia_alvo,
                artista.valence_alvo,
                artista.acousticness_alvo
            ],
            borderColor: '#FF16B9',
            backgroundColor: 'rgba(255,22,185,0.2)',
            pointBackgroundColor: '#FF16B9',
            pointBorderColor: '#FF16B9',
            pointRadius: 4,
            borderWidth: 2
        });
    }

    graficoRadar.data.datasets = datasets;
    graficoRadar.update();
}

async function atualizarHistograma(idArtista) {
    const resposta = await fetch(
        `/dashboard/distribuicao/${idArtista}`
    );
    const distribuicao =
        await resposta.json();
    let dados = [0, 0, 0, 0];
    distribuicao.forEach(item => {
        if (item.faixa == '0-25') {
            dados[0] = item.quantidade;
        }
        else if (item.faixa == '26-50') {
            dados[1] = item.quantidade;
        }
        else if (item.faixa == '51-70') {
            dados[2] = item.quantidade;
        }
        else if (item.faixa == '71-100') {
            dados[3] = item.quantidade;
        }
    });

    graficoHistograma.data.datasets[0].data =
        dados;
    graficoHistograma.update();
}

function calcularVariacaoNormalizada(valorAtual, valorAnterior) {
    const atual = Number(valorAtual || 0);
    const anterior = Number(valorAnterior || 0);

    if (atual == 0 && anterior == 0) {
        return 0;
    }

    const variacao = Math.round(
        ((atual - anterior) / (atual + anterior)) * 100
    );
    return Math.max(
        -50,
        Math.min(50, variacao)
    );
}

async function atualizarCrescimentoArtista(idArtista) {
    const resposta = await fetch(
        `/dashboard/crescimento/${idArtista}`
    );

    const crescimento = await resposta.json();

    const variacaoStreams =
        calcularVariacaoNormalizada(
            crescimento.streams_atual,
            crescimento.streams_anterior
        );

    const variacaoPopularidade =
        calcularVariacaoNormalizada(
            crescimento.popularidade_atual,
            crescimento.popularidade_anterior
        );

    crescimentoStreams.innerHTML = `${variacaoStreams}%`;

    crescimentoPopularidade.innerHTML = `${variacaoPopularidade}%`;
}

function limparDashboard() {
    nomeArtistaSelecionado.innerHTML = 'Nenhum artista encontrado';
    kpiGenero.innerHTML = '-';
    kpiStreams.innerHTML = '0';
    kpiPopularidade.innerHTML = '0';
    kpiLancamentos.innerHTML = '0';

    crescimentoStreams.innerHTML = '0%';
    crescimentoPopularidade.innerHTML = '0%';

    graficoBarras.data.labels = [];
    graficoBarras.data.datasets[0].data = [];
    graficoBarras.data.datasets[1].data = [];
    graficoBarras.update();

    graficoMusicas.data.labels = [];
    graficoMusicas.data.datasets = [];
    graficoMusicas.update();
    graficoHistograma.data.datasets[0].data = [0, 0, 0, 0];
    graficoHistograma.update();
    graficoRadar.data.datasets = [];
    graficoRadar.update();
}
