var horaReg = document.querySelector(".horaReg")
var horaRegEst = document.querySelector(".horaRegEst")
var horaRegVen = document.querySelector(".horaRegVen")
var horaRegCadProd = document.querySelector(".horaRegCadProd")
var spanDataActual = document.querySelector(".spanDataActual")

setInterval(displayHello, 100);

function displayHello() {
    var now = new Date
    horaRegEst.value = now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds() + " - " + now.getDate() + "/" + now.getMonth() + "/" + now.getFullYear()

    spanDataActual.innerHTML = 
    now.getDate() +
    "/" +
    (now.getMonth() + 1) +
    "/" +
    now.getFullYear()

    //horaRegVen.value = now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds()  + " - " + now.getDate() + "/" + now.getMonth() + "/" + now.getFullYear()


    
    horaRegCadProd.value = now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds() + " - " + now.getDate() + "/" + now.getMonth() + "/" + now.getFullYear()
}
