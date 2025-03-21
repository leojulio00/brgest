import { firebaseConfig } from "../logico/firebaseConfig.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-app.js";
import {
  getDatabase,
  ref,
  onValue,
} from "https://www.gstatic.com/firebasejs/9.14.0/firebase-database.js";

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Dados do localStorage
var usuarioEstabelecimento = window.localStorage.getItem(
  "usuarioEstabelecimento"
);
var localEstabelecimento = window.localStorage.getItem("localEstabelecimento");
var emailEstabelecimento = window.localStorage.getItem("emailEstabelecimento");
var nomeUser = window.localStorage.getItem("nomeUser");
var telefoneEstabelecimento = window.localStorage.getItem(
  "telefoneEstabelecimento"
);

// Data e hora atual
function getHoraActual() {
  var now = new Date();
  return (
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
  );
}

// Referências do Firebase
const produtosSelecionadosRef = ref(
  db,
  "estabelecimentos/" + usuarioEstabelecimento + "/produtos/selecProdutos"
);
const metodoPagSelecionadoRef = ref(
  db,
  "estabelecimentos/" +
    usuarioEstabelecimento +
    "/metodosPagamento/metodoSelecionado"
);
const produtosValorRef = ref(
  db,
  "estabelecimentos/" +
    usuarioEstabelecimento +
    "/produtos/selecProdutosValor/valorTotal"
);
const trocoSelecionadoSelecionadoRef = ref(
  db,
  "estabelecimentos/" +
    usuarioEstabelecimento +
    "/produtos/trocoVendaSelecionada/trocoVenda"
);
const clienteSelecionadoSelecionadoRef = ref(
  db,
  "estabelecimentos/" +
    usuarioEstabelecimento +
    "/produtos/clienteSelecionado/nomeCliente"
);

// Função para carregar e armazenar dados no localStorage
function carregarEArmazenarDados() {
  onValue(
    produtosSelecionadosRef,
    (snapshot) => {
      const produtosSelecionados = snapshot.val();
      if (produtosSelecionados) {
        localStorage.setItem(
          "produtosSelecionados",
          JSON.stringify(produtosSelecionados)
        );
      }
    },
    { onlyOnce: false }
  );

  onValue(
    metodoPagSelecionadoRef,
    (snapshot) => {
      const metodoPagamento = snapshot.val();
      if (metodoPagamento) {
        localStorage.setItem(
          "metodoPagamento",
          JSON.stringify(metodoPagamento)
        );
      }
    },
    { onlyOnce: false }
  );

  onValue(
    produtosValorRef,
    (snapshot) => {
      const valorTotal = snapshot.val();
      if (valorTotal !== null && valorTotal !== undefined) {
        localStorage.setItem("valorTotalVenda", valorTotal);
      } else {
        //localStorage.setItem("valorTotalVenda",   );
      }
    },
    { onlyOnce: true }
  );

  onValue(
    trocoSelecionadoSelecionadoRef,
    (snapshot) => {
      const troco = snapshot.val();
      if (troco !== null && troco !== undefined) {
        localStorage.setItem("troco", troco);
      }
    },
    { onlyOnce: false }
  );

  onValue(
    clienteSelecionadoSelecionadoRef,
    (snapshot) => {
      const cliente = snapshot.val();
      if (cliente) {
        localStorage.setItem("cliente", cliente);
      }
    },
    { onlyOnce: false }
  );
}

// Carregar e armazenar os dados ao iniciar
carregarEArmazenarDados();

function geradorRecibos() {
  // Recuperar dados do localStorage
  const produtosSelecionados = JSON.parse(
    localStorage.getItem("produtosSelecionados")
  );
  const metodoPagamento = JSON.parse(localStorage.getItem("metodoPagamento"));
  const valorTotal = localStorage.getItem("valorTotalProdutos");
  const troco = localStorage.getItem("troco");
  const cliente = localStorage.getItem("cliente");

  // Recuperar dados do localStorage (já existentes no código original)
  const usuarioEstabelecimento = window.localStorage.getItem(
    "usuarioEstabelecimento"
  );
  const localEstabelecimento = window.localStorage.getItem(
    "localEstabelecimento"
  );
  const emailEstabelecimento = window.localStorage.getItem(
    "emailEstabelecimento"
  );
  const nomeUser = window.localStorage.getItem("nomeUser");
  const telefoneEstabelecimento = window.localStorage.getItem(
    "telefoneEstabelecimento"
  );

  // Montar a lista de produtos
  let pLL = "";
  if (produtosSelecionados) {
    Object.values(produtosSelecionados).forEach((produto) => {
      const nomeProdutoFinal =
        produto.nomeProduto.length > 15
          ? produto.nomeProduto.slice(0, 15) + "..."
          : produto.nomeProduto;
      pLL += `>${nomeProdutoFinal} ------ ${produto.quantidadeProd} ---- ${
        produto.precoProduto * produto.quantidadeProd
      } ${produto.tipoMoeda}
      `;
    });
  }

  // Montar o recibo
  const recibo = `
                    RECIBO
    ---------------------------------
    Emitente: ${usuarioEstabelecimento}
    Endereço: ${localEstabelecimento}
    E-mail: ${emailEstabelecimento}
    Telefone: ${telefoneEstabelecimento}
    ---------------------------------
    Cliente: ${cliente || "N/A"}
    ---------------------------------
    Data: ${getHoraActual()}
    ---------------------------------
    Descrição do Serviço/Produto:
    Nome ------------ Qtd --------- Sub Total
    ---------------------------------
    ${pLL}
    ---------------------------------
    TOTAL: ${valorTotal ? parseFloat(valorTotal).toFixed(2) : "0.00"} MZN
    Troco: ${troco || "0.00"} MZN
    Forma de Pagamento: ${
      metodoPagamento
        ? Object.values(metodoPagamento)[0]?.nomeMetodo || "N/A"
        : "N/A"
    }
    ---------------------------------
    Responsavel da venda: ${
      nomeUser.length > 10 ? nomeUser.slice(0, 10) + "..." : nomeUser
    }
    Obs: Este recibo serve como comprovante de
    pagamento e não substitui a factura.
    VOLTE SEMPRE
  `;

  return recibo;
}

// Exportar a função geradorRecibos
export { geradorRecibos };

/*import { firebaseConfig } from "../logico/firebaseConfig.js";
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
var localEstabelecimento = window.localStorage.getItem("localEstabelecimento");
var emailEstabelecimento = window.localStorage.getItem("emailEstabelecimento");
var nomeUser = window.localStorage.getItem("nomeUser");
var telefoneEstabelecimento = window.localStorage.getItem(
  "telefoneEstabelecimento"
);
var btnTesteRegVenda = document.querySelector(".btnTesteRegVenda");
let pLL = "";
let pL = "";

var now = new Date();
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
  now.getFullYear();

// Referência para todos os produtos Selecionados na venda
const produtosSelecionadosRef = ref(
  db,
  "estabelecimentos/" + usuarioEstabelecimento + "/produtos/selecProdutos"
);

// Referência para metodo de pagamento selecionado
const metodoPagSelecionadoRef = ref(
  db,
  "estabelecimentos/" +
    usuarioEstabelecimento +
    "/metodosPagamento/metodoSelecionado"
);

// Referência para trocoSeleconado
const produtosValorRef = ref(
  db,
  "estabelecimentos/" +
    usuarioEstabelecimento +
    "/produtos/selecProdutosValor/valorTotal"
);

// Referência para trocoSeleconado
const trocoSelecionadoSelecionadoRef = ref(
  db,
  "estabelecimentos/" +
    usuarioEstabelecimento +
    "/produtos/trocoVendaSelecionada/trocoVenda"
);

// Referência para cliente selecionado
const clienteSelecionadoSelecionadoRef = ref(
  db,
  "estabelecimentos/" +
    usuarioEstabelecimento +
    "/produtos/clienteSelecionado/nomeCliente"
);

let totalProdutosAbaixo = 0;
/*
// Carregar e exibir a quantidade e o nome de todos os produtos com quantidade maior ou igual a 5
onValue(produtosRef, (snapshot) => {
  let totalProdutos = 0;
  // Limpar a div antes de adicionar novos elementos
  divVerProdutosAbaixo.innerHTML = "";

  snapshot.forEach((childSnapshot) => {
    const produto = childSnapshot.val();
    if (produto.quantProdE <= 5) {
      totalProdutos += produto.quantProdE;
      totalProdutosAbaixo += 1;

      // Criar elemento de lista para cada produto
      const listItem = document.createElement("div");
      listItem.innerHTML = "<strong>" + "Nome do produto: " + "</strong>" + `${produto.nomeProd},` + "</br>" +
             "<strong>" + "Quantidade: " + "</strong>" + `${produto.quantProdE}` + "</br>" + "</br>";
      divVerProdutosAbaixo.appendChild(listItem);
    }
  });

  // Adicionar evento ao botão para exibir produtos abaixo
  if (btnVerProdutosAbaixo) {
    btnVerProdutosAbaixo.addEventListener("click", () => {
      const modal = new bootstrap.Modal(modalVerProdutosAbaixo);
      modal.show();
    });
  }

  // Atualizar o texto com o total de produtos abaixo
  if (totalProdutosAbaixoTxt) {
    totalProdutosAbaixoTxt.innerHTML = totalProdutosAbaixo;
  }
});
*

export function geradorRecibos() {
  let recibo = "";
  let limite = 15;
  let nomeProduto = "";
  let nomeProdutoFinal;
  let metodoPagamento = "";
  let nomeCliente = "";
  let valorTroco = 0;
  let valorTotalProdutosSelec = 0;
  // Calcular e exibir o ticket médio de cada produto
  onValue(produtosSelecionadosRef, (snapshot) => {
    //divTicketMedio.innerHTML = ""; // Limpar a div antes de adicionar novos elementos


    snapshot.forEach((childSnapshot) => {
      const produto = childSnapshot.val();

      nomeProduto = produto.nomeProduto;
      nomeProdutoFinal =
        nomeProduto.length > limite
          ? nomeProduto.slice(0, limite) + "..."
          : nomeProduto;
      let produtosLista =
        ">" +
        nomeProduto +
        " ------ " +
        produto.quantidadeProd +
        " ---- " +
        produto.precoProduto * produto.quantidadeProd +
        " " +
        produto.tipoMoeda +
        "%0A";

      pL = produtosLista;
      pLL = pLL + pL;

      if (produto.quantProdE) {
      }
    });

    //console.log(pLL);

    onValue(clienteSelecionadoSelecionadoRef, (snapshot) => {
      const data = snapshot.val();
      console.log(data);

      if (data) {
        nomeCliente = data;
      }
    });

    onValue(trocoSelecionadoSelecionadoRef, (snapshot) => {
      const data = snapshot.val();
      console.log(data);

      if (data) {
        valorTroco = data;
      }
    });

    //console.log(nomeCliente + "---" + valorTroco);

    onValue(
      metodoPagSelecionadoRef,
      (snapshot) => {
        /*const data = snapshot.key;
      console.log(data);*
        snapshot.forEach((childSnapshot) => {
          const data = childSnapshot.val();
          console.log(data);

          if (data) {
            metodoPagamento = data.nomeMetodo;
          }
        });
      },
      {
        onlyOnce: true,
      }
    );

    onValue(
      produtosValorRef,
      (snapshot) => {
        const data = snapshot.val();
        console.log(data);

        if (data) {
          valorTotalProdutosSelec = data;
        }
      },
      {
        onlyOnce: true,
      }
    );

    recibo = `
                    RECIBO%0A
    =======================================%0A
    Emitente: ${usuarioEstabelecimento}%0A
    Endereço: ${localEstabelecimento}%0A
    E-mail: ${emailEstabelecimento}%0A
    Telefone: ${telefoneEstabelecimento}%0A
    ---------------------------------------%0A
    Cliente: ${nomeCliente}%0A
    =======================================%0A
    Data: ${horaActual}%0A
    =======================================%0A
    Descrição do Serviço/Produto:
    ---------------------------------------%0A
    Nome ------------ Qtd --------- Sub Total%0A
    ---------------------------------------%0A

    ${pLL}
    ---------------------------------------%0A
    TOTAL: ${valorTotalProdutosSelec.toFixed(2)} MZN%0A
    Troco: ${valorTroco ? valorTroco : 0} MZN%0A
    Forma de Pagamento: ${metodoPagamento}%0A
    =======================================%0A
    Responsavel da venda: ${
      nomeUser.length > 10 ? nomeUser.slice(0, 10) + "..." : nomeUser
    }%0A
    =======================================%0A
    Obs: Este recibo serve como comprovante de
    pagamento e não substitui a factura.%0A
    =======================================%0A
    VOLTE SEMPRE
    `;

    //return recibo;
    //console.log(recibo);
  });
  recibo = `
                    RECIBO%0A
    =======================================%0A
    Emitente: ${usuarioEstabelecimento}%0A
    Endereço: ${localEstabelecimento}%0A
    E-mail: ${emailEstabelecimento}%0A
    Telefone: ${telefoneEstabelecimento}%0A
    ---------------------------------------%0A
    Cliente: ${nomeCliente}%0A
    =======================================%0A
    Data: ${horaActual}%0A
    =======================================%0A
    Descrição do Serviço/Produto:
    ---------------------------------------%0A
    Nome ------------ Qtd --------- Sub Total%0A
    ---------------------------------------%0A

    ${pLL}
    ---------------------------------------%0A
    TOTAL: ${valorTotalProdutosSelec.toFixed(2)} MZN%0A
    Troco: ${valorTroco ? valorTroco : 0} MZN%0A
    Forma de Pagamento: ${metodoPagamento}%0A
    =======================================%0A
    Responsavel da venda: ${
      nomeUser.length > 10 ? nomeUser.slice(0, 10) + "..." : nomeUser
    }%0A
    =======================================%0A
    Obs: Este recibo serve como comprovante de
    pagamento e não substitui a factura.%0A
    =======================================%0A
    VOLTE SEMPRE
    `;
  return recibo;
}

btnTesteRegVenda.addEventListener("click", () => {});
*/
