import { firebaseConfig} from "../logico/firebaseConfig.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-app.js";
import { getDatabase, set, ref, onValue } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-database.js";


var usuarioEstabelecimento = window.localStorage.getItem('usuarioEstabelecimento')
var userCod = document.querySelector(".userCod")
var userNome = document.querySelector(".userNome")
var userCategoria = document.querySelector(".userCategoria")
var userEnder = document.querySelector(".userEnder")
var userTelefone = document.querySelector(".userTelefone")
var userMail = document.querySelector(".userMail")
var userLocalStorage = window.localStorage.getItem("user");

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);


  
  const starCountRef = ref(database, 'estabelecimentos/' + usuarioEstabelecimento + '/users/' + userLocalStorage);
  onValue(starCountRef, (snapshot) => {
      const data = snapshot.val();
      //updateStarCount(postElement, data);
      
      userCod.innerHTML = userLocalStorage
      userNome.innerHTML = data.nomeColab
      userCategoria.innerHTML = data.catgColab
      userEnder.innerHTML = data.enderColab
      userTelefone.innerHTML = data.telColab
      userMail.innerHTML = data.emailColab
  });
