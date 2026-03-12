import { useState } from "react";
import accounts from "../services/auth.js";
import "../styles/login.css";

export function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await accounts.login({email, password});
      console.log("Login realizado com sucesso:", data);

      } catch (error) {
        setError("E-mail ou senha inválidos.");
        console.error(error);
      } finally {
        setLoading(false);
      } 
    }
    return (
      <div className="main">
        <div className="header">
          <button className="back-button" onClick={() => window.history.back()}>&lt;</button>
          <h1><strong>Acesse sua conta aqui!</strong></h1>
        </div>
        <form className="grid" onSubmit={handleSubmit}>
          <aside className="pensar">
            <p id="frase_do_dia"><em>Frase</em> - Autor</p>
          </aside>
          <section className="form">
            <label htmlFor="login_user">Email?</label>
            <input id="email" type="email"
                placeholder="Digite seu e-mail" value={email}
                onChange={(event) => setEmail(event.target.value)} required></input>
            <label htmlFor="login_senha">Confirme sua senha:</label>
            <input id="senha" type="password"
                  placeholder="Digite sua senha" value={password}
                  onChange={(event) => setPassword(event.target.value)} required></input>
            <button className="login-button" type="submit" disabled={loading}>
              {loading ? "Entrando..." : "Entrar"}
            </button>
          </section>
        </form>
        {error && <p className="erro-login">{error}</p>}
      </div>
    );
}
