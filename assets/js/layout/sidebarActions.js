let tdsSection = document.querySelectorAll(".tdsSection");
let btnSideRegistarVenda = document.querySelector(".btnSideRegistarVenda");
let btnSideMesas = document.querySelector(".btnSideMesas");
let btnSidePaginaInicial = document.querySelector(".btnSidePaginaInicial");
let btnSideCadastroProdutos = document.querySelector(
  ".btnSideCadastroProdutos"
);
let btnSideRegistoEntradaEstoque = document.querySelector(
  ".btnSideRegistoEntradaEstoque"
);
let btnSideVerEstoque = document.querySelector(".btnSideVerEstoque");
let btnSideCadastroColaboradores = document.querySelector(
  ".btnSideCadastroColaboradores"
);
let btnSideRemocaoColaboradores = document.querySelector(
  ".btnSideRemocaoColaboradores"
);
let btnSideVerColaboradores = document.querySelector(
  ".btnSideVerColaboradores"
);
let btnSideUsuario = document.querySelector(".btnSideUsuario");

let btnSideCriarClientes = document.querySelector(".btnSideCriarClientes");
let btnSideVerClientes = document.querySelector(".btnSideVerClientes");

let sectionDashboard = document.querySelector(".dashboard");
let sectionFluxoCaixa = document.querySelector(".fluxoCaixa");
let sectionRelatorios = document.querySelector(".relatorios");
let sectionVendas = document.querySelector(".vendas");
let sectionCaixa = document.querySelector(".caixa");
let sectionProdutos = document.querySelector(".produtos");
let sectionColaboradores = document.querySelector(".colaboradores");
let sectionClientes = document.querySelector(".clientes");
let sectionUsuario = document.querySelector(".usuario");
let btnDashboard = document.querySelector(".btnDashboard");
let btnVendas = document.querySelector(".btnVendas");
let btnCaixa = document.querySelector(".btnCaixa");
let btnProdutos = document.querySelector(".btnProdutos");
let btnColaboradores = document.querySelector(".btnColaboradores");
let btnSideFluxoCaixa = document.querySelector(".btnSideFluxoCaixa");
var btnSideRelatoriosDiarios = document.querySelector(".btnSideRelatoriosDiarios");
let btnUsuario = document.querySelector(".btnUsuario");
var btnSidebar = document.querySelector(".navbar-toggler");
var menuLateral = document.querySelector(".menuLateral");
var btnAcessoRapidoRegistarVenda = document.querySelector(".btnAcessoRapidoRegistarVenda");


btnSidePaginaInicial.addEventListener("click", () => {
  tdsSection.forEach((val) => {
    val.style.display = "none";
  });
  sectionDashboard.style.display = "block";
});

btnSideFluxoCaixa.addEventListener("click", () => {
  tdsSection.forEach((val) => {
    val.style.display = "none";
  });
  sectionFluxoCaixa.style.display = "block";
});

btnSideRelatoriosDiarios.addEventListener("click", () => {
  tdsSection.forEach((val) => {
    val.style.display = "none";
  });
  sectionRelatorios.style.display = "block";
});

btnSideRegistarVenda.addEventListener("click", () => {
  tdsSection.forEach((val) => {
    val.style.display = "none";
  });
  sectionVendas.style.display = "block";
});

btnSideMesas.addEventListener("click", () => {
  tdsSection.forEach((val) => {
    val.style.display = "none";
  });
  sectionVendas.style.display = "block";
});

btnSideCadastroProdutos.addEventListener("click", () => {
  tdsSection.forEach((val) => {
    val.style.display = "none";
  });
  sectionProdutos.style.display = "block";
});

btnSideRegistoEntradaEstoque.addEventListener("click", () => {
  tdsSection.forEach((val) => {
    val.style.display = "none";
  });
  sectionProdutos.style.display = "block";
});

btnSideVerEstoque.addEventListener("click", () => {
  tdsSection.forEach((val) => {
    val.style.display = "none";
  });
  sectionProdutos.style.display = "block";
});

btnSideCadastroColaboradores.addEventListener("click", () => {
  tdsSection.forEach((val) => {
    val.style.display = "none";
  });
  sectionColaboradores.style.display = "block";
});

btnSideRemocaoColaboradores.addEventListener("click", () => {
  tdsSection.forEach((val) => {
    val.style.display = "none";
  });
  sectionColaboradores.style.display = "block";
});

btnSideVerColaboradores.addEventListener("click", () => {
  tdsSection.forEach((val) => {
    val.style.display = "none";
  });
  sectionColaboradores.style.display = "block";
});

btnSideUsuario.addEventListener("click", () => {
  tdsSection.forEach((val) => {
    val.style.display = "none";
  });
  sectionUsuario.style.display = "block";
});

btnSideCriarClientes.addEventListener("click", () => {
  tdsSection.forEach((val) => {
    val.style.display = "none";
  });
  sectionClientes.style.display = "block";
  document.getElementById("sectionCriarClientes").scrollIntoView();
});

btnSideVerClientes.addEventListener("click", () => {
  tdsSection.forEach((val) => {
    val.style.display = "none";
  });
  sectionClientes.style.display = "block";
  document.getElementById("sectionVerClientes").scrollIntoView();
});

btnAcessoRapidoRegistarVenda.addEventListener("click", () => {
  btnSideRegistarVenda.click()
});
