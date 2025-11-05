import re

# Atualizar Sidebar - remover "Meus Chamados" da seção tech e padronizar espaçamento
with open('frontend/src/components/layout/Sidebar.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Remover o link "Meus Chamados" da seção de técnicos
content = re.sub(
    r'(\{role === "tech" && \(\s*<>\s*<Link to="/tickets".*?</Link>)\s*<Link to="/my-tickets".*?Meus Chamados\s*</Link>',
    r'\1',
    content,
    flags=re.DOTALL
)

# Atualizar padding e gap
content = content.replace('className="d-flex flex-column vh-100 p-4"', 'className="d-flex flex-column vh-100"')
content = content.replace(
    'borderRight: "1px solid var(--magenta)",',
    'borderRight: "1px solid var(--magenta)",\n        padding: "1.5rem",\n        gap: "0.75rem"'
)
content = content.replace('mb-4">', 'style={{ marginBottom: "1.5rem" }}>')
content = content.replace(' p-2 mb-2 rounded', ' p-2 rounded')

with open('frontend/src/components/layout/Sidebar.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("✅ Sidebar atualizado")

# Atualizar Header - trocar botão por "Olá, [Nome]" para técnicos
with open('frontend/src/components/layout/Header.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Adicionar import useAppSelector
if 'useAppSelector' not in content:
    content = content.replace(
        'import "bootstrap/dist/css/bootstrap.min.css";',
        'import "bootstrap/dist/css/bootstrap.min.css";\nimport { useAppSelector } from "../../hooks/useRedux";'
    )

# Substituir a lógica do botão
old_button_section = '''  const handleNewTicket = () => {
    // Dispatch um evento customizado para a página capturar
    window.dispatchEvent(new CustomEvent('openNewTicketModal'));
  };

  return (
    <header
      className="d-flex align-items-center justify-content-between"
      style={{
        backgroundColor: headerBg,
        borderBottom: "1px solid var(--magenta)",
        height: "70px",
        padding: "0 2rem",
      }}
    >
      {/* Título da página */}
      <h4
        className="m-0"
        style={{
          color: "var(--branco)",
          fontFamily: "var(--font-principal)",
          fontWeight: "bold",
          fontSize: "1.5rem",
        }}
      >
        {pageTitle}
      </h4>

      {/* Botão Novo Chamado quando aplicável */}
      {showNewTicketButton && (
        <button
          onClick={handleNewTicket}
          className="d-flex align-items-center justify-content-center"
          style={{
            backgroundColor: "var(--magenta)",
            color: "var(--branco)",
            border: "none",
            borderRadius: "8px",
            padding: "10px 20px",
            fontFamily: "var(--font-secundaria)",
            fontWeight: 500,
            fontSize: "14px",
            cursor: "pointer",
            transition: "all 0.2s ease-in-out",
            boxShadow: "0 2px 8px rgba(230, 39, 248, 0.3)",
          }}
          onMouseOver={(e) =>
            (e.currentTarget.style.backgroundColor = "var(--cinza-azulado)")
          }
          onMouseOut={(e) =>
            (e.currentTarget.style.backgroundColor = "var(--magenta)")
          }
        >
          <Plus size={18} className="me-2" />
          Novo Chamado
        </button>
      )}
    </header>
  );'''

new_button_section = '''  const user = useAppSelector(s => s.auth.user);
  
  const handleNewTicket = () => {
    // Dispatch um evento customizado para a página capturar
    window.dispatchEvent(new CustomEvent('openNewTicketModal'));
  };

  return (
    <header
      className="d-flex align-items-center justify-content-between"
      style={{
        backgroundColor: headerBg,
        borderBottom: "1px solid var(--magenta)",
        height: "70px",
        padding: "0 2rem",
        gap: "1.5rem"
      }}
    >
      {/* Título da página */}
      <h4
        className="m-0"
        style={{
          color: "var(--branco)",
          fontFamily: "var(--font-principal)",
          fontWeight: "bold",
          fontSize: "1.5rem",
        }}
      >
        {pageTitle}
      </h4>

      {/* Botão Novo Chamado para usuários ou Olá para técnicos */}
      {role === "tech" ? (
        <span
          style={{
            color: "var(--branco)",
            fontFamily: "var(--font-secundaria)",
            fontSize: "1rem",
            fontWeight: 500,
          }}
        >
          Olá, {user?.name || "Técnico"}
        </span>
      ) : showNewTicketButton ? (
        <button
          onClick={handleNewTicket}
          className="d-flex align-items-center justify-content-center"
          style={{
            backgroundColor: "var(--magenta)",
            color: "var(--branco)",
            border: "none",
            borderRadius: "8px",
            padding: "10px 20px",
            fontFamily: "var(--font-secundaria)",
            fontWeight: 500,
            fontSize: "14px",
            cursor: "pointer",
            transition: "all 0.2s ease-in-out",
            boxShadow: "0 2px 8px rgba(230, 39, 248, 0.3)",
          }}
          onMouseOver={(e) =>
            (e.currentTarget.style.backgroundColor = "var(--cinza-azulado)")
          }
          onMouseOut={(e) =>
            (e.currentTarget.style.backgroundColor = "var(--magenta)")
          }
        >
          <Plus size={18} className="me-2" />
          Novo Chamado
        </button>
      ) : null}
    </header>
  );'''

content = content.replace(old_button_section, new_button_section)

with open('frontend/src/components/layout/Header.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("✅ Header atualizado")

# Atualizar DashboardLayout - fundo preto para técnicos
with open('frontend/src/components/layout/DashboardLayout.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(
    'return (\n    <div className="d-flex vh-100 bg-dark">',
    'const bgColor = role === "tech" ? "var(--preto)" : "var(--cinza-escuro)";\n\n  return (\n    <div className="d-flex vh-100" style={{ backgroundColor: bgColor }}>'
)

# Atualizar padding do main
content = content.replace(
    "style={{ padding: '2rem' }}",
    "style={{ padding: '2rem', backgroundColor: role === 'tech' ? 'var(--preto)' : 'transparent' }}"
)

with open('frontend/src/components/layout/DashboardLayout.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("✅ DashboardLayout atualizado")
