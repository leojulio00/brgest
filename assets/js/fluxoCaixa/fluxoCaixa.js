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
const divTodasEntradasCaixa = document.querySelector(".divTodasEntradasCaixa");
const divTodasSaidasCaixa = document.querySelector(".divTodasSaidasCaixa");

// Referência para todos as movimentacoes de entrada
const saldoEntradaRef = ref(
  db,
  "estabelecimentos/" + usuarioEstabelecimento + "/saldo/entrada"
);

// Referência para todos as movimentacoes de saida
const saldoSaidaRef = ref(
  db,
  "estabelecimentos/" + usuarioEstabelecimento + "/saldo/saida"
);

// Carregar e exibir a quantidade e o nome de todos os produtos com quantidade maior ou igual a 5
onValue(saldoEntradaRef, (snapshot) => {
  // Limpar a div antes de adicionar novos elementos
  divTodasEntradasCaixa.innerHTML = "";

  snapshot.forEach((childSnapshot) => {
    const entradas = childSnapshot.val();
    // Criar elemento de lista para cada produto
    let divRow1 = document.createElement("div");
    let divRow2 = document.createElement("div");
    let divCol1 = document.createElement("div");
    let divCol2 = document.createElement("div");
    let divCol3 = document.createElement("div");
    let divCol4 = document.createElement("div");
    let divCard = document.createElement("div");
    let divCardBody = document.createElement("div");
    let motivoEntrada = document.createElement("h4");
    let horaEntrada = document.createElement("h4");
    let saldoAdicionado = document.createElement("h4");
    let responsavelEntrada = document.createElement("h4");

    if (entradas.motivo) {
      motivoEntrada.innerHTML =
        "<strong>Descrição: </strong></br>" + entradas.motivo;
      horaEntrada.innerHTML =
        "<strong>Data e hora da movimentação: </strong></br>" +
        entradas.horaActual;
      saldoAdicionado.innerHTML =
        "<strong>Saldo adicionado ao caixa: </strong></br>" +
        entradas.saldoAdicionado;
      responsavelEntrada.innerHTML =
        "<strong>Respondavel da movimentação: </strong></br>" +
        entradas.responsavel;

      divCol1.classList.add("col");
      divCol2.classList.add("col");
      divCol3.classList.add("col");
      divCol4.classList.add("col");
      divRow1.classList.add("row");
      divRow2.classList.add("row");
      divCard.classList.add("card");
      divCard.classList.add("cardRegVendas");
      divCard.style.margin = "10px 0px";
      divCardBody.classList.add("card-body");
      divCard.style.padding = "0px";
      /*divCardBody.style.display = "flex";
      divCardBody.style.flexDirection = "column";
      divCardBody.style.justifyContent = "space-between";*/
      horaEntrada.classList.add("card-title");
      horaEntrada.style.fontSize = "18px";
      horaEntrada.style.marginBottom = "10px";
      saldoAdicionado.classList.add("card-title");
      saldoAdicionado.style.fontSize = "18px";
      saldoAdicionado.style.marginBottom = "10px";
      motivoEntrada.classList.add("card-text");
      motivoEntrada.style.fontSize = "18px";
      motivoEntrada.style.margin = "0px";
      responsavelEntrada.classList.add("card-text");
      responsavelEntrada.style.fontSize = "18px";
      responsavelEntrada.style.margin = "0px";

      divCard.appendChild(divCardBody);
      divCardBody.appendChild(divRow1);
      divCardBody.appendChild(divRow2);
      divRow1.appendChild(divCol1);
      divRow1.appendChild(divCol2);
      divRow2.appendChild(divCol3);
      divRow2.appendChild(divCol4);
      divCol1.appendChild(horaEntrada);
      divCol2.appendChild(saldoAdicionado);
      divCol3.appendChild(motivoEntrada);
      divCol4.appendChild(responsavelEntrada);

      divTodasEntradasCaixa.appendChild(divCard);
    }
  });
});

// Carregar e exibir a quantidade e o nome de todos os produtos com quantidade maior ou igual a 5
onValue(saldoSaidaRef, (snapshot) => {
  // Limpar a div antes de adicionar novos elementos
  divTodasSaidasCaixa.innerHTML = "";

  snapshot.forEach((childSnapshot) => {
    const saidas = childSnapshot.val();

    // Criar elemento de lista para cada produto
    let divRow1 = document.createElement("div");
    let divRow2 = document.createElement("div");
    let divCol1 = document.createElement("div");
    let divCol2 = document.createElement("div");
    let divCol3 = document.createElement("div");
    let divCol4 = document.createElement("div");
    let divCard = document.createElement("div");
    let divCardBody = document.createElement("div");
    let motivoEntrada = document.createElement("h4");
    let horaEntrada = document.createElement("h4");
    let saldoAdicionado = document.createElement("h4");
    let responsavelEntrada = document.createElement("h4");

    if (saidas.horaActual) {
      motivoEntrada.innerHTML =
        "<strong>Descrição: </strong></br>" + saidas.motivo;
      horaEntrada.innerHTML =
        "<strong>Data e hora da movimentação: </strong></br>" +
        saidas.horaActual;
      saldoAdicionado.innerHTML =
        "<strong>Saldo retirado ao caixa: </strong></br>" +
        saidas.saldoRetirado;
      responsavelEntrada.innerHTML =
        "<strong>Respondavel da movimentação: </strong></br>" + saidas.usuario;

      divCol1.classList.add("col");
      divCol2.classList.add("col");
      divCol3.classList.add("col");
      divCol4.classList.add("col");
      divRow1.classList.add("row");
      divRow2.classList.add("row");
      divCard.classList.add("card");
      divCard.classList.add("cardRegVendas");
      divCard.style.margin = "10px 0px";
      divCardBody.classList.add("card-body");
      divCard.style.padding = "0px";
      /*divCardBody.style.display = "flex";
        divCardBody.style.flexDirection = "column";
        divCardBody.style.justifyContent = "space-between";*/
      horaEntrada.classList.add("card-title");
      horaEntrada.style.fontSize = "18px";
      horaEntrada.style.marginBottom = "10px";
      saldoAdicionado.classList.add("card-title");
      saldoAdicionado.style.fontSize = "18px";
      saldoAdicionado.style.marginBottom = "10px";
      motivoEntrada.classList.add("card-text");
      motivoEntrada.style.fontSize = "18px";
      motivoEntrada.style.margin = "0px";
      responsavelEntrada.classList.add("card-text");
      responsavelEntrada.style.fontSize = "18px";
      responsavelEntrada.style.margin = "0px";

      divCard.appendChild(divCardBody);
      divCardBody.appendChild(divRow1);
      divCardBody.appendChild(divRow2);
      divRow1.appendChild(divCol1);
      divRow1.appendChild(divCol2);
      divRow2.appendChild(divCol3);
      divRow2.appendChild(divCol4);
      divCol1.appendChild(horaEntrada);
      divCol2.appendChild(saldoAdicionado);
      divCol3.appendChild(motivoEntrada);
      divCol4.appendChild(responsavelEntrada);

      divTodasSaidasCaixa.appendChild(divCard);
    }
  });
});
