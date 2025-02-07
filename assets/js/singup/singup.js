import { firebaseConfig } from "../logico/firebaseConfig.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-app.js";
import {
  getDatabase,
  ref,
  onValue,
  set,
} from "https://www.gstatic.com/firebasejs/9.14.0/firebase-database.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "https://www.gstatic.com/firebasejs/9.14.0/firebase-auth.js";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

var divDadosAdm = document.querySelector(".dadosAdm");
var divDadosEmpresa = document.querySelector(".dadosEmpresa");
var nomeCompleto = document.querySelector("#nomeCompleto");
var endereco = document.querySelector("#endereco");
var cargo = document.querySelector("#cargo");
var telefone = document.querySelector("#telefone");
var email = document.querySelector("#email");
var senha = document.querySelector("#senha");
var nomeEmpresa = document.querySelector("#nomeEmpresa");
var localizacaoEmpresa = document.querySelector("#localizacaoEmpresa");
var emailEmpresa = document.querySelector("#emailEmpresa");
var telefoneEmpresa = document.querySelector("#telefoneEmpresa");
var tipoEmpresa = document.querySelector("#tipoEmpresa");
var planoEscolhido = document.querySelector("#planoEscolhido");
var btnProximo = document.querySelector(".btnProximo");
var btnEnviar = document.querySelector(".btnEnviar");
var data = new Date();
var dataActual;

//Accao no botao proximo para a aba de insercao de dados da empresa
btnProximo.addEventListener("click", () => {
  divDadosEmpresa.style.display = "block";
  btnEnviar.style.display = "block";
  divDadosAdm.style.display = "none";
});

setInterval(() => {
  dataActual =
    data.getDate() + "/" + (data.getMonth() + 1) + "/" + data.getFullYear();
}, 100);

btnEnviar.addEventListener("click", () => {
  // Função para simular a execução de uma tarefa demorada
  function AbrirPreloader() {
    // Inicia o gif preloader
    var preloader = document.getElementById("preloader");
    preloader.style.display = "flex";
    // Simula uma tarefa demorada de 3 segundos
    setTimeout(function () {
      // Termina a tarefa e oculta o gif preloader
      preloader.style.display = "none";
      //window.location.href = "https://brgest.com"
      //alert("Minha função terminou de executar!");
    }, 8500);
  }

  AbrirPreloader();

  let usuarioId = "";
  function CriarConta(
    nomeCompleto,
    endereco,
    cargo,
    telefone,
    email,
    senha,
    nomeEmpresa,
    localizacaoEmpresa,
    emailEmpresa,
    telefoneEmpresa,
    tipoEmpresa,
    planoEscolhido
  ) {
    createUserWithEmailAndPassword(auth, email, senha).then(
      (userCredential) => {
        // Signed in
        const user = userCredential.user;
        usuarioId = user.uid;

        set(
          ref(db, "estabelecimentos/" + nomeEmpresa + "/users/" + usuarioId),
          {
            nomeColab: nomeCompleto,
            enderColab: endereco,
            telColab: telefone,
            emailColab: email,
            catgColab: cargo,
            localizacaoEstabelecimento: localizacaoEmpresa,
            emailEstabelecimento: emailEmpresa,
            usuarioEstabelecimento: nomeEmpresa,
          }
        );

        set(ref(db, "estabelecimentos/" + nomeEmpresa + "/dadosEmpresa"), {
          localizacaoEstabelecimento: localizacaoEmpresa,
          emailEstabelecimento: emailEmpresa,
          usuarioEstabelecimento: nomeEmpresa,
          telefoneEstabelecimento: telefoneEmpresa,
          tipoEstabelecimento: tipoEmpresa,
          plano: planoEscolhido,
          estadoPlano: false,
          validadePlano: "none",
          dataInscricao: dataActual,
        });

        set(ref(db, "usuarios/" + usuarioId), {
          nomeColab: nomeCompleto,
          enderColab: endereco,
          telColab: telefone,
          emailColab: email,
          catgColab: cargo,
          usuarioEstabelecimento: nomeEmpresa,
        });

        set(
          ref(
            db,
            "/estabelecimentos/" +
              nomeEmpresa +
              "/vendas/lucroTotalVendas/lucroTotal"
          ),
          0
        );

        set(
          ref(
            db,
            "/estabelecimentos/" + nomeEmpresa + "/vendas/todasVendas/0/preset"
          ),
          "preset"
        );

        set(
          ref(
            db,
            "/estabelecimentos/" +
              nomeEmpresa +
              "/vendas/valorTotalVendas/valorTotal"
          ),
          0
        );

        set(
          ref(
            db,
            "/estabelecimentos/" + nomeEmpresa + "/saldo/entrada/0/preset"
          ),
          "preset"
        );

        set(
          ref(db, "/estabelecimentos/" + nomeEmpresa + "/saldo/saida/0/preset"),
          "preset"
        );

        set(ref(db, "/estabelecimentos/" + nomeEmpresa + "/saldo/saldo"), {
          saldo: 0,
          totalMovimentacoes: 0,
        });

        set(
          ref(db, "/estabelecimentos/" + nomeEmpresa + "/tipoMoeda/tipoMoeda"),
          "MZN"
        );

        set(
          ref(
            db,
            "estabelecimentos/" + nomeEmpresa + "/metodosPagamento/todosMetodos"
          ),
          {
            cartaoCredito: {
              nomeMetodo: "Cartão de Crédito",
            },
            cartaoDebito: {
              nomeMetodo: "Cartão de débito",
            },
            credito: {
              nomeMetodo: "Crédito (Dívida)",
            },
            dinheiro: {
              nomeMetodo: "Dinheiro",
            },
            eMola: {
              nomeMetodo: "eMola",
            },
            mKesh: {
              nomeMetodo: "mKesh",
            },
            mpesa: {
              nomeMetodo: "m-Pesa",
            },
          }
        );

        //alert("Conta criada com sucesso")
      }
    );
  }

  try {
    if (
      nomeCompleto.value != "" &&
      endereco.value != "" &&
      cargo.value != "" &&
      telefone.value != "" &&
      email.value != "" &&
      senha.value != "" &&
      nomeEmpresa.value != "" &&
      localizacaoEmpresa.value != "" &&
      emailEmpresa.value != "" &&
      telefoneEmpresa.value != "" &&
      tipoEmpresa.value != "" &&
      planoEscolhido.value != ""
    ) {
      CriarConta(
        nomeCompleto.value,
        endereco.value,
        cargo.value,
        telefone.value,
        email.value,
        senha.value,
        nomeEmpresa.value,
        localizacaoEmpresa.value,
        emailEmpresa.value,
        telefoneEmpresa.value,
        tipoEmpresa.value,
        planoEscolhido.value
      );

      const auth2 = getAuth(app);
      sendEmailVerification(auth2.currentUser).then(() => {
        // Email verification sent!
        // ...
        alert(
          "Enviamos um e-mail de confirmacao para o endereco de e-mail disponibilizado por si. Verifique a sua caixa de e-mail e confirme o seu e-mail para aceder ao software!"
        );
        //window.location.href = "https://brgest.com"
      });
    } else {
      alert("Preencha todos os campos em branco");
    }
  } catch (error) {
    console.log(error);
  }
});
