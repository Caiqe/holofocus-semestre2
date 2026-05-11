async function carregarDados() {
    await carregarKpis();
    await carregarGraficoBarras();
    await carregarGraficoLinhas();
    await carregarOportunidades();
    await carregarGenerosSelect();
    await carregarUltimaAtualizacao();
}

async function carregarKpis() {
    const kpi_genero  = document.getElementById('genero__popular');
    const titulo  = document.getElementById('genero__titulo');
    const titulo2  = document.getElementById('genero__titulo2');
    const kpi_energia = document.getElementById('genero_energia');
    const kpi_musica  = document.getElementById('top__musica');

    try {
        const response = await fetch('/dashboard-marketing/kpis');
        const resp     = await response.json();
        const dados    = resp[0];

        kpi_genero.innerHTML  = dados.genero;
        titulo.innerHTML  = dados.genero;
        titulo2.innerHTML  = dados.genero;
        kpi_energia.innerHTML = dados.media_energia+"/100";
        kpi_musica.innerHTML  = dados.musica_mais_ouvida;
    } catch (erro) {
        console.log('ERRO AO CARREGAR KPIS', erro);
    }
}

async function carregarGraficoBarras() {
    try {
        const response = await fetch('/dashboard-marketing/grafico-barras');
        const dados    = await response.json();

        const labels       = dados.map(row => row.titulo_genero);
        const popularidade = dados.map(row => row.media_popularidade);
        const energia      = dados.map(row => row.media_energia);

        new Chart(document.getElementById('graficoBarras'), {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Popularidade (%)',
                        data: popularidade,
                        backgroundColor: '#E2B8F5',
                        borderSkipped: false,
                        barPercentage: 0.5,
                        categoryPercentage: 0.5,
                    },
                    {
                        label: 'Energia (%)',
                        data: energia,
                        backgroundColor: '#B006FD',
                        borderSkipped: false,
                        barPercentage: 0.5,
                        categoryPercentage: 0.5,
                    }
                ]
            },
            options: chartOptions
        });
    } catch (erro) {
        console.log('ERRO AO CARREGAR GRÁFICO DE BARRAS', erro);
    }
}

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
    const insight_genero      = document.getElementById('insight__genero');
    const genero      = document.getElementById('genero__oportunidade');
    const insight_popularidade = document.getElementById('insight__popularidade');
    const insight_energia     = document.getElementById('insight__energia');

    try {
        const response = await fetch('/dashboard-marketing/oportunidades');
        const resp     = await response.json();
        const dados    = resp[0];

        insight_genero.innerHTML       = dados.genero;
        genero.innerHTML       = dados.genero;
        insight_popularidade.innerHTML = dados.media_popularidade;
        insight_energia.innerHTML      = dados.media_energia;
    } catch (erro) {
        console.log('ERRO AO CARREGAR OPORTUNIDADES', erro);
    }
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

        const tbody = document.getElementById('corpo__tabela'); // ← pelo id
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
        document.getElementById('data__consulta2').innerHTML = data;
        document.getElementById('data__consulta3').innerHTML = data;
    } catch (erro) {
        console.log('ERRO AO CARREGAR ÚLTIMA ATUALIZAÇÃO', erro);
    }
}

document.getElementById('select__genero').addEventListener('change', function () {
    carregarTabela(this.value);
});
carregarDados();