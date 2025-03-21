import { firebaseConfig } from "../logico/firebaseConfig.js";
import {
  usuarioMail,
  usuarioNome,
  usuarioTel,
  usuarioEnder,
  usuarioCargo,
} from "../login/login.js";
import { TipoMoeda } from "../saldo/tipoMoeda.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-app.js";
import {
  getDatabase,
  ref,
  set,
  child,
  onValue,
  get,
  remove,
} from "https://www.gstatic.com/firebasejs/9.14.0/firebase-database.js";

var usuarioEstabelecimento = window.localStorage.getItem(
  "usuarioEstabelecimento"
);
var nomeProdDetalheProduto = document.querySelector(".nomeProdDetalheProduto");
var precVendaRDetalheProduto = document.querySelector(
  ".precVendaRDetalheProduto"
);
var precCompraDetalheProduto = document.querySelector(
  ".precCompraDetalheProduto"
);
var lucroVendaDetalheProduto = document.querySelector(
  ".lucroVendaDetalheProduto"
);
var quantProdEDetalheProduto = document.querySelector(
  ".quantProdEDetalheProduto"
);
var dataValidadeDetalheProduto = document.querySelector(
  ".dataValidadeDetalheProduto"
);
var tituloModalProdutos = document.querySelector(".tituloModalProdutos");
var divDetalhesProdutos = document.querySelector(".divDetalhesProdutos");
var reviewProduto = document.querySelector(".reviewProduto");
var editarProduto = document.querySelector(".editarProduto");
var btnCloseDetalhesprodutos = document.querySelector(
  ".btnCloseDetalhesprodutos"
);
var btnEditarProduto = document.querySelector(".btnEditarProduto");
var btnSalvarAlteracoesProduto = document.querySelector(
  ".btnSalvarAlteracoesProduto"
);
var btnDeletarProduto = document.querySelector(".btnDeletarProduto");
var cod = 0;
var bodyEstoque = document.querySelector(".bodyEstoque");
var btnRefresh = document.querySelector(".btnRefresh");
var alertaInfo = document.querySelector(".alerta-info");
var alertaErro = document.querySelector(".alerta-erro");
var alertaSucesso = document.querySelector(".alerta-sucesso");
var valorLucroVenda = 0;

const app = initializeApp(firebaseConfig);
const db = getDatabase();

//FUNCAO ALERTA DE SUCESSO
function AlertaSucesso(mensagem) {
  let info = document.createElement("p");
  info.style.margin = "0px";
  info.style.padding = "0px";
  info.innerHTML = mensagem;
  alertaSucesso.appendChild(info);
  alertaSucesso.style.display = "block";
  setTimeout(() => {
    alertaSucesso.style.display = "none";
    info.innerHTML = "";
  }, 2500);
}

//FUNCAO ALERTA DE ERRO
function AlertaErro(mensagem) {
  let info = document.createElement("p");
  info.style.margin = "0px";
  info.style.padding = "0px";
  info.innerHTML = mensagem;
  alertaErro.appendChild(info);
  alertaErro.style.display = "block";
  setTimeout(() => {
    alertaErro.style.display = "none";
    info.innerHTML = "";
  }, 2500);
}

//FUNÇÃO DE ALERTA DE INFORMAÇÃO
function AlertaInfo(mensagem) {
  let info = document.createElement("p");
  info.style.margin = "0px";
  info.style.padding = "0px";
  info.innerHTML = mensagem;
  alertaInfo.appendChild(info);
  alertaInfo.style.display = "block";
  setTimeout(() => {
    alertaInfo.style.display = "none";
    info.innerHTML = "";
  }, 2500);
}

//FUNCAO PARA PEGAR TODOS OS DADOS DO PRODUTO E COLOCAR NO MODAL
function AddDetalhesProdModal(
  nomeProd,
  categoriaProd,
  precCompra,
  precVenda,
  quantiProd,
  lucroProd,
  ticketMedio,
  dataValidade,
  horaReg
) {
  let divCol = document.createElement("div");
  let divCard = document.createElement("div");
  let divCardBody = document.createElement("div");
  let produDetalhes = document.createElement("h5");

  produDetalhes.innerHTML =
    "<strong>Nome:</strong> " +
    nomeProd +
    "</br>" +
    "</br>" +
    "<strong>Categoria:</strong> " +
    categoriaProd +
    "</br>" +
    "</br>" +
    "<strong>Preço de compra:</strong> " +
    precCompra +
    " " +
    TipoMoeda +
    "</br>" +
    "</br>"+
    "<strong>Preço de venda:</strong> " +
    precVenda +
    " " +
    TipoMoeda +
    "</br>" +
    "</br>" +
    "<strong>Lucro por unidade:</strong> " +
    lucroProd +
    " " +
    TipoMoeda +
    "</br>" +
    "</br>"  +
    "<strong>Quantidade no estoque:</strong> " +
    quantiProd +
    "</br>" +
    "</br>" +
    "<strong>Média de facturação por unidade:</strong> " +
    ticketMedio +
    "</br>" +
    "</br>" +
    "<strong>Data de validade:</strong> " +
    dataValidade +
    "</br>" +
    "</br>";

  divCol.classList.add("col");
  divCard.classList.add("card");
  divCard.classList.add("cardRegVendas");
  divCardBody.classList.add("card-body");
  produDetalhes.style.fontSize = "18px";
  produDetalhes.style.margin = "0px";

  divCol.appendChild(divCard);
  divCard.appendChild(divCardBody);
  divCardBody.appendChild(produDetalhes);

  divDetalhesProdutos.innerHTML = "";
  divDetalhesProdutos.appendChild(divCol);
}

//FUNCO PARA CARREGAR INFORMACOES DO PRODUTO NOS INPUTS
function addDetalhesInputs(
  nomeProd,
  precCompra,
  precVenda,
  quantiProd,
  lucroProd,
  dataValidade
) {
  nomeProdDetalheProduto.value = nomeProd;
  precVendaRDetalheProduto.value = precVenda;
  precCompraDetalheProduto.value = precCompra;
  lucroVendaDetalheProduto.value = lucroProd;
  quantProdEDetalheProduto.value = quantiProd;
  dataValidadeDetalheProduto.value = dataValidade;
}

//FUNCAO PARA LISTAR TODOS OS PRODUTOS CADASTRADOS
function addItemToTable(
  nomeProd,
  categoriaProd,
  quantiProd,
  dataValidade,
  dataModi,
  precVenda,
  precCompra,
  lucroProd,
  ticketMedio,
  horaReg
) {
  reviewProduto.style.display = "block";
  editarProduto.style.display = "none";

  let divCol = document.createElement("div");
  let divCard = document.createElement("div");
  let divCardBody = document.createElement("div");
  let produNome = document.createElement("h3");
  let produQuantidade = document.createElement("h3");
  let produPreco = document.createElement("h3");

  produNome.innerHTML = nomeProd;
  produQuantidade.innerHTML = "Qtn.: " + quantiProd;
  produPreco.innerHTML = "Preço: " + precVenda;

  //ADICIONANDO OS ATRIBUTOS PARA ABIR O MODAL DO CARD TOTAL VENDAS
  divCard.setAttribute("data-bs-toggle", "modal");
  divCard.setAttribute("data-bs-target", "#modalDetalhesProdutos");

  //FUNCAO PARA CALCULAR LUCRO E ADICIONAR NO INPUT
  precVendaRDetalheProduto.addEventListener("keyup", () => {
    valorLucroVenda = Math.abs(
      precCompraDetalheProduto.value - precVendaRDetalheProduto.value
    );

    lucroVendaDetalheProduto.value = valorLucroVenda;
  });

  divCard.addEventListener("click", () => {
    tituloModalProdutos.innerHTML = nomeProd;

    AddDetalhesProdModal(
      nomeProd,
      categoriaProd,
      precCompra,
      precVenda,
      quantiProd,
      lucroProd,
      ticketMedio,
      dataValidade,
      horaReg
    );

    addDetalhesInputs(
      nomeProd,
      precCompra,
      precVenda,
      quantiProd,
      lucroProd,
      ticketMedio,
      dataValidade
    );

    btnSalvarAlteracoesProduto.addEventListener("click", () => {
      try {
        set(
          ref(
            db,
            "/estabelecimentos/" +
              usuarioEstabelecimento +
              "/produtos/todosProdutos/" +
              nomeProd +
              "/precCompra"
          ),
          precCompraDetalheProduto.value
        );
        set(
          ref(
            db,
            "/estabelecimentos/" +
              usuarioEstabelecimento +
              "/produtos/todosProdutos/" +
              nomeProd +
              "/precVenda"
          ),
          precVendaRDetalheProduto.value
        );
        set(
          ref(
            db,
            "/estabelecimentos/" +
              usuarioEstabelecimento +
              "/produtos/todosProdutos/" +
              nomeProd +
              "/lucroProd"
          ),
          lucroVendaDetalheProduto.value
        );
        set(
          ref(
            db,
            "/estabelecimentos/" +
              usuarioEstabelecimento +
              "/produtos/todosProdutos/" +
              nomeProd +
              "/quantProdE"
          ),
          quantProdEDetalheProduto.value
        );
        set(
          ref(
            db,
            "/estabelecimentos/" +
              usuarioEstabelecimento +
              "/produtos/todosProdutos/" +
              nomeProd +
              "/dataValidade"
          ),
          dataValidadeDetalheProduto.value
        );

        AlertaSucesso("Informações actualizadas com sucesso");
        window.location.reload()
      } catch (error) {
        console.log(error);
        AlertaErro("Ocorreu algum erro durante o processo");
      }
    });

    btnDeletarProduto.addEventListener("click", () => {
      try {
        remove(
          ref(
            db,
            "/estabelecimentos/" +
              usuarioEstabelecimento +
              "/produtos/todosProdutos/" +
              nomeProd
          )
        );

        AlertaSucesso("Informações actualizadas com sucesso");
        window.location.reload()
        btnCloseDetalhesprodutos.click();
      } catch (error) {
        console.log(error);
        AlertaErro("Ocorreu algum erro durante o processo");
      }
    });
  });

  divCol.classList.add("col");
  divCard.classList.add("card");
  divCard.classList.add("cardRegVendas");
  divCardBody.classList.add("card-body");
  divCardBody.style.display = "flex";
  divCardBody.style.flexDirection = "row";
  divCardBody.style.justifyContent = "space-between";
  produNome.classList.add("card-title");
  produNome.style.fontSize = "18px";
  produNome.style.margin = "0px";
  produPreco.classList.add("card-title");
  produPreco.style.fontSize = "18px";
  produPreco.style.margin = "0px";
  produQuantidade.classList.add("card-text");
  produQuantidade.style.fontSize = "18px";
  produQuantidade.style.margin = "0px";

  divCol.appendChild(divCard);
  divCard.appendChild(divCardBody);
  divCardBody.appendChild(produNome);
  divCardBody.appendChild(produPreco);
  divCardBody.appendChild(produQuantidade);

  bodyEstoque.appendChild(divCol);
}

function addAllItemsToTable(produtosEstoque) {
  bodyEstoque.innerHTML = "";
  produtosEstoque.forEach((element) => {
    addItemToTable(
      element.nomeProd,
      element.categoriaProd,
      element.quantProdE,
      element.dataValidade,
      element.ticketMedio,
      element.precVenda,
      element.precCompra,
      element.lucroProd,
      element.ticketMedio,
      element.horaReg
    );
  });
}

function GetAllDataOnce() {
  const dbRef = ref(db);

  get(child(dbRef, "produtosEstoque")).then((snapshot) => {
    var produtos = [];

    snapshot.forEach((childSnapshot) => {
      produtos.push(childSnapshot.val());
    });
    addAllItemsToTable(produtos);
  });
}

function GetAllDataRealtime() {
  const dbRef = ref(
    db,
    "estabelecimentos/" + usuarioEstabelecimento + "/produtos/todosProdutos/"
  );

  onValue(dbRef, (snapshot) => {
    var produtos = [];

    snapshot.forEach((childSnapshot) => {
      produtos.push(childSnapshot.val());
    });

    addAllItemsToTable(produtos);
  });
}

/*btnRefresh.addEventListener('click', ()=>{
    //GetAllDataRealtime()
    window.onload
})*/

window.onload = GetAllDataRealtime();

btnEditarProduto.addEventListener("click", () => {
  reviewProduto.style.display = "none";
  editarProduto.style.display = "block";
});

btnCloseDetalhesprodutos.addEventListener("click", () => {
  window.onload = GetAllDataRealtime();
});
