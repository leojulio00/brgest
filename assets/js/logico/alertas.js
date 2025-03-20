var alertaInfo = document.querySelector(".alerta-info");
var alertaErro = document.querySelector(".alerta-erro");
var alertaSucesso = document.querySelector(".alerta-sucesso");

export function AlertaSucesso(mensagem) {
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
  
export function AlertaErro(mensagem) {
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
  
export function AlertaInfo(mensagem) {
    let info = document.createElement("p");
    info.style.margin = "0px";
    info.style.padding = "0px";
    info.innerHTML = mensagem;
    alertaInfo.appendChild(info);
    alertaInfo.style.display = "block";
    alertaInfo.style.zIndex = "1000"
    setTimeout(() => {
      alertaInfo.style.display = "none";
      info.innerHTML = "";
    }, 2500);
}