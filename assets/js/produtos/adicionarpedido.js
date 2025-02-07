/*import { firebaseConfig} from "./firebaseConfig.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-app.js";
import { getDatabase, set, ref, onValue } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-database.js";
var codPedido = document.querySelector(".codPedido")
var estadoPedi = document.querySelector(".estadoPedi")
var prodPed = document.querySelector(".prodPed")
var btnRegPedido = document.querySelector(".btnRegPedido")
var btnAltPedido = document.querySelector(".btnAltPedido")
//var btnCanPedido = document.querySelector(".btnCanPedido")
var alertaInfo = document.querySelector('.alerta-info')
var alertaErro = document.querySelector('.alerta-erro')
var alertaSucesso = document.querySelector('.alerta-sucesso')

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

*btnRegPedido.addEventListener("click", ()=>{
function adicionarPedido(codPedido, prodPed, estadoPedi) {
  const db = getDatabase();
  set(ref(db, 'pedidosV/' + codPedido), {
    prodPed: prodPed,
    estadoPedi: estadoPedi
  });
}*

btnRegPedido.addEventListener("click", ()=>{
    function adicionarPedido(codPedido, prodPed, estadoPedi) {
      const db = getDatabase();
      set(ref(db, 'pedidos/' + codPedido), {
        prodPed: prodPed,
        estadoPedi: estadoPedi
      });
    }

adicionarPedido(codPedido.value, prodPed.value, estadoPedi.value)

    alert("Pedido Registado com sucesso")
    codPedido.value = ""
    estadoPedi.value = ""
    prodPed.value = ""
})

btnAltPedido.addEventListener("click", ()=>{
function adicionarProd(codPedido, prodPed, estadoPedi) {
    const db = getDatabase();
    set(ref(db, 'pedidos/' + codPedido), {
    estadoPedi: estadoPedi,
    prodPed: prodPed
    });
}

adicionarProd(codPedido.value, prodPed.value, estadoPedi.value)
    alert("Pedido Registado com sucesso")
    codPedido.value = ""
    estadoPedi.value = ""
    prodPed.value = ""
})*/