import { firebaseConfig} from "../logico/firebaseConfig.js";
import { usuarioMail, usuarioNome, usuarioTel, usuarioEnder } from "../login/login.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-app.js";
import { getDatabase, ref, onValue, set } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-database.js";

var codProdE = document.querySelector(".codProdE")
var nomeProdE = document.querySelector(".nomeProdE")
var quantProdE = document.querySelector(".quantProdE")
var dataValidade = document.querySelector(".dataValidade")
var horaRegEst = document.querySelector(".horaRegEst")
var btnAdiProdE = document.querySelector(".btnAdiProdE")
var menuDropdownNomeProdAddEstoque = document.querySelector(".menuDropdownNomeProdAddEstoque")
var usuarioEstabelecimento = window.localStorage.getItem('usuarioEstabelecimento')
var nomeUsuario = window.localStorage.getItem('nomeUser')
var alertaInfo = document.querySelector('.alerta-info')
var alertaErro = document.querySelector('.alerta-erro')
var alertaSucesso = document.querySelector('.alerta-sucesso')


const app = initializeApp(firebaseConfig);
const db = getDatabase();

//FUNCAO ALERTA DE SUCESSO
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

//FUNCAO ALERTA DE ERRO
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

//FUNÇÃO DE ALERTA DE INFORMAÇÃO
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

//ADICIONANDO AÇÃO DE PESQUISA NO LABEL NOMEPRODE A CADA VEZ QUE O USUARIO CLICAR UMA TECLA 
nomeProdE.addEventListener("keyup", ()=>{
    /*const starCountRef = ref(db, 'produtos/todosProdutos/' + nomeProdE.value);


    onValue(starCountRef, (snapshot) => {
        const data = snapshot.val();
        //updateStarCount(postElement, data);
        console.log(data)
        nomeProdE.value = data.nomeProd
        horaRegA.value = data.horaReg
    });*/

    //PEGANDO TODOS OS PRODUTOS CADASTRADOS
    const starCountRef = ref(db, 'estabelecimentos/' + usuarioEstabelecimento + '/produtos/todosProdutos');
    var todosNomesProdutos = []

    onValue(starCountRef, (snapshot) =>{
      //CARREGANDO AS CHAVES DE CADA NÓ DOS PRODUTOS CADASTRADOS NA ARRAY TODOSNOMESPRODUTOS
      snapshot.forEach(childSnapshot => {
        todosNomesProdutos.push(childSnapshot.key)
      })

      //FAZENDO A PESQUISA DE CADA ELEMENTO NO ARRAY POR SEMELHANCA DE INICIO DE LETRA
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

//ACÇÃO NO BOTAO ADICIONAR PRODUTO NO ESTOQUE
btnAdiProdE.addEventListener("click", ()=>{
    function adicionarProd(nomeProdE, quantProdE, dataValidade, horaRegEst) {
        const db = getDatabase();
        let quantidadeInicial = 0

        //PEGANDO A QUANTIDADE INICIAL DA BASE DE DADOS
        onValue(ref(db, 'estabelecimentos/' + usuarioEstabelecimento + '/produtos/todosProdutos/' + nomeProdE), (snapshot)=>{
          const data = snapshot.val()
          quantidadeInicial = data.quantProdE
        })

        //SOMANDO A QUANTIDADE PRESENTE NA BASE DE DADOS E A NOVA QUANTIDADE
        let quantidadeFinal = parseInt(quantProdE) + parseInt(quantidadeInicial)

        //ADICIONANDO O NOME DE PRODUTO NO NÓ TODOS OS PRODUTOS E O PRODUTO SELECIONANDO
        set(ref(db, 'estabelecimentos/' + usuarioEstabelecimento + '/produtos/todosProdutos/' + nomeProdE + '/nomeProd'),  nomeProdE)

        //ADICIONANDO A QUANTIDADE FINAL NO NÓ TODOS OS PRODTOS E  O PRODUTO SELECIONADO
        set(ref(db, 'estabelecimentos/' + usuarioEstabelecimento + '/produtos/todosProdutos/' + nomeProdE + '/quantProdE'), quantidadeFinal )

        ////ADICIONANDO NA BASE DE DADOS A DATA DE VALIDADE
        set(ref(db, 'estabelecimentos/' + usuarioEstabelecimento + '/produtos/todosProdutos/' + nomeProdE + '/dataValidade'),  dataValidade)

        //ADICIONANDO NA BASE DE DADOS A HORA DE REGISTO
        set(ref(db, 'estabelecimentos/' + usuarioEstabelecimento + '/produtos/todosProdutos/' + nomeProdE + '/horaRegEst'),  horaRegEst)


        //alert("Produto adicionado ao estoque com sucesso")
        AlertaSucesso("Produto adicionado ao estoque com sucesso")
      }
      if(nomeProdE.value != "" && quantProdE.value != "" && dataValidade.value != ""){
        //EXECUTANDO A FUNÇÃO ADCIONARPROD
        adicionarProd(nomeProdE.value, quantProdE.value, dataValidade.value, horaRegEst.value)

        //LIMPANDO OS CAMPOS DE ADIÇÃO DE TEXTO
        nomeProdE.value = ""
        quantProdE.value = ""
        dataValidade.value = ""
      }
})


