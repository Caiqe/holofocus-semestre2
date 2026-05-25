async function carregarDados() {
    await carregarGenerosSelect();    
    await carregarKpis();              
    await carregarGraficoBarras();
    await carregarGraficoLinhas();
    await carregarOportunidades();
    await carregarUltimaAtualizacao();
}

async function carregarKpis() {
    const kpi_genero     = document.getElementById('genero__popular');
    const kpi_streams    = document.getElementById('genero_streams');  
    const kpi_musica     = document.getElementById('top__musica');
    const genero_titulo  = document.getElementById('genero__titulo');
    const genero_titulo2 = document.getElementById('genero__titulo2');

    try {
        const response = await fetch('/dashboard-marketing/kpis');
        const resp     = await response.json();
        const dados    = resp[0];

        console.log(dados); 
        kpi_genero.innerHTML     = dados.genero;
        kpi_musica.innerHTML     = dados.musica_mais_ouvida;
        genero_titulo.innerHTML  = dados.genero;
        genero_titulo2.innerHTML = dados.genero;

        // formata o número de streams (ex: 4.2B, 900M, 50K)
        kpi_streams.innerHTML = formatarStreams(Number(dados.total_streams));

        // evidencia o período da consulta (ex: 2015 - 2025)
        const anoInicio = new Date(dados.data_inicio).getFullYear();
        const anoFim    = new Date(dados.data_fim).getFullYear();

        const select = document.getElementById('select__genero');
        const options = Array.from(select.options);
        const opcao   = options.find(opt => opt.textContent === dados.genero);

        if (opcao) {
            select.value = opcao.value;
            await carregarTabela(opcao.value);
        }

    } catch (erro) {
        console.log('ERRO AO CARREGAR KPIS', erro);
    }
}

function formatarStreams(valor) {
    if (valor >= 1_000_000_000) return (valor / 1_000_000_000).toFixed(1) + 'B';
    if (valor >= 1_000_000)     return (valor / 1_000_000).toFixed(1) + 'M';
    if (valor >= 1_000)         return (valor / 1_000).toFixed(1) + 'K';
    return valor.toString();
}

var graficoBarrasInstance = null;

async function carregarGraficoBarras(meses = 3) {
    try {
        const response = await fetch(`/dashboard-marketing/grafico-barras/${meses}`);
        const dados    = await response.json();

        const labels       = dados.map(row => row.titulo_genero);
        const popularidade = dados.map(row => row.media_popularidade);
        const energia      = dados.map(row => row.media_energia);      // ← novo
        const eventos      = dados.map(row => row.total_eventos);

        if (graficoBarrasInstance) {
            graficoBarrasInstance.destroy();
        }

        graficoBarrasInstance = new Chart(document.getElementById('graficoBarras'), {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [
                    {
                        type: 'bar',
                        label: 'Popularidade (%)',
                        data: popularidade,
                        backgroundColor: '#E2B8F5',
                        borderSkipped: false,
                        barPercentage: 0.5,
                        categoryPercentage: 0.5,
                        yAxisID: 'y',
                    },
                    {
                        type: 'bar',                    // ← novo dataset
                        label: 'Energia (%)',
                        data: energia,
                        backgroundColor: '#9a34c9',
                        borderSkipped: false,
                        barPercentage: 0.5,
                        categoryPercentage: 0.5,
                        yAxisID: 'y',                  // mesmo eixo que popularidade (0-100)
                    },
                    {
                        type: 'line',
                        label: 'Qtd. Eventos',
                        data: eventos,
                        borderColor: '#F0D48D',
                        backgroundColor: '#F0D48D',
                        borderWidth: 3,
                        tension: 0.4,
                        pointBackgroundColor: '#F0D48D',
                        pointHoverRadius: 8,
                        fill: false,
                        yAxisID: 'y2',
                    }
                ]
            },
            options: {
                ...chartOptions,
                scales: {
                    x: {
                        ticks: { font: { size: 18 }, color: '#ffffff' },
                        grid:  { color: '#444' }
                    },
                    y: {
                        type: 'linear',
                        position: 'left',
                        min: 0,
                        max: 100,
                        ticks: { font: { size: 14 }, color: '#E2B8F5' },
                        grid:  { color: '#666' },
                        title: {
                            display: true,
                            text: 'Popularidade / Energia (%)',  // ← título atualizado
                            color: '#E2B8F5',
                            font: { size: 18 }
                        }
                    },
                    y2: {
                        type: 'linear',
                        position: 'right',
                        min: 0,
                        ticks: { font: { size: 14 }, color: '#F0D48D' },
                        grid:  { drawOnChartArea: false },
                        title: {
                            display: true,
                            text: 'Qtd. Eventos',
                            color: '#F0D48D',
                            font: { size: 18 }
                        }
                    }
                }
            }
        });

    } catch (erro) {
        console.log('ERRO AO CARREGAR GRÁFICO DE BARRAS', erro);
    }
}


document.getElementById('select__meses').addEventListener('change', function () {
    carregarGraficoBarras(this.value);
});

async function carregarGraficoLinhas() {
    const idEmpresa = sessionStorage.getItem('EMPRESA');

    try {
        const response = await fetch(`/dashboard-marketing/grafico-linhas/${idEmpresa}`);
        const dados    = await response.json();

        const labels = dados.map(row => row.mes_label);
        const totais = dados.map(row => row.total_eventos);

        new Chart(document.getElementById('graficoLinhas'), {
            type: 'line',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Qtd. Eventos',
                        data: totais,
                        borderColor: '#F0D48D',
                        borderWidth: 3,
                        tension: 0.5,
                        pointBackgroundColor: '#E2B8F5',
                        pointBorderColor: '#E2B8F5',
                        pointHoverRadius: 8,
                        fill: false,
                    }
                ]
            },
            options: chartOptions
        });
    } catch (erro) {
        console.log('ERRO AO CARREGAR GRÁFICO DE LINHAS', erro);
    }
}

async function carregarOportunidades() {
    const insight_genero       = document.getElementById('insight__genero');
    const genero_oportunidade  = document.getElementById('genero__oportunidade');
    const insight_popularidade = document.getElementById('insight__popularidade');
    const insight_energia      = document.getElementById('insight__energia');

    try {
        const response = await fetch('/dashboard-marketing/oportunidades');
        const dados    = await response.json();

        const melhorGenero = calcularOportunidade(dados);

        insight_genero.innerHTML       = melhorGenero.genero;
        genero_oportunidade.innerHTML  = melhorGenero.genero;
        insight_popularidade.innerHTML = melhorGenero.media_popularidade + '%';
        insight_energia.innerHTML      = melhorGenero.media_energia + '%';

    } catch (erro) {
        console.log('ERRO AO CARREGAR OPORTUNIDADES', erro);
    }
}

function calcularOportunidade(generos) {
    const maxStreams  = Math.max(...generos.map(g => Number(g.total_streams)));
    const maxPop     = Math.max(...generos.map(g => Number(g.media_popularidade)));
    const maxEventos = Math.max(...generos.map(g => Number(g.total_eventos)));

    const comScore = generos.map(genero => {
        const score =
            (Number(genero.total_streams)      / maxStreams  * 0.5) +   // 50% do peso
            (Number(genero.media_popularidade) / maxPop      * 0.3) -   // 30% do peso
            (Number(genero.total_eventos)      / maxEventos  * 0.2);    // 20% de penalidade

        return { ...genero, score };
    });

    return comScore.reduce((melhor, atual) => atual.score > melhor.score ? atual : melhor);
}

async function carregarGenerosSelect() {
    const select = document.getElementById('select__genero'); // ajuste o id

    try {
        const response = await fetch('/dashboard-marketing/generos');
        const dados    = await response.json();

        // limpa opções existentes exceto o placeholder
        select.innerHTML = `<option value="#" selected disabled>Selecione um gênero</option>`;

        dados.forEach(genero => {
            const option = document.createElement('option');
            option.value       = genero.id_genero;
            option.textContent = genero.titulo_genero;
            option.style.color = 'black';
            select.appendChild(option);
        });

        // listener: carrega a tabela ao selecionar um gênero
        select.addEventListener('change', function () {
            carregarTabela(this.value);
        });

    } catch (erro) {
        console.log('ERRO AO CARREGAR GÊNEROS DO SELECT', erro);
    }
}

async function carregarTabela(id_genero) {
    try {
        const response = await fetch(`/dashboard-marketing/tabela/${id_genero}`);
        const dados    = await response.json();

        const tbody = document.getElementById('corpo__tabela');
        tbody.innerHTML = '';

        dados.forEach(musica => {
            const tr = document.createElement('tr');
            tr.classList.add('bg-[#E2B8F5]');
            tr.innerHTML = `
                <td class="border-r-2 border-white">${musica.titulo_musica}</td>
                <td class="border-r-2 border-white">${musica.artista_nome}</td>
                <td class="border-r-2 border-white">${musica.popularidade}</td>
                <td>${musica.pais}</td>
            `;
            tbody.appendChild(tr);
        });

    } catch (erro) {
        console.log('ERRO AO CARREGAR TABELA', erro);
    }
}

const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            position: 'top',
            labels: { boxWidth: 15, font: { size: 16 }, color: '#ffffff' }
        }
    },
    scales: {
        x: {
            ticks: { font: { size: 18 }, color: '#ffffff' },
            grid:  { color: '#444' }
        },
        y: {
            ticks: { font: { size: 18 }, color: '#ffffff' },
            grid:  { color: '#666' }
        }
    }
};

async function carregarUltimaAtualizacao() {
    try {
        const response = await fetch('/dashboard-marketing/ultima-atualizacao');
        const resp     = await response.json();
        const data     = resp[0].ultima_atualizacao.toString().substring(0, 10);

        document.getElementById('data__consulta1').innerHTML = data;
        document.getElementById('data__consulta3').innerHTML = data;
    } catch (erro) {
        console.log('ERRO AO CARREGAR ÚLTIMA ATUALIZAÇÃO', erro);
    }
}


carregarDados();