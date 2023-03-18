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
export var usuarioId = ""

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

btnEntrar.addEventListener("click", ()=>{

  signInWithEmailAndPassword(auth, inputUser.value, inputPass.value).then((userCredential) => {
    // Signed in 
    const user = userCredential.user;
    alert("login feito com sucesso")
    
    window.localStorage.setItem("user", user.uid)

    usuarioId = user.uid

    const starCountRef = ref(db, 'usuarios/' + user.uid);

    onValue(starCountRef, (snapshot) => {
      const data = snapshot.val();
      //updateStarCount(postElement, data);
      console.log(data)
      usuarioMail = data.emailColab
      usuarioNome = data.nomeColab
      usuarioTel = data.telColab
      usuarioEnder = data.enderColab
      usuarioCargo = data.catgColab
      usuarioEstabelecimento = data.usuarioEstabelecimento
      window.localStorage.setItem('usuarioEstabelecimento', usuarioEstabelecimento)
      console.log(usuarioMail + " " + usuarioMail + " " + usuarioNome + " " + usuarioTel + " " + usuarioEnder + " " + usuarioCargo + " " + usuarioEstabelecimento)
      

      
      window.location.href = "dashboard/dashboard.html"

      // Função para simular a execução de uma tarefa demorada
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

      AbrirPreloader()

    });
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    alert("erro: " + errorMessage)
    console.log(errorCode)
  });

  
})