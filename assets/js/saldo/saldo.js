import { firebaseConfig } from "../logico/firebaseConfig.js";
import { TipoMoeda } from "./tipoMoeda.js";
import {
  usuarioMail,
  usuarioNome,
  usuarioTel,
  usuarioEnder,
} from "../login/login.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-app.js";
import {
  getDatabase,
  ref,
  remove,
  onValue,
  set,
  onChildAdded,
  query,
  orderByChild,
} from "https://www.gstatic.com/firebasejs/9.14.0/firebase-database.js";
import {
  getFirestore,
  collection,
  addDoc,
  setDoc,
  doc,
  where,
  getDocs,
} from "https://www.gstatic.com/firebasejs/9.14.0/firebase-firestore.js";

var usuarioEstabelecimento = window.localStorage.getItem(
  "usuarioEstabelecimento"
);
var nomeUsuario = window.localStorage.getItem("nomeUser");
var saldoContaTxt = document.querySelector(".saldoContaTxt");
var totalMovimentacoesTxt = document.querySelector(".totalMovimentacoesTxt");
var valorEntradaCaixa = document.querySelector(".valorEntradaCaixa");
var motivoEntradaCaixa = document.querySelector(".motivoEntradaCaixa");
var valorSaidaCaixa = document.querySelector(".valorSaidaCaixa");
var motivoSaidaCaixa = document.querySelector(".motivoSaidaCaixa");
var totalVendasTxt = document.querySelector(".totalVendasTxt");
var valorTotalVendasTxt = document.querySelector(".valorTotalVendasTxt");
var lucroTotalVendasTxt = document.querySelector(".lucroTotalVendasTxt");
var totalProdutosCadastradosTxt = document.querySelector(
  ".totalProdutosCadastradosTxt"
);
var precoTotalCompraProdutosTxt = document.querySelector(
  ".precoTotalCompraProdutosTxt"
);
var precoTotalVendaProdutosTxt = document.querySelector(
  ".precoTotalVendaProdutosTxt"
);
var lucroTotalVendaProdutosTxt = document.querySelector(
  ".lucroTotalVendaProdutosTxt"
);
var btnRegEntradaCaixa = document.querySelector(".btnRegEntradaCaixa");
var btnRegSaidaCaixa = document.querySelector(".btnRegSaidaCaixa");
var horaRegEst = document.querySelector(".horaRegEst");
var userLocalStorage = window.localStorage.getItem("user");
var valorInicial,
  valorIniciall = 0;
var saldoFinalEntrada = 0;
var saldoFinalSaida = 0;
var alertaInfo = document.querySelector(".alerta-info");
var alertaErro = document.querySelector(".alerta-erro");
var alertaSucesso = document.querySelector(".alerta-sucesso");


var now =  new Date();
var horaActual =
now.getHours() +
":" +
now.getMinutes() +
":" +
now.getSeconds() +
" - " +
now.getDate() +
"/" +
(now.getMonth() + 1) +
"/" +
now.getFullYear()

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const dbFt = getFirestore(app);

var chaveSaldoEntradaString;
var chaveSaldoEntrada = 0;
var chaveSaldoSaidaString;
var chaveSaldoSaida = 0;
var nrTotalVendasString;
var nrTotalVendas = 0;
var nrMovimentacoesString;
var nrMovimentacoes = 0;

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

const commentsRef = ref(
  db,
  "estabelecimentos/" + usuarioEstabelecimento + "/saldo/entrada"
);
onChildAdded(commentsRef, (data) => {
  chaveSaldoEntradaString = data.key;
});

const commentsRefSaida = ref(
  db,
  "estabelecimentos/" + usuarioEstabelecimento + "/saldo/saida"
);
onChildAdded(commentsRefSaida, (data) => {
  chaveSaldoSaidaString = data.key;
});

const commentsRefTotalVendas = ref(
  db,
  "estabelecimentos/" + usuarioEstabelecimento + "/vendas/todasVendas"
);
onChildAdded(commentsRefTotalVendas, (data) => {
  nrTotalVendasString = data.key;

  nrTotalVendas = nrTotalVendasString;

  totalVendasTxt.innerHTML = nrTotalVendas;

  var lucroPorProduto = [];

  data.forEach((childSnapshot) => {
    lucroPorProduto.push(childSnapshot.val().lucroVenda);
  });

  //console.log(lucroPorProduto)
});

/*var firstNodeRef = ref(db, '/vendas');
firstNodeRef.child('1').child('produtos').once("value", function(snapshot) {
  var data = snapshot.val();
  console.log(data);
});*/

const dbRefSaldo = ref(
  db,
  "estabelecimentos/" + usuarioEstabelecimento + "/saldo/saldo"
);
onValue(dbRefSaldo, (snapshot) => {
  const data = snapshot.val();
  valorInicial = data.saldo;
  valorIniciall = parseInt(valorInicial);

  saldoContaTxt.innerHTML = valorInicial + " " + TipoMoeda;

  nrMovimentacoesString = data.totalMovimentacoes;

  totalMovimentacoesTxt.innerHTML = nrMovimentacoesString;
});

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

    lucroTotalVendasTxt.innerHTML = valorLucroIniciall + " " + TipoMoeda;
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

    valorTotalVendasTxt.innerHTML = valorTotalVendasIniciall + " " + TipoMoeda;
  },
  {
    onlyOnce: false,
  }
);

onValue(
  ref(
    db,
    "estabelecimentos/" + usuarioEstabelecimento + "/produtos/todosProdutos"
  ),
  (snapshot) => {
    let todosProdutos = [];

    snapshot.forEach((childSnapshot) => {
      todosProdutos.push(childSnapshot.val());
    });

    let valorTodosProdutos = todosProdutos.length;

    totalProdutosCadastradosTxt.innerHTML = valorTodosProdutos;
  }
);

//PEGANDO O PRECO DE COMPRA DE TODOS OS PRODUTOS CADASTRADOS
const mostViewedPosts = query(
  ref(
    db,
    "estabelecimentos/" + usuarioEstabelecimento + "/produtos/todosProdutos"
  ),
  orderByChild("precCompra")
);

onValue(mostViewedPosts, (snapshot) => {
  const data = snapshot.val();
  let todosProdutos = [];
  let valorPrecoCompra = 0;
  let valorPrecoVenda = 0;

  snapshot.forEach((childSnapshot) => {
    todosProdutos.push(
      parseInt(childSnapshot.val().precCompra) *
        parseInt(childSnapshot.val().quantProdE)
    );

    valorPrecoCompra =
      valorPrecoCompra +
      parseInt(childSnapshot.val().precCompra) *
        parseInt(childSnapshot.val().quantProdE);

    valorPrecoVenda =
      valorPrecoVenda +
      parseInt(childSnapshot.val().precVenda) *
        parseInt(childSnapshot.val().quantProdE);
  });

  precoTotalCompraProdutosTxt.innerHTML = valorPrecoCompra + " " + TipoMoeda;
  precoTotalVendaProdutosTxt.innerHTML = valorPrecoVenda + " " + TipoMoeda;
  lucroTotalVendaProdutosTxt.innerHTML =
    valorPrecoVenda - valorPrecoCompra + " " + TipoMoeda;
});

//ACCAO NO BOTÃO REGISTAR ENTRADA NO CAIXA
btnRegEntradaCaixa.addEventListener("click", () => {
  //CONDIÇÃO DE CAMPOS PREENCHIDOS PARA VALIDAR O REGISTO DE ENTRADA NO CAIXA
  if (valorEntradaCaixa.value != "" && motivoEntradaCaixa.value != "") {
    //SOMANDO O SALDO INICIAL DA BASE DE DADOS E O SALDO INSERIDO PELO USUARIO
    saldoFinalEntrada =
      parseInt(valorEntradaCaixa.value) + parseInt(valorIniciall);

    chaveSaldoEntrada = parseInt(chaveSaldoEntradaString) + 1;
    nrMovimentacoes = parseInt(nrMovimentacoesString) + 1;

    try {
      //INCREMENTANDO NA BASE DE DADOS O NR DE MOCIMENTACOES NO CAIXA E ADICIONANDO O VALOR NO CAIXA
      set(
        ref(db, "estabelecimentos/" + usuarioEstabelecimento + "/saldo/saldo"),
        {
          saldo: parseInt(saldoFinalEntrada),
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
          saldoMovimentado: parseInt(valorEntradaCaixa.value),
          motivo: motivoEntradaCaixa.value,
          horaActual: horaRegEst.value,
          responsavel: nomeUsuario,
        }
      );

      //REGISTANDO NA BASE DE DADOS A OPERACAO DE REGISTO DE ENTRADA NO CAIXA
      set(
        ref(
          db,
          "estabelecimentos/" +
            usuarioEstabelecimento +
            "/saldo/entrada/" +
            chaveSaldoEntrada
        ),
        {
          saldoAdicionado: valorEntradaCaixa.value,
          motivo: motivoEntradaCaixa.value,
          horaActual: horaActual,
          usuario: nomeUsuario,
        }
      );

      //FUNÇÃO DE ALERTA DE OPERACAO SUCEDIDA
      AlertaSucesso("Entrada no caixa registado com sucesso");

      //LIMPANDO OS INPUT TEXTS
      valorEntradaCaixa.value = "";
      motivoEntradaCaixa.value = "";
    } catch (error) {
      console.log(error);
    }
  } else {
    //alert('Preencha todos os campos de saida na conta')
    AlertaInfo("Preencha todos os campos por favor");
  }
});

//ACCAO NO BOTÃO REGISTAR SAIDA NO CAIXA
btnRegSaidaCaixa.addEventListener("click", () => {
  if (valorSaidaCaixa.value != "" && motivoSaidaCaixa.value != "") {
    saldoFinalSaida = Math.abs(
      parseInt(valorSaidaCaixa.value) - parseInt(valorIniciall)
    );

    chaveSaldoSaida = parseInt(chaveSaldoSaidaString) + 1;
    nrMovimentacoes = parseInt(nrMovimentacoesString) + 1;

    try {
      set(
        ref(db, "estabelecimentos/" + usuarioEstabelecimento + "/saldo/saldo"),
        {
          saldo: parseInt(saldoFinalSaida),
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
          saldoMovimentado: parseInt(valorSaidaCaixa.value),
          motivo: motivoSaidaCaixa.value,
          horaActual: horaRegEst.value,
          responsavel: nomeUsuario,
        }
      );

      set(
        ref(
          db,
          "estabelecimentos/" +
            usuarioEstabelecimento +
            "/saldo/saida/" +
            chaveSaldoSaida
        ),
        {
          saldoRetirado: valorSaidaCaixa.value,
          motivo: motivoSaidaCaixa.value,
          horaActual: horaActual,
          usuario: nomeUsuario,
        }
      );
      //alert('Retirada no caixa registado com sucesso')
      AlertaSucesso("Retirada no caixa registado com sucesso");
      valorSaidaCaixa.value = "";
      motivoSaidaCaixa.value = "";
    } catch (error) {
      console.log(error);
    }
  } else {
    //alert('Preencha todos os campos')
    AlertaInfo("Preencha todos os campos por favor");
  }
});
