import { firebaseConfig} from "../logico/firebaseConfig.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-app.js";
import { getDatabase, ref, onValue, set } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-database.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-auth.js";

var inputUser = document.querySelector(".inputUser")
var inputPass = document.querySelector(".inputPass")
var btnEntrar = document.querySelector(".btnEntrar")
export var usuarioMail = ""
export var usuarioNome = ""
export var usuarioTel = ""
export var usuarioEnder = ""
export var usuarioCargo = ""
export var usuarioEstabelecimento = ""
export var nomeUsuario = ''
export var usuarioId = ""
var alertaInfo = document.querySelector('.alerta-info')
var alertaErro = document.querySelector('.alerta-erro')
var alertaSucesso = document.querySelector('.alerta-sucesso')

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

function AlertaSucesso(mensagem){
  let info = document.createElement('p')
  info.style.margin = '0px'
  info.style.padding = '0px'
  info.innerHTML = mensagem
  alertaSucesso.appendChild(info)
  alertaSucesso.style.display = 'block'
  setTimeout(()=>{
    alertaSucesso.style.display = 'none'
    info.innerHTML = ''
  }, 2500)
}

function AlertaErro(mensagem){
  let info = document.createElement('p')
  info.style.margin = '0px'
  info.style.padding = '0px'
  info.innerHTML = mensagem
  alertaErro.appendChild(info)
  alertaErro.style.display = 'block'
  setTimeout(()=>{
    alertaSucesso.style.display = 'none'
    info.innerHTML = ''
  }, 2500)
}

function AlertaInfo(mensagem){
  let info = document.createElement('p')
  info.style.margin = '0px'
  info.style.padding = '0px'
  info.innerHTML = mensagem
  alertaInfo.appendChild(info)
  alertaInfo.style.display = 'block'
  setTimeout(()=>{
    alertaSucesso.style.display = 'none'
    info.innerHTML = ''
  }, 2500)
}

//ACÇÃO NO BOTÃO ENTRAR DO LOGIN
btnEntrar.addEventListener("click", ()=>{
  // Função para simular a execução de uma tarefa demorada

  //FUNÇÃO ABRIR O GIF PRELOADER
  function AbrirPreloader() {
    // Inicia o gif preloader
    var preloader = document.getElementById("preloader");
    preloader.style.display = "flex";
    // Simula uma tarefa demorada de 3 segundos
    setTimeout(function() {
        // Termina a tarefa e oculta o gif preloader
        preloader.style.display = "none";
        //alert("Minha função terminou de executar!");
    }, 3500);
  }

  //CHAMANDO A FUNÇÃO PRELOADER
  AbrirPreloader()

  //FUNÇÃO DE LOGIN COM SENHA E PASSWORD DO FIREBASE
  signInWithEmailAndPassword(auth, inputUser.value, inputPass.value).then((userCredential) => {
    // Signed in 
    const user = userCredential.user;
    
    window.localStorage.setItem("user", user.uid)

    usuarioId = user.uid

    const starCountRef = ref(db, 'usuarios/' + user.uid);

    onValue(starCountRef, (snapshot) => {
      const data = snapshot.val();
      //updateStarCount(postElement, data);
      
      usuarioMail = data.emailColab
      usuarioNome = data.nomeColab
      usuarioTel = data.telColab
      usuarioEnder = data.enderColab
      usuarioCargo = data.catgColab
      usuarioEstabelecimento = data.usuarioEstabelecimento
      nomeUsuario = data.nomeColab
      window.localStorage.setItem('usuarioEstabelecimento', usuarioEstabelecimento)
      window.localStorage.setItem("nomeUser", nomeUsuario)
      console.log(usuarioMail + " " + usuarioMail + " " + usuarioNome + " " + usuarioTel + " " + usuarioEnder + " " + usuarioCargo + " " + usuarioEstabelecimento)
      

      //alert("login feito com sucesso")
      AlertaSucesso('Login feito com sucesso')


      //REDIRECIONANDO PARA DASHBOARD
      window.location.href = "dashboard/dashboard.html"

    });
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    //alert("erro: " + errorMessage)
    AlertaInfo('Erro: '+ errorMessage)
    console.log(errorCode)
  });

  
})