import { firebaseConfig} from "./firebaseConfig.js";
import { TipoMoeda } from "./tipoMoeda.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-app.js";
import { getDatabase, ref, remove, onValue, set, onChildAdded } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-database.js";
import { getFirestore, collection, addDoc, setDoc, doc, query, where, getDocs } from 'https://www.gstatic.com/firebasejs/9.14.0/firebase-firestore.js'

var saldoContaTxt = document.querySelector(".saldoContaTxt")

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const dbFt = getFirestore(app);



const dbRefSaldo = ref(db, "/saldo")
onValue(dbRefSaldo, (snapshot)=>{
    const data = snapshot.val()

    saldoContaTxt.innerHTML = data.saldo
})