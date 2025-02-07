import { firebaseConfig } from "../logico/firebaseConfig.js";
import { TipoMoeda } from "../saldo/tipoMoeda.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-app.js";
import {
  getDatabase,
  ref,
  set,
  onValue,
} from "https://www.gstatic.com/firebasejs/9.14.0/firebase-database.js";

const app = initializeApp(firebaseConfig);
const db = getDatabase();

var usuarioEstabelecimento = window.localStorage.getItem(
  "usuarioEstabelecimento"
);
var nomeUsuario = window.localStorage.getItem("nomeUser");

// Elementos do formulário
var nomeCliente = document.querySelector(".nomeCliente");
var telefoneCliente = document.querySelector(".telefoneCliente");
var emailCliente = document.querySelector(".emailCliente");
var enderecoCliente = document.querySelector(".enderecoCliente");
var saldoDividaCliente = document.querySelector(".saldoDividaCliente");
var dataCadastroCliente = document.querySelector(".dataCadastroCliente");
var btnCadastrarCliente = document.querySelector(".btnCadastrarCliente");

// Elementos de alerta
var alertaInfo = document.querySelector(".alerta-info");
var alertaErro = document.querySelector(".alerta-erro");
var alertaSucesso = document.querySelector(".alerta-sucesso");

// Funções de alerta
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

// Função para atualizar a data de cadastro
function atualizarDataCadastro() {
  let now = new Date();
  dataCadastroCliente.value =
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
}

// Atualizar data ao carregar a página
window.onload = atualizarDataCadastro;

// Função para cadastrar cliente
function cadastrarCliente(
  nomeCliente,
  telefone,
  email,
  endereco,
  saldoDivida,
  dataCadastro
) {
  try {
    set(
      ref(
        db,
        "estabelecimentos/" +
          usuarioEstabelecimento +
          "/clientes/" +
          nomeCliente
      ),
      {
        nomeCliente: nomeCliente,
        telefone: telefone,
        email: email,
        endereco: endereco,
        saldoDivida: saldoDivida,
        dataCadastro: dataCadastro,
        frequenciaCompras: 0,
        responsavelCadastro: nomeUsuario,
      }
    );

    AlertaSucesso("Cliente cadastrado com sucesso!");

    atualizarDataCadastro(); // Atualizar a data de cadastro
  } catch (error) {
    console.error(error);
    AlertaErro("Erro ao cadastrar cliente. Por favor, tente novamente.");
  }
}

// Event listener do botão cadastrar
btnCadastrarCliente.addEventListener("click", () => {
  if (nomeCliente.value && telefoneCliente.value && enderecoCliente.value) {
    cadastrarCliente(
      nomeCliente.value,
      telefoneCliente.value,
      emailCliente.value,
      enderecoCliente.value,
      saldoDividaCliente.value,
      dataCadastroCliente.value
    );
  } else {
    AlertaInfo("Por favor, preencha todos os campos obrigatórios.");
  }

  // Limpar todos os campos do formulário
  nomeCliente.value = "";
  telefoneCliente.value = "";
  emailCliente.value = "";
  enderecoCliente.value = "";
  saldoDividaCliente.value = "";
});

// Função para carregar todos os clientes e preencher o modal
function carregarClientesNoModal() {
  const clientesRef = ref(
    db,
    "estabelecimentos/" + usuarioEstabelecimento + "/clientes"
  );

  onValue(clientesRef, (snapshot) => {
    const listaClientes = document.getElementById("listaClientes");
    listaClientes.innerHTML = ""; // Limpar lista atual

    snapshot.forEach((childSnapshot) => {
      const cliente = childSnapshot.val();
      const listItem = document.createElement("li");
      listItem.classList.add("list-group-item");
      listItem.textContent = cliente.nomeCliente;
      listItem.style.cursor = "pointer";

      // Ao clicar no nome do cliente, referenciar na seção de registrar venda
      listItem.addEventListener("click", () => {
        const nomeClienteVendaInput =
          document.querySelector(".nomeClienteVenda");
        if (nomeClienteVendaInput) {
          nomeClienteVendaInput.value = cliente.nomeCliente;
        } else {
          console.error(
            "Elemento com a classe 'nomeClienteVenda' não encontrado."
          );
        }
        const modal = bootstrap.Modal.getInstance(
          document.getElementById("modalListaClientes")
        );
        modal.hide();

        // Atualizar o innerHTML da div com a classe 'clienteSelecionado' com o nome do cliente
        let clienteSelecionadoDiv = document.querySelector(
          ".clienteSelecionado"
        );
        if (clienteSelecionadoDiv) {
          clienteSelecionadoDiv.innerHTML =
            "Cliente Selecionado: " + cliente.nomeCliente;
        } else {
          console.error(
            "Elemento com a classe 'clienteSelecionado' não encontrado."
          );
        }
      });

      listaClientes.appendChild(listItem);
    });
  });
}

// Carregar clientes no modal ao abrir
const modalListaClientes = document.getElementById("modalListaClientes");
modalListaClientes.addEventListener("show.bs.modal", carregarClientesNoModal);
