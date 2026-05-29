let graficoBarras;
let graficoMusicas;
let graficoRadar;
let graficoHistograma;

let artistasFiltrados = [];

async function iniciarDashboard() {

    //validarSessao();

    inicializarGraficos();

    await carregarFiltros();

    await filtrarDashboard();
}

async function carregarFiltros() {
    const resposta = await fetch('/dashboard/artistas');
    const artistas = await resposta.json();
    const generos = [
        ...new Set(
            artistas.map(artista => artista.genero)
        )
    ];

    selectGenero.innerHTML =
        `<option value="">Selecionar</option>`;
    generos.forEach(genero => {
        selectGenero.innerHTML += `
            <option value="${genero}">
                ${genero}
            </option>
        `;
    });
    const paises = [
        ...new Set(
            artistas.map(artista => artista.pais)
        )
    ];
    selectPais.innerHTML =
        `<option value="">Selecionar</option>`;
    paises.forEach(pais => {
        selectPais.innerHTML += `
            <option value="${pais}">
                ${pais}
            </option>
        `;
    });
}

async function filtrarDashboard() {

    const genero = selectGenero.value;
    const pais = selectPais.value;
    const popularidade = selectPopularidade.value;

    const resposta = await fetch(
        `/dashboard/artistas?genero=${genero}&pais=${pais}&popularidade=${popularidade}`
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

    // GRAFICO MUSICAS ------------------------------------------------------------------------
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
    // HISTOGRAMA ------------------------------------------------------------------------
    graficoHistograma = new Chart(
        document.getElementById('graficoHistograma'),
        {
            type: 'bar',
            data: {
                labels: [
                    '0-25',
                    '26-50',
                    '51-75',
                    '76-100'
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

    // GRAFICO RADAR
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
    graficoBarras.data.labels =
        artistasFiltrados.map(
            artista => artista.nome
        );
    const maiorStream = Math.max(
        ...artistasFiltrados.map(
            artista => artista.streams
        )
    );
    graficoBarras.data.datasets[0].data =
        artistasFiltrados.map(
            artista =>
                Math.round(
                    (artista.streams / maiorStream) * 100
                )
        );
    graficoBarras.data.datasets[1].data =
        artistasFiltrados.map(
            artista => artista.popularidade
        );
    graficoBarras.update();
}

async function atualizarGraficoMusicas() {

    const ids = artistasFiltrados
        .map(artista => artista.id_artista)
        .join(',');

    const resposta = await fetch(
        `/dashboard/top-musicas-artistas?ids=${ids}`
    );

    const musicas = await resposta.json();

    // labels do eixo Y
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

    // cria 5 datasets (Top 1, Top 2, Top 3...)
    for (let posicao = 0; posicao < 5; posicao++) {

        let dados = [];
        let nomesMusicas = [];

        artistasFiltrados.forEach(artista => {

            const musicasArtista = musicas
                .filter(
                    musica =>
                        musica.id_artista == artista.id_artista
                )
                .sort(
                    (a, b) =>
                        b.contagem_streams - a.contagem_streams
                );

            const musica = musicasArtista[posicao];

            if (musica) {

                dados.push(
                    Math.round(
                        musica.contagem_streams / 1000000
                    )
                );

                nomesMusicas.push(
                    musica.titulo_musica
                );

            } else {

                dados.push(0);

                nomesMusicas.push('Sem música');
            }
        });

        datasets.push({

            label: `Top ${posicao + 1}`,

            data: dados,

            nomesMusicas: nomesMusicas,

            backgroundColor: cores[posicao],

            borderRadius: 5,

            barThickness: 10
        });
    }

    graficoMusicas.data.datasets = datasets;

    graficoMusicas.options.plugins.tooltip = {

        callbacks: {

            label: function(context) {

                const nomeMusica =
                    context.dataset.nomesMusicas[
                        context.dataIndex
                    ];

                const streams =
                    context.raw;

                return `
${nomeMusica} - ${streams}M streams
                `;
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

    nomeArtistaSelecionado.innerHTML =
        artista.nome;

    kpiGenero.innerHTML =
        artista.genero;

    kpiStreams.innerHTML =
        Number(
            artista.streams
        ).toLocaleString('pt-BR');

    kpiPopularidade.innerHTML =
        artista.popularidade;

    kpiLancamentos.innerHTML =
        artista.lancamentos || 0;

    crescimentoStreams.innerHTML = "0%";
    crescimentoPopularidade.innerHTML = "0%";

    atualizarRadar(artista);
    await atualizarHistograma(idArtista);
}

function atualizarRadar(artista) {

    graficoRadar.data.datasets = [

        {
            label: artista.nome,

            data: [
                artista.dancabilidade,
                artista.energia,
                artista.valence || 50,
                artista.acousticness || 50
            ],

            borderColor: '#FF6D03',

            backgroundColor:
                'rgba(255,109,3,0.2)',

            pointBackgroundColor: '#FF6D03',

            pointBorderColor: '#FF6D03',

            pointRadius: 4,

            borderWidth: 2
        },

        {
            label: 'Perfil musical da casa',

            data: [70, 85, 60, 80],

            borderColor: '#FF16B9',

            backgroundColor:
                'rgba(255,22,185,0.2)',

            pointBackgroundColor: '#FF16B9',

            pointBorderColor: '#FF16B9',

            pointRadius: 4,

            borderWidth: 2
        }
    ];

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

        else if (item.faixa == '51-75') {
            dados[2] = item.quantidade;
        }

        else if (item.faixa == '76-100') {
            dados[3] = item.quantidade;
        }
    });

    graficoHistograma.data.datasets[0].data =
        dados;
    graficoHistograma.update();
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