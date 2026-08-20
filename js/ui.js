// ui.js

// Este arquivo cuida só de atualizar o que aparece na tela

const nomesCategorias = {
    alimentacao: "Alimentação",
    transporte: "Transporte",
    lazer: "Lazer",
    casa: "Casa",
    trabalho: "Trabalho",
    outros: "Outros"
};

// Elementos do HTML
const saldoEl = document.getElementById("saldo");
const receitasEl = document.getElementById("receitas");
const despesasEl = document.getElementById("despesas");
let graficoCategorias = null;

const corpoTabela = document.getElementById("lista-transacoes");
const listaCategoriasEl = document.getElementById("lista-categorias");

// Atualiza tudo na tela de uma vez
function atualizarTela() {
    atualizarCards();
    atualizarTabela();
    atualizarResumoCategorias();
    atualizarGrafico();
}

// Desenha ou atualiza o gráfico de pizza com os gastos por categoria
function atualizarGrafico() {
    const totalPorCategoria = calcularTotalPorCategoria();

    const dados = {
        labels: ["Alimentação", "Transporte", "Lazer", "Casa", "Outros"],
        datasets: [{
            data: [
                totalPorCategoria.alimentacao,
                totalPorCategoria.transporte,
                totalPorCategoria.lazer,
                totalPorCategoria.casa,
                totalPorCategoria.outros
            ],
            backgroundColor: [
                "#f97316",
                "#3b82f6",
                "#22c55e",
                "#a855f7",
                "#9ca3af"
            ]
        }]
    };

    // Se o gráfico já existe, só atualiza os dados
    if (graficoCategorias !== null) {
        graficoCategorias.data = dados;
        graficoCategorias.update();
        return;
    }

    // Se é a primeira vez, cria o gráfico
    const canvas = document.getElementById("grafico-categorias");

    graficoCategorias = new Chart(canvas, {
        type: "pie",
        data: dados
    });
}

// Transforma um número em texto no formato "R$ 1.234,56"
function formatarMoeda(numero) {
    return numero.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
}

// Atualiza os 3 cards do topo, usando o cálculo que já vem pronto do transactions.js
function atualizarCards() {
    const totais = calcularTotais();

    saldoEl.textContent = formatarMoeda(totais.saldo);
    receitasEl.textContent = formatarMoeda(totais.receitas);
    despesasEl.textContent = formatarMoeda(totais.despesas);
}

// Redesenha a tabela de histórico
function atualizarTabela() {
    if (transacoes.length === 0) {
        corpoTabela.innerHTML = '<tr><td colspan="6" class="vazio">Nenhuma transação cadastrada.</td></tr>';
        return;
    }

    corpoTabela.innerHTML = "";

    const transacoesOrdenadas = [...transacoes].reverse();

    transacoesOrdenadas.forEach(function (transacao) {
        const linha = document.createElement("tr");

        const sinal = transacao.tipo === "income" ? "+" : "-";
        const corValor = transacao.tipo === "income" ? "receita" : "despesa";
        const textoTipo = transacao.tipo === "income" ? "↑ Receita" : "↓ Despesa";

        linha.innerHTML = `
            <td>${transacao.descricao}</td>
            <td>${nomesCategorias[transacao.categoria]}</td>
            <td>${textoTipo}</td>
            <td class="card-valor ${corValor}" style="font-size:14px">${sinal} ${formatarMoeda(transacao.valor)}</td>
            <td>${transacao.data}</td>
            <td>
                <button class="botao-editar" data-id="${transacao.id}">✏️</button>
                <button class="botao-excluir" data-id="${transacao.id}">🗑️</button>
            </td>
        `;

        corpoTabela.appendChild(linha);
    });

    // Clique de excluir
    document.querySelectorAll(".botao-excluir").forEach(function (botao) {
        botao.addEventListener("click", function () {
            const id = Number(botao.getAttribute("data-id"));
            excluirTransacao(id);
            atualizarTela();
        });
    });

    // Clique de editar
    document.querySelectorAll(".botao-editar").forEach(function (botao) {
        botao.addEventListener("click", function () {
            const id = Number(botao.getAttribute("data-id"));
            abrirEdicao(id);
        });
    });
}

// Soma as despesas por categoria e atualiza a lista "Resumo dos gastos"
function atualizarResumoCategorias() {
    const totalPorCategoria = calcularTotalPorCategoria();

    const itens = listaCategoriasEl.querySelectorAll("li");
    const categoriasNaOrdem = [
        "alimentacao",
        "transporte",
        "lazer",
        "casa",
        "outros"
    ];

    itens.forEach(function (item, indice) {
        const categoria = categoriasNaOrdem[indice];
        const valorEl = item.querySelector("b");

        valorEl.textContent = formatarMoeda(totalPorCategoria[categoria]);
    });
}