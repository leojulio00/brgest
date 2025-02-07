import { firebaseConfig } from "./logico/firebaseConfig.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-app.js";
import {
  getDatabase,
  ref,
  onValue,
} from "https://www.gstatic.com/firebasejs/9.14.0/firebase-database.js";

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
var usuarioEstabelecimento = window.localStorage.getItem(
  "usuarioEstabelecimento"
);

// Referência para todas as vendas do cliente Edma Julio
const todasVendasRef = ref(
  db,
  "estabelecimentos/" +
    usuarioEstabelecimento +
    "/vendas/todasVendas/Edma Julio"
);

// Buscar e exibir as compras no console
onValue(todasVendasRef, (snapshot) => {
  snapshot.forEach((childSnapshot) => {
    const compra = childSnapshot.val();
    console.log(compra);
  });
  console.log("Compras do cliente Edma Julio:");
});
