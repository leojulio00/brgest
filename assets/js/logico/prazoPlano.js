import { firebaseConfig } from "./firebaseConfig.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-app.js";
import { getDatabase, ref, onValue, set } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-database.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-auth.js";

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
var usuarioEstabelecimento = window.localStorage.getItem('usuarioEstabelecimento')

let tdsSection = document.querySelectorAll(".tdsSection")
var alertaInfo = document.querySelector('.alerta-info')
var sectionPrazoPlano = document.querySelector('.sectionPrazoPlano')
var dataInscricao = ''
var dataInscricaoo = ''
var nomePlano = ''

const dbRef = ref(db, 'estabelecimentos/' + usuarioEstabelecimento + '/dadosEmpresa')

function AlertaInfo(mensagem){
    let info = document.createElement('p')
    info.style.margin = '0px'
    info.style.padding = '0px'
    info.innerHTML = mensagem
    alertaInfo.appendChild(info)
    alertaInfo.style.display = 'block'
}

onValue(dbRef, (snapshot)=>{
    const data = snapshot.val()
    dataInscricaoo = data.dataInscricao
    nomePlano = data.plano
    dataInscricao = dataInscricaoo

    InserirData()
}, {
    onlyOnce: true
})


function InserirData(){
    // Data de início do plano (formato: dd/mm/yyyy)
    var dataInicio = dataInscricao;
    // Duração do plano em dias
    var duracaoPlano
    if(nomePlano == 'mensal'){
        duracaoPlano = 30
    }else if(nomePlano == 'semestral'){
        duracaoPlano = 183
    }else if(nomePlano == 'anual'){
        duracaoPlano = 365
    }
    

    // Converte a data de início do plano para o objeto Date
    var partesDataInicio = dataInicio.split("/");
    var dataInicioObj = new Date(partesDataInicio[2], partesDataInicio[1] - 1, partesDataInicio[0]);
    console.log(dataInicioObj)

    // Calcula a data de término do plano
    var dataFim = new Date(dataInicioObj);
    dataFim.setDate(dataFim.getDate() + duracaoPlano);
    console.log(dataFim)

    // Calcula a diferença de dias entre a data atual e a data de término do plano
    var hoje = new Date();
    var diferencaDias = Math.ceil((dataFim.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24));
    console.log(diferencaDias)

    /*setInterval(()=>{
        console.log(dataInicio)
        console.log(dataInicioObj.getDate())
        console.log(dataFim.getDate() + '/' + dataFim.getMonth() + '/' + dataFim.getFullYear())
    }, 4000)*/

    // Verifica se faltam 3 dias ou menos para o término do plano
    if (diferencaDias <= 3) {
        // Formata a data de início do plano no formato "dd/mm/yyyy"
        var dataInicioFormatada = dataInicio.split("/").reverse().join("/");
        // Emite um alerta para lembrar o usuário do prazo do plano
        AlertaInfo("Atenção! Seu plano " + nomePlano + " (iniciado em " + dataInicioFormatada + ") está prestes a expirar em " + diferencaDias + " dias.")
    }

    if(diferencaDias <= 0){
        set(ref(db, 'estabelecimentos/' + usuarioEstabelecimento + '/dadosEmpresa/estadoPlano'), false);
    }

    set(ref(db, 'estabelecimentos/' + usuarioEstabelecimento + '/dadosEmpresa/validadePlano'), dataFim.getDate() + '/' + dataFim.getMonth() + '/' + dataFim.getFullYear());

    onValue(dbRef, (snapshot)=>{
        const estadoPlano = snapshot.val().estadoPlano
    
        if(estadoPlano == false){
            setInterval(()=>{
                tdsSection.forEach((val)=>{
                    val.style.display = "none"
                })
        
                sectionPrazoPlano.style.display = 'block'
            }, 10)
        }else{
            sectionPrazoPlano.style.display = 'none'
        }
    })
}





