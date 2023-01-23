import { firebaseConfig} from "./firebaseConfig.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-app.js";
import { getDatabase, ref, remove, onValue, set, onChildAdded} from "https://www.gstatic.com/firebasejs/9.14.0/firebase-database.js";


const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
var codMesa = document.querySelector(".codMesa")
var tamanhoMesa = document.querySelector(".tamanhoMesa")
var formaMesaSelect = document.querySelector(".formaMesaSelect")
var rotuloMesa = document.querySelector(".rotuloMesa")
var divSelecProdutos = document.querySelector(".selecionarProdutos")
var divSelecMetodos = document.querySelector(".selecionarMPagamento")
var finalizarPreVenda = document.querySelector(".finalizarPreVenda")
var divVerMesasDisponiveis =document.querySelector(".divVerMesasDisponiveis")
var verProdutosMesa =document.querySelector(".verProdutosMesa")
var listarTdsProdutosMesa =document.querySelector(".listarTdsProdutosMesa")
var spanTotalVerProdutosMesa = document.querySelector(".spanTotalVerProdutosMesa")
var btnCadastrarMesa = document.querySelector(".btnCadastrarMesa")
var btnAdicionarProdutos = document.querySelector(".btnAdicionarProdutos")
var btnCancelar2 = document.querySelector(".btnCancelar2")
var btnProximoRegVenda = document.querySelector(".btnProximoRegVenda")


btnCadastrarMesa.addEventListener("click", ()=>{
    set(ref(db, 'mesas/todasMesas/' + codMesa.value), {
        codigoMesa: codMesa.value,
        tamanho: tamanhoMesa.value,
        foma: formaMesaSelect.options[formaMesaSelect.selectedIndex].text,
        rotulo: rotuloMesa.value
    });

    alert("Mesa cadastrada")
})


let produtosSelecionadosMesa = ""
let metodoSelecionandoMesa = ""

const dbRefProdutosMesa = ref(db, "produtos/selecProdutos")
const dbRefMetodoMesa = ref(db, "/metodosPagamento/metodoSelecionado")
onValue(dbRefProdutosMesa, (snapshot)=>{
  const data = snapshot.val()
  produtosSelecionadosMesa = data
})

onValue(dbRefMetodoMesa, (snapshot)=>{
  const data = snapshot.val()
  metodoSelecionandoMesa = data
})

var CodigoMesaClicado

function addMesasNaDiv(codigoMesa, rotulo, tamanho){
  let divCol = document.createElement("div")
  let divCard = document.createElement("div")
  let divCardBody = document.createElement("div")
  let codigoMesaTxt = document.createElement("h5")
  let rotuloMesaTxt = document.createElement("h5")
  let tamanhoMesaTxt = document.createElement("h5")

  codigoMesaTxt.innerHTML = "Cod. " + codigoMesa
  rotuloMesaTxt.innerHTML = "Rot." + rotulo
  tamanhoMesaTxt.innerHTML = "Tamanho " + tamanho

  divCard.setAttribute("data-bs-dismiss", "modal")

  divCard.addEventListener("click", ()=>{
    btnAdicionarProdutos.click()

    divSelecProdutos.style.display = "none"
    divSelecMetodos.style.display = "none"
    finalizarPreVenda.style.display = "none"
    verProdutosMesa.style.display = "block"

    btnProximoRegVenda.classList.remove("d-none")
    btnProximoRegVenda.classList.add("d-block")
    btnProximoRegVenda.style.display = "block"
    btnCancelar2.classList.remove("d-none")
    btnCancelar2.classList.add("d-block")
    btnCancelar2.style.display = "block"

    CodigoMesaClicado = codigoMesa
    console.log(CodigoMesaClicado)
  })

  divCol.classList.add("col")
  divCard.classList.add("card")
  divCard.classList.add("cardRegVendasSelecionado")
  divCardBody.classList.add("card-body")
  divCardBody.style.display = "flex"
  divCardBody.style.flexDirection = "row"
  divCardBody.style.flexWrap = "nowrap"
  divCardBody.style.justifyContent = "space-between"
  divCardBody.style.margin = "5px 0px"
  codigoMesaTxt.classList.add("card-title")
  codigoMesaTxt.style.margin = "0px"
  rotuloMesaTxt.classList.add("card-title")
  rotuloMesaTxt.style.margin = "0px"
  tamanhoMesaTxt.classList.add("card-text")
  tamanhoMesaTxt.style.margin = "0px"

  divCol.appendChild(divCard)  
  divCard.appendChild(divCardBody) 
  divCardBody.appendChild(codigoMesaTxt)  
  divCardBody.appendChild(rotuloMesaTxt)
  divCardBody.appendChild(tamanhoMesaTxt)  

  divVerMesasDisponiveis.appendChild(divCol)
}

function addTdasMesasNaDiv(produtos){
  divVerMesasDisponiveis.innerHTML = ""
  produtos.forEach(element => {
      addMesasNaDiv(element.codigoMesa, element.rotulo, element.tamanho)
  });
}

function PegarTdsMesas(){
  const dbRef = ref(db, "mesas/todasMesas")

  onValue(dbRef, (snapshot) =>{
      var todasMesas = []

      snapshot.forEach(childSnapshot => {
        todasMesas.push(childSnapshot.val())
      })

      addTdasMesasNaDiv(todasMesas)
  })
}

window.onload = PegarTdsMesas()

function addProdutosNoCard(nomeProduto, precoProduto, tipoMoeda, quantidadeProd){
  let divCol = document.createElement("div")
  let divCard = document.createElement("div")
  let divCardBody = document.createElement("div")
  let produNomeTxt = document.createElement("h5")
  let precoProdutoTxt = document.createElement("h5")
  let produQuantidadeTxt = document.createElement("h5")

  produNomeTxt.innerHTML = nomeProduto
  precoProdutoTxt.innerHTML = precoProduto + ".00 " + tipoMoeda
  produQuantidadeTxt.innerHTML = quantidadeProd

  /*divCard.addEventListener("click", ()=>{
    produQuantidade.innerHTML = "Qtd " + quantProduto++

    const db = getDatabase();
    set(ref(db, 'produtos/selecProdutos/' + nomeProduto), {
      quantidadeProd: quantProduto - 1
    });

    if(divCard.classList.contains("cardRegVendasSelecionado")){
      //
    }else{
      divCard.classList.add("cardRegVendasSelecionado")
    }
  })*/

  divCol.classList.add("col")
  divCard.classList.add("card")
  divCard.classList.add("cardRegVendasSelecionado")
  divCardBody.classList.add("card-body")
  divCardBody.style.display = "flex"
  divCardBody.style.flexDirection = "row"
  divCardBody.style.flexWrap = "nowrap"
  divCardBody.style.justifyContent = "space-between"
  produNomeTxt.classList.add("card-title")
  produNomeTxt.style.fontSize = "16px"
  precoProdutoTxt.classList.add("card-title")
  precoProdutoTxt.style.fontSize = "16px"
  produQuantidadeTxt.classList.add("card-text")
  produQuantidadeTxt.style.fontSize = "16px"

  divCol.appendChild(divCard)  
  divCard.appendChild(divCardBody) 
  divCardBody.appendChild(produNomeTxt)  
  divCardBody.appendChild(precoProdutoTxt)
  divCardBody.appendChild(produQuantidadeTxt)  

  produtosEscolhidoFinal.appendChild(divCol)
}

function addTdsProdutosNaDiv(produtos){
  produtosEscolhidoFinal.innerHTML = ""
  produtos.forEach(element => {
      addProdutosNoCard(element.nomeProduto, element.precoProduto, element.tipoMoeda, element.quantidadeProd)
  });
}

function PegarTdsProdutosSelecionados(){
  const dbRef = ref(db, "mesas/produtos/" + CodigoMesaClicado)

  onValue(dbRef, (snapshot) =>{
      var todosProdutos = []

      snapshot.forEach(childSnapshot => {
        todosProdutos.push(childSnapshot.val())
      })

      addTdsProdutosNaDiv(todosProdutos)
  })
}

const dbRef = ref(db, "mesas/produtos/" + CodigoMesaClicado)

/*setInterval(()=>{
  
  onValue(dbRef, (snapshot) =>{
    var todosProdutos = []

    snapshot.forEach(childSnapshot => {
      todosProdutos.push(childSnapshot.val())
    })

    todosProdutos.forEach(element => {
      
      dbRef = ref(db, "mesa/produtos/" + CodigoMesaClicado + "/" + element.produto + "/")
    });
    console.log(dbRef)
    
  })
}, 1000)*/

  
