
// Evita que o formulário seja enviado de forma padrão (regarregar a página)

document.getElementById("loginForm").addEventListener("submit", function(e){
    e.preventDefault();

    //Pega os valores dos campos de nome e senha
    var name = document.getElementById("name").value;
    var password = document.getElementById("password").value;

    (async function(){
        try {

            // faz a requisição POST para o backend, enviando os dados de login
            var response = await fetch("http://localhost:3000/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ name: name, password: password })
            });

            // se a resposta não for OK, exibe mensagem de erro
            if (!response.ok) {
                alert("Usuário ou senha inválidos");
                return;
            }

            // converte a resposta JSON em objeto JavaScript
            var data = await response.json();

            // redireciona com base no papel do usuário
            if (data.role === "funcionario") {
                window.location.href = "pagina-funcionario.html";
            } else if (data.role === "tecnico") {
                window.location.href = "pagina-tecnico.html";
            }
        } catch (error) {
            // captura erros de rede ou outros problemas
            console.error("Erro ao conectar ao servidor:", error);
            alert("Erro ao conectar ao servidor");
        }
    })(); //Executa a função assíncrona imediatamente
});