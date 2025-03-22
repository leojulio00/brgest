import { firebaseConfig } from "../logico/firebaseConfig.js";
import { TipoMoeda } from "../saldo/tipoMoeda.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-app.js";
import {
  getDatabase,
  ref,
  onValue,
} from "https://www.gstatic.com/firebasejs/9.14.0/firebase-database.js";

const app = initializeApp(firebaseConfig);
const db = getDatabase();

var usuarioEstabelecimento = window.localStorage.getItem(
  "usuarioEstabelecimento"
);
var bodyClientes = document.querySelector(".bodyClientes");
var divDetalhesCliente = document.querySelector(".divDetalhesCliente");
var tituloModalCliente = document.querySelector(".tituloModalCliente");
var saldoDividaCliente = document.querySelector(".saldoDividaClienteTxt");
var btnVercomprasCliente = document.querySelector(".btnVercomprasCliente")
var btnVerComprasCreditoCliente = document.querySelector(".btnVerComprasCreditoCliente")
var frequenciaComprasCliente = document.querySelector(
  ".frequenciaComprasCliente"
);
var frequenciaComprasClienteCredito = document.querySelector(
  ".frequenciaComprasClienteCredito"
);

// Adicionar atributos para abrir o modal
btnVercomprasCliente.setAttribute("data-bs-toggle", "modal");
btnVercomprasCliente.setAttribute("data-bs-target", "#modalComprasCliente");
btnVerComprasCreditoCliente.setAttribute("data-bs-toggle", "modal");
btnVerComprasCreditoCliente.setAttribute("data-bs-target", "#modalComprasCliente");

// Função para adicionar cliente na lista
function addClienteNaLista(nomeCliente, endereco, telefone, email) {
  let divCol = document.createElement("div");
  let divCard = document.createElement("div");
  let divCardBody = document.createElement("div");
  let nomeClienteTxt = document.createElement("h3");

  nomeClienteTxt.innerHTML = nomeCliente;

  // Adicionar atributos para abrir o modal
  divCard.setAttribute("data-bs-toggle", "modal");
  divCard.setAttribute("data-bs-target", "#modalDetalhesCliente");

  // Adicionar evento de clique para carregar detalhes do cliente
  divCard.addEventListener("click", () => {
    tituloModalCliente.innerHTML = nomeCliente;
    carregarDetalhesCliente(nomeCliente);
  });

  divCol.classList.add("col-md-4", "mb-3");
  divCard.classList.add("card", "cardCliente");
  divCard.style.cursor = "pointer";
  divCard.style.marginBottom = "10px";
  divCardBody.classList.add("card-body");
  nomeClienteTxt.classList.add("card-title");
  nomeClienteTxt.style.fontSize = "18px";
  nomeClienteTxt.style.margin = "0px";

  divCol.appendChild(divCard);
  divCard.appendChild(divCardBody);
  divCardBody.appendChild(nomeClienteTxt);

  if(nomeCliente != undefined){
    bodyClientes.appendChild(divCol);
    
  }
}

// Função para adicionar detalhes do cliente no modal
function addDetalhesClienteModal(cliente) {
  let detalhesHTML = `
    <div class="row">
      <div class="col-md-6">
        <p><strong>Nome:</strong> ${cliente.nomeCliente}</p>
        <p><strong>Endereço:</strong> ${cliente.endereco}</p>
        <p><strong>Telefone:</strong> ${cliente.telefone}</p>
      </div>
      <div class="col-md-6">
        <p><strong>Email:</strong> ${cliente.email}</p>
        <p><strong>Data de Cadastro:</strong> ${cliente.dataCadastro}</p>
      </div>
    </div>
  `;

  divDetalhesCliente.innerHTML = detalhesHTML;
  saldoDividaCliente.innerHTML = cliente.saldoDivida;
  frequenciaComprasClienteCredito.innerHTML = cliente.frequenciaComprasCredito
  frequenciaComprasCliente.innerHTML = cliente.frequenciaCompras + " compras";
  /*cliente.historicoCompras.forEach((e)=>{
    console.log(e)
  })*/

  
  const clientesReff = ref(
    db,
    "estabelecimentos/" + usuarioEstabelecimento + "/" + cliente.nomeCliente
  );

  try {
    onValue(clientesReff, (snapshot) => {
      //bodyClientes.innerHTML = ""; // Limpar lista atual
  
      snapshot.forEach((childSnapshot) => {
        const cliente = childSnapshot.val();
        
        btnVercomprasCliente.addEventListener("click", ()=>{
          console.log("botao clicado")
          console.log(cliente)
          
        })
      });
    })
  } catch (error) {
    console.log(error)
  }


  
}

// Função para carregar detalhes do cliente do Firebase
function carregarDetalhesCliente(nomeCliente) {
  const clienteRef = ref(
    db,
    "estabelecimentos/" + usuarioEstabelecimento + "/clientes/" + nomeCliente
  );

  onValue(clienteRef, (snapshot) => {
    const data = snapshot.val();
    if (data) {
      addDetalhesClienteModal(data);
    }
  });
}

// Função para carregar todos os clientes do Firebase
function carregarTodosClientes() {
  const clientesRef = ref(
    db,
    "estabelecimentos/" + usuarioEstabelecimento + "/clientes"
  );

  onValue(clientesRef, (snapshot) => {
    bodyClientes.innerHTML = ""; // Limpar lista atual

    snapshot.forEach((childSnapshot) => {
      const cliente = childSnapshot.val();
      addClienteNaLista(
        cliente.nomeCliente,
        cliente.endereco,
        cliente.telefone,
        cliente.email
      );
    });
  });
}

// Carregar clientes ao iniciar
window.onload = carregarTodosClientes();
