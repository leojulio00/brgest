import { initializeApp } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-app.js";
//import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { firebaseConfig } from "../logico/firebaseConfig.js";
import {
  getDatabase,
  ref,
  onValue,
} from "https://www.gstatic.com/firebasejs/9.14.0/firebase-database.js";


const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
//const auth = getAuth();
var usuarioEstabelecimento = window.localStorage.getItem(
  "usuarioEstabelecimento"
);
var dataActual = ""
var horaActual = ""
var usuarioFecho = window.localStorage.getItem("nomeUser");

// Referência para todas as vendas do cliente Edma Julio
const todasVendasRef = ref(
  db,
  "estabelecimentos/" +
    usuarioEstabelecimento +
    "/vendas/todasVendas"
);

//Referencia dos dados da empresa
const dadosEmpresaRef = ref(
  db,
  "estabelecimentos/" +
    usuarioEstabelecimento +
    "/dadosEmpresa"
);

//Referencia de saldo de entrada
const saldoEntradaRef = ref(
  db,
  "estabelecimentos/" +
    usuarioEstabelecimento +
    "/saldo/entrada"
);

//Referencia de saldo de entrada
const saldoSaidaRef = ref(
  db,
  "estabelecimentos/" +
    usuarioEstabelecimento +
    "/saldo/saida"
);


function calcularEstatisticas(numeros) {
  return numeros.reduce((acc, num) => {
      acc.soma += num;
      acc.maior = Math.max(acc.maior, num);
      acc.menor = Math.min(acc.menor, num);
      return acc;
  }, { soma: 0, maior: -Infinity, menor: Infinity });

}


// Função para atualizar a data actual
var now = new Date();
dataActual =
  now.getDate() +
  "/" +
  (now.getMonth() + 1) +
  "/" +
  now.getFullYear();
horaActual = 
  now.getHours() +
  ":" +
  now.getMinutes() +
  ":" +
  now.getSeconds()

console.log(dataActual)

//Passando a localizacao, email e telefone do estabelecimento para as respectivas variaveis
onValue(dadosEmpresaRef, (snapshot) => {
  const data = snapshot.val();

  window.localStorage.setItem("localEstabelecimento", data.localizacaoEstabelecimento);
  window.localStorage.setItem("emailEstabelecimento", data.emailEstabelecimento);
  window.localStorage.setItem("telefoneEstabelecimento", data.telefoneEstabelecimento);
  
})

var localEstabelecimento = window.localStorage.getItem("localEstabelecimento");
var emailEstabelecimento = window.localStorage.getItem("localEstabelecimento");
var telefoneEstabelecimento = window.localStorage.getItem("telefoneEstabelecimento");



/*
onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log("Usuário está logado:", user);
  } else {
    console.log("Nenhum usuário logado.");
  }
});*/


// Buscar e exibir as compras no console
onValue(todasVendasRef, (snapshot) => {
  let nrVendasDiarias = 0
  let valorTotalVendasDiarias = 0
  let nrTotalMetodoDinheiro = 0
  let todosValoresVenda = []
  let valorTotalSaldoAdicionado = 0
  let valorTotalSaldoRetirado = 0
  let todasMovimentacoesCaixa = 0
  let todoSaldoAdicionado = []
  let todoSaldoRetirado = []
  let nrTotalMetodoCartaoCredito = 0
  let nrTotalMetodoCartaoDebito =0
  let nrTotalMetodoMpesa = 0
  let nrTotalMetodoEmola = 0


  snapshot.forEach((childSnapshot) => {
    const compra = childSnapshot.val();
    
    let horaActual = compra.horaActual
    if (compra.horaActual) {
        let data = horaActual.split(" - ")[1] 
    
        if (data == dataActual) {
            nrVendasDiarias ++
            valorTotalVendasDiarias = valorTotalVendasDiarias + compra.precoTotalVenda
            let todosValores = compra.precoTotalVenda
            todosValoresVenda.push(todosValores)

            let metodoPagamento = compra.metodoPagamento
            //console.log(compra);
    
            /*if (Object.keys(metodoPagamento)[0] == "Dinheiro") {
                nrTotalMetodoDinheiro ++
            }
            /*let metodos = compra.metodoPagamento
            metodos.forEach((childSnapshot) => {
                console.log(childSnapshot);
            })*/
    
    
        }else{
        }
    }


  });

  // Buscar e exibir as compras no console
  onValue(saldoEntradaRef, (snapshot) => {
  

    snapshot.forEach((childSnapshot) => {
      const saldoEntrada = childSnapshot.val();
      let horaActualEntradas = saldoEntrada.horaActual

      if (saldoEntrada.horaActual) {
        let dataEntrada = horaActualEntradas.split(" - ")[1] 

        if (dataEntrada == dataActual) {
          todoSaldoAdicionado.push(saldoEntrada.saldoAdicionado)
          console.log(saldoEntrada)
          
        }
      }
    })
  })

  // Buscar e exibir as compras no console
  onValue(saldoSaidaRef, (snapshot) => {
  

    snapshot.forEach((childSnapshot) => {
      const saldoSaida = childSnapshot.val();
      let horaActualSaida = saldoSaida.horaActual

      if (saldoSaida.horaActual) {
        let dataEntrada = horaActualSaida.split(" - ")[1] 

        if (dataEntrada == dataActual) {
          todoSaldoAdicionado.push(saldoSaida.saldoRetirado)
          console.log(saldoSaida)
          
        }
      }
    })
  })
  
  console.log(todoSaldoAdicionado)
  let estatisticas = calcularEstatisticas(todosValoresVenda);
  estatisticas.media = estatisticas.soma / todosValoresVenda.length;
  let estatisticasSaldoEntrada = calcularEstatisticas(todoSaldoAdicionado);
  estatisticasSaldoEntrada.media = estatisticasSaldoEntrada.soma / todoSaldoAdicionado.length;
  
  let estatisticasSaldoSaida = calcularEstatisticas(todoSaldoRetirado);
  estatisticasSaldoSaida.media = estatisticasSaldoSaida.soma / todoSaldoRetirado.length;

  console.log("numero total de compras com o metodo de pa gamento Dinheiro feito pela cliente Beatriz e: " + nrTotalMetodoDinheiro);
  console.log("numero total de compras da  Beatriz e: " + nrVendasDiarias);
  console.log("O valor total de vendas e: " + valorTotalVendasDiarias);

  
  console.log(
    'Nome do estabelecimento: ' + usuarioEstabelecimento + 
    '      Localizacao do estabelecimento: ' + localEstabelecimento + 
    '      Email: ' + emailEstabelecimento + 
    '      Telefone: ' + telefoneEstabelecimento + 
    "      Usuario que realizou o fecho: " + usuarioFecho +
    '      data e data do fecho: ' + dataActual + " - " + horaActual + 
    "      Numero total de vendas: " + nrVendasDiarias  + 
    '      Maior valor vendido: ' + estatisticas.maior + 
    '      Menor valor vendido: ' + estatisticas.menor + 
    '      media de vendas: ' + (estatisticas.media).toFixed(2) + 
    '      Total vendas: ' + estatisticas.soma + 
    '      Total de movimentacoes de entrada no caixa: ' + estatisticasSaldoEntrada.length +  + 
    '      Valor total de entradas no caixa: ' + estatisticasSaldoEntrada.soma  + 
    '      Maior valor introduzido no caixa: ' + estatisticasSaldoEntrada.maior  +  
    '      Menor valor introduzido no caixa: ' + estatisticasSaldoEntrada.menor +  
    '      Media dos valores introduzidos no caixa: ' + estatisticasSaldoEntrada.media  + 
    '      Total de movimentacoes de saida no caixa: ' + estatisticasSaldoSaida.length  + 
    '      Valor total de saidas no caixa: ' + estatisticasSaldoSaida.soma  + 
    '      Maior valor retirado no caixa: ' + estatisticasSaldoSaida.maior +  
    '      Menor valor retirados no caixa: ' + estatisticasSaldoSaida.menor +  
    '      Media dos valores iretirados no caixa: ' + estatisticasSaldoSaida.media 
  )


  /*console.log(estatisticas); // { soma: 80, maior: 30, menor: 5, media: 16 }

  todosValoresVenda.sort((a, b) => a - b);
  todosValoresVenda.reverse()
  console.log("Maior valor vendido do dia: " + todosValoresVenda[0]);*/
});




