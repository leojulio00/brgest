import { firebaseConfig} from "../logico/firebaseConfig.js";
import { usuarioMail, usuarioNome, usuarioTel, usuarioEnder, usuarioCargo } from "../login/login.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-app.js";
import { getDatabase, set, ref, onValue } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-database.js";

var usuarioEstabelecimento = window.localStorage.getItem('usuarioEstabelecimento')
var nomeUsuario = window.localStorage.getItem('nomeUser')
var nomeProd = document.querySelector(".nomeProd")
var precVendaR = document.querySelector(".precVendaR")
var precCompra = document.querySelector(".precCompra")
var lucroVenda = document.querySelector(".lucroVenda")
var dataValidade = document.querySelector(".dataValidade")
var horaReg = document.querySelector(".horaRegCadProd")
var btnRegProd = document.querySelector(".btnRegProd")
var tipoMoeda = ""
var valorLucroVenda = 0
var categoriaProd = document.querySelector(".categoriaProd")
var inputNomeCategoria = document.querySelector(".inputNomeCategoria")
var divVerTodasCategorias = document.querySelector(".divVerTodasCategorias")
var btnAdicionarCategoria = document.querySelector(".btnAdicionarCategoria")
var btnCadastrarCategoria = document.querySelector(".btnCadastrarCategoria")
var btnFecharModalCategoria = document.querySelector(".btnFecharModalCategoria")
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

// Referência para todos as categorias cadastrados
const categoriasRef = ref(
  db,
  "estabelecimentos/" + usuarioEstabelecimento + "/produtos/categorias"
);

// Carregar e exibir todas as categorias cadastradas
onValue(categoriasRef, (snapshot) => {
  // Limpar a div antes de adicionar novos elementos
  divVerTodasCategorias.innerHTML = "";

  snapshot.forEach((childSnapshot) => {
    const categoria = childSnapshot.val();

    // Criar elemento de lista para cada produto
    let divCol = document.createElement("div");
    let divCard = document.createElement("div");
    let divCardBody = document.createElement("div");
    const listItem = document.createElement("p");

    divCol.classList.add("col");
    divCol.style.margin = "5px 0px";
    divCard.classList.add("card");
    divCard.classList.add("cardRegVendasSelecionado");
    divCardBody.classList.add("card-body");
    divCardBody.style.display = "flex";
    divCardBody.style.flexDirection = "row";
    divCardBody.style.flexWrap = "nowrap";
    divCardBody.style.justifyContent = "space-between";
    divCardBody.style.margin = "5px 0px";
    listItem.classList.add("card-title");
    listItem.style.margin = "0px 5px";

    
    listItem.textContent = `${categoria.nomeCategoria}`;
    
    divCol.addEventListener("click", () => {
      console.log(`Nome do produto selecionado é ${categoria.nomeCategoria}`);
      categoriaProd.value = `${categoria.nomeCategoria}`
      categoriaProd.setAttribute = "disabled"
      btnFecharModalCategoria.click()
    });

    divCol.appendChild(divCard);
    divCard.appendChild(divCardBody);
    divCardBody.appendChild(listItem);
    divVerTodasCategorias.appendChild(divCol);
    
  });

  // Adicionar evento ao botão para exibir produtos abaixo
  /*if (btnVerProdutosAbaixo) {
    btnVerProdutosAbaixo.addEventListener("click", () => {
      console.log("Botão Ver Produtos Abaixo clicado.");
      const modal = new bootstrap.Modal(modalVerProdutosAbaixo);
      modal.show();
    });
  }

  // Atualizar o texto com o total de produtos abaixo
  if (totalProdutosAbaixoTxt) {
    totalProdutosAbaixoTxt.innerHTML = totalProdutosAbaixo;
  }*/
});

//FUNCAO PARA CALCULAR LUCRO E ADICIONAR NO INPUT
precVendaR.addEventListener("keyup", ()=>{
  valorLucroVenda = Math.abs(precCompra.value - precVendaR.value)

  lucroVenda.value = valorLucroVenda
})

btnAdicionarCategoria.addEventListener("click", ()=>{
  const modal = new bootstrap.Modal(modalModalAdicionarCategoria);
  modal.show();
  
})

btnCadastrarCategoria.addEventListener("click", ()=>{
  function adicionarProd(nomeCategoria) {
    const db = getDatabase();
    set(ref(db, 'estabelecimentos/' + usuarioEstabelecimento + '/produtos/categorias/' + nomeCategoria), {
      nomeCategoria: nomeCategoria
    });
  }
  
  if(inputNomeCategoria.value != ""){
    adicionarProd(inputNomeCategoria.value)
  
    //alert("Produto cadastrado com sucesso")
    AlertaSucesso("Produto cadastrado com sucesso")
    inputNomeCategoria.value = ""
  }else{
    //alert("Preencha todos os campos necessarios por favor")
    AlertaInfo("Preencha todos os campos necessarios por favor")
  }
})

categoriaProd.addEventListener("click", ()=>{
  const modal = new bootstrap.Modal(modalVerCategoriaProduto);
  modal.show();
  
})

btnRegProd.addEventListener("click", ()=>{
  const tipoMoedaRef = ref(db, 'estabelecimentos/' + usuarioEstabelecimento + '/tipoMoeda/');
  onValue(tipoMoedaRef, (snapshot) => {
    const data = snapshot.val();
    tipoMoeda = data.tipoMoeda

    function adicionarProd(nomeProd, categoriaProd, precVenda, precCompra, lucroProd, tipoMoeda, horaReg,) {
      const db = getDatabase();
      set(ref(db, 'estabelecimentos/' + usuarioEstabelecimento + '/produtos/todosProdutos/' + nomeProd), {
        nomeProd: nomeProd,
        categoriaProd: categoriaProd,
        precVenda: precVenda,
        precCompra: precCompra,
        lucroProd: lucroProd,
        tipoMoeda: tipoMoeda,
        horaReg: horaReg,
        quantProdE: 0,
        responsavel: nomeUsuario
      });
    }

    console.log(categoriaProd.value)
    
    if(nomeProd.value != "" && precVendaR.value != "" && precCompra.value != "" && categoriaProd.value != ""){
      adicionarProd(nomeProd.value, categoriaProd.value, precVendaR.value, precCompra.value, lucroVenda.value, tipoMoeda, horaReg.value)
    
      //alert("Produto cadastrado com sucesso")
      AlertaSucesso("Produto cadastrado com sucesso")
      nomeProd.value = ""
      precVendaR.value = ""
      precCompra.value = ""
      lucroVenda.value = ""
      dataValidade.value = ""
      categoriaProd.value = ""
    }else{
      //alert("Preencha todos os campos necessarios por favor")
      AlertaInfo("Preencha todos os campos necessarios por favor")
    }
  });
})