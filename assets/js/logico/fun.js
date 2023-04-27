document.addEventListener('keydown', function(event) {
    if (event.ctrlKey) {
      // exibir dados do usuário
      event.preventDefault()
    }
});

document.addEventListener('keydown', function(event) {
    if (event.key === 'F12') {
      event.preventDefault()
    }
});

//document.addEventListener('contextmenu', event => event.preventDefault());
  