import { firebaseConfig} from '../logico/firebaseConfig.js';
import { TipoMoeda } from './tipoMoeda.js'
import { usuarioMail, usuarioNome, usuarioTel, usuarioEnder} from "../login/login.js";
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.14.0/firebase-app.js';
import { getDatabase, ref, remove, onValue, set, onChildAdded, query, orderByChild } from 'https://www.gstatic.com/firebasejs/9.14.0/firebase-database.js';
import { getFirestore, collection, addDoc, setDoc, doc, where, getDocs } from 'https://www.gstatic.com/firebasejs/9.14.0/firebase-firestore.js'


var usuarioEstabelecimento = window.localStorage.getItem('usuarioEstabelecimento')
var saldoContaTxt = document.querySelector('.saldoContaTxt')
var totalMovimentacoesTxt = document.querySelector('.totalMovimentacoesTxt')
var valorEntradaCaixa = document.querySelector('.valorEntradaCaixa')
var motivoEntradaCaixa = document.querySelector('.motivoEntradaCaixa')
var valorSaidaCaixa = document.querySelector('.valorSaidaCaixa')
var motivoSaidaCaixa = document.querySelector('.motivoSaidaCaixa')
var totalVendasTxt = document.querySelector('.totalVendasTxt')
var valorTotalVendasTxt = document.querySelector('.valorTotalVendasTxt')
var lucroTotalVendasTxt = document.querySelector('.lucroTotalVendasTxt')
var totalProdutosCadastradosTxt = document.querySelector('.totalProdutosCadastradosTxt')
var precoTotalCompraProdutosTxt = document.querySelector('.precoTotalCompraProdutosTxt')
var precoTotalVendaProdutosTxt = document.querySelector('.precoTotalVendaProdutosTxt')
var lucroTotalVendaProdutosTxt = document.querySelector('.lucroTotalVendaProdutosTxt')
var btnRegEntradaCaixa = document.querySelector('.btnRegEntradaCaixa')
var btnRegSaidaCaixa = document.querySelector('.btnRegSaidaCaixa')
var horaRegEst = document.querySelector('.horaRegEst')
var userLocalStorage = window.localStorage.getItem('user');
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

const commentsRef = ref(db, 'estabelecimentos/' + usuarioEstabelecimento + '/saldo/entrada');
onChildAdded(commentsRef, (data) => {
  chaveSaldoEntradaString = data.key
});

const commentsRefSaida = ref(db, 'estabelecimentos/' + usuarioEstabelecimento + '/saldo/saida');
onChildAdded(commentsRefSaida, (data) => {
  chaveSaldoSaidaString = data.key
});

const commentsRefTotalVendas = ref(db, 'estabelecimentos/' + usuarioEstabelecimento + '/vendas/todasVendas');
onChildAdded(commentsRefTotalVendas, (data) => {
  nrTotalVendasString = data.key

  nrTotalVendas = nrTotalVendasString

  totalVendasTxt.innerHTML = nrTotalVendas

  var lucroPorProduto = []

  data.forEach(childSnapshot => {
    lucroPorProduto.push(childSnapshot.val().lucroVenda)
  })

  

  //console.log(lucroPorProduto)
});

/*var firstNodeRef = ref(db, '/vendas');
firstNodeRef.child('1').child('produtos').once("value", function(snapshot) {
  var data = snapshot.val();
  console.log(data);
});*/

const dbRefSaldo = ref(db, 'estabelecimentos/' + usuarioEstabelecimento + '/saldo/saldo')
onValue(dbRefSaldo, (snapshot)=>{
    const data = snapshot.val()
    valorInicial = data.saldo
    valorIniciall = parseInt(valorInicial)

    saldoContaTxt.innerHTML = valorInicial + ' ' + TipoMoeda

    nrMovimentacoesString = data.totalMovimentacoes

    totalMovimentacoesTxt.innerHTML = nrMovimentacoesString
})

var valorLucroInicial, valorLucroIniciall = 0
var valorLucroFinal = 0
const dbRefLucro = ref(db, 'estabelecimentos/' + usuarioEstabelecimento + '/vendas/lucroTotalVendas')

onValue(dbRefLucro, (snapshot)=>{
  const data = snapshot.val()
  valorLucroInicial = data.lucroTotal
  
  valorLucroIniciall = parseInt(valorLucroInicial)

  lucroTotalVendasTxt.innerHTML = valorLucroIniciall
}, {
  onlyOnce: false
})

var valorTotalVendasInicial, valorTotalVendasIniciall = 0
var valorTotalVendasFinal = 0
const dbRefValorVendas = ref(db, 'estabelecimentos/' + usuarioEstabelecimento + '/vendas/valorTotalVendas')

onValue(dbRefValorVendas, (snapshot)=>{
  const data = snapshot.val()
  valorTotalVendasInicial = data.valorTotal
  
  valorTotalVendasIniciall = parseInt(valorTotalVendasInicial)

  valorTotalVendasTxt.innerHTML = valorTotalVendasIniciall
}, {
  onlyOnce: false
})

onValue(ref(db, 'estabelecimentos/' + usuarioEstabelecimento + '/produtos/todosProdutos'), (snapshot)=>{
    let todosProdutos = []

    snapshot.forEach(childSnapshot => {
        todosProdutos.push(childSnapshot.val())
    })

    let valorTodosProdutos = todosProdutos.length

    totalProdutosCadastradosTxt.innerHTML = valorTodosProdutos
})


const mostViewedPosts = query(ref(db, 'estabelecimentos/' + usuarioEstabelecimento + '/produtos/todosProdutos'), orderByChild('precCompra'));

onValue(mostViewedPosts, (snapshot)=>{
    const data = snapshot.val()
    let todosProdutos = []
    let valorPrecoCompra = 0
    let valorPrecoVenda = 0

    snapshot.forEach(childSnapshot => {
        todosProdutos.push(parseInt(childSnapshot.val().precCompra) * parseInt(childSnapshot.val().quantProdE))

        valorPrecoCompra = valorPrecoCompra + (parseInt(childSnapshot.val().precCompra) * parseInt(childSnapshot.val().quantProdE))

        valorPrecoVenda = valorPrecoVenda + (parseInt(childSnapshot.val().precVenda) * parseInt(childSnapshot.val().quantProdE))

    })

    precoTotalCompraProdutosTxt.innerHTML = valorPrecoCompra
    precoTotalVendaProdutosTxt.innerHTML = valorPrecoVenda
    lucroTotalVendaProdutosTxt.innerHTML = valorPrecoVenda - valorPrecoCompra
})

btnRegEntradaCaixa.addEventListener('click', ()=>{
    if(valorEntradaCaixa.value != '' && motivoEntradaCaixa.value != ''){
        saldoFinalEntrada = parseInt(valorEntradaCaixa.value) + parseInt(valorIniciall)

        chaveSaldoEntrada = parseInt(chaveSaldoEntradaString) + 1
        nrMovimentacoes = parseInt(nrMovimentacoesString) + 1
        
        try {
            set(ref(db, 'estabelecimentos/' + usuarioEstabelecimento + '/saldo/saldo'), {
                saldo: parseInt(saldoFinalEntrada),
                totalMovimentacoes: nrMovimentacoes
            });
            set(ref(db, 'estabelecimentos/' + usuarioEstabelecimento + '/saldo/entrada/' + chaveSaldoEntrada), {
                saldoAdicionado: valorEntradaCaixa.value,
                motivo: motivoEntradaCaixa.value,
                timestamp: horaRegEst.value,
                usuario: userLocalStorage
            });
            alert('Entrada no caixa registado com sucesso')
            valorEntradaCaixa.value = ''
            motivoEntradaCaixa.value = ''
        } catch (error) {
            console.log(error)
        }
    }else{
        alert('Preencha todos os campos de saida na conta')
    }
})

btnRegSaidaCaixa.addEventListener('click', ()=>{
    if(valorSaidaCaixa.value != '' && motivoSaidaCaixa.value != ''){
        saldoFinalSaida = Math.abs(parseInt(valorSaidaCaixa.value) - parseInt(valorIniciall))

        chaveSaldoSaida = parseInt(chaveSaldoSaidaString) + 1
        nrMovimentacoes = parseInt(nrMovimentacoesString) + 1

        try {
            set(ref(db, 'estabelecimentos/' + usuarioEstabelecimento + '/saldo/saldo'), {
                saldo: parseInt(saldoFinalSaida), 
                totalMovimentacoes: nrMovimentacoes
            });
            set(ref(db, 'estabelecimentos/' + usuarioEstabelecimento + '/saldo/saida/' + chaveSaldoSaida), {
                saldoRetirado: valorSaidaCaixa.value,
                motivo: motivoSaidaCaixa.value,
                timestamp: horaRegEst.value,
                usuario: userLocalStorage
            });
            alert('Retirada no caixa registado com sucesso')
            valorSaidaCaixa.value = ''
            motivoSaidaCaixa.value = ''
        } catch (error) {
            console.log(error)
        }
    }else{
        alert('Preencha todos os campos')
    }
})