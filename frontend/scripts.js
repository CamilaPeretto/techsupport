const API_URL = "http://localhost:3000"; // URL do backend

// ------------------ LOGIN ------------------
document.addEventListener("DOMContentLoaded", () => {
  const formLogin = document.getElementById("loginForm");

  if (formLogin) {
    console.log("🟢 Página de login detectada.");

    formLogin.addEventListener("submit", async (event) => {
      event.preventDefault();

      const name = document.getElementById("name").value;
      const password = document.getElementById("password").value;

      try {
        const resposta = await fetch(`${API_URL}/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, password })
        });

        const resultado = await resposta.json();

        if (!resposta.ok) {
          alert(resultado.message || "Usuário ou senha inválidos.");
          return;
        }

        console.log("✅ Login bem-sucedido:", resultado);

        // Redireciona conforme o papel
       if (resultado.role.toLowerCase() === "tecnico" || resultado.role.toLowerCase() === "técnico") {
  window.location.href = "pagina-tecnico.html";
} else if (resultado.role.toLowerCase() === "funcionario" || resultado.role.toLowerCase() === "funcionário") {
  window.location.href = "pagina-funcionario.html";
} else {
  alert("Tipo de usuário desconhecido.");
}

      } catch (error) {
        console.error("Erro ao fazer login:", error);
        alert("Erro na conexão com o servidor.");
      }
    });
  }

  // ------------------ LISTAGEM DE TICKETS (página técnico) ------------------
  const corpoTabela = document.getElementById("ticketsBody");

  if (corpoTabela) {
    console.log("🟡 Página de técnico detectada.");
    carregarTickets();
  }

  // ------------------ CRIAÇÃO DE USUÁRIO ------------------
  const formUsuario = document.getElementById("formUsuario");

  if (formUsuario) {
    console.log("🔵 Página de cadastro detectada.");

    formUsuario.addEventListener("submit", async (event) => {
      event.preventDefault();

      const nome = document.getElementById("nomeUsuario").value;
      const senha = document.getElementById("senhaUsuario").value;
      const role = document.getElementById("roleUsuario").value;

      try {
        const resposta = await fetch(`${API_URL}/user`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: nome, password: senha, role })
        });

        const resultado = await resposta.json();

        if (resposta.ok) {
          alert("Usuário criado com sucesso!");
          formUsuario.reset();
        } else {
          alert("Erro ao criar usuário: " + resultado.message);
        }
      } catch (error) {
        console.error("Erro ao criar usuário:", error);
        alert("Erro ao criar usuário.");
      }
    });
  }
});

// ------------------ FUNÇÕES GERAIS ------------------

// Carregar tickets
async function carregarTickets() {
  try {
    const resposta = await fetch(`${API_URL}/tecnico/tickets`);
    const tickets = await resposta.json();
    exibirTickets(tickets);
  } catch (error) {
    console.error("Erro ao carregar tickets:", error);
  }
}

// Exibir tickets
function exibirTickets(tickets) {
  const corpoTabela = document.getElementById("ticketsBody");
  if (!corpoTabela) return;

  corpoTabela.innerHTML = "";

  tickets.forEach(ticket => {
    const linha = document.createElement("tr");

    linha.innerHTML = `
      <td>${ticket.title}</td>
      <td>${ticket.description}</td>
      <td>${ticket.status}</td>
      <td>
        <select id="status-${ticket._id}">
          <option value="aberto" ${ticket.status === "aberto" ? "selected" : ""}>Aberto</option>
          <option value="em andamento" ${ticket.status === "em andamento" ? "selected" : ""}>Em andamento</option>
          <option value="concluído" ${ticket.status === "concluído" ? "selected" : ""}>Concluído</option>
        </select>
        <button onclick="atualizarStatus('${ticket._id}')">Salvar</button>
      </td>
    `;

    corpoTabela.appendChild(linha);
  });
}

// Atualizar status
async function atualizarStatus(id) {
  const novoStatus = document.getElementById(`status-${id}`).value;

  try {
    const resposta = await fetch(`${API_URL}/ticket/${id}/status`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: novoStatus })
    });

    const resultado = await resposta.json();

    if (resposta.ok) {
      alert("Status atualizado com sucesso!");
      carregarTickets();
    } else {
      alert("Erro ao atualizar: " + resultado.message);
    }
  } catch (error) {
    console.error("Erro na atualização:", error);
    alert("Erro ao atualizar status.");
  }
}
