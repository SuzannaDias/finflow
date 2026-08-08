// Lista de transações. Começa carregando o que já estava salvo no navegador.
let transacoes = carregarTransacoes();

// Nomes bonitos pra mostrar cada categoria na tela
const nomesCategorias = {
    alimentacao: "Alimentação",
    transporte: "Transporte",
    lazer: "Lazer",
    casa: "Casa",
    trabalho: "Trabalho",
    outros: "Outros"
};

// Guarda se o usuário escolheu "Receita" ou "Despesa" no formulário
let tipoSelecionado = "income";

// Elementos do HTML
const form = document.getElementById("form-transacao");
const inputDescricao = document.getElementById("descricao");
const inputValor = document.getElementById("valor");
const selectCategoria = document.getElementById("categoria");

const btnReceita = document.getElementById("btn-receita");
const btnDespesa = document.getElementById("btn-despesa");

const saldoEl = document.getElementById("saldo");
const receitasEl = document.getElementById("receitas");
const despesasEl = document.getElementById("despesas");

const corpoTabela = document.getElementById("lista-transacoes");
const listaCategoriasEl = document.getElementById("lista-categorias");

const themeToggle = document.getElementById("theme-toggle");

// Alterna entre "Receita" e "Despesa" no formulário
btnReceita.addEventListener("click", function () {
    tipoSelecionado = "income";
    btnReceita.classList.add("ativo");
    btnDespesa.classList.remove("ativo");
});

btnDespesa.addEventListener("click", function () {
    tipoSelecionado = "expense";
    btnDespesa.classList.add("ativo");
    btnReceita.classList.remove("ativo");
});

// Quando o formulário é enviado
form.addEventListener("submit", function (evento) {
    evento.preventDefault(); // impede a página de recarregar

    const descricao = inputDescricao.value.trim();
    const valor = converterParaNumero(inputValor.value);
    const categoria = selectCategoria.value;

    // validação simples
    if (descricao === "") {
        alert("Digite uma descrição para a transação.");
        return;
    }

    if (valor <= 0) {
        alert("Digite um valor maior que zero.");
        return;
    }

    if (categoria === "") {
        alert("Selecione uma categoria.");
        return;
    }

    // cria o objeto da transação
    const novaTransacao = {
        id: Date.now(), // um número único, baseado no horário atual
        descricao: descricao,
        valor: valor,
        categoria: categoria,
        tipo: tipoSelecionado,
        data: new Date().toLocaleDateString("pt-BR")
    };

    transacoes.push(novaTransacao);
    salvarTransacoes();

    atualizarTela();
    form.reset();
    // depois do reset, volta o botão "Receita" como padrão
    btnReceita.click();
});

// Exclui uma transação
function excluirTransacao(id) {
    transacoes = transacoes.filter(function (transacao) {
        return transacao.id !== id;
    });
    salvarTransacoes();
    atualizarTela();
}

// Atualiza tudo na tela de uma vez
function atualizarTela() {
    atualizarCards();
    atualizarTabela();
    atualizarResumoCategorias();
}

// Atualiza os 3 cards do topo (Saldo, Receitas, Despesas)
function atualizarCards() {
    let totalReceitas = 0;
    let totalDespesas = 0;

    transacoes.forEach(function (transacao) {
        if (transacao.tipo === "income") {
            totalReceitas += transacao.valor;
        } else {
            totalDespesas += transacao.valor;
        }
    });

    const saldo = totalReceitas - totalDespesas;

    saldoEl.textContent = formatarMoeda(saldo);
    receitasEl.textContent = formatarMoeda(totalReceitas);
    despesasEl.textContent = formatarMoeda(totalDespesas);
}

// Redesenha a tabela de histórico
function atualizarTabela() {
    // se não tem nenhuma transação, mostra a mensagem padrão
    if (transacoes.length === 0) {
        corpoTabela.innerHTML = '<tr><td colspan="6" class="vazio">Nenhuma transação cadastrada.</td></tr>';
        return;
    }

    // limpa a tabela antes de redesenhar
    corpoTabela.innerHTML = "";

    // mostra as mais recentes primeiro
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
            <td><button class="botao-excluir" data-id="${transacao.id}">🗑️</button></td>
        `;

        corpoTabela.appendChild(linha);
    });

    // adiciona o clique de excluir em cada botão de lixeira recém-criado
    document.querySelectorAll(".botao-excluir").forEach(function (botao) {
        botao.addEventListener("click", function () {
            const id = Number(botao.getAttribute("data-id"));
            excluirTransacao(id);
        });
    });
}

// Soma as despesas por categoria e atualiza a lista "Resumo dos gastos"
function atualizarResumoCategorias() {
    // zera os totais
    const totalPorCategoria = {
        alimentacao: 0,
        transporte: 0,
        lazer: 0,
        casa: 0,
        outros: 0
    };

    transacoes.forEach(function (transacao) {
        // o resumo mostra só despesas (igual ao gráfico do mockup)
        if (transacao.tipo === "expense" && totalPorCategoria.hasOwnProperty(transacao.categoria)) {
            totalPorCategoria[transacao.categoria] += transacao.valor;
        }
    });

    // pega cada <li> da lista e atualiza o valor (<b>) dentro dele
    const itens = listaCategoriasEl.querySelectorAll("li");
    const categoriasNaOrdem = ["alimentacao", "transporte", "lazer", "casa", "outros"];

    itens.forEach(function (item, indice) {
        const categoria = categoriasNaOrdem[indice];
        const valorEl = item.querySelector("b");
        valorEl.textContent = formatarMoeda(totalPorCategoria[categoria]);
    });
}

// Salva as transações no localStorage.
// O localStorage só guarda texto, por isso usamos JSON.stringify()
// pra transformar o array de objetos em texto antes de salvar.
function salvarTransacoes() {
    const textoJSON = JSON.stringify(transacoes);
    localStorage.setItem("finflow-transacoes", textoJSON);
}

// Carrega as transações do localStorage.
// Pega o texto salvo e usa JSON.parse() pra transformar de volta em array.
function carregarTransacoes() {
    const textoSalvo = localStorage.getItem("finflow-transacoes");

    // se nunca salvou nada antes, textoSalvo vai ser "null" — aí começamos vazio
    if (!textoSalvo) {
        return [];
    }

    return JSON.parse(textoSalvo);
}

// Transforma "R$ 1.234,56" ou "1234,56" em número: 1234.56
function converterParaNumero(texto) {
    const limpo = texto
        .replace("R$", "")
        .replace(/\s/g, "")
        .replace(/\./g, "")   // remove pontos de milhar
        .replace(",", ".");   // troca vírgula decimal por ponto

    return parseFloat(limpo) || 0;
}

// Transforma um número em texto no formato "R$ 1.234,56"
function formatarMoeda(numero) {
    return numero.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
}

// Alterna entre tema claro e escuro
themeToggle.addEventListener("click", function () {
    document.body.classList.toggle("tema-escuro");

    if (document.body.classList.contains("tema-escuro")) {
        themeToggle.textContent = "☀️";
    } else {
        themeToggle.textContent = "🌙";
    }
});

// Primeira renderização, ao abrir a página
atualizarTela();