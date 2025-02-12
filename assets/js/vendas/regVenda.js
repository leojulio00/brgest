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
} from "https://www.gstatic.com/firebasejs/9.14.0/firebase-database.js";
import {
  getFirestore,
  collection,
  addDoc,
  setDoc,
  doc,
  query,
  where,
  getDocs,
} from "https://www.gstatic.com/firebasejs/9.14.0/firebase-firestore.js";

var usuarioEstabelecimento = window.localStorage.getItem(
  "usuarioEstabelecimento"
);
var nomeUsuario = window.localStorage.getItem("nomeUser");
var produtosEscolhidoFinal = document.querySelector(".produtosEscolhidoFinal");
var metodoPagamentoEscolhido = document.querySelector(
  ".metodoPagamentoEscolhido"
);
var produtosAdicio = document.querySelector(".produtosAdicio");
var produtosCategoria = document.querySelector(".produtosCategoria");
var metodosPagamentos = document.querySelector(".metodosPagamentos");
var finalizarPreVenda = document.querySelector(".finalizarPreVenda");
var mesasDisponiveis = document.querySelector(".mesasDisponiveis");
var divSelecProdutos = document.querySelector(".selecionarProdutos");
var divSelecMetodos = document.querySelector(".selecionarMPagamento");
var divBtnProximo = document.querySelector(".divBtnProximo");
var divMesasDisponiveis = document.querySelector(".divMesasDisponiveis");
var spanTotalVenda = document.querySelector(".spanTotalVenda");
var btnAdicionarAMesa = document.querySelector(".btnAdicionarAMesa");
var btnFinalizarVenda = document.querySelector(".btnFinalizarVenda");
var botaoProximo = document.querySelector(".btnProximoRegVenda");
var botaoCancelar = document.querySelector(".btnCancelar");
var botaoCancelar2 = document.querySelector(".btnCancelar2");
var btnRegVenda = document.querySelector(".btnRegVenda");
var btnAdicionarProdutos = document.querySelector(".btnAdicionarProdutos");
var btnAdicionarMetodo = document.querySelector(".btnAdicionarMetodo");
var btnFecharModalVendas = document.querySelector(".btnFecharModalVendas");
var cardNenhumProd = document.querySelector(".cardNenhumProd");
var alertaInfo = document.querySelector(".alerta-info");
var alertaErro = document.querySelector(".alerta-erro");
var alertaSucesso = document.querySelector(".alerta-sucesso");
var divCalculoTroco = document.querySelector(".divCalculoTroco");
var valorTotalVenda = document.querySelector(".valorTotalVenda");
var valorPagoCliente = document.querySelector(".valorPagoCliente");
var trocoCliente = document.querySelector(".trocoCliente");
const txtAdicionarClientes = document.querySelector(".txtAdicionarClientes");
const btnVoltarCategorias = document.querySelector(".btnVoltarCategorias");

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const dbFt = getFirestore(app);

// Variável global para armazenar o valor do troco
let valorTrocoGlobal = 0;

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
  alertaInfo.style.zIndex = "1000"
  setTimeout(() => {
    alertaInfo.style.display = "none";
    info.innerHTML = "";
  }, 2500);
}

divSelecProdutos.style.display = "block";
divSelecMetodos.style.display = "none";
finalizarPreVenda.style.display = "none";

set(
  ref(
    db,
    "estabelecimentos/" +
      usuarioEstabelecimento +
      "/produtos/selecProdutosValor/"
  ),
  {
    valorTotal: 0,
  }
);

function regVendasNormal() {
  set(
    ref(
      db,
      "estabelecimentos/" +
        usuarioEstabelecimento +
        "/produtos/selecProdutosValor/"
    ),
    {
      valorTotal: 0,
    }
  );

  const dbRefProdSelect = ref(
    db,
    "estabelecimentos/" + usuarioEstabelecimento + "/produtos/selecProdutos"
  );
  const dbRefMethSelect = ref(
    db,
    "estabelecimentos/" +
      usuarioEstabelecimento +
      "/metodosPagamento/metodoSelecionado"
  );

  remove(dbRefProdSelect);
  remove(dbRefMethSelect);

  let divCol = document.createElement("div");
  let divCard = document.createElement("div");
  let divCardBody = document.createElement("div");
  let nomeMetodoTxt = document.createElement("p");
  let divCol2 = document.createElement("div");
  let divCard2 = document.createElement("div");
  let divCardBody2 = document.createElement("div");
  let nomeProdTxt = document.createElement("p");

  produtosCategoria.innerHTML = ""
  produtosAdicio.innerHTML = ""
  AdicionarProdutosDiv()

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

  // Adicionar evento de clique para verificar método dinheiro
  divCard.addEventListener("click", () => {
    if (nomeMetodoTxt.innerHTML.toLowerCase().includes("dinheiro")) {
      AlertaInfo("Você clicou no método dinheiro");
    }
  });

  divCol.appendChild(divCard);
  divCard.appendChild(divCardBody);
  divCardBody.appendChild(nomeMetodoTxt);

  divCol2.appendChild(divCard2);
  divCard2.appendChild(divCardBody2);
  divCardBody2.appendChild(nomeProdTxt);

  if (metodoPagamentoEscolhido.childNodes.length == 0) {
    metodoPagamentoEscolhido.appendChild(divCol);
  }

  if (produtosEscolhidoFinal.childNodes.length == 0) {
    produtosEscolhidoFinal.appendChild(divCol2);
  }

  spanTotalVenda.innerHTML = "0 " + TipoMoeda;
  //window.onload = GetAllDataRealtime();
  window.onload = GetAllDataRealtimeMetodosP();

  divSelecProdutos.style.display = "block";
  divSelecMetodos.style.display = "none";
  finalizarPreVenda.style.display = "none";

  btnFecharModalVendas.click();
}


/*function addItemToTable(nomeProd, precVenda, tipoMoeda, lucroProduto) {
  let divCol = document.createElement("div");
  let divCard = document.createElement("div");
  let divCardBody = document.createElement("div");
  let produNome = document.createElement("h3");
  let produQuantidade = document.createElement("h5");
  let produPreco = document.createElement("h1");
  let quantProduto = 1;
  //produQuantidade.innerHTML = 'Qtd ' + quantProduto

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
            "/produtos/selecProdutos/" +
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
          "/produtos/selecProdutosValor"
      );

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
            "/produtos/selecProdutosValor/"
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

  produtosAdicio.appendChild(divCol);
}*/

// Referência para todos as categorias cadastrados
const categoriasRef = ref(
  db,
  "estabelecimentos/" + usuarioEstabelecimento + "/produtos/categorias"
);

function AdicionarProdutosDiv() {
  // Carregar e exibir todas as categorias cadastradas
  onValue(categoriasRef, (snapshot) => {
    // Limpar a div antes de adicionar novos elementos
    produtosCategoria.innerHTML = "";
    produtosAdicio.style.display = "none";
    produtosCategoria.style.display = "block"

    snapshot.forEach((childSnapshot) => {
      const categoria = childSnapshot.val();

      // Criar elemento de lista para cada produto
      let divCol = document.createElement("div");
      let divCard = document.createElement("div");
      let divCardBody = document.createElement("div");
      const listItem = document.createElement("p");

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
      listItem.classList.add("card-title");
      listItem.style.margin = "0px 5px";

      
      listItem.textContent = `${categoria.nomeCategoria}`;


      
      divCol.addEventListener("click", () => {

        // Carregar e exibir todas as categorias cadastradas
        onValue(ref(
          db,
          "estabelecimentos/" + usuarioEstabelecimento + "/produtos/todosProdutos"
          ), (snapshot) => {
          // Limpar a div antes de adicionar novos elementos
          produtosAdicio.innerHTML = "";
          produtosCategoria.style.display = "none";
          produtosAdicio.style.display = "block";

          snapshot.forEach((childSnapshot) => {
            const produtos = childSnapshot.val();
            
            if (categoria.nomeCategoria == produtos.categoriaProd && produtos.quantProdE >= 0) {
              let divCol = document.createElement("div");
              let divCard = document.createElement("div");
              let divCardBody = document.createElement("div");
              let produNome = document.createElement("h3");
              let produQuantidade = document.createElement("h5");
              let produPreco = document.createElement("h1");
              let quantProduto = 1;
              //produQuantidade.innerHTML = 'Qtd ' + quantProduto

              produNome.innerHTML = produtos.nomeProd;
              produPreco.innerHTML = produtos.precVenda + " " + produtos.tipoMoeda;

              if (produtos.quantProdE >= 0) {
                divCard.addEventListener("click", () => {
                  const db = getDatabase();
                  let quantProdEDisponivel;
                  const dbRefQuantProd = ref(
                    db,
                    "estabelecimentos/" +
                      usuarioEstabelecimento +
                      "/produtos/todosProdutos/" +
                      produtos.nomeProd
                  );
  
                  let quantProdutoFinal = quantProduto++;
  
                  function AdicionarProdutos() {
                    set(
                      ref(
                        db,
                        "estabelecimentos/" +
                          usuarioEstabelecimento +
                          "/produtos/selecProdutos/" +
                          produtos.nomeProd
                      ),
                      {
                        nomeProduto: produtos.nomeProd,
                        quantidadeProd: quantProduto - 1,
                        precoProduto: produtos.precVenda,
                        tipoMoeda: produtos.tipoMoeda,
                        lucroProduto: produtos.lucroProd * (quantProduto - 1),
                        precoTotalProduto: produtos.precVenda * (quantProduto - 1),
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
                    let valorProduto = produtos.precVenda;
                    const dbRef = ref(
                      db,
                      "estabelecimentos/" +
                        usuarioEstabelecimento +
                        "/produtos/selecProdutosValor"
                    );
  
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
                          "/produtos/selecProdutosValor/"
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
                      AlertaInfo("Estoque do produto " + data.nomeProd + " está no nivel crítico");
                    }
                  });
                });
              } else {
                
                AlertaInfo("Não tem produto suficiente no estoque");
              }
              

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

              produtosAdicio.appendChild(divCol);
            } else {
              
            }
          });
        });
      });

      divCol.appendChild(divCard);
      divCard.appendChild(divCardBody);
      divCardBody.appendChild(listItem);
      produtosCategoria.appendChild(divCol);
      
    });
  });
}



/*function addAllItemsToTable(produtos) {
  var categoriaEscolhida = ""
  
  onValue(ref(
    db,
    "estabelecimentos/" +
      usuarioEstabelecimento +
      "/produtos/selecCategoria"
    ), (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val(); // Removi o parâmetro inválido
        categoriaEscolhida = data; // Armazena os dados corretamente
        console.log("Categoria selecionada:", data.categoriaSelecionada);

        //produtosAdicio.innerHTML = "";
        produtos.forEach((element) => {
          if (element.quantProdE > 0 && element.nomeCategoria == categoriaEscolhida) {
            addItemToTable(
              element.nomeProd,
              element.precVenda,
              element.tipoMoeda,
              element.lucroProd
            );
          }else{
            console.log("algum problema com a categoriaEscolhida")
          }
        });
      } else {
        console.log("Nenhuma categoria encontrada.");
      }
  });
}

function GetAllDataRealtime() {
  const dbRef = ref(
    db,
    "estabelecimentos/" + usuarioEstabelecimento + "/produtos/todosProdutos"
  );

  onValue(dbRef, (snapshot) => {
    var todosProdutos = [];

    snapshot.forEach((childSnapshot) => {
      todosProdutos.push(childSnapshot.val());
    });

    addAllItemsToTable(todosProdutos);
  });
}*/

window.onload = AdicionarProdutosDiv();

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
    btnFecharModalVendas.click();
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

  metodosPagamentos.appendChild(divCol);
}

function addAllItemsToTableMetodosP(metodos) {
  metodosPagamentos.innerHTML = "";
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

function addMetodNoCard(nomeMetodo) {
  let divCol = document.createElement("div");
  let divCard = document.createElement("div");
  let divCardBody = document.createElement("div");
  let metodoPagamento = document.createElement("h5");

  metodoPagamento.innerHTML = nomeMetodo;

  divCard.addEventListener("click", () => {
    // Remover seleção de outros cartões
    document.querySelectorAll(".cardRegVendasSelecionado").forEach((card) => {
      card.classList.remove("cardRegVendasSelecionado");
    });
    divCard.classList.add("cardRegVendasSelecionado");

    // Se for método dinheiro, mostrar div de troco
    if (nomeMetodo.toLowerCase().includes("dinheiro")) {
      document.querySelector(".mostrarTroco").style.display = "block";
      AlertaInfo("Você clicou no método dinheiro");
    } else {
      document.querySelector(".mostrarTroco").style.display = "none";
    }
  });

  divCol.classList.add("col");
  divCard.classList.add("card");
  divCard.classList.add("cardRegVendasSelecionado");
  divCardBody.classList.add("card-body");
  metodoPagamento.classList.add("card-title");
  metodoPagamento.style.fontSize = "16px";

  divCol.appendChild(divCard);
  divCard.appendChild(divCardBody);
  divCardBody.appendChild(metodoPagamento);

  metodoPagamentoEscolhido.appendChild(divCol);
}

function addTdsMetodNoCard(metodo) {
  metodoPagamentoEscolhido.innerHTML = "";
  metodo.forEach((element) => {
    addMetodNoCard(element.nomeMetodo);
  });
}

function PegarMetodosSelecionado() {
  const metodosEscolhidos = document.querySelectorAll(
    ".cardRegVendasSelecionado"
  );

  if (metodosEscolhidos.length === 0) {
    AlertaInfo("Por favor, selecione um método de pagamento");
    return;
  }

  // Verificar se é pagamento em dinheiro e validar o troco
  const metodoDinheiro = Array.from(metodosEscolhidos).some((card) =>
    card.textContent.toLowerCase().includes("dinheiro")
  );

  // Mostrar ou esconder div de troco baseado no método
  if (metodoDinheiro) {
    document.querySelector(".mostrarTroco").style.display = "block";
  } else {
    document.querySelector(".mostrarTroco").style.display = "none";
  }

  if (metodoDinheiro && valorPagoCliente) {
    const valorTotal = parseFloat(
      spanTotalVenda.innerHTML.replace(/[^0-9.-]+/g, "")
    );
    const valorPago = parseFloat(valorPagoCliente.value) || 0;

    if (valorPago < valorTotal) {
      AlertaInfo("O valor pago é menor que o valor total da venda");
      return;
    }
  }

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

  /*divCard.addEventListener('click', ()=>{
    produQuantidade.innerHTML = 'Qtd ' + quantProduto++

    const db = getDatabase();
    set(ref(db, 'produtos/selecProdutos/' + nomeProduto), {
      quantidadeProd: quantProduto - 1
    });

    if(divCard.classList.contains('cardRegVendasSelecionado')){
      //
    }else{
      divCard.classList.add('cardRegVendasSelecionado')
    }
  })*/

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
    "estabelecimentos/" + usuarioEstabelecimento + "/produtos/selecProdutos"
  );

  onValue(dbRef, (snapshot) => {
    var todosProdutos = [];

    snapshot.forEach((childSnapshot) => {
      todosProdutos.push(childSnapshot.val());
    });

    addTdsProdutosNaDiv(todosProdutos);
  });
}

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

var chaveMesaString;
var chaveMesa = 0;

function ultimaAdicaoMesa(codigoMesa) {
  const commentsRefMesa = ref(
    db,
    "estabelecimentos/" +
      usuarioEstabelecimento +
      "/mesas/produtos/" +
      codigoMesa +
      "/"
  );
  onChildAdded(commentsRefMesa, (data) => {
    chaveMesaString = data.key;

    chaveMesa = parseInt(chaveMesaString);
  });
}

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

  function getRandom(max) {
    return Math.floor(Math.random() * max + 1);
  }

  let numeroSorteado = getRandom(100);
  divCard.addEventListener("click", async () => {
    ultimaAdicaoMesa(codigoMesa);

    /*set(ref(db, 'mesas/' + codigoMesa), {
        codigoMesa: codigoMesa,
        produtos: produtosSelecionadosMesa,
        metodoPagamento: metodoSelecionandoMesa
      });*/

    try {
      const docRef = await addDoc(
        collection(dbFt, "produtosMesa"),
        {
          codigoMesa: codigoMesa,
          produtos: produtosSelecionadosMesa,
          metodoPagamento: metodoSelecionandoMesa,
        },
        { merge: true }
      );
      /*setDoc(doc(db, 'cities', 'new-city-id'), data)
        console.log('Document written with ID: ', docRef.id);*/
      //alert('Adicionado a mesa com sucesso')
      AlertaSucesso("Adicionado a mesa com sucesso");
    } catch (e) {
      console.error("Error adding document: ", e);
    }

    regVendasNormal();
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

  divMesasDisponiveis.appendChild(divCol);
}

function addTdasMesasNaDiv(produtos) {
  divMesasDisponiveis.innerHTML = "";
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

/**/ btnAdicionarAMesa.addEventListener("click", () => {
  mesasDisponiveis.style.display = "block";
});

/*btnProximoRegVenda.addEventListener("click", () => {
  
  produtosCategoria.style.display = "none";
  produtosAdicio.style.display = "block";
  
})*/

btnFinalizarVenda.addEventListener("click", () => {
  //let btnProximo = document.createElement("button")
  let valorTotal = 0;
  //modalRegistarVendas.classList.remove("show")
  //modalRegistarVendas.ariaHidden = "true"
  //modalRegistarVendas.style.display = "none"

  /*btnProximo.innerHTML = "Próximo"
  btnProximo.classList.add("btn")
  btnProximo.classList.add("btn-primary")
  btnProximo.classList.add("btnProximoRegVenda")

  divBtnProximo.appendChild(btnProximo)*/

  divSelecProdutos.style.display = "block";
  divSelecMetodos.style.display = "none";
  finalizarPreVenda.style.display = "none";
  //window.onload = GetAllDataRealtime();
  window.onload = GetAllDataRealtimeMetodosP();
  divBtnProximo.classList.remove("d-none");
  divBtnProximo.classList.add("d-block");

  let prodEscolhidoLocalStorage = window.localStorage.getItem("prodEscolhido");

  if (prodEscolhidoLocalStorage != "true") {
    //window.onload = PegarTdsProdutosSelecionados()
  }

  const dbRef = ref(
    db,
    "estabelecimentos/" +
      usuarioEstabelecimento +
      "/produtos/selecProdutosValor"
  );

  onValue(dbRef, (snapshot) => {
    const data = snapshot.val();

    valorTotal = data.valorTotal;
    
    spanTotalVenda.innerHTML = valorTotal + " " + TipoMoeda;

    window.localStorage.setItem("valorTotalProdutos", valorTotal);

    window.localStorage.setItem("prodEscolhido", true);

    /*set(
      ref(
        db,
        "estabelecimentos/" +
          usuarioEstabelecimento +
          "/produtos/selecProdutosTotal"
      ),
      {
        valorTotal: valorTotal,
      }
    );*/
  },
  {
    onlyOnce: true,
  });

  
});

const dbRef = ref(
  db,
  "estabelecimentos/" + usuarioEstabelecimento + "/produtos/selecProdutos"
);
var dadosSelecProdBtnPrx;

onValue(dbRef, (snapshot) => {
  const data = snapshot.val();
  dadosSelecProdBtnPrx = data;
});

botaoProximo.addEventListener("click", () => {
  /*function passarPTelaMetodos(){
    console.log(dadosSelecProdBtnPrx)
    btnFecharModalVendas.click()
    if(dadosSelecProdBtnPrx == null){
      alert("Selecione um produto")
    }else{
      divSelecProdutos.style.display = "none"
      finalizarPreVenda.style.display = "block"

      botaoProximo.classList.remove("btnProximoRegVenda")
      botaoProximo.classList.add("btnProximoRegVendaModalMesas")
      divBtnProximo.classList.add("d-none") 
    }
  }*/
  /*let prodEscolhidoLocalStorage = window.localStorage.getItem("prodEscolhido");

  if(prodEscolhidoLocalStorage != "true"){
    btnFinalizarVenda.click()
  }*/

  produtosCategoria.style.display = "block";
  produtosAdicio.style.display = "none";
    
  btnFinalizarVenda.click();

  
  //passarPTelaMetodos()
  window.onload = PegarTdsProdutosSelecionados();
});

const dbRefMetPagamentoE = ref(
  db,
  "estabelecimentos/" +
    usuarioEstabelecimento +
    "/metodosPagamento/metodoSelecionado"
);
let confirME = true;
const dbRefProdE = ref(
  db,
  "estabelecimentos/" + usuarioEstabelecimento + "/produtos/selecProdutos"
);
let confirPE = true;
const dbRefProdEMesa = ref(
  db,
  "estabelecimentos/" + usuarioEstabelecimento + "/mesas/selecProdutos"
);
let confirPEMesa = true;

onValue(dbRefProdE, (snapshot) => {
  const data = snapshot.val();
  if (data == null) {
    confirPE = false;
  } else {
    confirPE = true;
  }
});

onValue(dbRefProdEMesa, (snapshot) => {
  const data = snapshot.val();
  if (data == null) {
    confirPEMesa = false;
  } else {
    confirPEMesa = true;
  }
});

onValue(dbRefMetPagamentoE, (snapshot) => {
  const data = snapshot.val();
  if (data == null) {
    confirME = false;
    //if(confirME == false){
    btnAdicionarMetodo.setAttribute("data-bs-toggle", "modal");
    btnAdicionarMetodo.setAttribute("data-bs-target", "#modalRegistarVendas");

    //}
  } else {
    confirME = true;
  }
});

btnAdicionarProdutos.addEventListener("click", () => {
  let prodEscolhidoLocalStorage = window.localStorage.getItem("prodEscolhido");
  if (prodEscolhidoLocalStorage == "true") {
    divSelecProdutos.style.display = "block";
    finalizarPreVenda.style.display = "none";
    divSelecMetodos.style.display = "none";
    produtosCategoria.style.display = "block";
    produtosAdicio.style.display = "none";
    
  } else {
    //alert('Adicione um metodo')
  }
});

btnAdicionarMetodo.addEventListener("click", () => {
  let prodEscolhidoLocalStorage = window.localStorage.getItem("prodEscolhido");

  if (prodEscolhidoLocalStorage == "true") {
    divSelecProdutos.style.display = "none";
    finalizarPreVenda.style.display = "none";
    divSelecMetodos.style.display = "block";
  } else {
    //alert('Adicione um produto')
    AlertaInfo("Adicione um produto");
    divSelecProdutos.style.display = "block";
    finalizarPreVenda.style.display = "none";
    divSelecMetodos.style.display = "none";
  }
});

botaoCancelar.addEventListener("click", () => {
  let prodEscolhidoLocalStorage = window.localStorage.getItem("prodEscolhido");

  if (prodEscolhidoLocalStorage == "true") {
    regVendasNormal();
    //alert('Cancelado com sucesso')
    AlertaInfo("Cancelado com sucesso");
    window.localStorage.setItem("prodEscolhido", false);
    window.localStorage.removeItem("valorTotalProdutos");
    divSelecProdutos.style.display = "block";
    finalizarPreVenda.style.display = "none";
    divSelecMetodos.style.display = "none";
  } else {
    //alert('Nada seleciondo')
    AlertaInfo("Cancelado com sucesso");
  }

  // Ocultar a div mostrarTroco após cancelar a venda
  document.querySelector(".mostrarTroco").style.display = "none";

  txtAdicionarClientes.innerHTML = "Cliente Selecionado: ";
  
});

botaoCancelar2.addEventListener("click", () => {
  if (confirME == true) {
    regVendasNormal();

    window.localStorage.setItem("prodEscolhido", false);
    window.localStorage.removeItem("valorTotalProdutos");
    divSelecProdutos.style.display = "block";
    finalizarPreVenda.style.display = "none";
    divSelecMetodos.style.display = "none";
  } else {
    //alert('Nada seleciondo')
  }
});


btnVoltarCategorias.addEventListener("click", () => {
  
  produtosCategoria.style.display = "block";
  produtosAdicio.style.display = "none";

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
  "estabelecimentos/" + usuarioEstabelecimento + "/produtos/selecProdutosValor"
);

onValue(dbRefValorTtlProd, (snapshot) => {
  const data = snapshot.val();

  valorTotalProdutos = data.valorTotal;

  
  console.log(valorTotalProdutos)
},
{
  onlyOnce: true,
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

// Adicionar evento para calcular troco em tempo real
document.addEventListener("DOMContentLoaded", function () {
  const inputTroco = document.querySelector(".inputTroco");

  if (inputTroco) {
    inputTroco.addEventListener("input", function () {

      const valorTotal = parseFloat(
        spanTotalVenda.innerHTML.replace(/[^0-9.-]+/g, "")
      );
      const valorPago = parseFloat(this.value) || 0;
      const troco = valorPago - valorTotal;

      valorTrocoGlobal = troco; // Armazenar o troco na variável global


      if (troco >= 0) {
        document.querySelector(".mostrarTroco p").innerHTML =
          "Troco: " + troco.toFixed(2) + " " + TipoMoeda;
        document.querySelector(".mostrarTroco p").style.color = "#198754"; // Verde para troco positivo
      } else {
        document.querySelector(".mostrarTroco p").innerHTML =
          "Valor insuficiente";
        document.querySelector(".mostrarTroco p").style.color = "#dc3545"; // Vermelho para valor insuficiente
      }
    });
  } else {
    console.log("Input troco não encontrado!"); // Debug se o elemento não for encontrado
  }
});

btnRegVenda.addEventListener("click", () => {
  // Capturar o nome do cliente selecionado

  const nomeCliente = txtAdicionarClientes
    ? txtAdicionarClientes.textContent.replace("Cliente Selecionado: ", "")
    : "";

  if (nomeCliente) {
    // Referência para a frequência de compras do cliente
    const frequenciaComprasRef = ref(
      db,
      "estabelecimentos/" +
        usuarioEstabelecimento +
        "/clientes/" +
        nomeCliente +
        "/frequenciaCompras"
    );

    // Incrementar a frequência de compras
    onValue(
      frequenciaComprasRef,
      (snapshot) => {
        const frequenciaAtual = snapshot.val() || 0;
        set(frequenciaComprasRef, frequenciaAtual + 1);
      },
      { onlyOnce: true }
    );
  }

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
      codMesaEscolhido
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
    dbRefProdutos,
    (snapshot) => {
      const data = snapshot.val();
      produtosSelecionados = data;

      var lucroPorProduto = [];
      var precoTotalPorProduto = [];

      snapshot.forEach((childSnapshot) => {
        lucroPorProduto.push(childSnapshot.val().lucroProduto);
      });

      snapshot.forEach((childSnapshot) => {
        quantidadeProduto.push(childSnapshot.val());

        //reduzirQuantProduto(childSnapshot.val().nomeProduto, childSnapshot.val().quantidadeProd)
      });

      lucroPorProduto.forEach((val) => {
        lucroInicialPorVenda = lucroInicialPorVenda + val;
      });

      snapshot.forEach((childSnapshot) => {
        precoTotalPorProduto.push(childSnapshot.val().precoTotalProduto);
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

  let valorTotalProdutosLocal = window.localStorage.getItem("valorTotalProdutos");

  console.log(valorTotalProdutosLocal)
  var valorTotalProdutoss = (parseInt(valorTotalProdutos) / 2);
  saldoFinal = parseInt(saldoIniciall) + valorTotalProdutosLocal;
  
  console.log(valorTotalProdutoss)

  nrMovimentacoes = parseInt(nrMovimentacoess) + 1;

  chaveVendas = parseInt(chaveVendasString) + 1;

  let prodEscolhidoLocalStorage = window.localStorage.getItem("prodEscolhido");

  if (prodEscolhidoLocalStorage == "true") {
    try {
      onValue(
        dbRefProdutos,
        (snapshot) => {
          const data = snapshot.val();
          produtosSelecionados = data;

          var lucroPorProduto = [];
          var precoTotalPorProduto = [];

          snapshot.forEach((childSnapshot) => {
            lucroPorProduto.push(childSnapshot.val().lucroProduto);
          });

          lucroPorProduto.forEach((val) => {
            lucroInicialPorVenda = lucroInicialPorVenda + val;
          });

          snapshot.forEach((childSnapshot) => {
            precoTotalPorProduto.push(childSnapshot.val().precoTotalProduto);
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
          produtos: produtosSelecionados,
          codigoVenda: chaveVendas,
          metodoPagamento: metodoSelecionando,
          //produtosMesa: produtosSelecionadosMesas,
          horaActual:
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
            now.getFullYear(),
          precoTotalVenda: precoTotalVenda / 2,
          lucroVenda: {
            lucroVenda: lucroInicialPorVenda / 2,
          },
          responsavel: nomeUsuario,
          troco: valorTrocoGlobal.toFixed(2),
          timestamp: new Date().toISOString(),
          cliente: nomeCliente,
        }
      );

      set(
        ref(db, "estabelecimentos/" + usuarioEstabelecimento + "/saldo/saldo"),
        {
          saldo: parseInt(saldoIniciall) + parseInt(valorTotalProdutosLocal),
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
          saldoMovimentado: parseInt(valorTotalProdutosLocal),
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
            (now.getMonth() + 1) +
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
          valorTotal: valorTotalVendasIniciall + parseInt(valorTotalProdutosLocal),
        }
      );

      // Adicionar informações no histórico de compras do cliente
      const dbRefHistoricoCliente = ref(
        db,
        "estabelecimentos/" +
          usuarioEstabelecimento +
          "/clientes/" +
          nomeCliente +
          "/historicoCompras/" +
          chaveVendas
      );

      set(dbRefHistoricoCliente, {
        produtos: produtosSelecionados,
        valorCompra: precoTotalVenda,
        lucroVenda: lucroInicialPorVenda,
        horaActual:
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
          now.getFullYear(),
      });

      // Adicionar informações da venda como entrada no caixa
      const saldoEntradaRef = ref(
        db,
        "estabelecimentos/" + usuarioEstabelecimento + "/saldo/entrada"
      );

      onValue(
        saldoEntradaRef,
        (snapshot) => {
          const chaveSaldoEntrada = snapshot.size + 1;
          set(
            ref(
              db,
              "estabelecimentos/" +
                usuarioEstabelecimento +
                "/saldo/entrada/" +
                chaveSaldoEntrada
            ),
            {
              saldoAdicionado: precoTotalVenda,
              motivo: "venda",
              produtos: produtosSelecionados,
              horaActual:
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
                now.getFullYear(),
              nomeCliente: nomeCliente,
              responsavel: nomeUsuario,
            }
          );
        },
        { onlyOnce: true }
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

  // Ocultar a div mostrarTroco após registrar a venda
  document.querySelector(".mostrarTroco").style.display = "none";

  txtAdicionarClientes.innerHTML = "Cliente Selecionado: ";
});

/*
const citiesRef = collection(dbFt, 'produtosMesa');

const q = query(citiesRef, where('codigoMesa', '==', 'M-002'));

const querySnapshot = await getDocs(q);
let dadosP = []
let dadosPP = []
querySnapshot.forEach((doc) => {
  // doc.data() is never undefined for query doc snapshots
  console.log(doc.id, ' => ', doc.data().produtos);
   dadosP.push(doc.data().produtos)
   *dadosPP.push(dadosP.forEach((l)=>{
    //console.log(l)
   }))*
   //let arrayDados = Object.keys(dadosP).map(i => JSON.parse(dadosP[Number(i)]))

   console.log(dadosP[0])
   dadosP.forEach((val)=>{
    dadosPP.unshift(val)
    
    *dadosPP.forEach((val2)=>{
      console.log(val2)
    })*
   })

   
  *dadosP.forEach((d)=>{
    console.log(d)
  })*
  
});*/

/*import { firebaseConfig} from './firebaseConfig.js';
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-app.js";
import { getDatabase, set, ref, onValue } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-database.js";


var codProdV = document.querySelector(".codProdV")
var nomeProdV = document.querySelector(".nomeProdV")
var precVenda = document.querySelector(".precVenda")
var quantProdV = document.querySelector(".quantProdV")
var valorTot = document.querySelector(".valorTot")
var valorEntr = document.querySelector(".valorEntr")
var valorTr = document.querySelector(".valorTr")
var horaRegVen = document.querySelector(".horaRegVen")
var btnRegVenda = document.querySelector(".btnRegVenda")
var codProdVendas = 0
var precVendaV = 0
var valorTotal

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

codProdV.addEventListener("keyup", ()=>{
  const starCountRef = ref(database, 'produtos/' + codProdV.value);

  onValue(starCountRef, (snapshot) => {
      const data = snapshot.val();
      //updateStarCount(postElement, data);
      console.log(data)
      /*if(nomeProd.placeholder == "undefined"){
        nomeProd.placeholder = "Não existe, digite um novo dado"
      }else{
        nomeProd.placeholder = data.nomeProd
      }
      if(precVenda.placeholder == "undefined"){
        precVenda.placeholder = "Não existe, digite um novo dado"
      }else{
        precVenda.placeholder = data.precVenda
      }*
      //horaRegA.value = data.horaReg
      nomeProdV.value = data.nomeProd
      precVenda.value = data.precVenda
      precVendaV = data.precVenda
  });
})

quantProdV.addEventListener("keyup", ()=>{
  valorTotal = precVendaV * quantProdV.value

  valorTot.value = valorTotal
})

valorEntr.addEventListener("keyup", ()=>{
  if(valorEntr.value < valorTotal){
    //alert("O valor dado e menor que valor total")
    valorTr.value = 0
  }else{
    var valorTroco = Math.abs(valorTot.value - valorEntr.value)
    valorTr.value = valorTroco
  }
})



btnRegVenda.addEventListener("click", ()=>{
  if(valorEntr.value < valorTotal){
    alert("O valor dado e menor que valor total")
    window.location.href = "./dashboard.html?#sectionReg"
  }else{
    /*var valorTroco = Math.abs(valorTot.value - valorEntr.value)
    valorTr.value = valorTroco*

    function adicionarProd(codProdV, nomeProdV, precVenda, quantProdV, valorTot, valorEntr, valorTr, horaRegVen) {
      const db = getDatabase();
      set(ref(db, 'vendas/' + codProdVendas + 1), {
        codProdV: codProdV,
        nomeProdV: nomeProdV,
        precVenda: precVenda,
        quantProdV: quantProdV,
        valorTot: valorTot,
        valorEntr: valorEntr,
        valorTr: valorTr,
        horaRegVen: horaRegVen
      });
    }

    adicionarProd(codProdV.value, nomeProdV.value, precVenda.value, quantProdV.value, valorTot.value, valorEntr.value, valorTr.value, horaRegVen.value)

    alert("Venda cadastrada com sucesso")
    codProdV.value = ""
    nomeProdV.value = ""
    precVenda.value = ""
    quantProdV.value = ""
    valorTot.value = ""
    valorEntr.value = ""
    valorTr.value = ""
    horaRegVen.value
  }
})







*btnAlterProd.addEventListener("click", ()=>{
  function adicionarProd(codProd, nomeProd, precVenda, horaReg,) {
    const db = getDatabase();
    set(ref(db, 'produtos/' + codProd), {
      nomeProd: nomeProd,
      precVenda: precVenda,
      horaReg: horaReg
    });
  }
  
  adicionarProd(codProd.value, nomeProd.value, precVenda.value, horaReg.value)
  
      alert("Produto cadastrado com sucesso")
      codProd.value = ""
      nomeProd.value = ""
      precVenda.value = ""
  })*/

// Função para calcular troco quando método dinheiro é selecionado
function calcularTroco() {
  valorPagoCliente.addEventListener("input", () => {
    const valorTotal = parseFloat(spanTotalVenda.innerHTML);
    const valorPago = parseFloat(valorPagoCliente.value) || 0;
    const troco = valorPago - valorTotal;

    if (troco >= 0) {
      trocoCliente.innerHTML = troco.toFixed(2) + " " + TipoMoeda;
      trocoCliente.style.color = "#198754"; // Verde para troco positivo
    } else {
      trocoCliente.innerHTML = "Valor insuficiente";
      trocoCliente.style.color = "#dc3545"; // Vermelho para valor insuficiente
    }
  });
}

// Função para validar pagamento em dinheiro
function validarPagamentoDinheiro() {
  const valorTotal = parseFloat(spanTotalVenda.innerHTML);
  const valorPago = parseFloat(valorPagoCliente.value) || 0;

  if (valorPago < valorTotal) {
    AlertaInfo("O valor pago é menor que o valor total da venda");
    return false;
  }
  return true;
}

// Adicionar evento ao botão de confirmar método de pagamento
/*document
  .querySelector(".btnConfirmarMetodoPagamento")
  .addEventListener("click", () => {
    const metodoDinheiro = document
      .querySelector(".cardRegVendasSelecionado")
      ?.textContent.toLowerCase()
      .includes("dinheiro");

    if (metodoDinheiro) {
      if (!validarPagamentoDinheiro()) {
        return;
      }
    }

    PegarMetodosSelecionado();
  });*/

// Referenciar o botão btnAdicionarCliente
const btnAdicionarCliente = document.querySelector(".btnAdicionarCliente");

// Adicionar EventListener ao botão
if (btnAdicionarCliente) {
  btnAdicionarCliente.addEventListener("click", () => {
    // Usar Bootstrap Modal para abrir o modal
    const modal = new bootstrap.Modal(
      document.getElementById("modalAdicionarClientes")
    );
    modal.show();
  });
} else {
  console.error("Botão btnAdicionarCliente não encontrado.");
}

// Função para carregar todos os clientes e preencher a divAdicionarClientes
function carregarClientesNaDiv() {
  const clientesRef = ref(
    db,
    "estabelecimentos/" + usuarioEstabelecimento + "/clientes"
  );

  onValue(clientesRef, (snapshot) => {
    const divAdicionarClientes = document.querySelector(
      ".divAdicionarClientes"
    );
    divAdicionarClientes.innerHTML = ""; // Limpar lista atual

    snapshot.forEach((childSnapshot) => {
      const cliente = childSnapshot.val();
      const listItem = document.createElement("li");
      listItem.classList.add("list-group-item");
      listItem.textContent = cliente.nomeCliente;
      listItem.setAttribute("data-bs-dismiss", "modal"); // Fechar modal ao clicar

      // Adicionar EventListener para atualizar o innerHTML
      listItem.addEventListener("click", () => {
        const txtAdicionarClientes = document.querySelector(
          ".txtAdicionarClientes"
        );
        if (txtAdicionarClientes) {
          txtAdicionarClientes.innerHTML =
            "Cliente Selecionado: " + "<strong>" + cliente.nomeCliente + "</strong>";
        } else {
          console.error(
            "Elemento com a classe 'txtAdicionarClientes' não encontrado."
          );
        }
      });

      divAdicionarClientes.appendChild(listItem);
    });
  });
}

// Carregar clientes na div ao abrir o modal
const modalAdicionarClientes = document.getElementById(
  "modalAdicionarClientes"
);
modalAdicionarClientes.addEventListener("show.bs.modal", carregarClientesNaDiv);
