import { firebaseConfig} from "./firebaseConfig.js";
import { TipoMoeda } from "./tipoMoeda.js"
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-app.js";
import { getDatabase, ref, remove, onValue, set, onChildAdded } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-database.js";
import { getFirestore, collection, addDoc, setDoc, doc, query, where, getDocs } from 'https://www.gstatic.com/firebasejs/9.14.0/firebase-firestore.js'

var saldoContaTxt = document.querySelector(".saldoContaTxt")
var totalMovimentacoesTxt = document.querySelector(".totalMovimentacoesTxt")
var valorEntradaCaixa = document.querySelector(".valorEntradaCaixa")
var motivoEntradaCaixa = document.querySelector(".motivoEntradaCaixa")
var valorSaidaCaixa = document.querySelector(".valorSaidaCaixa")
var motivoSaidaCaixa = document.querySelector(".motivoSaidaCaixa")
var totalVendasTxt = document.querySelector(".totalVendasTxt")
var btnRegEntradaCaixa = document.querySelector(".btnRegEntradaCaixa")
var btnRegSaidaCaixa = document.querySelector(".btnRegSaidaCaixa")
var horaRegEst = document.querySelector(".horaRegEst")
var userLocalStorage = window.localStorage.getItem("user");
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
var nrTotalVendasString
var nrTotalVendas = 0
var nrMovimentacoesString
var nrMovimentacoes = 0


const commentsRef = ref(db, '/saldo/entrada');
onChildAdded(commentsRef, (data) => {
  chaveSaldoEntradaString = data.key
});

const commentsRefSaida = ref(db, '/saldo/saida');
onChildAdded(commentsRefSaida, (data) => {
  chaveSaldoSaidaString = data.key
});

const commentsRefTotalVendas = ref(db, '/vendas');
onChildAdded(commentsRefTotalVendas, (data) => {
  nrTotalVendasString = data.key

  nrTotalVendas = nrTotalVendasString

  totalVendasTxt.innerHTML = nrTotalVendas

  var lucroPorProduto = []

  data.forEach(childSnapshot => {
    lucroPorProduto.push(childSnapshot.val().lucroVenda)
  })

  

  console.log(data.val().lucroVenda)
});

const dbRefSaldo = ref(db, "/saldo/saldo")
onValue(dbRefSaldo, (snapshot)=>{
    const data = snapshot.val()
    valorInicial = data.saldo
    valorIniciall = parseInt(valorInicial)

    saldoContaTxt.innerHTML = valorInicial + " " + TipoMoeda

    nrMovimentacoesString = data.totalMovimentacoes

    totalMovimentacoesTxt.innerHTML = nrMovimentacoesString
})

btnRegEntradaCaixa.addEventListener("click", ()=>{
    if(valorEntradaCaixa.value != "" && motivoEntradaCaixa.value != ""){
        saldoFinalEntrada = parseInt(valorEntradaCaixa.value) + parseInt(valorIniciall)

        chaveSaldoEntrada = parseInt(chaveSaldoEntradaString) + 1
        nrMovimentacoes = parseInt(nrMovimentacoesString) + 1
        
        try {
            set(ref(db, '/saldo/saldo'), {
                saldo: parseInt(saldoFinalEntrada),
                totalMovimentacoes: nrMovimentacoes
            });
            set(ref(db, '/saldo/entrada/' + chaveSaldoEntrada), {
                saldoAdicionado: valorEntradaCaixa.value,
                motivo: motivoEntradaCaixa.value,
                timestamp: horaRegEst.value,
                usuario: userLocalStorage
            });
            alert("Entrada no caixa registado com sucesso")
            valorEntradaCaixa.value = ""
            motivoEntradaCaixa.value = ""
        } catch (error) {
            console.log(error)
        }
    }else{
        alert("Preencha todos os campos de saida na conta")
    }
})

btnRegSaidaCaixa.addEventListener("click", ()=>{
    if(valorSaidaCaixa.value != "" && motivoSaidaCaixa.value != ""){
        saldoFinalSaida = Math.abs(parseInt(valorSaidaCaixa.value) - parseInt(valorIniciall))

        chaveSaldoSaida = parseInt(chaveSaldoSaidaString) + 1
        nrMovimentacoes = parseInt(nrMovimentacoesString) + 1

        try {
            set(ref(db, '/saldo/saldo'), {
                saldo: parseInt(saldoFinalSaida), 
                totalMovimentacoes: nrMovimentacoes
            });
            set(ref(db, '/saldo/saida/' + chaveSaldoSaida), {
                saldoRetirado: valorSaidaCaixa.value,
                motivo: motivoSaidaCaixa.value,
                timestamp: horaRegEst.value,
                usuario: userLocalStorage
            });
            alert("Retirada no caixa registado com sucesso")
            valorSaidaCaixa.value = ""
            motivoSaidaCaixa.value = ""
        } catch (error) {
            console.log(error)
        }
    }else{
        alert("Preencha todos os campos")
    }
})