// Função para iniciar o gif preloader e trancar a página enquanto a página carrega
/*window.onload = function() {
    // Inicia o gif preloader
    var preloader = document.getElementById("preloader");
    preloader.style.display = "block";
    // Oculta o gif preloader depois que a página é carregada
    window.setTimeout(function() {
        preloader.style.display = "none";
    }, 1000); // Tempo em milissegundos
};*/

// Inicia o gif preloader
var preloader = document.getElementById("preloader");
window.addEventListener("load", function() {
    setTimeout(()=>{
        preloader.style.display = "none";
    }, 3500)
});

/*// Função para simular a execução de uma tarefa demorada
function AbrirPreloader() {
    // Inicia o gif preloader
    var preloader = document.getElementById("preloader");
    preloader.style.display = "flex";
    // Simula uma tarefa demorada de 3 segundos
    setTimeout(function() {
        // Termina a tarefa e oculta o gif preloader
        preloader.style.display = "none";
        //alert("Minha função terminou de executar!");
    }, 3500);
}*/