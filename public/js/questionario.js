const formulario = document.getElementById("formPerfil")
const botaoTopo = document.getElementById("pular")

const pergResp = [
    {
        pergunta: "1. Qual clima você quer criar no evento?",
        resposta1: "Alegre e leve",
        r1value: "E1 +2",
        resposta2: "Mais profundo / introspectivo",
        r2value: "E1 -2"
    },
    {
        pergunta: "2. O nível de animação ideal é:",
        resposta1: "Alto, público animado",
        r1value: "E2 +2",
        resposta2: "Baixo, mais tranquilo",
        r2value: "E2 -2"
    },
    {
        pergunta: "3. O público deve:",
        resposta1: "Dançar bastante",
        r1value: "E3 +2, E4 +1",
        resposta2: "Curtir mais sentado / conversando",
        r2value: "E3 -2, E4 -1"
    },
    {
        pergunta: "4. O evento se parece mais com:",
        resposta1: "Festa/celebração ",
        r1value: "E1 +1, E2 +1, E4 +1",
        resposta2: "Experiência artística",
        r2value: "E1 -1, E3 -1, E4 -1"
    },
    {
        pergunta: "5. Sobre o ritmo das músicas:",
        resposta1: "Rápido e envolvente",
        r1value: "E2 +1, E3 +1",
        resposta2: "Lento e relaxante",
        r2value: "E2 -1, E3 -1"
    },
    {
        pergunta: "6. O som ideal é:",
        resposta1: "Forte, marcante",
        r1value: "E2 +2",
        resposta2: "Suave, discreto",
        r2value: "E2 -2"
    },
    {
        pergunta: "7. O público ideal vai:",
        resposta1: "Interagir, cantar, se movimentar",
        r1value: "E4 +2, E3 +1",
        resposta2: "Conversar e aproveitar o ambiente",
        r2value: "E4 -2, E3 -1"
    },
    {
        pergunta: "8. Sobre o estilo das músicas:",
        resposta1: "Comerciais e conhecidas ",
        r1value: "E1 +1",
        resposta2: "Alternativas / diferentes",
        r2value: "E1 -1"
    },
    {
        pergunta: "9. Sobre presença de vocal:",
        resposta1: "Músicas com vocal forte",
        r1value: "E4 +1",
        resposta2: "Mais instrumental / ambiente",
        r2value: "E4 -2"
    },
    {
        pergunta: "10. O evento deve deixar as pessoas:",
        resposta1: "Energizadas e animadas",
        r1value: "E2 +1, E1 +1",
        resposta2: "Relaxadas e tranquilas",
        r2value: "E2 -1, E1 -1"
    },
]

const fragment = document.createDocumentFragment()

for (let i = 0; i < pergResp.length; i++) {

    const card = document.createElement("div")
    card.classList.add("card", i === 0 ? "atual" : "proximo")

    const titulo = document.createElement("h2")
    titulo.textContent = pergResp[i].pergunta

    const respostas = document.createElement("div")
    respostas.classList.add("respostas")

    const div1 = document.createElement("div")

    const input1 = document.createElement("input")
    const id1 = `q${i}_a`
    input1.type = "radio"
    input1.name = `resp${i}`
    input1.id = id1
    input1.value = pergResp[i].r1value

    const label1 = document.createElement("label")
    label1.setAttribute("for", id1)
    label1.textContent = pergResp[i].resposta1

    div1.appendChild(label1)
    div1.appendChild(input1)

    const div2 = document.createElement("div")

    const input2 = document.createElement("input")
    const id2 = `q${i}_b`
    input2.type = "radio"
    input2.name = `resp${i}`
    input2.id = id2
    input2.value = pergResp[i].r2value

    const label2 = document.createElement("label")
    label2.setAttribute("for", id2)
    label2.textContent = pergResp[i].resposta2

    div2.appendChild(label2)
    div2.appendChild(input2)

    respostas.appendChild(div1)
    respostas.appendChild(div2)

    card.appendChild(titulo)
    card.appendChild(respostas)

    fragment.appendChild(card)
}

let div = document.createElement("div")
div.classList.add("linhaBotao")

let botao = document.createElement("button")
botao.type = "submit"
botao.textContent = "Proximo"

div.appendChild(botao)
fragment.appendChild(div)

formulario.appendChild(fragment)

formulario.addEventListener("change", function (e) {
    const target = e.target

    if (target.type === "radio") {
        const cardAtual = target.closest(".card.atual")

        if (cardAtual) {
            const proximoCard = cardAtual.nextElementSibling

            cardAtual.classList.remove("atual")

            if (proximoCard && proximoCard.classList.contains("card")) {
                proximoCard.classList.remove("proximo")
                proximoCard.classList.add("atual")

                proximoCard.scrollIntoView({
                    behavior: "smooth",
                    block: "center"
                })
            }
        }
    }
})

const container1 = document.getElementById("divContainer1")
const container2 = document.getElementById("divContainer2")

const scores = {
    E1: 0,
    E2: 0,
    E3: 0,
    E4: 0
}

const perfil = {
    E1: scores.E1 >= 0 ? "P" : "I",
    E2: scores.E2 >= 0 ? "E" : "S",
    E3: scores.E3 >= 0 ? "D" : "C",
    E4: scores.E4 >= 0 ? "A" : "C"
}

formulario.addEventListener("submit", function (e) {
    e.preventDefault()

    for (let i = 0; i < pergResp.length; i++) {
        const selecionado = document.querySelector(`input[name="resp${i}"]:checked`)

        if (!selecionado) continue

        const valor = selecionado.value

        const partes = valor.split(",")

        partes.forEach(parte => {
            const [eixo, numero] = parte.trim().split(" ")

            const pontos = Number(numero)

            scores[eixo] += pontos
        })
    }

    resultado()
})

function resultado() {
    container1.style.display = "none"
    container2.style.display = "flex"
}

function voltar() {
    container1.style.display = "flex"
    container2.style.display = "none"
}

function atualizaSeuPerfil() {
    const campo = document.getElementById("seuPerfil")
}