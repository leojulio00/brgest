import { firebaseConfig} from "./firebaseConfig.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-app.js";
import { getDatabase, ref, onValue, set } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-database.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-auth.js";

var inputUser = document.querySelector(".inputUser")
var inputPass = document.querySelector(".inputPass")
var btnEntrar = document.querySelector(".btnEntrar")

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

btnEntrar.addEventListener("click", ()=>{
  window.localStorage.setItem("user", inputUser.value);
  var usuarioMail = ""

  const starCountRef = ref(db, 'users/' + inputUser.value);

  onValue(starCountRef, (snapshot) => {
    const data = snapshot.val();
    //updateStarCount(postElement, data);
    console.log(data)
    usuarioMail = data.emailColab
    console.log(usuarioMail)
    signInWithEmailAndPassword(auth, usuarioMail, inputPass.value).then((userCredential) => {
      // Signed in 
      const user = userCredential.user;
      alert("login feito com sucesso")
      
      window.location.href = "dashboard/dashboard.html"
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      alert("erro: " + errorMessage)
    });
  });

  
})