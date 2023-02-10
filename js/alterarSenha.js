import { firebaseConfig} from "./firebaseConfig.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-app.js";
import { getDatabase, ref, onValue, set } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-database.js";
import { getAuth, signInWithEmailAndPassword, updatePassword } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-auth.js";

var usuarioEstabelecimento = window.localStorage.getItem('usuarioEstabelecimento')
var actualPass = document.querySelector(".senhaActual")
var novaPass = document.querySelector(".novaSenha")
var confirPass = document.querySelector(".confSenha")
var btnAlterPass = document.querySelector(".btnAlterarSenha")
var userLocalStorage = window.localStorage.getItem("user");
var usuarioMail = ""


const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getDatabase(app);

btnAlterPass.addEventListener("click", ()=>{
  const starCountRef = ref(db, 'estabelecimentos/' + usuarioEstabelecimento + '/users/' + userLocalStorage);

  if(actualPass.value != "" & novaPass.value != "" & confirPass.value != ""){
    onValue(starCountRef, (snapshot) => {
      const data = snapshot.val();
      //updateStarCount(postElement, data);
      usuarioMail = data.emailColab
  
      signInWithEmailAndPassword(auth, usuarioMail, actualPass.value).then((userCredential) => {
        // Signed in 
        const userA = userCredential.user;
        // ...


        const user = auth.currentUser;
        /*const newPassword = getASecureRandomPassword();*/

        if(novaPass.value == confirPass.value){
          updatePassword(user, novaPass.value).then(() => {
            // Update successful.
            alert("Senha alterada com sucesso!")

            actualPass.value = ""
            novaPass.value = ""
            confirPass.value = ""
          }).catch((error) => {
            // An error ocurred
            // ...
            alert("err:  2" + error)
          });
        }else{
          //alert("")
        }

      }).catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        alert("erro:   1" + errorMessage)
      });
    });
  }else{
    alert("Preencha todos os campos por favor")
  }

})
