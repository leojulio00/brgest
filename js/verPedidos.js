/*import { firebaseConfig} from "./firebaseConfig.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-app.js";
import { getDatabase, ref, child, onValue, get } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-database.js";

var cod = 0
var bodyPedidos = document.querySelector(".bodyPedidos")
//var btnRefresh = document.querySelector(".btnRefresh")


  const app = initializeApp(firebaseConfig);
    const db = getDatabase();

function addItemToTable(codProdE, prodPedidos, estadoPedi){
    let trow = document.createElement("tr")
    let td1 = document.createElement("td")
    let td2 = document.createElement("td")
    let td3 = document.createElement("td")

    td1.innerHTML = ++cod
    td2.innerHTML = prodPedidos
    td3.innerHTML = estadoPedi

    trow.appendChild(td1)  
    trow.appendChild(td2) 
    trow.appendChild(td3)  

    bodyPedidos.appendChild(trow)
}

function addAllItemsToTable(produtosPedidos){
    bodyPedidos.innerHTML = ""
    produtosPedidos.forEach(element => {
        addItemToTable(element.codProdE, element.prodPed, element.estadoPedi)
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
    const dbRef = ref(db, "pedidos")

    onValue(dbRef, (snapshot) =>{
        var produtos = []

        snapshot.forEach(childSnapshot => {
            produtos.push(childSnapshot.val())
        })

        addAllItemsToTable(produtos)
    })
}

*btnRefresh.addEventListener("click", ()=>{
    //GetAllDataRealtime()
    window.onload
})*

window.onload = GetAllDataRealtime()*/