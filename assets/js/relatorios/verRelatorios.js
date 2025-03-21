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
const divTodosRelatorios = document.querySelector(".divTodosRelatorios");
const modalVerRelatorios = document.querySelector(".modalVerRelatorios");
const txtNomeEstabelecimento = document.querySelector(".txtNomeEstabelecimento");
const txtLocalizacaoEstabelecimento = document.querySelector(".txtLocalizacaoEstabelecimento");
const txtEmailEstabelecimento = document.querySelector(".txtEmailEstabelecimento");
const txtTelEstabelecimento = document.querySelector(".txtTelEstabelecimento");
const txtDataHora = document.querySelector(".txtDataHora");
const txtNumeroVendas = document.querySelector(".txtNumeroVendas");
const txtLucroTotalVendas = document.querySelector(".txtLucroTotalVendas");
const txtMediaVendas = document.querySelector(".txtMediaVendas");
const txtMaiorValorVendido = document.querySelector(".txtMaiorValorVendido");
const txtMenorValorVendido = document.querySelector(".txtMenorValorVendido");
const txtVezesCartaoCredito = document.querySelector(".txtVezesCartaoCredito");
const txtVezesCartaoDebito = document.querySelector(".txtVezesCartaoDebito");
const txtVezesDinheiro = document.querySelector(".txtVezesDinheiro");
const txtVezesCredito = document.querySelector(".txtVezesCredito");
const txtVezesEmola = document.querySelector(".txtVezesEmola");
const txtVezesMpesa = document.querySelector(".txtVezesMpesa");
const txtVezesMkesh = document.querySelector(".txtVezesMkesh");
const txtVezesEntradaCaixa = document.querySelector(".txtVezesEntradaCaixa");
const txtValorTotalEntradaCaixa = document.querySelector(".txtValorTotalEntradaCaixa");
const txtMediaValoresIntroduzidoCaixa = document.querySelector(".txtMediaValoresIntroduzidoCaixa");
const txtMaiorValorIntroduzidoCaixa = document.querySelector(".txtMaiorValorIntroduzidoCaixa");
const txtMenorValorIntroduzidoCaixa = document.querySelector(".txtMenorValorIntroduzidoCaixa");
const txtVezesSaidaCaixa = document.querySelector(".txtVezesSaidaCaixa");
const txtValorTotalSaidaCaixa = document.querySelector(".txtValorTotalSaidaCaixa");
const txtMediaValoresRetiradosCaixa = document.querySelector(".txtMediaValoresRetiradosCaixa");
const txtMaiorValorRetiradosCaixa = document.querySelector(".txtMaiorValorRetiradosCaixa");
const txtMenorValorRetiradosCaixa = document.querySelector(".txtMenorValorRetiradosCaixa");
const txtTotalmovimentacoesCaixa = document.querySelector(".txtTotalmovimentacoesCaixa");
const txtValorTotalmovimentacoesCaixa = document.querySelector(".txtValorTotalmovimentacoesCaixa");
const txtSaldoTotalDia = document.querySelector(".txtSaldoTotalDia");

// Referência para todos as movimentacoes de entrada
const relatoriosRef = ref(
  db,
  "estabelecimentos/" + usuarioEstabelecimento + "/relatorios"
);

// Referência para todos as movimentacoes de saida
const saldoSaidaRef = ref(
  db,
  "estabelecimentos/" + usuarioEstabelecimento + "/saldo/saida"
);

// Carregar e exibir a quantidade e o nome de todos os produtos com quantidade maior ou igual a 5
onValue(relatoriosRef, (snapshot) => {
  // Limpar a div antes de adicionar novos elementos
  divTodosRelatorios.innerHTML = "";

  snapshot.forEach((childSnapshot) => {
    const relatorios = childSnapshot.val();
    // Criar elemento de lista para cada produto
    let divRow1 = document.createElement("div");
    let divCol1 = document.createElement("div");
    let divCol2 = document.createElement("div");
    let divCol3 = document.createElement("div");
    let divCol4 = document.createElement("div");
    let divCard = document.createElement("div");
    let divCardBody = document.createElement("div");
    let dataRelatorio = document.createElement("h4");
    let horaRelatorio = document.createElement("h4");
    let saldoRelatorio = document.createElement("h4");
    let responsavelRelatorio = document.createElement("h4");
    let semRelatorios = document.createElement("h4");

    if (relatorios) {
        dataRelatorio.innerHTML =
        "<strong>Data: </strong></br>" + relatorios.dadosFecho.dataFecho;
      horaRelatorio.innerHTML =
        "<strong>Hora: </strong></br>" +
        relatorios.dadosFecho.horaFecho;
      saldoRelatorio.innerHTML =
        "<strong>Saldo do dia: </strong></br>" +
        relatorios.saldoCaixa.saldoDia
      responsavelRelatorio.innerHTML =
        "<strong>Respondavel: </strong></br>" +
        relatorios.dadosFecho.responsavelFecho;

      divCol1.classList.add("col");
      divCol2.classList.add("col");
      divCol3.classList.add("col");
      divCol4.classList.add("col");
      divRow1.classList.add("row");
      divCard.classList.add("card");
      divCard.classList.add("cardRegVendas");
      divCard.style.margin = "10px 0px";
      divCardBody.classList.add("card-body");
      divCard.style.padding = "0px";
      /*divCardBody.style.display = "flex";
      divCardBody.style.flexDirection = "column";
      divCardBody.style.justifyContent = "space-between";*/
      dataRelatorio.style.fontSize = "18px";
      dataRelatorio.style.marginBottom = "10px";
      dataRelatorio.classList.add("card-title");
      horaRelatorio.classList.add("card-title");
      horaRelatorio.style.fontSize = "18px";
      horaRelatorio.style.marginBottom = "10px";
      saldoRelatorio.classList.add("card-text");
      saldoRelatorio.style.fontSize = "18px";
      saldoRelatorio.style.margin = "0px";
      responsavelRelatorio.classList.add("card-text");
      responsavelRelatorio.style.fontSize = "18px";
      responsavelRelatorio.style.margin = "0px";

      divCard.addEventListener("click", ()=>{
        const modal = new bootstrap.Modal(modalVerRelatorios);
        modal.show();

        txtDataHora.innerHTML = "Data e hora: " + relatorios.dadosFecho.dataFecho + " - " + relatorios.dadosFecho.horaFecho
        txtEmailEstabelecimento.innerHTML = relatorios.dadosFecho.emailEstabelecimento
        txtLocalizacaoEstabelecimento.innerHTML = relatorios.dadosFecho.localizacaoEstabelecimento
        txtLucroTotalVendas.innerHTML = relatorios.vendas.lucroTotalVendas
        txtMaiorValorIntroduzidoCaixa.innerHTML = relatorios.fluxoCaixa.maiorValorIntroduzidoCaixa
        txtMaiorValorRetiradosCaixa.innerHTML = relatorios.fluxoCaixa.maiorValorRetiradoCaixa
        txtMaiorValorVendido.innerHTML = relatorios.vendas.maiorValorVendido
        txtMediaValoresIntroduzidoCaixa.innerHTML = relatorios.fluxoCaixa.mediaValorIntroduzidoCaixa
        txtMediaValoresRetiradosCaixa.innerHTML = relatorios.fluxoCaixa.mediaValoresRetiradoCaixa        
        txtMediaVendas.innerHTML = relatorios.vendas.mediaVendas
        txtMenorValorIntroduzidoCaixa.innerHTML = relatorios.fluxoCaixa.menorValorIntroduzidoCaixa
        txtMenorValorRetiradosCaixa.innerHTML = relatorios.fluxoCaixa.menorValorRetiradoCaixa
        txtMenorValorVendido.innerHTML = relatorios.vendas.menorValorVendido
        txtNomeEstabelecimento.innerHTML = relatorios.dadosFecho.nomeEstabelecimento
        txtNumeroVendas.innerHTML = relatorios.vendas.numerosVendas
        txtSaldoTotalDia.innerHTML = relatorios.saldoCaixa.saldoDia
        txtTelEstabelecimento.innerHTML = relatorios.dadosFecho.telefoneEstabelecimento
        txtTotalmovimentacoesCaixa.innerHTML =  relatorios.fluxoCaixa.totalMovimentacoesCaixa
        txtValorTotalEntradaCaixa.innerHTML = relatorios.fluxoCaixa.valorTotalEntradasCaixa
        txtValorTotalSaidaCaixa.innerHTML = relatorios.fluxoCaixa.valorTotalSaidaCaixa
        txtValorTotalmovimentacoesCaixa.innerHTML = relatorios.fluxoCaixa.valorTotalMovimentadoCaixa        
        txtValorTotalEntradaCaixa.innerHTML = relatorios.fluxoCaixa.valorTotalEntradasCaixa
        txtValorTotalSaidaCaixa.innerHTML = relatorios.fluxoCaixa.valorTotalSaidaCaixa
        txtVezesCartaoCredito.innerHTML = relatorios.metodosPagamento.cartaoCredito
        txtVezesCartaoDebito.innerHTML = relatorios.metodosPagamento.cartaoDebito
        txtVezesCredito.innerHTML = relatorios.metodosPagamento.credito
        txtVezesDinheiro.innerHTML = relatorios.metodosPagamento.dinheiro
        txtVezesEmola.innerHTML = relatorios.metodosPagamento.emola
        txtVezesEntradaCaixa.innerHTML = relatorios.fluxoCaixa.totalMovimentacoesEntradaCaixa
        txtVezesMkesh.innerHTML = relatorios.metodosPagamento.mkesh
        txtVezesMpesa.innerHTML = relatorios.metodosPagamento.mpesa
        txtVezesSaidaCaixa.innerHTML = relatorios.fluxoCaixa.totalMovimentacoesSaidaCaixa
      })

      divCard.appendChild(divCardBody);
      divCardBody.appendChild(divRow1);
      divRow1.appendChild(divCol1);
      divRow1.appendChild(divCol2);
      divRow1.appendChild(divCol3);
      divRow1.appendChild(divCol4);
      divCol1.appendChild(dataRelatorio);
      divCol2.appendChild(horaRelatorio);
      divCol3.appendChild(saldoRelatorio);
      divCol4.appendChild(responsavelRelatorio);

      divTodosRelatorios.appendChild(divCard);
    }
  });
});