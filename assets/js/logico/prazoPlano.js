import { firebaseConfig } from "./firebaseConfig.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-app.js";
import {
  getDatabase,
  ref,
  onValue,
  set,
} from "https://www.gstatic.com/firebasejs/9.14.0/firebase-database.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/9.14.0/firebase-auth.js";

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
var usuarioEstabelecimento = window.localStorage.getItem(
  "usuarioEstabelecimento"
);

let tdsSection = document.querySelectorAll(".tdsSection");
var alertaInfo = document.querySelector(".alerta-info");
var sectionPrazoPlano = document.querySelector(".sectionPrazoPlano");
var dataInscricao = "";
var dataInscricaoo = "";
var nomePlano = "";

const dbRef = ref(
  db,
  "estabelecimentos/" + usuarioEstabelecimento + "/dadosEmpresa"
);

function AlertaInfo(mensagem) {
  let info = document.createElement("p");
  info.style.margin = "0px";
  info.style.padding = "0px";
  info.innerHTML = mensagem;
  alertaInfo.appendChild(info);
  alertaInfo.style.display = "block";
}

onValue(
  dbRef,
  (snapshot) => {
    const data = snapshot.val();
    dataInscricaoo = data.dataInscricao;
    nomePlano = data.plano;
    dataInscricao = dataInscricaoo;

    InserirData();
  },
  {
    onlyOnce: true,
  }
);

function InserirData() {
  // Melhoria: Objeto com duração dos planos
  const DURACAO_PLANOS = {
    mensal: 30,
    semestral: 183,
    anual: 365,
  };

  // Melhoria: Validação da data de início
  if (!dataInscricao) {
    console.error("Data de inscrição não encontrada");
    return;
  }

  // Obtém a duração do plano
  const duracaoPlano = DURACAO_PLANOS[nomePlano] || 30; // default para mensal

  // Converte a data de início para objeto Date
  const [dia, mes, ano] = dataInscricao.split("/");
  const dataInicioObj = new Date(ano, mes - 1, dia);

  // Calcula data de término
  const dataFim = new Date(dataInicioObj);
  dataFim.setDate(dataFim.getDate() + duracaoPlano);

  // Calcula dias restantes
  const hoje = new Date();
  const diferencaDias = Math.ceil((dataFim - hoje) / (1000 * 60 * 60 * 24));

  // Formata data para armazenamento
  const dataFimFormatada = `${dataFim.getDate()}/${
    dataFim.getMonth() + 1
  }/${dataFim.getFullYear()}`;

  // Atualiza validade no Firebase
  set(
    ref(
      db,
      "estabelecimentos/" +
        usuarioEstabelecimento +
        "/dadosEmpresa/validadePlano"
    ),
    dataFimFormatada
  );

  // Verifica estado do plano
  if (diferencaDias <= 0) {
    // Plano expirado
    set(
      ref(
        db,
        "estabelecimentos/" +
          usuarioEstabelecimento +
          "/dadosEmpresa/estadoPlano"
      ),
      false
    );
    console.log(
      `Atenção! Seu plano ${nomePlano} está prestes a expirar em ${diferencaDias} dias.`
    );
    enviarEmailExpirado();
    bloquearAcesso();
  } else if (diferencaDias <= 3) {
    // Plano próximo de expirar
    AlertaInfo(
      `Atenção! Seu plano ${nomePlano} está prestes a expirar em ${diferencaDias} dias.`
    );
    console.log(
      `Atenção! Seu plano ${nomePlano} está prestes a expirar em ${diferencaDias} dias.`
    );
    enviarEmailAlerta(diferencaDias);
  }
}

// Nova função para enviar email de alerta
function enviarEmailAlerta(diasRestantes) {
  const emailRef = ref(
    db,
    "estabelecimentos/" + usuarioEstabelecimento + "/dadosEmpresa/email"
  );

  onValue(
    emailRef,
    (snapshot) => {
      const emailUsuario = snapshot.val();
      // Aqui você pode implementar o envio de email usando seu serviço preferido
      // Exemplo com EmailJS ou similar
      // emailjs.send("service_id", "template_id", {
      //     email: emailUsuario,
      //     dias: diasRestantes,
      //     plano: nomePlano
      // });
    },
    {
      onlyOnce: true,
    }
  );
}

// Nova função para enviar email de plano expirado
function enviarEmailExpirado() {
  const emailRef = ref(
    db,
    "estabelecimentos/" + usuarioEstabelecimento + "/dadosEmpresa/email"
  );

  onValue(
    emailRef,
    (snapshot) => {
      const emailUsuario = snapshot.val();
      // Implementar envio de email de expiração
    },
    {
      onlyOnce: true,
    }
  );
}

// Nova função para bloquear acesso
function bloquearAcesso() {
  // Esconde todas as seções
  tdsSection.forEach((section) => {
    section.style.display = "none";
  });

  // Mostra apenas a seção de prazo do plano
  sectionPrazoPlano.style.display = "block";

  // Redireciona para página de renovação ou mostra modal
  // window.location.href = '/renovacao.html';
}

// Melhoria: Adicionar listener para mudanças no estado do plano
onValue(
  ref(
    db,
    "estabelecimentos/" + usuarioEstabelecimento + "/dadosEmpresa/estadoPlano"
  ),
  (snapshot) => {
    const estadoPlano = snapshot.val();

    if (!estadoPlano) {
      //bloquearAcesso();
    } else {
      sectionPrazoPlano.style.display = "none";
    }
  }
);
