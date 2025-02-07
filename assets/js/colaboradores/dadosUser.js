import { firebaseConfig } from "../logico/firebaseConfig.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-app.js";
import {
  getDatabase,
  set,
  ref,
  onValue,
} from "https://www.gstatic.com/firebasejs/9.14.0/firebase-database.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/9.14.0/firebase-auth.js";

var usuarioEstabelecimento = window.localStorage.getItem(
  "usuarioEstabelecimento"
);
var userCod = document.querySelector(".userCod");
var userNome = document.querySelector(".userNome");
var userEstabelecimento = document.querySelector(".userEstabelecimento");
var userCategoria = document.querySelector(".userCategoria");
var userEnder = document.querySelector(".userEnder");
var userTelefone = document.querySelector(".userTelefone");
var userMail = document.querySelector(".userMail");
var userLocalStorage = window.localStorage.getItem("user");
var novoUserNome = document.querySelector(".novoUserNome");
var novoUserSobreMim = document.querySelector(".novoUserSobreMim");
var novoUserEstabelecimento = document.querySelector(
  ".novoUserEstabelecimento"
);
var novoUserCategoria = document.querySelector(".novoUserCategoria");
var novoUserPais = document.querySelector(".novoUserPais");
var novoUserEndereco = document.querySelector(".novoUserEndereco");
var novoUserTelefone = document.querySelector(".novoUserTelefone");
var novoUserEmail = document.querySelector(".novoUserEmail");
var novoUserFace = document.querySelector(".novoUserFace");
var novoUserInsta = document.querySelector(".novoUserNInsta");
var novoUserLinkedin = document.querySelector(".novoUserLinkedin");
var sobreMim = document.querySelector(".sobreMim");
var userPais = document.querySelector(".userPais");
var userFace = document.querySelector(".userFace");
var userInsta = document.querySelector(".userInsta");
var userLinkedin = document.querySelector(".userLinkedin");
var btnSalvarUserAlteracoes = document.querySelector(
  ".btnSalvarUserAlteracoes"
);

var alertaInfo = document.querySelector(".alerta-info");
var alertaErro = document.querySelector(".alerta-erro");
var alertaSucesso = document.querySelector(".alerta-sucesso");

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth();

function AlertaSucesso(mensagem) {
  let info = document.createElement("p");
  info.style.margin = "0px";
  info.style.padding = "0px";
  info.innerHTML = mensagem;
  alertaSucesso.appendChild(info);
  alertaSucesso.style.display = "block";
  setTimeout(() => {
    alertaSucesso.style.display = "none";
    info.innerHTML = "";
  }, 2500);
}

function AlertaErro(mensagem) {
  let info = document.createElement("p");
  info.style.margin = "0px";
  info.style.padding = "0px";
  info.innerHTML = mensagem;
  alertaErro.appendChild(info);
  alertaErro.style.display = "block";
  setTimeout(() => {
    alertaErro.style.display = "none";
    info.innerHTML = "";
  }, 2500);
}

function AlertaInfo(mensagem) {
  let info = document.createElement("p");
  info.style.margin = "0px";
  info.style.padding = "0px";
  info.innerHTML = mensagem;
  alertaInfo.appendChild(info);
  alertaInfo.style.display = "block";
  setInterval(() => {
    alertaInfo.style.display = "none";
    info.innerHTML = "";
  }, 2500);
}

const starCountRef = ref(
  database,
  "estabelecimentos/" + usuarioEstabelecimento + "/users/" + userLocalStorage
);
onValue(starCountRef, (snapshot) => {
  const data = snapshot.val();

  userNome.innerHTML = data.nomeColab;
  novoUserNome.value = data.nomeColab;
  userEstabelecimento.innerHTML = data.usuarioEstabelecimento;
  novoUserEstabelecimento.value = data.usuarioEstabelecimento;
  userCategoria.innerHTML = data.catgColab;
  novoUserCategoria.value = data.catgColab;
  userEnder.innerHTML = data.enderColab;
  novoUserEndereco.value = data.enderColab;
  userTelefone.innerHTML = data.telColab;
  novoUserTelefone.value = data.telColab;
  userMail.innerHTML = data.emailColab;
  novoUserEmail.value = data.emailColab;
  sobreMim.innerHTML = data.userSobreMim;
  novoUserSobreMim.value = data.userSobreMim;
  userPais.innerHTML = data.userPais;
  novoUserPais.value = data.userPais;
  userFace.innerHTML = data.userFace;
  userInsta.innerHTML = data.userInsta;
  userLinkedin.innerHTML = data.userLinkdin;
});

btnSalvarUserAlteracoes.addEventListener("click", (e) => {
  function writeUserData(
    nomeColabo,
    enderColab,
    telColab,
    sobreMim,
    pais,
    userFace,
    userInsta,
    userLinkdin
  ) {
    const db = getDatabase();

    set(
      ref(
        db,
        "estabelecimentos/" +
          usuarioEstabelecimento +
          "/users/" +
          userLocalStorage
      ),
      {
        nomeColab: nomeColabo,
        enderColab: enderColab,
        telColab: telColab,
        userSobreMim: sobreMim,
        userPais: pais,
        userFace: userFace,
        userInsta: userInsta,
        userLinkdin: userLinkdin,
        usuarioEstabelecimento: novoUserEstabelecimento.value,
        emailColab: novoUserEmail.value,
        catgColab: novoUserCategoria.value,
      }
    );

    set(ref(db, "usuarios/" + userLocalStorage), {
      nomeColab: nomeColabo,
      enderColab: enderColab,
      telColab: telColab,
      userSobreMim: sobreMim,
      userPais: pais,
      userFace: userFace,
      userInsta: userInsta,
      userLinkdin: userLinkdin,
      usuarioEstabelecimento: novoUserEstabelecimento.value,
      emailColab: novoUserEmail.value,
      catgColab: novoUserCategoria.value,
    });

    AlertaSucesso("Informações alteradas com sucesso");

    /*createUserWithEmailAndPassword(auth, novoUserEmail.value, senha)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        usuarioId = user.uid;
        console.log(user.uid);
        set(
          ref(
            db,
            "estabelecimentos/" + usuarioEstabelecimento + "/users/" + usuarioId
          ),
          {
            nomeColab: nomeColab,
            enderColab: enderColab,
            telColab: telColab,
            userSobreMim: sobreMim,
            userPais: pais,
            userFace: userFace,
            userInsta: userInsta,
            userLinkdin: userLinkdin,
          }
        );

        set(ref(db, "usuarios/" + usuarioId), {
          nomeColab: nomeColab,
          enderColab: enderColab,
          telColab: telColab,
          userSobreMim: sobreMim,
          userPais: pais,
          userFace: userFace,
          userInsta: userInsta,
          userLinkdin: userLinkdin,
        });

        AlertaSucesso("usuario criado com sucesso");

        e.preventDefault();
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        // ..
        AlertaErro("Ocorreu um erro no processo de cadastro");
      });*/
  }

  try {
    if (
      novoUserNome.value != "" &&
      novoUserEndereco.value != "" &&
      novoUserSobreMim.value != "" &&
      novoUserPais.value != "" &&
      novoUserTelefone.value != "" &&
      novoUserFace.value != "" &&
      novoUserInsta.value != "" &&
      novoUserLinkedin.value != ""
    ) {
      writeUserData(
        novoUserNome.value,
        novoUserEndereco.value,
        novoUserTelefone.value,
        novoUserSobreMim.value,
        novoUserPais.value,
        novoUserFace.value,
        novoUserInsta.value,
        novoUserLinkedin.value
      );
    } else {
      AlertaInfo("Preencha todos os campos em branco por favor!");
    }
  } catch (error) {
    AlertaErro(
      "Ocorreu um erro no processo de cadastro contacte a equipe tecnica"
    );

    console.log(error);
  }

  return false;
});
