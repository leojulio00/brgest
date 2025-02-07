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
var userLocalStorage = window.localStorage.getItem("user");
var cargo = "";
var liSeccProdutos = document.querySelector(".liSeccProdutos");
var liSeccColabor = document.querySelector(".liSeccColabor");
var liSeccVendas = document.querySelector(".liSeccVendas");

const starCountRef = ref(
  db,
  "estabelecimentos/" + usuarioEstabelecimento + "/users/" + userLocalStorage
);
onValue(starCountRef, (snapshot) => {
  const data = snapshot.val();

  cargo = data.catgColab;

  if (cargo == "Gerente Caixa") {
    liSeccProdutos.style.display = "none";
    liSeccColabor.style.display = "none";
  } else {
    liSeccProdutos.style.display = "block";
    liSeccColabor.style.display = "block";
  }

  if (cargo == "Gerente Vendas") {
    liSeccProdutos.style.display = "none";
    liSeccColabor.style.display = "none";
  } else {
    liSeccProdutos.style.display = "block";
    liSeccColabor.style.display = "block";
  }

  if (cargo == "Gerente Estoque") {
    liSeccVendas.style.display = "none";
    liSeccColabor.style.display = "none";
  } else {
    liSeccVendas.style.display = "block";
    liSeccColabor.style.display = "block";
  }

  if (cargo == "Garçom") {
    liSeccProdutos.style.display = "none";
    liSeccColabor.style.display = "none";
  } else {
    liSeccProdutos.style.display = "block";
    liSeccColabor.style.display = "block";
  }
});
