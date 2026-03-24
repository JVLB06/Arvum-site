import { useState } from "react";
import accounts from "../services/auth.js";
import "../styles/cadastrate.css";

export function Cadastrate() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [nasce, setNasce] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
  event.preventDefault();
  setError("");
  setLoading(true);

  if (password !== confirmPassword) {
    setError("As senhas não coincidem.");
    setLoading(false);
    return;
  }

  try {
    const data = await accounts.cadastrate({
      username,
      email,
      nasce,
      password,
    });

    console.log("Cadastro realizado com sucesso:", data);
  } catch (error) {
    console.error("Erro completo:", error);
    console.error("error.response:", error.response);
    console.error("error.request:", error.request);
    console.error("error.message:", error.message);
    console.error("error.code:", error.code);

    if (error.response) {
      const data = error.response.data;

      if (data?.errors) {
        const mensagens = Object.values(data.errors).flat().join(" | ");
        setError(`Erro ${error.response.status}: ${mensagens}`);
      } else if (data?.message) {
        setError(`Erro ${error.response.status}: ${data.message}`);
      } else {
        setError(`Erro ${error.response.status}: ${JSON.stringify(data)}`);
      }
    } else if (error.request) {
      setError(
        `Sem resposta do servidor. Código: ${error.code || "N/A"} | Mensagem: ${error.message || "N/A"}`
      );
    } else {
      setError(`Erro interno no front: ${error.message}`);
    }
  } finally {
    setLoading(false);
  }
}

  return (
    <div className="main">
      <div className="header">
        <button
          className="back-button"
          onClick={() => window.history.back()}
          type="button"
        >
          &lt;
        </button>

        <h1>
          <strong>Primeira vez? Cadastre-se aqui!</strong>
        </h1>
      </div>

      <form className="grid" onSubmit={handleSubmit}>
        <section className="form">
          <label htmlFor="cadastro_nome">Qual o seu nome?</label>
          <input
            id="cadastro_nome"
            type="text"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            required
          />

          <label htmlFor="cadastro_email">Qual o seu melhor email?</label>
          <input
            id="cadastro_email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />

          <label htmlFor="cadastro_nasce">Quando você nasceu?</label>
          <input
            id="cadastro_nasce"
            type="date"
            value={nasce}
            onChange={(event) => setNasce(event.target.value)}
            required
          />

          <label htmlFor="cadastro_senha">Crie uma senha segura:</label>
          <input
            id="cadastro_senha"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />

          <label htmlFor="cadastro_confirma_senha">Confirme sua senha:</label>
          <input
            id="cadastro_confirma_senha"
            type="password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            required
          />
        </section>

        <aside className="pensar">
          <p id="frase_do_dia">
            <em>Frase</em> - Autor
          </p>
          <button type="submit" disabled={loading}>
            {loading ? "Cadastrando..." : "Cadastrar"}
          </button>
        </aside>
      </form>

      {error && <p className="erro-login">{error}</p>}
    </div>
  );
}