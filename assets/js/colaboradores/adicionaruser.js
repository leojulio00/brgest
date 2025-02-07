import { firebaseConfig } from "../logico/firebaseConfig.js";
import {
  usuarioMail,
  usuarioNome,
  usuarioTel,
  usuarioEnder,
  usuarioCargo,
} from "../login/login.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-app.js";
import {
  getDatabase,
  set,
  ref,
} from "https://www.gstatic.com/firebasejs/9.14.0/firebase-database.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/9.14.0/firebase-auth.js";

var usuarioColab = document.querySelector(".usuarioColab");
var nomeColab = document.querySelector(".nomeColab");
var enderColab = document.querySelector(".enderColab");
var telColab = document.querySelector(".telColab");
var emailColab = document.querySelector(".emailColab");
var catgColab = document.querySelector(".catgColab");
var passColab = document.querySelector(".passColab");
var btnCadasColab = document.querySelector(".btnCadasColab");
var usuarioEstabelecimento = window.localStorage.getItem(
  "usuarioEstabelecimento"
);
var alertaInfo = document.querySelector(".alerta-info");
var alertaErro = document.querySelector(".alerta-erro");
var alertaSucesso = document.querySelector(".alerta-sucesso");

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth();
//var db = firebase.database()

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
  setInterval(() => {
    alertaInfo.style.display = "none";
    info.innerHTML = "";
  }, 2500);
}

btnCadasColab.addEventListener("click", (e) => {
  function writeUserData(
    nomeColab,
    enderColab,
    telColab,
    emailColab,
    catgColab,
    senha
  ) {
    const db = getDatabase();

    let usuarioId = "";

    createUserWithEmailAndPassword(auth, emailColab, senha)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        usuarioId = user.uid;
        
        set(
          ref(
            db,
            "estabelecimentos/" + usuarioEstabelecimento + "/users/" + usuarioId
          ),
          {
            nomeColab: nomeColab,
            enderColab: enderColab,
            telColab: telColab,
            emailColab: emailColab,
            catgColab: catgColab,
            usuarioEstabelecimento: usuarioEstabelecimento,
          }
        );

        set(ref(db, "usuarios/" + usuarioId), {
          nomeColab: nomeColab,
          enderColab: enderColab,
          telColab: telColab,
          emailColab: emailColab,
          catgColab: catgColab,
          usuarioEstabelecimento: usuarioEstabelecimento,
        });

        AlertaSucesso("usuario criado com sucesso");

        e.preventDefault();
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        // ..
        AlertaErro("Ocorreu um erro no processo de cadastro");
      });
  }

  try {
    if (
      nomeColab.value != "" &&
      enderColab.value != "" &&
      telColab.value != "" &&
      emailColab.value != "" &&
      catgColab.value != "" &&
      passColab.value
    ) {
      writeUserData(
        nomeColab.value,
        enderColab.value,
        telColab.value,
        emailColab.value,
        catgColab.value,
        passColab.value
      );

      nomeColab.value = "";
      enderColab.value = "";
      telColab.value = "";
      emailColab.value = "";
      catgColab.value = "";
    } else {
      AlertaInfo("Preencha todos os campos em branco por favor!");
    }
  } catch (error) {
    AlertaErro(
      "Ocorreu um erro no processo de cadastro contacte a equipe tecnica"
    );

    console.log(error);
  }

  return false;
});
