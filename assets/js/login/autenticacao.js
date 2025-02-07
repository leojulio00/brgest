console.log("sucesso")
import { getAuth, signInWithEmailAndPassword } from "firebase/auth"

var inputEmail = document.querySelector(".inputEmail")
var inputPass = document.querySelector(".inputPass")
var btnEntrar = document.querySelector(".btnEntrar")
const auth = getAuth();


btnEntrar.addEventListener("click", ()=>{
  console.log("sucesso")
  /*if(inputEmail.value == "leonildojuliojulio@gmail.com" && inputPass.value == "123456"){
    alert("sucesso")
  }
  
  /*signInWithEmailAndPassword(auth, inputEmail, inputPass)
    .then((userCredential) => {
      // Signed in 
      const user = userCredential.user;
      inputPass
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      alert("Erro " + errorMessage)
    });*/
})







