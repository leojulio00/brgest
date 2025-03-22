import { firebaseConfig} from "../logico/firebaseConfig.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-app.js";
import { getDatabase, ref, onValue, set } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-database.js";
import { getAuth, signInWithEmailAndPassword, updatePassword } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-auth.js";

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);


const emailUsuarioAltSenha = document.querySelector('.emailUsuarioAltSenha')
const currentPassword = document.querySelector('.inputPassAntiga');
const newPassword = document.querySelector('.inputPassNova');
const inputConfirmarSenha = document.querySelector('.inputConfirmarSenha')

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

// Função para alterar a senha
document.querySelector('.btnAlterarSenha').addEventListener('click', (e) => {
    //e.preventDefault();
    const user = auth.currentUser;

    if (
          (emailUsuarioAltSenha.value != "") &
          (currentPassword.value != "") &
          (newPassword.value != "") &
          (inputConfirmarSenha.value != "")
        ) {
          signInWithEmailAndPassword(auth, emailUsuarioAltSenha.value, currentPassword.value)
            .then((userCredential) => {
              // Signed in
              const userA = userCredential.user;
    
              const user = auth.currentUser;
              /*const newPassword = getASecureRandomPassword();*/
    
              if (newPassword.value == inputConfirmarSenha.value) {
                updatePassword(user, newPassword.value)
                  .then(() => {
                    // Update successful.
                    AlertaSucesso("Senha alterada com sucesso");
    
                    emailUsuarioAltSenha.value = "";
                    currentPassword.value = "";
                    newPassword.value = "";
                    inputConfirmarSenha.value = ""

                    window.location.href = "https://painel.brgest.com/"
                    console.log("passou")
                  })
                  .catch((error) => {
                    // An error ocurred
                    // ...
                    console.log(error)
                    //alert("err:  2" + error)
                  });
              } else {
                //alert("")
                AlertaErro("A nova senha tem de ser igual");
              }
            })
            .catch((error) => {
              const errorCode = error.code;
              const errorMessage = error.message;
              AlertaErro("Senha que inseriu não é correta");
              console.log(errorMessage + errorCode)
              //alert("erro:   1" + errorMessage)
            });
        } else {
          AlertaInfo("Preencha todos os campos por favor");
        }
});