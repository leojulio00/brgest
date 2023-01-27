import { firebaseConfig} from "./firebaseConfig.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-app.js";
import { getDatabase, set, ref, onValue } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-database.js";

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

precVendaR.addEventListener("keyup", ()=>{
  //console.log("kdks")

  valorLucroVenda = Math.abs(precCompra.value - precVendaR.value)

  lucroVenda.value = valorLucroVenda
})

btnRegProd.addEventListener("click", ()=>{
  const tipoMoedaRef = ref(db, 'tipoMoeda/');
  onValue(tipoMoedaRef, (snapshot) => {
    const data = snapshot.val();
    tipoMoeda = data.tipoMoeda

    function adicionarProd(nomeProd, precVenda, precCompra, lucroProd, tipoMoeda, horaReg,) {
      const db = getDatabase();
      set(ref(db, 'produtos/todosProdutos/' + nomeProd), {
        nomeProd: nomeProd,
        precVenda: precVenda,
        precCompra: precCompra,
        lucroProd: lucroProd,
        tipoMoeda: tipoMoeda,
        horaReg: horaReg
      });
    }
    
    if(nomeProd != "" && precVendaR != "" && precCompra != ""){
      adicionarProd(nomeProd.value, precVendaR.value, precCompra.value, lucroVenda.value, tipoMoeda, horaReg.value)
    
      alert("Produto cadastrado com sucesso")
      nomeProd.value = ""
      precVendaR.value = ""
      precCompra.value = ""
      lucroVenda.value = ""
      dataValidade.value = ""
    }else{
      alert("Preencha todos os campos necessarios por favor")
    }
  });
})

btnAlterProd.addEventListener("click", ()=>{
  function adicionarProd(codProd, nomeProd, precVenda, horaReg,) {
    const db = getDatabase();
    set(ref(db, 'produtos/' + codProd), {
      nomeProd: nomeProd,
      precVenda: precVenda,
      horaReg: horaReg
    });
  }
  
  adicionarProd(codProd.value, nomeProd.value, precVenda.value, horaReg.value)
  
      alert("Produto cadastrado com sucesso")
      codProd.value = ""
      nomeProd.value = ""
      precVenda.value = ""
  })