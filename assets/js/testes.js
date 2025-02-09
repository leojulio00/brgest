
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-app.js";
//import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { firebaseConfig } from "./logico/firebaseConfig.js";
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

// Referência para todas as vendas do cliente Edma Julio
const todasVendasRef = ref(
  db,
  "estabelecimentos/" +
    usuarioEstabelecimento +
    "/vendas/todasVendas"
);


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
  let nrTotalMetodoDinheiro = 0
  let nrTotalMetodoCartaoCredito = 0
  let nrTotalMetodoCartaoDebito =0
  let nrTotalMetodoMpesa = 0
  let nrTotalMetodoEmola = 0
  snapshot.forEach((childSnapshot) => {
    const compra = childSnapshot.val();
    
    if(compra.cliente == "Beatriz Donaciano"){
      let horaActual = compra.horaActual
      let data = horaActual.split(" - ")[1] 
      if (data == "7/1/2025") {
        nrVendasDiarias ++
        let metodoPagamento = compra.metodoPagamento
        console.log(compra);

        if (Object.keys(metodoPagamento)[0] == "Dinheiro") {
          nrTotalMetodoDinheiro ++
        }
        console.log(Object.keys(metodoPagamento)[0]);
        /*let metodos = compra.metodoPagamento
        metodos.forEach((childSnapshot) => {
          console.log(childSnapshot);
        })*/
        
        
      }

    }
  });
  console.log("numero total de compras com o metodo de pa gamento Dinheiro feito pela cliente Beatriz e: " + nrTotalMetodoDinheiro);
  console.log("numero total de compras da  Beatriz e: " + nrVendasDiarias);
  console.log("Compras do cliente Edma Julio:");
});
