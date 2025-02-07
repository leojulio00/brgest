import { firebaseConfig} from "../logico/firebaseConfig.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-app.js";
import { getDatabase, ref, onValue, set } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-database.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-auth.js";

var usuarioId = window.localStorage.getItem("user");

const app = initializeApp(firebaseConfig);
const auth = getAuth();

onAuthStateChanged(auth, (user) => {
  if (user) {
    // User is signed in, see docs for a list of available properties
    // https://firebase.google.com/docs/reference/js/firebase.User
    const uid = user.uid;

    if(uid != usuarioId){
        window.location.href = "../index.html"
    }else{
        //window.location.href = "./dashboard.html"
    }
  } else {
    // User is signed out
    // ...
    window.location.href = "../index.html"
  }
}); 

