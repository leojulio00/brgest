// Este arquivo será usado para monitoramento de produtos.

// Adicione aqui a lógica necessária para o monitoramento de produtos.

import { firebaseConfig } from "../logico/firebaseConfig.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-app.js";
import {
  getDatabase,
  ref,
  onValue,
  set,
} from "https://www.gstatic.com/firebasejs/9.14.0/firebase-database.js";

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
var usuarioEstabelecimento = window.localStorage.getItem(
  "usuarioEstabelecimento"
);
const btnVerProdutosAbaixo = document.querySelector(".btnVerProdutosAbaixo");
const totalProdutosAbaixoTxt = document.querySelector(
  ".totalProdutosAbaixoTxt"
);
const divVerProdutosAbaixo = document.querySelector(".divVerProdutosAbaixo");
const modalVerProdutosAbaixo = document.querySelector(
  ".modalVerProdutosAbaixo"
);
const divTicketMedio = document.querySelector(".divTicketMedio");
const mediaFacturacaoTotalProdutosTxt = document.querySelector(
  ".mediaFacturacaoTotalProdutosTxt"
);

// Referência para todos os produtos cadastrados
const produtosRef = ref(
  db,
  "estabelecimentos/" + usuarioEstabelecimento + "/produtos/todosProdutos"
);

let totalProdutosAbaixo = 0;

// Carregar e exibir a quantidade e o nome de todos os produtos com quantidade maior ou igual a 5
onValue(produtosRef, (snapshot) => {
  let totalProdutos = 0;
  // Limpar a div antes de adicionar novos elementos
  divVerProdutosAbaixo.innerHTML = "";

  snapshot.forEach((childSnapshot) => {
    const produto = childSnapshot.val();
    if (produto.quantProdE <= 5) {
      totalProdutos += produto.quantProdE;
      totalProdutosAbaixo += 1;

      // Criar elemento de lista para cada produto
      const listItem = document.createElement("div");
      listItem.innerHTML = "<strong>" + "Nome do produto: " + "</strong>" + `${produto.nomeProd},` + "</br>" +
             "<strong>" + "Quantidade: " + "</strong>" + `${produto.quantProdE}` + "</br>" + "</br>";
      divVerProdutosAbaixo.appendChild(listItem);
    }
  });

  // Adicionar evento ao botão para exibir produtos abaixo
  if (btnVerProdutosAbaixo) {
    btnVerProdutosAbaixo.addEventListener("click", () => {
      const modal = new bootstrap.Modal(modalVerProdutosAbaixo);
      modal.show();
    });
  }

  // Atualizar o texto com o total de produtos abaixo
  if (totalProdutosAbaixoTxt) {
    totalProdutosAbaixoTxt.innerHTML = totalProdutosAbaixo;
  }
});

// Calcular e exibir o ticket médio de cada produto
onValue(produtosRef, (snapshot) => {
  divTicketMedio.innerHTML = ""; // Limpar a div antes de adicionar novos elementos

  let totalTicketMedio = 0;
  let totalProdutos = 0;

  snapshot.forEach((childSnapshot) => {
    const produto = childSnapshot.val();
    if (produto.quantProdE > 0) {
      const ticketMedio = produto.precVenda / produto.quantProdE;
      totalTicketMedio += ticketMedio;
      totalProdutos += 1;

      const ticketItem = document.createElement("div");
      ticketItem.textContent = `Nome: ${
        produto.nomeProd
      }, Ticket Médio: ${ticketMedio.toFixed(2)}`;
      //divTicketMedio.appendChild(ticketItem);

      // Adicionar o valor do ticket médio na base de dados
      const produtoRef = ref(
        db,
        `estabelecimentos/${usuarioEstabelecimento}/produtos/todosProdutos/${childSnapshot.key}/ticketMedio`
      );
      set(produtoRef, ticketMedio.toFixed(2));
    }
  });

  // Calcular o ticket médio geral
  const ticketMedioGeral =
    totalProdutos > 0 ? totalTicketMedio / totalProdutos : 0;

  // Atualizar o texto com o ticket médio geral
  if (mediaFacturacaoTotalProdutosTxt) {
    mediaFacturacaoTotalProdutosTxt.innerHTML = ticketMedioGeral.toFixed(2);
  }
});

// Calcular o somatório total do preço de compra de todos os produtos vendidos multiplicado pela quantidade vendida
onValue(produtosRef, (snapshot) => {
  let totalPrecoCompraVendidos = 0;

  snapshot.forEach((childSnapshot) => {
    const produto = childSnapshot.val();
    const quantidadeVendida = produto.quantProdV || 0; // Supondo que quantProdV representa a quantidade vendida
    totalPrecoCompraVendidos +=
      (parseFloat(produto.precCompra) || 0) * quantidadeVendida;
  });

});
