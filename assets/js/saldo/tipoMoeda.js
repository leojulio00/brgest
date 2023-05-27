import { firebaseConfig} from "../logico/firebaseConfig.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-app.js";
import { getDatabase, ref, remove, onValue, set } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-database.js";

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

//PEGANDO O NOME DO ESTABELECIMENTO NO LOCALSTORAGE
var usuarioEstabelecimento = window.localStorage.getItem('usuarioEstabelecimento')

export var TipoMoeda = ""

//PEGANDO O TIPO DE MOEDA DA BASE DE DADOS
const dbRef = ref(db, 'estabelecimentos/' + usuarioEstabelecimento + '/tipoMoeda')
console.log(dbRef)
onValue(dbRef, (snapshot)=>{
    const data = snapshot.val()

    TipoMoeda = data.tipoMoeda
})
