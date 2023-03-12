import { firebaseConfig} from "../logico/firebaseConfig.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-app.js";
import { getAuth, signOut } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-auth.js";

const btnLogoff = document.querySelector(".logoutt")

  const app = initializeApp(firebaseConfig);
  const auth = getAuth();

btnLogoff.addEventListener("click", () => {
    signOut(auth).then(() => {
        window.localStorage.clear();
        alert("LogOut feito com sucesso")
    }).catch((error) => {
        alert("LogOut feito sem sucesso")
    }); 
})