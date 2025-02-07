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
  signInWithEmailAndPassword,
  updatePassword,
} from "https://www.gstatic.com/firebasejs/9.14.0/firebase-auth.js";

var usuarioEstabelecimento = window.localStorage.getItem(
  "usuarioEstabelecimento"
);
var actualPass = document.querySelector(".senhaActual");
var novaPass = document.querySelector(".novaSenha");
var confirPass = document.querySelector(".confSenha");
var btnAlterPass = document.querySelector(".btnAlterarSenha");
var userLocalStorage = window.localStorage.getItem("user");
var usuarioMail = "";
var alertaInfo = document.querySelector(".alerta-info");
var alertaErro = document.querySelector(".alerta-erro");
var alertaSucesso = document.querySelector(".alerta-sucesso");

const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getDatabase(app);

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

btnAlterPass.addEventListener("click", () => {
  const starCountRef = ref(
    db,
    "estabelecimentos/" + usuarioEstabelecimento + "/users/" + userLocalStorage
  );

  if (
    (actualPass.value != "") &
    (novaPass.value != "") &
    (confirPass.value != "")
  ) {
    onValue(starCountRef, (snapshot) => {
      const data = snapshot.val();
      //updateStarCount(postElement, data);
      usuarioMail = data.emailColab;

      signInWithEmailAndPassword(auth, usuarioMail, actualPass.value)
        .then((userCredential) => {
          // Signed in
          const userA = userCredential.user;
          // ...

          const user = auth.currentUser;
          /*const newPassword = getASecureRandomPassword();*/

          if (novaPass.value == confirPass.value) {
            updatePassword(user, novaPass.value)
              .then(() => {
                // Update successful.
                AlertaSucesso("Senha alterada com sucesso");

                actualPass.value = "";
                novaPass.value = "";
                confirPass.value = "";
              })
              .catch((error) => {
                // An error ocurred
                // ...
                AlertaErro("A nova senha tem de ser igual");
                //alert("err:  2" + error)
              });
          } else {
            //alert("")
          }
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          AlertaErro("Senha que inseriu não é correta");
          //alert("erro:   1" + errorMessage)
        });
    });
  } else {
    AlertaInfo("Preencha todos os campos por favor");
  }
});
