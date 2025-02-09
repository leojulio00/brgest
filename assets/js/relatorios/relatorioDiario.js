/*import { initializeApp } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-app.js";
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

// Referência para todas as vendas do cliente Edma Julio
const todasVendasRef = ref(
  db,
  "estabelecimentos/" +
    usuarioEstabelecimento +
    "/vendas/todasVendas"
);


// Função para atualizar a data actual
var now = new Date();
dataActual =
    now.getDate() +
    "/" +
    (now.getMonth() + 1) +
    "/" +
    now.getFullYear();

console.log(dataActual)

/*
onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log("Usuário está logado:", user);
  } else {
    console.log("Nenhum usuário logado.");
  }
});*


// Buscar e exibir as compras no console
onValue(todasVendasRef, (snapshot) => {
  let nrVendasDiarias = 0
  let valorTotalVendasDiarias = 0
  let nrTotalMetodoDinheiro = 0
  let todosValoresVenda = []
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
            console.log(compra);
    
            if (Object.keys(metodoPagamento)[0] == "Dinheiro") {
                nrTotalMetodoDinheiro ++
            }
            /*let metodos = compra.metodoPagamento
            metodos.forEach((childSnapshot) => {
                console.log(childSnapshot);
            })*
    
    
        }else{
        }
    }


    if(compra.cliente == "Beatriz Donaciano"){
      

    }
  });

  console.log("numero total de compras com o metodo de pa gamento Dinheiro feito pela cliente Beatriz e: " + nrTotalMetodoDinheiro);
  console.log("numero total de compras da  Beatriz e: " + nrVendasDiarias);
  console.log("O valor total de vendas e: " + valorTotalVendasDiarias);

  function calcularEstatisticas(numeros) {
    return numeros.reduce((acc, num) => {
        acc.soma += num;
        acc.maior = Math.max(acc.maior, num);
        acc.menor = Math.min(acc.menor, num);
        return acc;
    }, { soma: 0, maior: -Infinity, menor: Infinity });
}

let valores = [10, 20, 30, 5, 15];
let estatisticas = calcularEstatisticas(todosValoresVenda);
estatisticas.media = estatisticas.soma / valores.length;

console.log(estatisticas); // { soma: 80, maior: 30, menor: 5, media: 16 }

  todosValoresVenda.sort((a, b) => a - b);
  todosValoresVenda.reverse()
  console.log("Maior valor vendido do dia: " + todosValoresVenda[0]);
});
*/