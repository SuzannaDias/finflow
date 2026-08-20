// app.js

// Este é o "maestro": liga os cliques e o envio do formulário aos outros módulos

// storage.js cuida do localStorage, transactions.js da lógica, ui.js do desenho na tela

// Guarda se o usuário escolheu "Receita" ou "Despesa" no formulário
let tipoSelecionado = "income";

// Guarda o id da transação que está sendo editada.
// Enquanto for null, o formulário está no modo "criar nova transação".
let idEmEdicao = null;

// Elementos do HTML
const form = document.getElementById("form-transacao");
const inputDescricao = document.getElementById("descricao");
const inputValor = document.getElementById("valor");
const selectCategoria = document.getElementById("categoria");
const btnReceita = document.getElementById("btn-receita");
const btnDespesa = document.getElementById("btn-despesa");
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

// Quando o formulário é enviado (serve tanto pra criar quanto pra editar)
form.addEventListener("submit", function (evento) {
    evento.preventDefault(); // impede a página de recarregar

    const descricao = inputDescricao.value.trim();
    const valor = converterParaNumero(inputValor.value);
    const categoria = selectCategoria.value;

    // Validação simples
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

    if (idEmEdicao === null) {
        // Modo criar: não tem id em edição, então é transação nova
        adicionarTransacao(descricao, valor, categoria, tipoSelecionado);
    } else {
        // Modo editar: já existe um id guardado, então atualiza aquela transação
        editarTransacao(idEmEdicao, {
            descricao: descricao,
            valor: valor,
            categoria: categoria,
            tipo: tipoSelecionado
        });

        sairDoModoEdicao();
    }

    atualizarTela();
    form.reset();

    // Depois do reset, volta o botão "Receita" como padrão
    btnReceita.click();
});

// Preenche o formulário com os dados de uma transação existente,
// pra pessoa poder editar em vez de digitar tudo de novo do zero
function abrirEdicao(id) {
    const transacao = transacoes.find(function (t) {
        return t.id === id;
    });

    if (!transacao) {
        return;
    }

    idEmEdicao = id;
    inputDescricao.value = transacao.descricao;
    inputValor.value = transacao.valor;
    selectCategoria.value = transacao.categoria;

    if (transacao.tipo === "income") {
        btnReceita.click();
    } else {
        btnDespesa.click();
    }

    document.getElementById("botao-submit").textContent = "Salvar edição";

    // Leva a pessoa até o formulário, caso ela esteja olhando outra parte da tela
    form.scrollIntoView({ behavior: "smooth" });
}

// Volta o formulário pro modo normal (criar nova transação)
function sairDoModoEdicao() {
    idEmEdicao = null;
    document.getElementById("botao-submit").textContent = "Adicionar transação";
}

// Transforma "R$ 1.234,56" ou "1234,56" em número: 1234.56
function converterParaNumero(texto) {
    const limpo = texto
        .replace("R$", "")
        .replace(/\s/g, "")
        .replace(/\./g, "") // remove pontos de milhar
        .replace(",", "."); // troca vírgula decimal por ponto

    return parseFloat(limpo) || 0;
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