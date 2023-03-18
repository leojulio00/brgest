import { firebaseConfig} from "../logico/firebaseConfig.js";
import { TipoMoeda } from "../saldo/tipoMoeda.js";
import { usuarioMail, usuarioNome, usuarioTel } from "../login/login.js";
import { CodigoMesaClicado } from "../mesas/mesas.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-app.js";
import { getDatabase, ref, remove, onValue, set, onChildAdded, update, query, orderByChild } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-database.js";
//import { getFirestore, collection, addDoc, setDoc, doc, query, where, getDocs } from 'https://www.gstatic.com/firebasejs/9.14.0/firebase-firestore.js'

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

var usuarioEstabelecimento = window.localStorage.getItem('usuarioEstabelecimento')

const dbRef = ref(db, '/estabelecimentos/' + usuarioEstabelecimento + '/vendas/todasVendas')
//const dbReff = ref(db, '/estabelecimentos/' + usuarioEstabelecimento + '/vendas/todasVendas').orderByChild('lucroVenda')
const most = query(ref(db, '/estabelecimentos/' + usuarioEstabelecimento + '/vendas/todasVendas/1/produtos'), orderByChild('nomeProduto'));

/*onValue(dbRef, (snapshot)=>{
    const data = snapshot.val()

    console.log(data)
    var produtos = []

    snapshot.forEach(childSnapshot => {
        produtos.push(childSnapshot.val().produtos)
    })
    

    produtos.forEach((val)=>{
        console.log(val)
    })
})*/

onValue(most, (snapshot)=>{
    console.log(snapshot.val())
})
