import { firebaseConfig } from "../logico/firebaseConfig.js";
import { TipoMoeda } from "../saldo/tipoMoeda.js";
import { usuarioMail, usuarioNome, usuarioTel } from "../login/login.js";
import { CodigoMesaClicado } from "../mesas/mesas.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-app.js";
import {
  getDatabase,
  ref,
  remove,
  onValue,
  set,
  onChildAdded,
  update,
  query,
  orderByChild,
} from "https://www.gstatic.com/firebasejs/9.14.0/firebase-database.js";
//import { getFirestore, collection, addDoc, setDoc, doc, query, where, getDocs } from 'https://www.gstatic.com/firebasejs/9.14.0/firebase-firestore.js'

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

var cardTotalVendas = document.querySelector(".cardTotalVendas");
var divVendasEfectuadas = document.querySelector(".divVendasEfectuadas");
var divVendasEfectuadasDetalhado = document.querySelector(
  ".divVendasEfectuadasDetalhado"
);
var divVendasEfectuadasDetalhadoMesa = document.querySelector(
  ".divVendasEfectuadasDetalhadoMesa"
);
var btnCloseVerVendas = document.querySelectorAll(".btnCloseVerVendas");
var divVendasEfectuadasDetalhadoMetodo = document.querySelector(
  ".divVendasEfectuadasDetalhadoMetodo"
);
var tituloCardMetodo = document.querySelector(".tituloCardMetodo");
var tituloCardResponsavel = document.querySelector(".tituloCardResponsavel");
var tituloTroco = document.querySelector(".tituloTroco");
var tituloDataHoraDaVenda = document.querySelector(".tituloDataHoraDaVenda");

var usuarioEstabelecimento = window.localStorage.getItem(
  "usuarioEstabelecimento"
);

const dbRef = ref(
  db,
  "/estabelecimentos/" + usuarioEstabelecimento + "/vendas/todasVendas"
);
//const dbReff = ref(db, '/estabelecimentos/' + usuarioEstabelecimento + '/vendas/todasVendas').orderByChild('lucroVenda')
const most = query(
  ref(
    db,
    "/estabelecimentos/" +
      usuarioEstabelecimento +
      "/vendas/todasVendas/1/produtos"
  ),
  orderByChild("nomeProduto")
);

/*onValue(dbRef, (snapshot)=>{
    const data = snapshot.val()

    console.log(data)
    var produtos = []

    snapshot.forEach(childSnapshot => {
        produtos.push(childSnapshot.val().produtos)
    })
    

    produtos.forEach((val)=>{
        console.log(val)
    })
})*

onValue(most, (snapshot)=>{
    console.log(snapshot.val())
})*/

//ADICIONANDO OS ATRIBUTOS PARA ABIR O MODAL DO CARD TOTAL VENDAS
cardTotalVendas.setAttribute("data-bs-toggle", "modal");
cardTotalVendas.setAttribute("data-bs-target", "#modalVerVendas");

//FUNÇÃO PARA APRESENTAR DETALHES DE CADA VENDA EFECTUADA
function addVendasNaDiv(codigoVenda, precoTotalVenda, horaActual) {
  let divCol = document.createElement("div");
  let divCard = document.createElement("div");
  let divCardBody = document.createElement("div");
  let codigoMesaTxt = document.createElement("h5");
  let rotuloMesaTxt = document.createElement("h5");
  let tamanhoMesaTxt = document.createElement("h5");

  codigoMesaTxt.innerHTML = "cod.: " + codigoVenda;
  rotuloMesaTxt.innerHTML = "val.: " + precoTotalVenda + " MZN";
  tamanhoMesaTxt.innerHTML = horaActual;

  divCard.setAttribute("data-bs-dismiss", "modal");

  divCard.setAttribute("data-bs-toggle", "modal");
  divCard.setAttribute("data-bs-target", "#modalVerVendasDetalhado");

  //ADICIONANDO ACÇÃO DE CLIC EM CADA DIV GERADA NA FUNÇÃO
  divCard.addEventListener("click", async () => {
    //FECHANDO O MODAL PRINCIPAL E ABRINDO O NOVO COM INFORMAÇÕES DE CADA VENDA
    divCard.setAttribute("data-bs-dismiss", "modal");

    /*function addMetodoDivVerProdutos(nomeMetodo){
          let divCol = document.createElement('div')
          let divCard = document.createElement('div')
          let divCardBody = document.createElement('div')
          let nomeProdutoTxt = document.createElement('p')
        
          nomeProdutoTxt.innerHTML = nomeMetodo
        
          //divCard.setAttribute('data-bs-dismiss', 'modal')
        
        
          divCol.classList.add('col')
          divCol.style.margin = '5px 0px'
          divCard.classList.add('card')
          divCard.classList.add('cardRegVendasSelecionado')
          divCardBody.classList.add('card-body')
          divCardBody.style.display = 'flex'
          divCardBody.style.flexDirection = 'row'
          divCardBody.style.flexWrap = 'nowrap'
          divCardBody.style.justifyContent = 'space-between'
          divCardBody.style.margin = '5px 0px'
          nomeProdutoTxt.classList.add('card-title')
          nomeProdutoTxt.style.margin = '0px 5px'
        
          divCol.appendChild(divCard)  
          divCard.appendChild(divCardBody) 
          divCardBody.appendChild(nomeProdutoTxt)  
        
          divVendasEfectuadasDetalhadoMetodo.appendChild(divCol)
        }*/

    //PEGANDO METODO DE PAGAMENTO EFECTUADO NA VENDA
    const dbRefProdE = ref(
      db,
      "estabelecimentos/" +
        usuarioEstabelecimento +
        "/vendas/todasVendas/" +
        codigoVenda +
        "/metodoPagamento"
    );
    onValue(
      dbRefProdE,
      (snapshot) => {
        const data = snapshot.val();

        var todosMetodos = [];

        snapshot.forEach((childSnapshot) => {
          todosMetodos.push(childSnapshot.val());
        });

        /*todosMetodos.forEach((val)=>{
            addMetodoDivVerProdutos(val.nomeMetodo)
          })*/

        tituloCardMetodo.innerHTML = todosMetodos[0].nomeMetodo;
      },
      {
        onlyOnce: true,
      }
    );

    //PEGANDO RESPONSAVEL DA EFECTUADO NA VENDA
    const dbRefProdRespon = ref(
      db,
      "estabelecimentos/" +
        usuarioEstabelecimento +
        "/vendas/todasVendas/" +
        codigoVenda +
        ""
    );
    onValue(
      dbRefProdRespon,
      (snapshot) => {
        const data = snapshot.val();

        tituloCardResponsavel.innerHTML = data.responsavel;
      },
      {
        onlyOnce: true,
      }
    );

    //FUNÇÃO PARA LISTAR TODOS OS PRODUTOS VENDIDOS
    function addVendasNaDiv(
      nomeProduto,
      quantidadeProd,
      precoProduto,
      precoTotalProduto
    ) {
      let divCol = document.createElement("div");
      let divCard = document.createElement("div");
      let divCardBody = document.createElement("div");
      let nomeProdutoTxt = document.createElement("p");
      let quantidadeProdutoTxt = document.createElement("p");
      let precoProdutoTxt = document.createElement("p");
      let precoTotalProdutoTxt = document.createElement("p");

      nomeProdutoTxt.innerHTML = nomeProduto;
      quantidadeProdutoTxt.innerHTML = quantidadeProd;
      precoProdutoTxt.innerHTML = precoProduto + " MZN";
      precoTotalProdutoTxt.innerHTML = precoTotalProduto + " MZN";

      //divCard.setAttribute('data-bs-dismiss', 'modal')

      divCol.classList.add("col");
      divCol.style.margin = "5px 0px";
      divCard.classList.add("card");
      divCard.classList.add("cardRegVendasSelecionado");
      divCardBody.classList.add("card-body");
      divCardBody.style.display = "flex";
      divCardBody.style.flexDirection = "row";
      divCardBody.style.flexWrap = "nowrap";
      divCardBody.style.justifyContent = "space-between";
      divCardBody.style.margin = "5px 0px";
      nomeProdutoTxt.classList.add("card-title");
      nomeProdutoTxt.style.margin = "0px 5px";
      quantidadeProdutoTxt.classList.add("card-title");
      quantidadeProdutoTxt.style.margin = "0px 5px";
      precoProdutoTxt.classList.add("card-text");
      precoProdutoTxt.style.margin = "0px 5px";
      precoTotalProdutoTxt.classList.add("card-text");
      precoTotalProdutoTxt.style.margin = "0px 5px";

      divCol.appendChild(divCard);
      divCard.appendChild(divCardBody);
      divCardBody.appendChild(nomeProdutoTxt);
      divCardBody.appendChild(quantidadeProdutoTxt);
      divCardBody.appendChild(precoProdutoTxt);
      divCardBody.appendChild(precoTotalProdutoTxt);

      divVendasEfectuadasDetalhado.appendChild(divCol);
      //divVendasEfectuadasDetalhadoMesa.appendChild(divCol)
    }

    //FUNÇÃO PARA LISTAR TODOS OS PRODUTOS VENDIDOS
    function addVendasNaDivMesa(
      nomeProduto,
      quantidadeProd,
      precoProduto,
      precoTotalProduto
    ) {
      let divCol = document.createElement("div");
      let divCard = document.createElement("div");
      let divCardBody = document.createElement("div");
      let nomeProdutoTxt = document.createElement("p");
      let quantidadeProdutoTxt = document.createElement("p");
      let precoProdutoTxt = document.createElement("p");
      let precoTotalProdutoTxt = document.createElement("p");

      nomeProdutoTxt.innerHTML = nomeProduto;
      quantidadeProdutoTxt.innerHTML = quantidadeProd;
      precoProdutoTxt.innerHTML = precoProduto + " MZN";
      precoTotalProdutoTxt.innerHTML = precoTotalProduto + " MZN";

      //divCard.setAttribute('data-bs-dismiss', 'modal')

      divCol.classList.add("col");
      divCol.style.margin = "5px 0px";
      divCard.classList.add("card");
      divCard.classList.add("cardRegVendasSelecionado");
      divCardBody.classList.add("card-body");
      divCardBody.style.display = "flex";
      divCardBody.style.flexDirection = "row";
      divCardBody.style.flexWrap = "nowrap";
      divCardBody.style.justifyContent = "space-between";
      divCardBody.style.margin = "5px 0px";
      nomeProdutoTxt.classList.add("card-title");
      nomeProdutoTxt.style.margin = "0px 5px";
      quantidadeProdutoTxt.classList.add("card-title");
      quantidadeProdutoTxt.style.margin = "0px 5px";
      precoProdutoTxt.classList.add("card-text");
      precoProdutoTxt.style.margin = "0px 5px";
      precoTotalProdutoTxt.classList.add("card-text");
      precoTotalProdutoTxt.style.margin = "0px 5px";

      divCol.appendChild(divCard);
      divCard.appendChild(divCardBody);
      divCardBody.appendChild(nomeProdutoTxt);
      divCardBody.appendChild(quantidadeProdutoTxt);
      divCardBody.appendChild(precoProdutoTxt);
      divCardBody.appendChild(precoTotalProdutoTxt);

      //divVendasEfectuadasDetalhado.appendChild(divCol)
      divVendasEfectuadasDetalhadoMesa.appendChild(divCol);
    }

    function addTdaVendasNaDiv(produtos) {
      divVendasEfectuadasDetalhado.innerHTML = "";
      produtos.forEach((element) => {
        addVendasNaDiv(
          element.nomeProduto,
          element.quantidadeProd,
          element.precoProduto,
          element.precoTotalProduto
        );
      });

      /*produtos.forEach(element => {
              addVendasNaDivMesa(element.nomeProduto, element.quantidadeProd, element.precoProduto, element.precoTotalProduto)
          });*/
    }

    function addTdaVendasNaDivMesa(produtos) {
      divVendasEfectuadasDetalhadoMesa.innerHTML = "";
      /*produtos.forEach(element => {
              addVendasNaDiv(element.nomeProduto, element.quantidadeProd, element.precoProduto, element.precoTotalProduto)
          });*/

      produtos.forEach((element) => {
        addVendasNaDivMesa(
          element.nomeProduto,
          element.quantidadeProd,
          element.precoProduto,
          element.precoTotalProduto
        );
      });
    }

    function PegarTdsVendas() {
      const dbRef = ref(
        db,
        "estabelecimentos/" +
          usuarioEstabelecimento +
          "/vendas/todasVendas/" +
          codigoVenda +
          "/produtos"
      );

      let todasVendas = [];

      onValue(dbRef, (snapshot) => {
        snapshot.forEach((childSnapshot) => {
          todasVendas.push(childSnapshot.val());
        });

        addTdaVendasNaDiv(todasVendas);
      });
    }

    function PegarTdsVendasMesa() {
      const dbRefMesa = ref(
        db,
        "estabelecimentos/" +
          usuarioEstabelecimento +
          "/vendas/todasVendas/" +
          codigoVenda +
          "/produtosMesa"
      );

      let todasMesas = [];

      onValue(dbRefMesa, (snapshot) => {
        snapshot.forEach((childSnapshot) => {
          todasMesas.push(childSnapshot.val());
        });

        addTdaVendasNaDivMesa(todasMesas);
      });
    }

    // Adicionando informações adicionais ao modal
    const dbRefVendaDetalhes = ref(
      db,
      "estabelecimentos/" +
        usuarioEstabelecimento +
        "/vendas/todasVendas/" +
        codigoVenda
    );
    onValue(
      dbRefVendaDetalhes,
      (snapshot) => {
        const data = snapshot.val();

        // Atualizando o innerHTML com o troco da venda
        tituloTroco.innerHTML = "Troco: " + (data.troco || 0) + " MZN";

        // Atualizando o innerHTML com a data e hora da venda
        tituloDataHoraDaVenda.innerHTML =
          "Data e Hora: " + (data.horaActual || "N/A");
      },
      {
        onlyOnce: true,
      }
    );

    PegarTdsVendas();
    PegarTdsVendasMesa();
  });

  divCol.classList.add("col");
  divCol.style.margin = "5px 0px";
  divCard.classList.add("card");
  divCard.classList.add("cardRegVendasSelecionado");
  divCardBody.classList.add("card-body");
  divCardBody.style.display = "flex";
  divCardBody.style.flexDirection = "row";
  divCardBody.style.flexWrap = "nowrap";
  divCardBody.style.justifyContent = "space-between";
  divCardBody.style.margin = "5px 0px";
  codigoMesaTxt.classList.add("card-title");
  codigoMesaTxt.style.margin = "0px";
  rotuloMesaTxt.classList.add("card-title");
  rotuloMesaTxt.style.margin = "0px";
  tamanhoMesaTxt.classList.add("card-text");
  tamanhoMesaTxt.style.margin = "0px";

  divCol.appendChild(divCard);
  divCard.appendChild(divCardBody);
  divCardBody.appendChild(codigoMesaTxt);
  divCardBody.appendChild(rotuloMesaTxt);
  divCardBody.appendChild(tamanhoMesaTxt);

  divVendasEfectuadas.appendChild(divCol);
}

function addTdaVendasNaDiv(produtos) {
  divVendasEfectuadas.innerHTML = "";
  produtos.forEach((element) => {
    addVendasNaDiv(
      element.codigoVenda,
      element.precoTotalVenda,
      element.horaActual
    );
  });
}

function PegarTdsVendas() {
  const dbRef = ref(
    db,
    "estabelecimentos/" + usuarioEstabelecimento + "/vendas/todasVendas"
  );

  onValue(dbRef, (snapshot) => {
    var todasMesas = [];

    snapshot.forEach((childSnapshot) => {
      todasMesas.push(childSnapshot.val());
    });

    addTdaVendasNaDiv(todasMesas);
  });
}

PegarTdsVendas();

setInterval(() => {}, 500);

cardTotalVendas.addEventListener("click", () => {
  //alert('click')
});
