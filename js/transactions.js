// Este arquivo cuida da lógica das transações: criar, editar, excluir e calcular totais

// Lista de transações. Começa carregando o que já estava salvo (usa a função do storage.js)
let transacoes = carregarTransacoes();

// Cria e adiciona uma nova transação
function adicionarTransacao(descricao, valor, categoria, tipo) {
    const novaTransacao = {
        id: Date.now(),
        descricao: descricao,
        valor: valor,
        categoria: categoria,
        tipo: tipo,
        data: new Date().toLocaleDateString("pt-BR")
    };

    transacoes.push(novaTransacao);
    salvarTransacoes(transacoes);
}

// Exclui uma transação pelo id
function excluirTransacao(id) {
    transacoes = transacoes.filter(function (transacao) {
        return transacao.id !== id;
    });

    salvarTransacoes(transacoes);
}

// Edita uma transação existente, encontrando ela pelo id
function editarTransacao(id, dadosNovos) {
    const indice = transacoes.findIndex(function (transacao) {
        return transacao.id === id;
    });

    // Se não achou nenhuma transação com esse id, não faz nada
    if (indice === -1) {
        return;
    }

    // Troca os dados, mas mantém o id e a data originais
    transacoes[indice] = {
        id: transacoes[indice].id,
        descricao: dadosNovos.descricao,
        valor: dadosNovos.valor,
        categoria: dadosNovos.categoria,
        tipo: dadosNovos.tipo,
        data: transacoes[indice].data
    };

    salvarTransacoes(transacoes);
}

// Calcula saldo, total de receitas e total de despesas
function calcularTotais() {
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

    return {
        saldo: saldo,
        receitas: totalReceitas,
        despesas: totalDespesas
    };
}

// Soma as despesas agrupadas por categoria
function calcularTotalPorCategoria() {
    const totalPorCategoria = {
        alimentacao: 0,
        transporte: 0,
        lazer: 0,
        casa: 0,
        outros: 0
    };

    transacoes.forEach(function (transacao) {
        if (
            transacao.tipo === "expense" &&
            totalPorCategoria.hasOwnProperty(transacao.categoria)
        ) {
            totalPorCategoria[transacao.categoria] += transacao.valor;
        }
    });

    return totalPorCategoria;
}