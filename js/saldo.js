import { firebaseConfig} from "./firebaseConfig.js";
import { TipoMoeda } from "./tipoMoeda.js"
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-app.js";
import { getDatabase, ref, remove, onValue, set, onChildAdded } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-database.js";
import { getFirestore, collection, addDoc, setDoc, doc, query, where, getDocs } from 'https://www.gstatic.com/firebasejs/9.14.0/firebase-firestore.js'

var saldoContaTxt = document.querySelector(".saldoContaTxt")
var valorEntradaCaixa = document.querySelector(".valorEntradaCaixa")
var motivoEntradaCaixa = document.querySelector(".motivoEntradaCaixa")
var valorSaidaCaixa = document.querySelector(".valorSaidaCaixa")
var motivoSaidaCaixa = document.querySelector(".motivoSaidaCaixa")
var btnRegEntradaCaixa = document.querySelector(".btnRegEntradaCaixa")
var btnRegSaidaCaixa = document.querySelector(".btnRegSaidaCaixa")
var horaRegEst = document.querySelector(".horaRegEst")
var valorInicial, valorIniciall = 0
var saldoFinalEntrada = 0
var saldoFinalSaida = 0

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const dbFt = getFirestore(app);

var chaveSaldoEntradaString
var chaveSaldoEntrada = 0
var chaveSaldoSaidaString
var chaveSaldoSaida = 0

console.log(horaRegEst.value)

const commentsRef = ref(db, '/saldo/entrada');
onChildAdded(commentsRef, (data) => {
  chaveSaldoEntradaString = data.key
});

const commentsRefSaida = ref(db, '/saldo/saida');
onChildAdded(commentsRefSaida, (data) => {
  chaveSaldoSaidaString = data.key
});

const dbRefSaldo = ref(db, "/saldo")
onValue(dbRefSaldo, (snapshot)=>{
    const data = snapshot.val()
    valorInicial = data.saldo
    valorIniciall = parseInt(valorInicial)

    saldoContaTxt.innerHTML = data.saldo + " " + TipoMoeda
})

btnRegEntradaCaixa.addEventListener("click", ()=>{
    if(valorEntradaCaixa.value != "" && motivoEntradaCaixa.value != ""){
        saldoFinalEntrada = parseInt(valorEntradaCaixa.value) + parseInt(valorIniciall)
        console.log(saldoFinalEntrada)

        chaveSaldoEntrada = parseInt(chaveSaldoEntradaString)

        set(ref(db, '/saldo'), {
            saldo: parseInt(saldoFinalEntrada)
        });
        set(ref(db, '/saldo/entrada/' + 0), {
            saldoAdicionado: valorEntradaCaixa.value,
            motivo: motivoEntradaCaixa.value,
            timestamp: horaRegEst.value
        });
    }else{
        alert("Preencha todos os campos de entrada na conta")
    }
})

btnRegEntradaCaixa.addEventListener("click", ()=>{
    if(valorEntradaCaixa.value != "" && motivoEntradaCaixa.value != ""){
        saldoFinalEntrada = parseInt(valorEntradaCaixa.value) + parseInt(valorIniciall)
        console.log(saldoFinalEntrada)

        chaveSaldoEntrada = parseInt(chaveSaldoEntradaString)

        set(ref(db, 'saldo'), {
            saldo: parseInt(saldoFinalEntrada)
        });
        set(ref(db, 'saldo/entrada/' + chaveSaldoEntrada++), {
            saldoAdicionado: valorEntradaCaixa.value,
            motivo: motivoEntradaCaixa.value,
            timestamp: horaRegEst.value
        });
    }else{
        alert("Preencha todos os campos de saida na conta")
    }
})

btnRegSaidaCaixa.addEventListener("click", ()=>{
    if(valorSaidaCaixa.value != "" && motivoSaidaCaixa.value != ""){
        saldoFinalSaida = Math.abs(parseInt(valorSaidaCaixa.value) - parseInt(valorIniciall))
        console.log(saldoFinalSaida)

        chaveSaldoSaida = parseInt(chaveSaldoSaidaString)

        set(ref(db, 'saldo'), {
            saldo: parseInt(saldoFinalSaida)
        });
        set(ref(db, '/saldo/saida/' + 0), {
            saldoRetirado: valorSaidaCaixa.value,
            motivo: motivoSaidaCaixa.value,
            timestamp: horaRegEst.value
        });
    }else{
        alert("Preencha todos os campos")
    }
})