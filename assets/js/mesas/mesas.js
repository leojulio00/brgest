import { firebaseConfig } from "../logico/firebaseConfig.js";
import {
  usuarioMail,
  usuarioNome,
  usuarioTel,
  usuarioEnder,
  usuarioCargo,
} from "../login/login.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-app.js";
import { TipoMoeda } from "../saldo/tipoMoeda.js";
import {
  getDatabase,
  ref,
  remove,
  onValue,
  set,
  onChildAdded,
} from "https://www.gstatic.com/firebasejs/9.14.0/firebase-database.js";

var usuarioEstabelecimento = window.localStorage.getItem(
  "usuarioEstabelecimento"
);
var nomeUsuario = window.localStorage.getItem("nomeUser");
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
var codMesa = document.querySelector(".codMesa");
var tamanhoMesa = document.querySelector(".tamanhoMesa");
var formaMesaSelect = document.querySelector(".formaMesaSelect");
var rotuloMesa = document.querySelector(".rotuloMesa");
var divSelecProdutosMesa = document.querySelector(".divSelecProdutosMesa");
var selecProdutosMesa = document.querySelector(".selecProdutosMesa");
var produtosEscolhidoFinal = document.querySelector(
  ".produtosEscolhidoFinalMesa"
);
var finalizarPreVenda = document.querySelector(".finalizarPreVenda");
var divVerMesasDisponiveis = document.querySelector(".divVerMesasDisponiveis");
var finalizarAdicaoMesa = document.querySelector(".finalizarAdicaoMesa");
var DivSelecionarProdutosMesa = document.querySelector(
  ".DivSelecionarProdutosMesa"
);
var listarTdsProdutosMesa = document.querySelector(".listarTdsProdutosMesa");
var spanTotalVerProdutosMesa = document.querySelector(
  ".spanTotalVerProdutosMesa"
);
var metodoPagamentoEscolhidoMesa = document.querySelector(
  ".metodoPagamentoEscolhidoMesa"
);
var metodosPagamentosMesa = document.querySelector(".metodosPagamentosMesa");
var detalhesMesa = document.querySelector(".detalhesMesa");
var btnCadastrarMesa = document.querySelector(".btnCadastrarMesa");
var btnFecharModalVendasMesa = document.querySelector(
  ".btnFecharModalVendasMesa"
);
var btnCancelar2 = document.querySelector(".btnCancelar2");
var btnCancelarMesa = document.querySelector(".btnCancelarMesa");
var btnAdicionarMetodoMesa = document.querySelector(".btnAdicionarMetodoMesa");
var btnAdicionarProdutosMesa = document.querySelector(
  ".btnAdicionarProdutosMesa"
);
var btnContinuarMesa = document.querySelector(".btnContinuarMesa");
var btnProximoAddMesa = document.querySelector(".btnProximoAddMesa");
var btnFecharContaMesa = document.querySelector(".btnFecharContaMesa");
var btnRegVendaMesa = document.querySelector(".btnRegVendaMesa");
var spanTotalVenda = document.querySelector(".spanTotalVendaMesa");
var btnFecharModalMesas = document.querySelector(".btnFecharModalMesas");
var alertaInfo = document.querySelector(".alerta-info");
var alertaErro = document.querySelector(".alerta-erro");
var alertaSucesso = document.querySelector(".alerta-sucesso");

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

function regVendasNormal() {
  set(
    ref(
      db,
      "estabelecimentos/" + usuarioEstabelecimento + "/mesas/selecProdutosValor"
    ),
    {
      valorTotal: 0,
    }
  );

  const dbRefProdSelectMesa = ref(
    db,
    "estabelecimentos/" + usuarioEstabelecimento + "/mesas/selecProdutos"
  );
  const dbRefMethSelect = ref(
    db,
    "estabelecimentos/" +
      usuarioEstabelecimento +
      "/metodosPagamento/metodoSelecionado"
  );

  remove(dbRefMethSelect);
  remove(dbRefProdSelectMesa);

  //window.location.href = './dashboard.html'

  let divCol = document.createElement("div");
  let divCard = document.createElement("div");
  let divCardBody = document.createElement("div");
  let nomeMetodoTxt = document.createElement("p");
  let divCol2 = document.createElement("div");
  let divCard2 = document.createElement("div");
  let divCardBody2 = document.createElement("div");
  let nomeProdTxt = document.createElement("p");

  nomeMetodoTxt.innerHTML = "Nenhum método Escolhido";
  nomeProdTxt.innerHTML = "Nenhum produto Escolhido";

  divCol.classList.add("col");
  divCard.classList.add("card");
  divCard.classList.add("cardRegVendasSelecionado");
  divCardBody.classList.add("card-body");
  nomeMetodoTxt.style.margin = "0px";
  divCol2.classList.add("col");
  divCard2.classList.add("card");
  divCard2.classList.add("cardRegVendasSelecionado");
  divCardBody2.classList.add("card-body");
  nomeProdTxt.style.margin = "0px";

  divCol.appendChild(divCard);
  divCard.appendChild(divCardBody);
  divCardBody.appendChild(nomeMetodoTxt);

  divCol2.appendChild(divCard2);
  divCard2.appendChild(divCardBody2);
  divCardBody2.appendChild(nomeProdTxt);

  if (metodoPagamentoEscolhidoMesa.childNodes.length == 0) {
    metodoPagamentoEscolhidoMesa.appendChild(divCol);
  }

  if (produtosEscolhidoFinal.childNodes.length == 0) {
    produtosEscolhidoFinal.appendChild(divCol2);
  }

  spanTotalVenda.innerHTML = "0 " + TipoMoeda;
  //window.onload = GetAllDataRealtime()
  window.onload = GetAllDataRealtimeMetodosP();
  //window.location.reload()

  //divSelecMetodos.style.display = 'none'
  //finalizarPreVenda.style.display = 'none'

  btnFecharModalVendasMesa.click();
}

btnCadastrarMesa.addEventListener("click", () => {
  if (
    codMesa.value != "" &&
    tamanhoMesa.value != "" &&
    formaMesaSelect.options[formaMesaSelect.selectedIndex].text != ""
  ) {
    set(
      ref(
        db,
        "estabelecimentos/" +
          usuarioEstabelecimento +
          "/mesas/todasMesas/" +
          codMesa.value
      ),
      {
        codigoMesa: codMesa.value,
        tamanho: tamanhoMesa.value,
        foma: formaMesaSelect.options[formaMesaSelect.selectedIndex].text,
        rotulo: rotuloMesa.value,
        responsavel: nomeUsuario,
      }
    );

    //alert("Mesa cadastrada")
    AlertaSucesso("Mesa cadastrada com sucesso");
  } else {
    AlertaErro("Preencha todos capos por favor");
  }
});

let produtosSelecionadosMesa = "";
let metodoSelecionandoMesa = "";

const dbRefProdutosMesa = ref(
  db,
  "estabelecimentos/" + usuarioEstabelecimento + "/produtos/selecProdutos"
);
const dbRefMetodoMesa = ref(
  db,
  "estabelecimentos/" +
    usuarioEstabelecimento +
    "/metodosPagamento/metodoSelecionado"
);
onValue(dbRefProdutosMesa, (snapshot) => {
  const data = snapshot.val();
  produtosSelecionadosMesa = data;
});

onValue(dbRefMetodoMesa, (snapshot) => {
  const data = snapshot.val();
  metodoSelecionandoMesa = data;
});

export var CodigoMesaClicado = "";

function addMesasNaDiv(codigoMesa, rotulo, tamanho) {
  let divCol = document.createElement("div");
  let divCard = document.createElement("div");
  let divCardBody = document.createElement("div");
  let codigoMesaTxt = document.createElement("h5");
  let rotuloMesaTxt = document.createElement("h5");
  let tamanhoMesaTxt = document.createElement("h5");

  codigoMesaTxt.innerHTML = "Cod. " + codigoMesa;
  rotuloMesaTxt.innerHTML = "Rot." + rotulo;
  tamanhoMesaTxt.innerHTML = "Tamanho " + tamanho;

  divCard.setAttribute("data-bs-dismiss", "modal");

  divCard.addEventListener("click", () => {
    /*btnAdicionarProdutos.click()

    divSelecProdutosMesa.style.display = "none"
    divSelecMetodos.style.display = "none"
    finalizarPreVenda.style.display = "none"*/
    DivSelecionarProdutosMesa.style.display = "block";
    finalizarAdicaoMesa.style.display = "none";
    btnProximoAddMesa.removeAttribute("disabled", "disabled");

    /*btnProximoRegVenda.classList.remove("d-none")
    btnProximoRegVenda.classList.add("d-block")
    btnProximoRegVenda.style.display = "block"
    btnCancelar2.classList.remove("d-none")
    btnCancelar2.classList.add("d-block")
    btnCancelar2.style.display = "block"*/

    CodigoMesaClicado = codigoMesa;

    window.localStorage.setItem(
      "codMesaEscolhido",
      "" + CodigoMesaClicado + ""
    );

    addDetalhesMesa();
  });

  divCol.classList.add("col");
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

  divCard.setAttribute("data-bs-toggle", "modal");
  divCard.setAttribute("data-bs-target", "#modalProdutosMesa");

  divVerMesasDisponiveis.appendChild(divCol);
}

function addTdasMesasNaDiv(produtos) {
  divVerMesasDisponiveis.innerHTML = "";
  produtos.forEach((element) => {
    addMesasNaDiv(element.codigoMesa, element.rotulo, element.tamanho);
  });
}

function PegarTdsMesas() {
  const dbRef = ref(
    db,
    "estabelecimentos/" + usuarioEstabelecimento + "/mesas/todasMesas"
  );

  onValue(dbRef, (snapshot) => {
    var todasMesas = [];

    snapshot.forEach((childSnapshot) => {
      todasMesas.push(childSnapshot.val());
    });

    addTdasMesasNaDiv(todasMesas);
  });
}

window.onload = PegarTdsMesas();

function addMetodNoCard(nomeMetodo) {
  let divCol = document.createElement("div");
  let divCard = document.createElement("div");
  let divCardBody = document.createElement("div");
  let metodoPagamento = document.createElement("h5");

  metodoPagamento.innerHTML = nomeMetodo;

  divCol.classList.add("col");
  divCard.classList.add("card");
  divCard.classList.add("cardRegVendasSelecionado");
  divCardBody.classList.add("card-body");
  metodoPagamento.classList.add("card-title");
  metodoPagamento.style.fontSize = "16px";

  divCol.appendChild(divCard);
  divCard.appendChild(divCardBody);
  divCardBody.appendChild(metodoPagamento);

  metodoPagamentoEscolhidoMesa.appendChild(divCol);
}

function addTdsMetodNoCard(metodo) {
  metodoPagamentoEscolhidoMesa.innerHTML = "";
  metodo.forEach((element) => {
    addMetodNoCard(element.nomeMetodo);
  });
}

function PegarMetodosSelecionado() {
  const dbRef = ref(
    db,
    "estabelecimentos/" +
      usuarioEstabelecimento +
      "/metodosPagamento/metodoSelecionado"
  );

  onValue(dbRef, (snapshot) => {
    var metodoSelec = [];

    snapshot.forEach((childSnapshot) => {
      metodoSelec.push(childSnapshot.val());
    });

    addTdsMetodNoCard(metodoSelec);
  });
}

function addItemToTableMetodosP(nomeMetodo) {
  let divCol = document.createElement("div");
  let divCard = document.createElement("div");
  let divCardBody = document.createElement("div");
  let nomeMetodoTxt = document.createElement("h1");

  nomeMetodoTxt.innerHTML = nomeMetodo;

  divCard.addEventListener("click", () => {
    const db = getDatabase();
    set(
      ref(
        db,
        "estabelecimentos/" +
          usuarioEstabelecimento +
          "/metodosPagamento/metodoSelecionado/" +
          nomeMetodo
      ),
      {
        nomeMetodo: nomeMetodo,
      }
    );

    if (divCard.classList.contains("cardRegVendasSelecionado")) {
      //
    } else {
      divCard.classList.add("cardRegVendasSelecionado");
    }

    const dbRef = ref(
      db,
      "estabelecimentos/" +
        usuarioEstabelecimento +
        "/metodosPagamento/metodoSelecionado"
    );
    var dados;

    onValue(dbRef, (snapshot) => {
      const data = snapshot.val();
      dados = data;
    });
    let prodEscolhidoLocalStorage =
      window.localStorage.getItem("prodEscolhido");

    window.localStorage.setItem("metodoEscolhido", true);
    //btnFinalizarVenda.click()
    btnFecharModalVendasMesa.click();
    window.onload = PegarMetodosSelecionado();

    /*function passarPTelaFinalizarPreVenda(){
      console.log(dados)

      if(dados == null){
        alert('Selecione um método')
      }else{
        divSelecProdutos.style.display = 'block'
        divSelecMetodos.style.display = 'none'
        finalizarPreVenda.style.display = 'none'
      }
    }
    alert('Fechou')
    //btnFecharModalVendas.click()
    passarPTelaFinalizarPreVenda()*/
  });

  divCol.classList.add("col");
  divCard.classList.add("card");
  divCard.classList.add("cardMetodospagamento");
  divCardBody.classList.add("card-body");
  nomeMetodoTxt.classList.add("card-title");
  nomeMetodoTxt.style.fontSize = "22px";

  divCol.appendChild(divCard);
  divCard.appendChild(divCardBody);
  divCardBody.appendChild(nomeMetodoTxt);

  metodosPagamentosMesa.appendChild(divCol);
}

function addAllItemsToTableMetodosP(metodos) {
  metodosPagamentosMesa.innerHTML = "";
  metodos.forEach((element) => {
    addItemToTableMetodosP(element.nomeMetodo);
  });
}

function GetAllDataRealtimeMetodosP() {
  const dbRef = ref(
    db,
    "estabelecimentos/" +
      usuarioEstabelecimento +
      "/metodosPagamento/todosMetodos"
  );

  onValue(dbRef, (snapshot) => {
    var todosMetodos = [];

    snapshot.forEach((childSnapshot) => {
      todosMetodos.push(childSnapshot.val());
    });

    addAllItemsToTableMetodosP(todosMetodos);
  });
}

window.onload = GetAllDataRealtimeMetodosP();

function addDetalhesMesa() {
  let divCol1 = document.createElement("div");
  let divCol2 = document.createElement("div");
  let divCard1 = document.createElement("div");
  let divCard2 = document.createElement("div");
  let divCard3 = document.createElement("div");
  let divCard4 = document.createElement("div");
  let divCardBody1 = document.createElement("div");
  let divCardBody2 = document.createElement("div");
  let divCardBody3 = document.createElement("div");
  let divCardBody4 = document.createElement("div");
  let codigoMesaTxt = document.createElement("h5");
  let rotuloMesaTxt = document.createElement("h5");
  let formaMesaTxt = document.createElement("h5");
  let tamanhoMesaTxt = document.createElement("h5");

  const dbRef = ref(
    db,
    "estabelecimentos/" +
      usuarioEstabelecimento +
      "/mesas/todasMesas/" +
      CodigoMesaClicado
  );

  onValue(dbRef, (snapshot) => {
    let dados = snapshot.val();

    codigoMesaTxt.innerHTML = "Cdg: da mesa: " + dados.codigoMesa;
    rotuloMesaTxt.innerHTML = "Rótulo da mesa: " + dados.rotulo;
    formaMesaTxt.innerHTML = "Forma da mesa: " + dados.foma;
    tamanhoMesaTxt.innerHTML = "Tamanho da mesa: " + dados.tamanho;
  });

  divCol1.classList.add("col");
  divCol2.classList.add("col");
  divCard1.classList.add("card");
  divCard1.classList.add("cardRegVendasSelecionado");
  divCard2.classList.add("card");
  divCard2.classList.add("cardRegVendasSelecionado");
  divCard3.classList.add("card");
  divCard3.classList.add("cardRegVendasSelecionado");
  divCard4.classList.add("card");
  divCard4.classList.add("cardRegVendasSelecionado");
  divCard1.classList.add("cardBodyStyle");
  divCard2.classList.add("cardBodyStyle");
  divCard3.classList.add("cardBodyStyle");
  divCard4.classList.add("cardBodyStyle");
  divCardBody1.classList.add("card-body");
  //divCardBody1.classList.add("cardBodyStyle")
  divCardBody1.style.display = "flex";
  divCardBody1.style.flexDirection = "row";
  divCardBody1.style.flexWrap = "nowrap";
  divCardBody1.style.justifyContent = "space-between";
  divCardBody2.classList.add("card-body");
  //divCardBody2.classList.add("cardBodyStyle")
  divCardBody2.style.display = "flex";
  divCardBody2.style.flexDirection = "row";
  divCardBody2.style.flexWrap = "nowrap";
  divCardBody2.style.justifyContent = "space-between";
  divCardBody3.classList.add("card-body");
  //divCardBody3.classList.add("cardBodyStyle")
  divCardBody3.style.display = "flex";
  divCardBody3.style.flexDirection = "row";
  divCardBody3.style.flexWrap = "nowrap";
  divCardBody3.style.justifyContent = "space-between";
  divCardBody4.classList.add("card-body");
  //divCardBody4.classList.add("cardBodyStyle")
  divCardBody4.style.display = "flex";
  divCardBody4.style.flexDirection = "row";
  divCardBody4.style.flexWrap = "nowrap";
  divCardBody4.style.justifyContent = "space-between";
  codigoMesaTxt.style.fontSize = "14px";
  codigoMesaTxt.style.margin = "0px";
  rotuloMesaTxt.style.fontSize = "14px";
  rotuloMesaTxt.style.margin = "0px";
  formaMesaTxt.style.fontSize = "14px";
  formaMesaTxt.style.margin = "0px";
  tamanhoMesaTxt.style.fontSize = "14px";
  tamanhoMesaTxt.style.margin = "0px";

  divCol1.appendChild(divCard1);
  divCol2.appendChild(divCard2);
  divCol1.appendChild(divCard3);
  divCol2.appendChild(divCard4);
  divCard1.appendChild(divCardBody1);
  divCard2.appendChild(divCardBody2);
  divCard3.appendChild(divCardBody3);
  divCard4.appendChild(divCardBody4);
  divCardBody1.appendChild(codigoMesaTxt);
  divCardBody2.appendChild(rotuloMesaTxt);
  divCardBody3.appendChild(formaMesaTxt);
  divCardBody4.appendChild(tamanhoMesaTxt);
  detalhesMesa.innerHTML = "";
  detalhesMesa.appendChild(divCol1);
  detalhesMesa.appendChild(divCol2);
}

function addProdutosMesa(nomeProd, precVenda, tipoMoeda, lucroProduto) {
  let divCol = document.createElement("div");
  let divCard = document.createElement("div");
  let divCardBody = document.createElement("div");
  let produNome = document.createElement("h3");
  let produQuantidade = document.createElement("h5");
  let produPreco = document.createElement("h1");
  let quantProduto = 1;
  //produQuantidade.innerHTML = "Qtd " + quantProduto

  produNome.innerHTML = nomeProd;
  produPreco.innerHTML = precVenda + " " + tipoMoeda;

  divCard.addEventListener("click", () => {
    const db = getDatabase();
    let quantProdEDisponivel;
    const dbRefQuantProd = ref(
      db,
      "estabelecimentos/" +
        usuarioEstabelecimento +
        "/produtos/todosProdutos/" +
        nomeProd
    );

    let quantProdutoFinal = quantProduto++;

    function AdicionarProdutos() {
      set(
        ref(
          db,
          "estabelecimentos/" +
            usuarioEstabelecimento +
            "/mesas/selecProdutos/" +
            CodigoMesaClicado +
            "/" +
            nomeProd
        ),
        {
          nomeProduto: nomeProd,
          quantidadeProd: quantProduto - 1,
          precoProduto: precVenda,
          tipoMoeda: tipoMoeda,
          lucroProduto: lucroProduto * (quantProduto - 1),
          precoTotalProduto: precVenda * (quantProduto - 1),
        }
      );

      produQuantidade.innerHTML = "Qtd " + quantProdutoFinal;

      if (divCard.classList.contains("cardRegVendasSelecionado")) {
        //
      } else {
        divCard.classList.add("cardRegVendasSelecionado");
      }

      let valorActual = 0;
      let valorSomado = 0;
      let valorProduto = precVenda;
      const dbRef = ref(
        db,
        "estabelecimentos/" +
          usuarioEstabelecimento +
          "/mesas/selecProdutosValor"
      );

      //Pegando o Valor actual
      onValue(dbRef, (snapshot) => {
        var data = snapshot.val();
        valorActual = data.valorTotal;
      });

      valorSomado = parseInt(valorProduto) + parseInt(valorActual);

      set(
        ref(
          db,
          "estabelecimentos/" +
            usuarioEstabelecimento +
            "/mesas/selecProdutosValor"
        ),
        {
          valorTotal: valorSomado,
        }
      );
    }

    onValue(dbRefQuantProd, (snapshot) => {
      const data = snapshot.val();

      quantProdEDisponivel = data.quantProdE;

      if (quantProdEDisponivel > quantProduto - 2) {
        AdicionarProdutos();
      } else {
        AlertaInfo("Não tem produto suficiente no estoque");
      }
    });
  });

  divCol.classList.add("col");
  divCard.classList.add("card");
  divCard.classList.add("cardRegVendas");
  divCardBody.classList.add("card-body");
  produNome.classList.add("card-title");
  produNome.style.fontSize = "18px";
  produPreco.classList.add("card-title");
  produPreco.style.fontSize = "26px";
  produQuantidade.classList.add("card-text");
  produQuantidade.style.fontSize = "16px";

  divCol.appendChild(divCard);
  divCard.appendChild(divCardBody);
  divCardBody.appendChild(produNome);
  divCardBody.appendChild(produPreco);
  divCardBody.appendChild(produQuantidade);

  selecProdutosMesa.appendChild(divCol);
}

function addTdsProdutosMesa(produtos) {
  selecProdutosMesa.innerHTML = "";
  produtos.forEach((element) => {
    if (element.quantProdE > 0) {
      addProdutosMesa(
        element.nomeProd,
        element.precVenda,
        element.tipoMoeda,
        element.lucroProd
      );
    }
  });
}

function PegarTdsProdutosMesa() {
  const dbRef = ref(
    db,
    "estabelecimentos/" + usuarioEstabelecimento + "/produtos/todosProdutos"
  );

  onValue(dbRef, (snapshot) => {
    var todosProdutos = [];

    snapshot.forEach((childSnapshot) => {
      todosProdutos.push(childSnapshot.val());
    });

    addTdsProdutosMesa(todosProdutos);
  });
}

//window.onload = PegarTdsProdutosMesa()

btnAdicionarProdutosMesa.addEventListener("click", () => {
  PegarTdsProdutosMesa();
  if ((divSelecProdutosMesa.style.display = "none")) {
    divSelecProdutosMesa.style.display = "block";
  } else {
    divSelecProdutosMesa.style.display = "none";
  }
});

btnAdicionarMetodoMesa.setAttribute("data-bs-toggle", "modal");
btnAdicionarMetodoMesa.setAttribute("data-bs-target", "#modalSelecMetodosMesa");

function addProdutosNoCard(
  nomeProduto,
  precoProduto,
  tipoMoeda,
  quantidadeProd
) {
  let divCol = document.createElement("div");
  let divCard = document.createElement("div");
  let divCardBody = document.createElement("div");
  let produNomeTxt = document.createElement("h5");
  let precoProdutoTxt = document.createElement("h5");
  let produQuantidadeTxt = document.createElement("h5");

  produNomeTxt.innerHTML = nomeProduto;
  precoProdutoTxt.innerHTML = precoProduto + ".00 " + tipoMoeda;
  produQuantidadeTxt.innerHTML = quantidadeProd;

  divCol.classList.add("col");
  divCard.classList.add("card");
  divCard.classList.add("cardRegVendasSelecionado");
  divCardBody.classList.add("card-body");
  divCardBody.style.display = "flex";
  divCardBody.style.flexDirection = "row";
  divCardBody.style.flexWrap = "nowrap";
  divCardBody.style.justifyContent = "space-between";
  produNomeTxt.classList.add("card-title");
  produNomeTxt.style.fontSize = "16px";
  precoProdutoTxt.classList.add("card-title");
  precoProdutoTxt.style.fontSize = "16px";
  produQuantidadeTxt.classList.add("card-text");
  produQuantidadeTxt.style.fontSize = "16px";

  divCol.appendChild(divCard);
  divCard.appendChild(divCardBody);
  divCardBody.appendChild(produNomeTxt);
  divCardBody.appendChild(precoProdutoTxt);
  divCardBody.appendChild(produQuantidadeTxt);

  produtosEscolhidoFinal.appendChild(divCol);
}

function addTdsProdutosNaDiv(produtos) {
  produtosEscolhidoFinal.innerHTML = "";
  produtos.forEach((element) => {
    addProdutosNoCard(
      element.nomeProduto,
      element.precoProduto,
      element.tipoMoeda,
      element.quantidadeProd
    );
  });
}

function PegarTdsProdutosSelecionados() {
  const dbRef = ref(
    db,
    "estabelecimentos/" +
      usuarioEstabelecimento +
      "/mesas/selecProdutos/" +
      CodigoMesaClicado
  );

  onValue(
    dbRef,
    (snapshot) => {
      var todosProdutos = [];

      snapshot.forEach((childSnapshot) => {
        todosProdutos.push(childSnapshot.val());
      });

      addTdsProdutosNaDiv(todosProdutos);
    },
    {
      onlyOnce: false,
    }
  );
}

btnFecharContaMesa.addEventListener("click", () => {
  //let btnProximo = document.createElement("button")
  let valorTotal = 0;

  DivSelecionarProdutosMesa.style.display = "block";
  finalizarAdicaoMesa.style.display = "none";
  window.onload = PegarTdsProdutosSelecionados();

  PegarTdsProdutosMesa();

  const dbRef = ref(
    db,
    "estabelecimentos/" + usuarioEstabelecimento + "/mesas/selecProdutosValor"
  );

  onValue(dbRef, (snapshot) => {
    const data = snapshot.val();

    valorTotal = data.valorTotal;
  });

  spanTotalVenda.innerHTML = valorTotal + " " + TipoMoeda;

  btnFecharModalMesas.click();
  window.localStorage.setItem("valorTotalProdutos", valorTotal);
  window.localStorage.setItem("prodEscolhido", true);
});

btnProximoAddMesa.addEventListener("click", () => {
  if (DivSelecionarProdutosMesa.style.display == "block") {
    finalizarAdicaoMesa.style.display = "block";
    DivSelecionarProdutosMesa.style.display = "none";
    btnProximoAddMesa.setAttribute("disabled", "disabled");
  } else {
    finalizarAdicaoMesa.style.display = "none";
    DivSelecionarProdutosMesa.style.display = "block";
  }
});

btnContinuarMesa.addEventListener("click", () => {
  //window.onload = PegarTdsProdutosSelecionados()
  window.localStorage.removeItem("codMesaEscolhido");
});

btnCancelarMesa.addEventListener("click", () => {
  regVendasNormal();
  /*if(confirME == true){
    regVendasNormal()
    
    window.localStorage.setItem('prodEscolhido', false);
    window.localStorage.removeItem('valorTotalProdutos')
    divSelecProdutos.style.display = 'block'
    finalizarPreVenda.style.display = 'none'
    divSelecMetodos.style.display = 'none'
  }else{
    //alert('Nada seleciondo')
  }*/
});

var chaveVendasString;
var chaveVendas = 0;
var nrMovimentacoesString;
var nrMovimentacoes = 0;
var nrMovimentacoess = 0;

const commentsRef = ref(
  db,
  "estabelecimentos/" + usuarioEstabelecimento + "/vendas/todasVendas"
);
onChildAdded(commentsRef, (data) => {
  chaveVendasString = data.key;
});

var valorTotalProdutos;
//valorTotalProdutos = parseInt(window.localStorage.getItem('valorTotalProdutos'));
var saldoInicial,
  saldoIniciall = 0;
var saldoFinal = 0;
const dbRefSaldo = ref(
  db,
  "estabelecimentos/" + usuarioEstabelecimento + "/saldo/saldo"
);
const dbRefValorTtlProd = ref(
  db,
  "estabelecimentos/" + usuarioEstabelecimento + "/mesas/selecProdutosValor"
);

onValue(dbRefValorTtlProd, (snapshot) => {
  const data = snapshot.val();

  valorTotalProdutos = data.valorTotal;
});

onValue(
  dbRefSaldo,
  (snapshot) => {
    const data = snapshot.val();
    saldoInicial = data.saldo;
    nrMovimentacoesString = data.totalMovimentacoes;
    nrMovimentacoess = parseInt(nrMovimentacoesString);
    saldoIniciall = parseInt(saldoInicial);
  },
  {
    onlyOnce: false,
  }
);

var valorLucroInicial,
  valorLucroIniciall = 0;
var valorLucroFinal = 0;
const dbRefLucro = ref(
  db,
  "estabelecimentos/" + usuarioEstabelecimento + "/vendas/lucroTotalVendas"
);

onValue(
  dbRefLucro,
  (snapshot) => {
    const data = snapshot.val();
    valorLucroInicial = data.lucroTotal;

    valorLucroIniciall = parseInt(valorLucroInicial);
  },
  {
    onlyOnce: false,
  }
);

var valorTotalVendasInicial,
  valorTotalVendasIniciall = 0;
var valorTotalVendasFinal = 0;
const dbRefValorVendas = ref(
  db,
  "estabelecimentos/" + usuarioEstabelecimento + "/vendas/valorTotalVendas"
);

onValue(
  dbRefValorVendas,
  (snapshot) => {
    const data = snapshot.val();
    valorTotalVendasInicial = data.valorTotal;

    valorTotalVendasIniciall = parseInt(valorTotalVendasInicial);
  },
  {
    onlyOnce: false,
  }
);

function reduzirQuantProduto(chaveProduto, quantidade) {
  const dbRefProdutos = ref(
    db,
    "estabelecimentos/" +
      usuarioEstabelecimento +
      "/produtos/todosProdutos/" +
      chaveProduto
  );
  let quantidadeActual = 0;

  try {
    onValue(dbRefProdutos, (snapshot) => {
      const data = snapshot.val();
      quantidadeActual = data.quantProdE;
    });

    set(
      ref(
        db,
        "estabelecimentos/" +
          usuarioEstabelecimento +
          "/produtos/todosProdutos/" +
          chaveProduto +
          "/quantProdE"
      ),
      quantidadeActual - quantidade
    );

    /*const postData = {
      quantProdE: quantidadeActual - quantidade
    };

    const updates = {};
    updates['estabelecimentos/' + usuarioEstabelecimento + '/produtos/todosProdutos/' + chaveProduto] = postData;
    updates['estabelecimentos/' + usuarioEstabelecimento + '/produtos/estoque/' + chaveProduto] = postData;

    update(ref(db), updates)

    /*set(ref(db, 'estabelecimentos/' + usuarioEstabelecimento + '/produtos/todosProdutos/' + chaveProduto), {
      quantProdE: quantidadeActual - quantidade
    });*

    db.ref('estabelecimentos/' + usuarioEstabelecimento + '/produtos/todosProdutos/' + chaveProduto).update({
      quantProdE: quantidadeActual - quantidade
    });
  

    /*set(ref(db, 'estabelecimentos/' + usuarioEstabelecimento + '/produtos/estoque/' + chaveProduto), {
      quantProdE: quantidadeActual - quantidade
    });*

    db.ref('estabelecimentos/' + usuarioEstabelecimento + '/produtos/estoque/' + chaveProduto).update({
      quantProdE: quantidadeActual - quantidade
    });*/
  } catch (error) {
    console.log(error);
  }
}

var now = new Date();

btnRegVendaMesa.addEventListener("click", () => {
  let produtosSelecionados = "";
  let produtosSelecionadosMesas = "";
  let metodoSelecionando = "";
  let codMesaEscolhido = window.localStorage.getItem("codMesaEscolhido");

  const dbRefProdutos = ref(
    db,
    "estabelecimentos/" + usuarioEstabelecimento + "/produtos/selecProdutos"
  );
  const dbRefProdutosMesas = ref(
    db,
    "estabelecimentos/" +
      usuarioEstabelecimento +
      "/mesas/selecProdutos/" +
      codMesaEscolhido +
      ""
  );
  const dbRefMetodo = ref(
    db,
    "estabelecimentos/" +
      usuarioEstabelecimento +
      "/metodosPagamento/metodoSelecionado"
  );

  let lucroInicialPorVenda = 0;
  let precoTotalVenda = 0;
  var quantidadeProduto = [];

  onValue(
    dbRefProdutosMesas,
    (snapshot) => {
      const data = snapshot.val();
      produtosSelecionados = data;

      var lucroPorProduto = [];
      var precoTotalPorProduto = [];

      snapshot.forEach((childSnapshot) => {
        lucroPorProduto.push(childSnapshot.val().lucroProduto);
      });

      snapshot.forEach((childSnapshot) => {
        precoTotalPorProduto.push(childSnapshot.val().precoTotalProduto);
      });

      snapshot.forEach((childSnapshot) => {
        quantidadeProduto.push(childSnapshot.val());

        //reduzirQuantProduto(childSnapshot.val().nomeProduto, childSnapshot.val().quantidadeProd)
      });

      lucroPorProduto.forEach((val) => {
        lucroInicialPorVenda = lucroInicialPorVenda + val;
      });

      precoTotalPorProduto.forEach((val) => {
        precoTotalVenda = precoTotalVenda + val;
      });
    },
    {
      onlyOnce: false,
    }
  );

  quantidadeProduto.forEach((val) => {
    reduzirQuantProduto(val.nomeProduto, val.quantidadeProd);
  });

  onValue(dbRefProdutosMesas, (snapshot) => {
    const data = snapshot.val();
    produtosSelecionadosMesas = data;
  });

  onValue(dbRefMetodo, (snapshot) => {
    const data = snapshot.val();
    metodoSelecionando = data;
  });

  var valorTotalProdutoss = parseInt(valorTotalProdutos);
  saldoFinal = parseInt(saldoIniciall) + valorTotalProdutoss;

  nrMovimentacoes = parseInt(nrMovimentacoess) + 1;

  chaveVendas = parseInt(chaveVendasString) + 1;

  let prodEscolhidoLocalStorage = window.localStorage.getItem("prodEscolhido");

  if (prodEscolhidoLocalStorage == "true") {
    try {
      onValue(
        dbRefProdutosMesas,
        (snapshot) => {
          const data = snapshot.val();
          produtosSelecionados = data;

          var lucroPorProduto = [];
          var precoTotalPorProduto = [];

          snapshot.forEach((childSnapshot) => {
            lucroPorProduto.push(childSnapshot.val().lucroProduto);
          });

          snapshot.forEach((childSnapshot) => {
            precoTotalPorProduto.push(childSnapshot.val().precoTotalProduto);
          });

          lucroPorProduto.forEach((val) => {
            lucroInicialPorVenda = lucroInicialPorVenda + val;
          });

          precoTotalPorProduto.forEach((val) => {
            precoTotalVenda = precoTotalVenda + val;
          });
        },
        {
          onlyOnce: false,
        }
      );

      set(
        ref(
          db,
          "estabelecimentos/" +
            usuarioEstabelecimento +
            "/vendas/todasVendas/" +
            chaveVendas
        ),
        {
          codigoMesa: codMesaEscolhido,
          codigoVenda: chaveVendas,
          //produtos: produtosSelecionados,
          horaActual:
            now.getHours() +
            ":" +
            now.getMinutes() +
            ":" +
            now.getSeconds() +
            " - " +
            now.getDate() +
            "/" +
            now.getMonth() +
            "/" +
            now.getFullYear(),
          metodoPagamento: metodoSelecionando,
          produtosMesa: produtosSelecionadosMesas,
          precoTotalVenda: precoTotalVenda / 2,
          lucroVenda: {
            lucroVenda: lucroInicialPorVenda / 2,
          },
          responsavel: nomeUsuario,
        }
      );

      set(
        ref(db, "estabelecimentos/" + usuarioEstabelecimento + "/saldo/saldo"),
        {
          saldo: parseInt(saldoIniciall) + valorTotalProdutoss,
          totalMovimentacoes: nrMovimentacoes,
        }
      );

      set(
        ref(
          db,
          "estabelecimentos/" +
            usuarioEstabelecimento +
            "/saldo/saldo/todasMovimentacoes/" +
            nrMovimentacoes
        ),
        {
          saldoMovimentado: parseInt(saldoIniciall) + valorTotalProdutoss,
          motivo: "Venda de produtos",
          horaActual:
            now.getHours() +
            ":" +
            now.getMinutes() +
            ":" +
            now.getSeconds() +
            " - " +
            now.getDate() +
            "/" +
            now.getMonth() +
            "/" +
            now.getFullYear(),
          responsavel: nomeUsuario,
        }
      );

      set(
        ref(
          db,
          "estabelecimentos/" +
            usuarioEstabelecimento +
            "/vendas/lucroTotalVendas"
        ),
        {
          lucroTotal: valorLucroIniciall + lucroInicialPorVenda / 2,
        }
      );

      set(
        ref(
          db,
          "estabelecimentos/" +
            usuarioEstabelecimento +
            "/vendas/valorTotalVendas"
        ),
        {
          valorTotal: valorTotalVendasIniciall + valorTotalProdutoss,
        }
      );

      //botaoCancelar.click()
      regVendasNormal();
      //alert('Venda cadatrada com sucesso')
      AlertaSucesso("Venda cadastrada com sucesso");
      window.localStorage.removeItem("codMesaEscolhido");
      window.localStorage.removeItem("valorTotalProdutos");

      //location.reload();
    } catch (error) {
      console.log(error);
    }
  } else {
    //alert('Adicione um produto antes')
    AlertaInfo("Adicione um produto antes");
  }
});
