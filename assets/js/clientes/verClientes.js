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
var divCompradoCliente = document.querySelector(".divCompradoCliente")
var btnVercomprasCliente = document.querySelector(".btnVercomprasCliente")
var btnCloseComprasCliente = document.querySelector(".btnCloseComprasCliente")
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
    "estabelecimentos/" + usuarioEstabelecimento + "/clientes/" + cliente.nomeCliente
  );

  try {
    onValue(clientesReff, (snapshot) => {
      //divCompradoCliente.innerHTML = ""; // Limpar lista atual
  
      const clientes = snapshot.val()
      const historicoCompras = clientes.historicoCompras
      const historicoArray = historicoCompras ? Object.values(historicoCompras) : [];
      /*historicoArray.forEach((eloar) => {
        console.log(eloar)
      })*/
      
      historicoArray.forEach((childSnapshot) => {
        const cliente = childSnapshot;
        //console.log(cliente)
        
        btnVercomprasCliente.addEventListener("click", ()=>{
          //divCompradoCliente.innerHTML = ""; // Limpar lista atual

          let divCol = document.createElement("div");
          let divCard = document.createElement("div");
          let divCardBody = document.createElement("div");
          let row1 = document.createElement("div")
          let col1Row1 = document.createElement("div")
          let titleCol1Row1 = document.createElement("h5")
          let txtCol1Row1 = document.createElement("p")
          let col2Row1 = document.createElement("div")
          let titleCol2Row1 = document.createElement("h5")
          let txtCol2Row1 = document.createElement("p")
          let row2 = document.createElement("div")
          let col1Row2 = document.createElement("div")
          let titleCol1Row2 = document.createElement("h5")
          let txtCol1Row2 = document.createElement("p")
          let col2Row2 = document.createElement("div")
          let titleCol2Row2 = document.createElement("h5")
          let txtCol2Row2 = document.createElement("p")
          let col3Row2 = document.createElement("div")
          let titleCol3Row2 = document.createElement("h5")
          let txtCol3Row2 = document.createElement("p")
          let row3 = document.createElement("div")
          let titleRow3 = document.createElement("h5")
          let row1Row3 = document.createElement("div")
          let subTitleCol1Row3 = document.createElement("p")
          let subTitleCol2Row3 = document.createElement("p")
          let subTitleCol3Row3 = document.createElement("p")
          let subTitleCol4Row3 = document.createElement("p")

          
          divCard.classList.add("card");
          divCard.style.marginBottom = "10px"
          divCard.style.padding = "10px"
          row1.classList.add("row")
          col1Row1.classList.add("col")
          col2Row1.classList.add("col")
          row2.classList.add("row")
          col1Row2.classList.add("col")
          col2Row2.classList.add("col")
          col3Row2.classList.add("col")
          row3.classList.add("row")
          row1Row3.classList.add("row")
          subTitleCol1Row3.classList.add("col")
          subTitleCol2Row3.classList.add("col")
          subTitleCol3Row3.classList.add("col")
          subTitleCol4Row3.classList.add("col")


          const clientesProdutos = cliente.produtos
          const clietesProdutosArray = clientesProdutos ? Object.values(clientesProdutos) : [];

          
          titleCol1Row1.innerHTML = "Codigo da Venda </br>"
          txtCol1Row1.innerHTML = cliente.codigoVenda
          titleCol2Row1.innerHTML = "Responsável da venda </br>"
          txtCol2Row1.innerHTML = cliente.responsavel
          titleCol1Row2.innerHTML = "Método de pagamento </br>"
          txtCol1Row2.innerHTML = Object.keys(cliente.metodoPagamento)[0] 
          titleCol2Row2.innerHTML = "Valor da  compra </br>"
          txtCol2Row2.innerHTML = cliente.precoTotalVenda
          titleCol3Row2.innerHTML = "Data e hora: </br>"
          txtCol3Row2.innerHTML = cliente.horaActual
          titleRow3.innerHTML = "Produtos comprados </br>"
          subTitleCol1Row3.innerHTML = "Nome"
          subTitleCol2Row3.innerHTML = "Qnt"
          subTitleCol3Row3.innerHTML = "Preço /Uni"
          subTitleCol4Row3.innerHTML = "Preço Total"

          
          row3.appendChild(titleRow3)
          row3.appendChild(row1Row3)
          row1Row3.appendChild(subTitleCol1Row3)
          row1Row3.appendChild(subTitleCol2Row3)
          row1Row3.appendChild(subTitleCol3Row3)
          row1Row3.appendChild(subTitleCol4Row3)
          
          clietesProdutosArray.forEach((prod)=>{
            let row2Row3 = document.createElement("div")
            let txt1Row3 = document.createElement("p")
            let txt2Row3 = document.createElement("p")
            let txt3Row3 = document.createElement("p")
            let txt4Row3 = document.createElement("p")

            
            row2Row3.classList.add("row")
            txt1Row3.classList.add("col")
            txt2Row3.classList.add("col")
            txt3Row3.classList.add("col")
            txt4Row3.classList.add("col")
            
            txt1Row3.innerHTML = prod.nomeProduto
            txt2Row3.innerHTML = prod.quantidadeProd
            txt3Row3.innerHTML = prod.precoProduto
            txt4Row3.innerHTML = prod.precoTotalProduto

            
            row2Row3.appendChild(txt1Row3)
            row2Row3.appendChild(txt2Row3)
            row2Row3.appendChild(txt3Row3)
            row2Row3.appendChild(txt4Row3)
            row3.appendChild(row2Row3)
          })

          row1.appendChild(col1Row1)
          col1Row1.appendChild(titleCol1Row1)
          col1Row1.appendChild(txtCol1Row1)
          row1.appendChild(col2Row1)
          col2Row1.appendChild(titleCol2Row1)
          col2Row1.appendChild(txtCol2Row1)
          row2.appendChild(col1Row2)
          col1Row2.appendChild(titleCol1Row2)
          col1Row2.appendChild(txtCol1Row2)
          row2.appendChild(col2Row2)
          col2Row2.appendChild(titleCol2Row2)
          col2Row2.appendChild(txtCol2Row2)
          row2.appendChild(col3Row2)
          col3Row2.appendChild(titleCol3Row2)
          col3Row2.appendChild(txtCol3Row2)
          divCardBody.appendChild(row1)
          divCardBody.appendChild(row2)
          divCardBody.appendChild(row3)
          divCard.appendChild(divCardBody)

          if(cliente.precoTotalVenda){
            divCompradoCliente.appendChild(divCard)

          }
        })
      });

      btnCloseComprasCliente.addEventListener("click", ()=>{
        divCompradoCliente.innerHTML = ""; // Limpar lista atual

      })    
    },
    {
      onlyOnce: true,
    })
  } catch (error) {
    console.log(error)
  }

  try {
    onValue(clientesReff, (snapshot) => {
      //divCompradoCliente.innerHTML = ""; // Limpar lista atual
  
      const clientes = snapshot.val()
      const historicoCompras = clientes.historicoComprasCredito
      const historicoArray = historicoCompras ? Object.values(historicoCompras) : [];
      
      historicoArray.forEach((childSnapshot) => {
        const cliente = childSnapshot;
        
        btnVerComprasCreditoCliente.addEventListener("click", ()=>{

          let divCol = document.createElement("div");
          let divCard = document.createElement("div");
          let divCardBody = document.createElement("div");
          let row1 = document.createElement("div")
          let col1Row1 = document.createElement("div")
          let titleCol1Row1 = document.createElement("h5")
          let txtCol1Row1 = document.createElement("p")
          let col2Row1 = document.createElement("div")
          let titleCol2Row1 = document.createElement("h5")
          let txtCol2Row1 = document.createElement("p")
          let row2 = document.createElement("div")
          let col1Row2 = document.createElement("div")
          let titleCol1Row2 = document.createElement("h5")
          let txtCol1Row2 = document.createElement("p")
          let col2Row2 = document.createElement("div")
          let titleCol2Row2 = document.createElement("h5")
          let txtCol2Row2 = document.createElement("p")
          let col3Row2 = document.createElement("div")
          let titleCol3Row2 = document.createElement("h5")
          let txtCol3Row2 = document.createElement("p")
          let row3 = document.createElement("div")
          let titleRow3 = document.createElement("h5")
          let row1Row3 = document.createElement("div")
          let subTitleCol1Row3 = document.createElement("p")
          let subTitleCol2Row3 = document.createElement("p")
          let subTitleCol3Row3 = document.createElement("p")
          let subTitleCol4Row3 = document.createElement("p")

          
          divCard.classList.add("card");
          divCard.style.marginBottom = "10px"
          divCard.style.padding = "10px"
          row1.classList.add("row")
          col1Row1.classList.add("col")
          col2Row1.classList.add("col")
          row2.classList.add("row")
          col1Row2.classList.add("col")
          col2Row2.classList.add("col")
          col3Row2.classList.add("col")
          row3.classList.add("row")
          row1Row3.classList.add("row")
          subTitleCol1Row3.classList.add("col")
          subTitleCol2Row3.classList.add("col")
          subTitleCol3Row3.classList.add("col")
          subTitleCol4Row3.classList.add("col")


          const clientesProdutos = cliente.produtos
          const clietesProdutosArray = clientesProdutos ? Object.values(clientesProdutos) : [];

          
          titleCol1Row1.innerHTML = "Codigo da Venda </br>"
          txtCol1Row1.innerHTML = cliente.codigoVenda
          titleCol2Row1.innerHTML = "Responsável da venda </br>"
          txtCol2Row1.innerHTML = cliente.responsavel
          titleCol1Row2.innerHTML = "Método de pagamento </br>"
          txtCol1Row2.innerHTML = Object.keys(cliente.metodoPagamento)[0] 
          titleCol2Row2.innerHTML = "Valor da  compra </br>"
          txtCol2Row2.innerHTML = cliente.precoTotalVenda
          titleCol3Row2.innerHTML = "Data e hora: </br>"
          txtCol3Row2.innerHTML = cliente.horaActual
          titleRow3.innerHTML = "Produtos comprados </br>"
          subTitleCol1Row3.innerHTML = "Nome"
          subTitleCol2Row3.innerHTML = "Qnt"
          subTitleCol3Row3.innerHTML = "Preço /Uni"
          subTitleCol4Row3.innerHTML = "Preço Total"

          
          row3.appendChild(titleRow3)
          row3.appendChild(row1Row3)
          row1Row3.appendChild(subTitleCol1Row3)
          row1Row3.appendChild(subTitleCol2Row3)
          row1Row3.appendChild(subTitleCol3Row3)
          row1Row3.appendChild(subTitleCol4Row3)
          
          clietesProdutosArray.forEach((prod)=>{
            let row2Row3 = document.createElement("div")
            let txt1Row3 = document.createElement("p")
            let txt2Row3 = document.createElement("p")
            let txt3Row3 = document.createElement("p")
            let txt4Row3 = document.createElement("p")

            
            row2Row3.classList.add("row")
            txt1Row3.classList.add("col")
            txt2Row3.classList.add("col")
            txt3Row3.classList.add("col")
            txt4Row3.classList.add("col")
            
            txt1Row3.innerHTML = prod.nomeProduto
            txt2Row3.innerHTML = prod.quantidadeProd
            txt3Row3.innerHTML = prod.precoProduto
            txt4Row3.innerHTML = prod.precoTotalProduto

            
            row2Row3.appendChild(txt1Row3)
            row2Row3.appendChild(txt2Row3)
            row2Row3.appendChild(txt3Row3)
            row2Row3.appendChild(txt4Row3)
            row3.appendChild(row2Row3)
          })

          row1.appendChild(col1Row1)
          col1Row1.appendChild(titleCol1Row1)
          col1Row1.appendChild(txtCol1Row1)
          row1.appendChild(col2Row1)
          col2Row1.appendChild(titleCol2Row1)
          col2Row1.appendChild(txtCol2Row1)
          row2.appendChild(col1Row2)
          col1Row2.appendChild(titleCol1Row2)
          col1Row2.appendChild(txtCol1Row2)
          row2.appendChild(col2Row2)
          col2Row2.appendChild(titleCol2Row2)
          col2Row2.appendChild(txtCol2Row2)
          row2.appendChild(col3Row2)
          col3Row2.appendChild(titleCol3Row2)
          col3Row2.appendChild(txtCol3Row2)
          divCardBody.appendChild(row1)
          divCardBody.appendChild(row2)
          divCardBody.appendChild(row3)
          divCard.appendChild(divCardBody)

          if(cliente.precoTotalVenda){
            divCompradoCliente.appendChild(divCard)

          }
          
        })
      });
      btnCloseComprasCliente.addEventListener("click", ()=>{
        divCompradoCliente.innerHTML = ""; // Limpar lista atual

      })
    },
    {
      onlyOnce: true,
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
