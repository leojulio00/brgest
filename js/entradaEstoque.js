import { firebaseConfig} from "./firebaseConfig.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-app.js";
import { getDatabase, ref, onValue, set } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-database.js";

var codProdE = document.querySelector(".codProdE")
var nomeProdE = document.querySelector(".nomeProdE")
var quantProdE = document.querySelector(".quantProdE")
var dataValidade = document.querySelector(".dataValidade")
var horaRegEst = document.querySelector(".horaRegEst")
var btnAdiProdE = document.querySelector(".btnAdiProdE")
var menuDropdownNomeProdAddEstoque = document.querySelector(".menuDropdownNomeProdAddEstoque")


const app = initializeApp(firebaseConfig);
const db = getDatabase();


nomeProdE.addEventListener("keyup", ()=>{
    /*const starCountRef = ref(db, 'produtos/todosProdutos/' + nomeProdE.value);


    onValue(starCountRef, (snapshot) => {
        const data = snapshot.val();
        //updateStarCount(postElement, data);
        console.log(data)
        nomeProdE.value = data.nomeProd
        horaRegA.value = data.horaReg
    });*/

    const starCountRef = ref(db, 'produtos/todosProdutos');
    var todosNomesProdutos = []

    onValue(starCountRef, (snapshot) =>{
      snapshot.forEach(childSnapshot => {
        todosNomesProdutos.push(childSnapshot.key)
      })
      todosNomesProdutos.forEach((val, i, arr)=>{
        var pV = ""
        if(val.startsWith(nomeProdE.value) == true){
          pV = val

          let dropItem = document.createElement("a")
          dropItem.innerHTML = pV
          dropItem.addEventListener("click", ()=>{
            nomeProdE.value = pV
          })
          menuDropdownNomeProdAddEstoque.innerHTML = ""
          menuDropdownNomeProdAddEstoque.appendChild(dropItem)
          if(menuDropdownNomeProdAddEstoque.classList.contains("show")){
            menuDropdownNomeProdAddEstoque.classList.remove("show")
          }else{
            menuDropdownNomeProdAddEstoque.classList.add("show")
          }
          
        }else{
          //menuDropdownNomeProdAddEstoque.classList.remove("show")
        }
      })
    })
})

btnAdiProdE.addEventListener("click", ()=>{
    function adicionarProd(nomeProdE, quantProdE, dataValidade, horaRegEst) {
        const db = getDatabase();
        set(ref(db, 'produtos/estoque/' + nomeProdE), {
          nomeProdE: nomeProdE,
          quantProdE: quantProdE,
          dataValidade: dataValidade,
          horaRegEst: horaRegEst
        });
        alert("Produto adicionado ao estoque com sucesso")
      }
      if(nomeProdE.value != "" && quantProdE.value != "" && dataValidade.value != ""){
        adicionarProd(nomeProdE.value, quantProdE.value, dataValidade.value, horaRegEst.value)
        nomeProdE.value = ""
        quantProdE.value = ""
        dataValidade.value = ""
      }
})


