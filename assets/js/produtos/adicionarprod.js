import { firebaseConfig} from "../logico/firebaseConfig.js";
import { usuarioMail, usuarioNome, usuarioTel, usuarioEnder, usuarioCargo } from "../login/login.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-app.js";
import { getDatabase, set, ref, onValue } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-database.js";

var usuarioEstabelecimento = window.localStorage.getItem('usuarioEstabelecimento')
var nomeProd = document.querySelector(".nomeProd")
var precVendaR = document.querySelector(".precVendaR")
var precCompra = document.querySelector(".precCompra")
var lucroVenda = document.querySelector(".lucroVenda")
var dataValidade = document.querySelector(".dataValidade")
var horaReg = document.querySelector(".horaRegCadProd")
var btnRegProd = document.querySelector(".btnRegProd")
var btnAlterProd = document.querySelector(".btnAlterProd")
var btnApagProd = document.querySelector(".btnApagProd")
var tipoMoeda = ""
var valorLucroVenda = 0
var alertaInfo = document.querySelector('.alerta-info')
var alertaErro = document.querySelector('.alerta-erro')
var alertaSucesso = document.querySelector('.alerta-sucesso')

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

/*codProd.addEventListener("keyup", ()=>{
  const starCountRef = ref(database, 'produtos/' + codProd.value);

  onValue(starCountRef, (snapshot) => {
      const data = snapshot.val();
      //updateStarCount(postElement, data);
      console.log(data)
      /*if(nomeProd.placeholder == "undefined"){
        nomeProd.placeholder = "Não existe, digite um novo dado"
      }else{
        nomeProd.placeholder = data.nomeProd
      }
      if(precVenda.placeholder == "undefined"){
        precVenda.placeholder = "Não existe, digite um novo dado"
      }else{
        precVenda.placeholder = data.precVenda
      }*
      //horaRegA.value = data.horaReg
      nomeProd.placeholder = data.nomeProd
      precVenda.placeholder = data.precVenda
  });
})*/

function AlertaSucesso(mensagem){
  let info = document.createElement('p')
  info.style.margin = '0px'
  info.style.padding = '0px'
  info.innerHTML = mensagem
  alertaSucesso.appendChild(info)
  alertaSucesso.style.display = 'block'
  setTimeout(()=>{
    alertaSucesso.style.display = 'none'
    info.innerHTML = ''
  }, 2500)
}

function AlertaErro(mensagem){
  let info = document.createElement('p')
  info.style.margin = '0px'
  info.style.padding = '0px'
  info.innerHTML = mensagem
  alertaErro.appendChild(info)
  alertaErro.style.display = 'block'
  setTimeout(()=>{
    alertaErro.style.display = 'none'
    info.innerHTML = ''
  }, 2500)
}

function AlertaInfo(mensagem){
  let info = document.createElement('p')
  info.style.margin = '0px'
  info.style.padding = '0px'
  info.innerHTML = mensagem
  alertaInfo.appendChild(info)
  alertaInfo.style.display = 'block'
  setTimeout(()=>{
    alertaInfo.style.display = 'none'
    info.innerHTML = ''
  }, 2500)
}

precVendaR.addEventListener("keyup", ()=>{
  //console.log("kdks")

  valorLucroVenda = Math.abs(precCompra.value - precVendaR.value)

  lucroVenda.value = valorLucroVenda
})

btnRegProd.addEventListener("click", ()=>{
  const tipoMoedaRef = ref(db, 'estabelecimentos/' + usuarioEstabelecimento + '/tipoMoeda/');
  onValue(tipoMoedaRef, (snapshot) => {
    const data = snapshot.val();
    tipoMoeda = data.tipoMoeda

    function adicionarProd(nomeProd, precVenda, precCompra, lucroProd, tipoMoeda, horaReg,) {
      const db = getDatabase();
      set(ref(db, 'estabelecimentos/' + usuarioEstabelecimento + '/produtos/todosProdutos/' + nomeProd), {
        nomeProd: nomeProd,
        precVenda: precVenda,
        precCompra: precCompra,
        lucroProd: lucroProd,
        tipoMoeda: tipoMoeda,
        horaReg: horaReg,
        quantProdE: 0
      });
    }
    
    if(nomeProd.value != "" && precVendaR.value != "" && precCompra.value != ""){
      adicionarProd(nomeProd.value, precVendaR.value, precCompra.value, lucroVenda.value, tipoMoeda, horaReg.value)
    
      //alert("Produto cadastrado com sucesso")
      AlertaSucesso("Produto cadastrado com sucesso")
      nomeProd.value = ""
      precVendaR.value = ""
      precCompra.value = ""
      lucroVenda.value = ""
      dataValidade.value = ""
    }else{
      //alert("Preencha todos os campos necessarios por favor")
      AlertaInfo("Preencha todos os campos necessarios por favor")
    }
  });
})

btnAlterProd.addEventListener("click", ()=>{
  function adicionarProd(codProd, nomeProd, precVenda, horaReg,) {
    const db = getDatabase();
    set(ref(db, 'estabelecimentos/' + usuarioEstabelecimento + '/produtos/' + codProd), {
      nomeProd: nomeProd,
      precVenda: precVenda,
      horaReg: horaReg
    });
  }
  
  adicionarProd(codProd.value, nomeProd.value, precVenda.value, horaReg.value)
  
      //alert("Produto cadastrado com sucesso")
      AlertaSucesso("Produto cadastrado com sucesso")
      codProd.value = ""
      nomeProd.value = ""
      precVenda.value = ""
  })