import { initializeApp } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-app.js";
//import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { firebaseConfig } from "../logico/firebaseConfig.js";
import { AlertaSucesso, AlertaErro, AlertaInfo } from "../logico/alertas.js";
import {
  getDatabase,
  ref,
  onValue,
  set
} from "https://www.gstatic.com/firebasejs/9.14.0/firebase-database.js";


const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
//const auth = getAuth();
var usuarioEstabelecimento = window.localStorage.getItem(
  "usuarioEstabelecimento"
);
var dataActual = ""
var dataActualRef = ""
var horaActual = ""
var usuarioFecho = window.localStorage.getItem("nomeUser");
var btnRegistarRelatorioDia = document.querySelector(".btnRegistarRelatorioDia")

// Referência para todas as vendas do cliente Edma Julio
const todasVendasRef = ref(
  db,
  "estabelecimentos/" +
    usuarioEstabelecimento +
    "/vendas/todasVendas"
);

//Referencia dos dados da empresa
const dadosEmpresaRef = ref(
  db,
  "estabelecimentos/" +
    usuarioEstabelecimento +
    "/dadosEmpresa"
);

//Referencia de saldo de entrada
const saldoEntradaRef = ref(
  db,
  "estabelecimentos/" +
    usuarioEstabelecimento +
    "/saldo/entrada"
);

//Referencia de saldo de entrada
const saldoSaidaRef = ref(
  db,
  "estabelecimentos/" +
    usuarioEstabelecimento +
    "/saldo/saida"
);

//Referencia de saldo de entrada
const usuariosRef = ref(
  db,
  "estabelecimentos/" +
    usuarioEstabelecimento +
    "/users"
);


//Referencia de data cadastro do estabelecimento
const dataRegistoRef = ref(
  db,
  "estabelecimentos/" +
    usuarioEstabelecimento +
    "/dadosEmpresa/dataInscricao"
);


function calcularEstatisticas(numeros) {
  return numeros.reduce((acc, num) => {
      acc.soma += parseInt(num);
      acc.maior = Math.max(acc.maior, num);
      acc.menor = Math.min(acc.menor, num);
      return acc;
  }, { soma: 0, maior: -Infinity, menor: Infinity });

}


// Função para atualizar a data actual
var now = new Date();
dataActual =
  now.getDate() +
  "/" +
  (now.getMonth() + 1) +
  "/" +
  now.getFullYear();

dataActualRef =
  now.getDate() +
  "-" +
  (now.getMonth() + 1) +
  "-" +
  now.getFullYear();

horaActual = 
  now.getHours() +
  ":" +
  now.getMinutes() +
  ":" +
  now.getSeconds()

//Passando a localizacao, email e telefone do estabelecimento para as respectivas variaveis
onValue(dadosEmpresaRef, (snapshot) => {
  const data = snapshot.val();

  window.localStorage.setItem("localEstabelecimento", data.localizacaoEstabelecimento);
  window.localStorage.setItem("emailEstabelecimento", data.emailEstabelecimento);
  window.localStorage.setItem("telefoneEstabelecimento", data.telefoneEstabelecimento);
})

var localEstabelecimento = window.localStorage.getItem("localEstabelecimento");
var emailEstabelecimento = window.localStorage.getItem("emailEstabelecimento");
var telefoneEstabelecimento = window.localStorage.getItem("telefoneEstabelecimento");




function registarRelatoriosPreset(dataInscricao) {
  try {
    set(
      ref(
        db,
        "estabelecimentos/" +
          usuarioEstabelecimento +
          "/relatorios/" + dataInscricao
      ),
      {
        dadosFecho: {
          nomeEstabelecimento: "NOME DA EMPRESA",
          localizacaoEstabelecimento: "LOCALIZAÇÃO",
          emailEstabelecimento: "E-MAIL",
          telefoneEstabelecimento: "TELEFONE",
          responsavelFecho: "RESPONSAVEL DA OPERAÇÃO",
          dataFecho: dataInscricao,
          horaFecho: dataInscricao
        },
        vendas: {
          numerosVendas: 0,
          maiorValorVendido: 0,
          menorValorVendido: 0,
          mediaVendas: 0,
          totalVendas: 0,
          lucroTotalVendas: 0
        },
        metodosPagamento: {
          dinheiro: 0,
          cartaoCredito: 0,
          cartaoDebito: 0,
          credito: 0,
          mpesa: 0,
          mkesh: 0,
          emola: 0
        },
        fluxoCaixa: {
          totalMovimentacoesEntradaCaixa: 0,
          valorTotalEntradasCaixa: 0,
          maiorValorIntroduzidoCaixa: 0,
          menorValorIntroduzidoCaixa: 0,
          mediaValorIntroduzidoCaixa: 0,
          totalMovimentacoesSaidaCaixa: 0,
          valorTotalSaidaCaixa: 0,
          maiorValorRetiradoCaixa: 0,
          menorValorRetiradoCaixa: 0,
          mediaValoresRetiradoCaixa: 0,
          totalMovimentacoesCaixa: 0,
          valorTotalMovimentadoCaixa: 0
        },
        saldoCaixa:{
          saldoDia: 0,
        }
      }
    );
    
  } catch (error) {
    console.log(error)
  }
  
}


// Buscar a data de registo do estabelecimento
onValue(dataRegistoRef, (snapshot) => {
  let dado = snapshot.val();
  const dataInscricao = dado.replace(/\//g, "-")
  if (dataInscricao) {
    registarRelatoriosPreset(dataInscricao)
  }
},
{
  onlyOnce: true,
});

// Buscar e exibir as compras no console
onValue(todasVendasRef, (snapshot) => {
  let nrVendasDiarias = 0
  let totalLucroVendas = 0
  let todosLucrosVenda = []
  let nrEntradasCaixa = 0
  let nrSaidasCaixa = 0
  let saldoInicialDia = 0
  let valorTotalVendasDiarias = 0
  let nrTotalMetodoDinheiro = 0
  let todosValoresVenda = []
  let valorTotalSaldoAdicionado = 0
  let valorTotalSaldoRetirado = 0
  let todasMovimentacoesCaixa = 0
  let todoSaldoAdicionado = []
  let todoSaldoRetirado = []
  let nrTotalMetodoCartaoCredito = 0
  let nrTotalMetodoCartaoDebito = 0
  let nrTotalMetodoCredito = 0
  let nrTotalMetodoMpesa = 0
  let nrTotalMetodoEmola = 0
  let nrTotalMetodoMkesh = 0


  snapshot.forEach((childSnapshot) => {
    const compra = childSnapshot.val();
    
    let horaActual = compra.horaActual
    if (compra.horaActual) {
        let data = horaActual.split(" - ")[1] 
    
        if (data == dataActual) {
            nrVendasDiarias ++
            valorTotalVendasDiarias = valorTotalVendasDiarias + compra.precoTotalVenda
            let todosValores = compra.precoTotalVenda
            let lucrosVendaTotal = compra.lucroVenda.lucroVenda
            todosLucrosVenda.push(lucrosVendaTotal)
            todosValoresVenda.push(todosValores)

            let metodoPagamento = compra.metodoPagamento
    
            if (Object.keys(metodoPagamento)[0] == "Dinheiro") {
                nrTotalMetodoDinheiro ++
            }

            if (Object.keys(metodoPagamento)[0] == "Cartão de Crédito") {
              nrTotalMetodoCartaoCredito ++
            }

            if (Object.keys(metodoPagamento)[0] == "Cartão de débito") {
              nrTotalMetodoCartaoDebito ++
            }

            if (Object.keys(metodoPagamento)[0] == "Crédito (Dívida)") {
              nrTotalMetodoCredito ++
            }

            if (Object.keys(metodoPagamento)[0] == "eMola") {
              nrTotalMetodoEmola ++
            }

            if (Object.keys(metodoPagamento)[0] == "mKesh") {
              nrTotalMetodoMkesh ++
            }

            if (Object.keys(metodoPagamento)[0] == "m-Pesa") {
              nrTotalMetodoMpesa ++
            }
            /*let metodos = compra.metodoPagamento
            metodos.forEach((childSnapshot) => {
                console.log(childSnapshot);
            })*/
    
    
        }else{
        }
    }
  });

  // Buscar e exibir as compras no console
  onValue(saldoEntradaRef, (snapshot) => {
  

    snapshot.forEach((childSnapshot) => {
      const saldoEntrada = childSnapshot.val();
      let horaActualEntradas = saldoEntrada.horaActual

      if (saldoEntrada.horaActual) {
        let dataEntrada = horaActualEntradas.split(" - ")[1] 

        if (dataEntrada == dataActual) {
          todoSaldoAdicionado.push(saldoEntrada.saldoAdicionado)
          
        }
      }
    })
  })

  // Buscar e exibir as compras no console
  onValue(saldoSaidaRef, (snapshot) => {
  

    snapshot.forEach((childSnapshot) => {
      const saldoSaida = childSnapshot.val();
      let horaActualSaida = saldoSaida.horaActual

      if (saldoSaida.horaActual) {
        let dataEntrada = horaActualSaida.split(" - ")[1] 

        if (dataEntrada == dataActual) {
          todoSaldoRetirado.push(saldoSaida.saldoRetirado)
          
        }
      }
    })
  })

  
  let estatisticasLucroVenda = calcularEstatisticas(todosLucrosVenda)

  let estatisticas = calcularEstatisticas(todosValoresVenda);
  estatisticas.media = (estatisticas.maior == -Infinity ? 0 : estatisticas.soma  / nrVendasDiarias);
  
  let estatisticasSaldoEntrada = calcularEstatisticas(todoSaldoAdicionado);
  nrEntradasCaixa = todoSaldoAdicionado.length == undefined ? 0 : todoSaldoAdicionado.length
  estatisticasSaldoEntrada.media = (estatisticasSaldoEntrada.maior == -Infinity ? 0 : estatisticasSaldoEntrada.soma / nrEntradasCaixa) ;
  
  let estatisticasSaldoSaida = calcularEstatisticas(todoSaldoRetirado);
  nrSaidasCaixa = todoSaldoRetirado.length == undefined ? 0 : todoSaldoRetirado.length
  estatisticasSaldoSaida.media = (estatisticasSaldoSaida.maior == -Infinity ? 0 : estatisticasSaldoSaida.soma / nrSaidasCaixa) ;


  


  btnRegistarRelatorioDia.addEventListener("click", ()=>{
    // verificando se o usuario e adm
    onValue(usuariosRef, (snapshot) => {
      let cargo = ""

      function registarRelatoriosDoDia() {
        try {
          set(
            ref(
              db,
              "estabelecimentos/" +
                usuarioEstabelecimento +
                "/relatorios/" + dataActualRef
            ),
            {
              dadosFecho: {
                nomeEstabelecimento: usuarioEstabelecimento,
                localizacaoEstabelecimento: localEstabelecimento,
                emailEstabelecimento: emailEstabelecimento,
                telefoneEstabelecimento: telefoneEstabelecimento,
                responsavelFecho: usuarioFecho,
                dataFecho: dataActual,
                horaFecho: horaActual
              },
              vendas: {
                numerosVendas: nrVendasDiarias,
                maiorValorVendido: (estatisticas.maior == -Infinity ? 0 : estatisticas.maior),
                menorValorVendido: (estatisticas.menor == Infinity ? 0 : estatisticas.menor),
                mediaVendas: (estatisticas.media).toFixed(2),
                totalVendas: estatisticas.soma,
                lucroTotalVendas: estatisticasLucroVenda.soma
              },
              metodosPagamento: {
                dinheiro: nrTotalMetodoDinheiro,
                cartaoCredito: nrTotalMetodoCartaoCredito,
                cartaoDebito: nrTotalMetodoCartaoDebito,
                credito: nrTotalMetodoCredito,
                mpesa: nrTotalMetodoMpesa,
                mkesh: nrTotalMetodoMkesh,
                emola: nrTotalMetodoEmola
              },
              fluxoCaixa: {
                totalMovimentacoesEntradaCaixa: nrEntradasCaixa,
                valorTotalEntradasCaixa: (estatisticasSaldoEntrada.soma ? estatisticasSaldoEntrada.soma : 0),
                maiorValorIntroduzidoCaixa: (estatisticasSaldoEntrada.maior == -Infinity ? 0 : estatisticasSaldoEntrada.maior),
                menorValorIntroduzidoCaixa: (estatisticasSaldoEntrada.menor == Infinity ? 0 : estatisticasSaldoEntrada.menor),
                mediaValorIntroduzidoCaixa: (estatisticasSaldoEntrada.media).toFixed(2),
                totalMovimentacoesSaidaCaixa: nrSaidasCaixa,
                valorTotalSaidaCaixa: (estatisticasSaldoSaida.soma ? estatisticasSaldoSaida.soma : 0),
                maiorValorRetiradoCaixa: (estatisticasSaldoSaida.maior == -Infinity ? 0 : estatisticasSaldoSaida.maior),
                menorValorRetiradoCaixa: (estatisticasSaldoSaida.menor == Infinity ? 0 : estatisticasSaldoSaida.menor),
                mediaValoresRetiradoCaixa: (estatisticasSaldoSaida.media).toFixed(2),
                totalMovimentacoesCaixa: nrEntradasCaixa + nrSaidasCaixa,
                valorTotalMovimentadoCaixa: (estatisticasSaldoEntrada.soma ? estatisticasSaldoEntrada.soma : 0) + (estatisticasSaldoSaida.soma ? estatisticasSaldoSaida.soma : 0)
              },
              saldoCaixa:{
                saldoDia: (valorTotalVendasDiarias + (estatisticasSaldoEntrada.soma ? estatisticasSaldoEntrada.soma : 0)) - (estatisticasSaldoSaida.soma ? estatisticasSaldoSaida.soma : 0),
              }
            }
          );
          
          AlertaSucesso("relatorio registado com sucesso")
        } catch (error) {
          console.log(error)
        }
        
      }

      //registarRelatoriosDoDia()

      snapshot.forEach((childSnapshot) => {
        const usuarios = childSnapshot.val();

        if (usuarioFecho == usuarios.nomeColab) {
          if (usuarios.catgColab == "Administrador" || "Gerente") {

            try {
              onValue(ref(
                db,
                "estabelecimentos/" +
                  usuarioEstabelecimento +
                  "/relatorios"
              ), (snapshot) => {
  
                snapshot.forEach((childSnapshot) => {
                  const relatorios = childSnapshot.val();
                  let dataDoFecho  = relatorios.dadosFecho.dataFecho

                  if (dataDoFecho) {
                    if (dataDoFecho != dataActual) {
                      registarRelatoriosDoDia()
                    } else {
                      AlertaInfo("Ja existe um relatorio para a data de hoje")
                    }
                  } else {
                    //registarRelatoriosDoDia()
                  }
                })
  
              },
              {
                onlyOnce: true,
              });
              
            } catch (error) {
              console.log(error)
            }
          } else {
            AlertaErro("Não está autorizado a realizar esta operação")
          }
        }
      })
    },
    {
      onlyOnce: true,
    });

  })
  
  /*console.log(
    'Nome do estabelecimento: ' + usuarioEstabelecimento + 
    '      Localizacao do estabelecimento: ' + localEstabelecimento + 
    '      Email: ' + emailEstabelecimento + 
    '      Telefone: ' + telefoneEstabelecimento + 
    "      Usuario que realizou o fecho: " + usuarioFecho +
    '      data e data do fecho: ' + dataActual + " - " + horaActual + 
    "      Numero total de vendas: " + nrVendasDiarias  + 
    '      Maior valor vendido: ' + (estatisticas.maior == -Infinity ? 0 : estatisticas.maior) + 
    '      Menor valor vendido: ' + (estatisticas.menor == Infinity ? 0 : estatisticas.menor) + 
    '      media de vendas: ' + (estatisticas.media).toFixed(2) + 
    '      Total vendas: ' + estatisticas.soma +  
    '      Lucro das vendas: ' + estatisticasLucroVenda.soma + 
    '      Total de movimentacoes de entrada no caixa: ' + nrEntradasCaixa  + 
    '      Valor total de entradas no caixa: ' + (estatisticasSaldoEntrada.soma ? estatisticasSaldoEntrada.soma : 0) + 
    '      Maior valor introduzido no caixa: ' + (estatisticasSaldoEntrada.maior == -Infinity ? 0 : estatisticasSaldoEntrada.maior) +  
    '      Menor valor introduzido no caixa: ' + (estatisticasSaldoEntrada.menor == Infinity ? 0 : estatisticasSaldoEntrada.menor)  +  
    '      Media dos valores introduzidos no caixa: ' + (estatisticasSaldoEntrada.media).toFixed(2)  + 
    '      Total de movimentacoes de saida no caixa: ' + nrSaidasCaixa  + 
    '      Valor total de saidas no caixa: ' + (estatisticasSaldoSaida.soma ? estatisticasSaldoSaida.soma : 0)   + 
    '      Maior valor retirado no caixa: ' + (estatisticasSaldoSaida.maior == -Infinity ? 0 : estatisticasSaldoSaida.maior)  +  
    '      Menor valor retirados no caixa: ' + (estatisticasSaldoSaida.menor == Infinity ? 0 : estatisticasSaldoSaida.menor)  +  
    '      Media dos valores iretirados no caixa: ' + (estatisticasSaldoSaida.media).toFixed(2)  
  )*/


  /*console.log(estatisticas); // { soma: 80, maior: 30, menor: 5, media: 16 }

  todosValoresVenda.sort((a, b) => a - b);
  todosValoresVenda.reverse()
  console.log("Maior valor vendido do dia: " + todosValoresVenda[0]);*/
},
{
  onlyOnce: false,
});












/*import { initializeApp } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-app.js";
import { firebaseConfig } from "../logico/firebaseConfig.js";
import {
  getDatabase,
  ref,
  onValue,
  query,
  orderByChild,
  equalTo,
} from "https://www.gstatic.com/firebasejs/9.14.0/firebase-database.js";

// Constantes para configuração
const STORAGE_KEYS = {
  ESTABELECIMENTO: "usuarioEstabelecimento",
  USUARIO: "nomeUser",
  LOCAL: "localEstabelecimento",
  EMAIL: "emailEstabelecimento",
  TELEFONE: "telefoneEstabelecimento",
};

class RelatorioDiario {
  constructor() {
    this.initFirebase();
    this.dataAtual = this.obterDataAtual();
    this.horaAtual = this.obterHoraAtual();
    this.dadosEstabelecimento = this.carregarDadosEstabelecimento();
  }

  initFirebase() {
    try {
      const app = initializeApp(firebaseConfig);
      this.db = getDatabase(app);
    } catch (error) {
      this.registrarErro("Erro ao inicializar Firebase", error);
    }
  }

  registrarErro(mensagem, erro) {
    console.error(`${mensagem}: `, erro);
    // Opcional: Implementar log de erros em serviço externo
  }

  obterDataAtual() {
    const now = new Date();
    return `${now.getDate()}/${now.getMonth() + 1}/${now.getFullYear()}`;
  }

  obterHoraAtual() {
    const now = new Date();
    return `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
  }

  carregarDadosEstabelecimento() {
    try {
      return {
        nome: localStorage.getItem(STORAGE_KEYS.ESTABELECIMENTO),
        local: localStorage.getItem(STORAGE_KEYS.LOCAL),
        email: localStorage.getItem(STORAGE_KEYS.EMAIL),
        telefone: localStorage.getItem(STORAGE_KEYS.TELEFONE),
        usuarioFecho: localStorage.getItem(STORAGE_KEYS.USUARIO),
      };
    } catch (error) {
      this.registrarErro("Erro ao carregar dados do estabelecimento", error);
      return {};
    }
  }

  calcularEstatisticas(numeros) {
    if (!numeros || numeros.length === 0) return null;

    return numeros.reduce(
      (acc, num) => {
        acc.soma += num;
        acc.maior = Math.max(acc.maior, num);
        acc.menor = Math.min(acc.menor, num);
        return acc;
      },
      { soma: 0, maior: -Infinity, menor: Infinity, media: 0 }
    );
  }

  processarVendasDiarias() {
    const vendasRef = ref(
      this.db,
      `estabelecimentos/${this.dadosEstabelecimento.nome}/vendas/todasVendas`
    );

    onValue(
      vendasRef,
      (snapshot) => {
        const vendasDoDia = [];

        snapshot.forEach((childSnapshot) => {
          const venda = childSnapshot.val();
          if (this.validarVendaDoDia(venda)) {
            vendasDoDia.push(venda);
          }
        });

        this.gerarRelatorioDiario(vendasDoDia);
      },
      (error) => {
        this.registrarErro("Erro ao processar vendas", error);
      }
    );
  }

  validarVendaDoDia(venda) {
    return (
      venda.horaActual && venda.horaActual.split(" - ")[1] === this.dataAtual
    );
  }

  gerarRelatorioDiario(vendasDoDia) {
    const estatisticasVendas = this.calcularEstatisticas(
      vendasDoDia.map((venda) => venda.precoTotalVenda)
    );

    console.log("Relatório Diário", {
      estabelecimento: this.dadosEstabelecimento,
      dataHora: `${this.dataAtual} - ${this.horaAtual}`,
      totalVendas: vendasDoDia.length,
      estatisticasVendas,
    });
  }

  iniciar() {
    this.processarVendasDiarias();
  }
}

// Inicialização
document.addEventListener("DOMContentLoaded", () => {
  const relatorioDiario = new RelatorioDiario();
  relatorioDiario.iniciar();
});
*/
