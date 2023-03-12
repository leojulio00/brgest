import { firebaseConfig} from "../logico/firebaseConfig.js";
import { usuarioMail, usuarioNome, usuarioTel, usuarioEnder, usuarioCargo } from "../login/login.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-app.js";
import { getDatabase, set, ref } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-database.js";
import { getAuth, createUserWithEmailAndPassword} from "https://www.gstatic.com/firebasejs/9.14.0/firebase-auth.js";

var usuarioColab = document.querySelector(".usuarioColab")
var nomeColab = document.querySelector(".nomeColab")
var enderColab = document.querySelector(".enderColab")
var telColab = document.querySelector(".telColab")
var emailColab = document.querySelector(".emailColab")
var catgColab = document.querySelector(".catgColab")
var passColab = document.querySelector(".passColab")
var btnCadasColab = document.querySelector(".btnCadasColab")
var usuarioEstabelecimento = window.localStorage.getItem('usuarioEstabelecimento')

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth();
//var db = firebase.database()





btnCadasColab.addEventListener("click", ()=>{
  function writeUserData(nomeColab, enderColab, telColab, emailColab, catgColab, senha) {
    const db = getDatabase();

    let usuarioId = ""

    createUserWithEmailAndPassword(auth, emailColab, senha)
    .then((userCredential) => {
      // Signed in 
      const user = userCredential.user;
      usuarioId = user.uid
      console.log(user.uid)
      set(ref(db,'estabelecimentos/' + usuarioEstabelecimento + '/users/' + usuarioId), {
        nomeColab: nomeColab,
        enderColab: enderColab,
        telColab: telColab,
        emailColab: emailColab,
        catgColab: catgColab,
        usuarioEstabelecimento: usuarioEstabelecimento
      });
  
      set(ref(db, 'usuarios/' + usuarioId), {
        nomeColab: nomeColab,
        enderColab: enderColab,
        telColab: telColab,
        emailColab: emailColab,
        catgColab: catgColab,
        usuarioEstabelecimento: usuarioEstabelecimento
      });

      alert("usuario criado com sucesso")

      usuarioColab.value = ""
      nomeColab.value = ""
      enderColab.value = ""
      telColab.value = ""
      emailColab.value = ""
      catgColab.value = ""
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      // ..
    });
  }

/*
    createUserWithEmailAndPassword(auth, emailColab.value, passColab.value)
  .then((userCredential) => {
    // Signed in 
    const user = userCredential.user;

    
      
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    alert("erro: " + errorMessage)
  });
*/

  try {
    if(nomeColab.value != "" && enderColab.value != "" && telColab.value != "" && emailColab.value != "" && catgColab.value != "" && passColab.value){
      writeUserData(nomeColab.value, enderColab.value, telColab.value, emailColab.value, catgColab.value, passColab.value)
    }else{
      alert("Preencha todos os campos em branco")
    }
  } catch (error) {
    console.log(error)
  }
})