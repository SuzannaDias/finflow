
// Este arquivo cuida só de salvar e carregar as transações no navegador (localStorage)

const CHAVE_STORAGE = "finflow-transacoes";

// Salva as transações no localStorage
function salvarTransacoes(transacoes) {
    const textoJSON = JSON.stringify(transacoes);
    localStorage.setItem(CHAVE_STORAGE, textoJSON);
}

// Carrega as transações do localStorage.
// Pega o texto salvo e usa JSON.parse() pra transformar de volta em array.
function carregarTransacoes() {
    const textoSalvo = localStorage.getItem(CHAVE_STORAGE);

    if (!textoSalvo) {
        return [];
    }

    return JSON.parse(textoSalvo);
}