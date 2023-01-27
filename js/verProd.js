import { firebaseConfig} from "./firebaseConfig.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-app.js";
import { getDatabase, ref, child, onValue, get } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-database.js";

var cod = 0
var bodyEstoque = document.querySelector(".bodyEstoque")
var btnRefresh = document.querySelector(".btnRefresh")

  const app = initializeApp(firebaseConfig);
    const db = getDatabase();

function addItemToTable(nomeProdE, quantiProd, dataValidade, dataModi){
    let trow = document.createElement("tr")
    let td1 = document.createElement("td")
    let td2 = document.createElement("td")
    let td3 = document.createElement("td")
    let td4 = document.createElement("td")
    let td5 = document.createElement("td")

    td1.innerHTML = ++cod
    td2.innerHTML = nomeProdE
    td3.innerHTML = quantiProd
    td4.innerHTML = dataValidade
    td5.innerHTML = dataModi

    trow.appendChild(td1)  
    trow.appendChild(td2) 
    trow.appendChild(td3)  
    trow.appendChild(td4)
    trow.appendChild(td5)

    bodyEstoque.appendChild(trow)
}

function addAllItemsToTable(produtosEstoque){
    bodyEstoque.innerHTML = ""
    produtosEstoque.forEach(element => {
        addItemToTable(element.nomeProdE, element.quantProdE, element.dataValidade, element.horaRegEst)
    });
}

function GetAllDataOnce(){
    const dbRef = ref(db)

    get(child(dbRef, "produtosEstoque")).then((snapshot)=>{
        var produtos = []


        snapshot.forEach(childSnapshot => {
            produtos.push(childSnapshot.val())
        })
        addAllItemsToTable(produtos)
    })
}

function GetAllDataRealtime(){
    const dbRef = ref(db, "produtos/estoque/")

    onValue(dbRef, (snapshot) =>{
        var produtos = []

        snapshot.forEach(childSnapshot => {
            produtos.push(childSnapshot.val())
        })

        addAllItemsToTable(produtos)
    })
}

/*btnRefresh.addEventListener("click", ()=>{
    //GetAllDataRealtime()
    window.onload
})*/

window.onload = GetAllDataRealtime()