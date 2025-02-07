// Este arquivo será usado para monitoramento de vendas.

// Adicione aqui a lógica necessária para o monitoramento de vendas.

import { firebaseConfig } from "../logico/firebaseConfig.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-app.js";
import {
  getDatabase,
  ref,
  onValue,
} from "https://www.gstatic.com/firebasejs/9.14.0/firebase-database.js";
import { TipoMoeda } from "../saldo/tipoMoeda.js";

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
var usuarioEstabelecimento = window.localStorage.getItem(
  "usuarioEstabelecimento"
);

// Referência para o saldo retirado do caixa
const saldoSaidaRef = ref(
  db,
  "estabelecimentos/" + usuarioEstabelecimento + "/saldo/saida"
);

// Referência para o lucro total das vendas
const lucroTotalRef = ref(
  db,
  "estabelecimentos/" +
    usuarioEstabelecimento +
    "/vendas/lucroTotalVendas/lucroTotal"
);
const lucroLiquidoTotalVendasTxt = document.querySelector(
  ".lucroLiquidoTotalVendasTxt"
);

// Referência para o valor total de vendas
const valorTotalVendasRef = ref(
  db,
  "estabelecimentos/" +
    usuarioEstabelecimento +
    "/vendas/valorTotalVendas/valorTotal"
);
const totalVendasRef = ref(
  db,
  "estabelecimentos/" + usuarioEstabelecimento + "/vendas/todasVendas"
);
const valorMedioVendasTxt = document.querySelector(".valorMedioVendasTxt");

// Calcular o somatório de todo saldo retirado do caixa
onValue(saldoSaidaRef, (snapshot) => {
  let totalSaldoRetirado = 0;
  snapshot.forEach((childSnapshot) => {
    const saldo = childSnapshot.val();
    totalSaldoRetirado += parseFloat(saldo.saldoRetirado) || 0;
  });
});

// Calcular o lucro líquido
onValue(lucroTotalRef, (snapshot) => {
  const lucroTotal = parseFloat(snapshot.val()) || 0;

  onValue(saldoSaidaRef, (snapshot) => {
    let totalSaldoRetirado = 0;
    snapshot.forEach((childSnapshot) => {
      const saldo = childSnapshot.val();
      totalSaldoRetirado += parseFloat(saldo.saldoRetirado) || 0;
    });

    const lucroLiquido = lucroTotal - totalSaldoRetirado;
    if (lucroLiquidoTotalVendasTxt) {
      lucroLiquidoTotalVendasTxt.innerHTML =
        lucroLiquido.toFixed(2) + " " + TipoMoeda;
    }
  });
});

// Calcular o valor médio de vendas
onValue(valorTotalVendasRef, (snapshot) => {
  const valorTotalVendas = parseFloat(snapshot.val()) || 0;

  onValue(totalVendasRef, (snapshot) => {
    const totalVendas = snapshot.size || 0;
    const valorMedioVendas =
      totalVendas > 0 ? valorTotalVendas / totalVendas - 1 : 0;

    if (valorMedioVendasTxt) {
      valorMedioVendasTxt.innerHTML =
        valorMedioVendas.toFixed(2) + " " + TipoMoeda;
    }
  });
});

// Função para verificar se uma data é hoje
function isToday(dateString) {
  const today = new Date();
  const date = new Date(dateString);
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
}

// Pesquisar todas as vendas efetuadas hoje
onValue(totalVendasRef, (snapshot) => {
  const vendasHoje = [];

  snapshot.forEach((childSnapshot) => {
    const venda = childSnapshot.val();
    if (isToday(venda.horaActual)) {
      vendasHoje.push(venda);
    }
  });

});
