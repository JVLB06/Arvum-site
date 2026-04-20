import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getTranslatedQuote } from './services/phrase';
import accounts from "../services/auth.js";
import "../styles/login.css";

export function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const FraseDoDia = () => {
      const [dados, setDados] = useState({ content: "Carregando frase...", author: "" })};
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
    // Função interna para buscar os dados
    const buscarDados = async () => {
      const resultado = await getTranslatedQuote();
      setDados(resultado);
    };
      buscarDados();
    }, []);

    async function handleSubmit(event) {
      event.preventDefault();
      setError("");
      setLoading(true);

      try {
        const data = await accounts.login({ username, password });
        console.log("Login realizado com sucesso:", data);

        if (!data.access_token) {
          throw new Error("Token não retornado pela API.");
        }

        navigate("/logged");
      } catch (error) {
        console.error("Erro no login:", error);

        if (error.response) {
          setError(error.response.data?.message || "Erro ao realizar login.");
        } else {
          setError(error.message || "Erro ao realizar login.");
        }
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
            <p id="frase_do_dia">
              <em>{dados.content}</em> - {dados.author}
            </p>
          </aside>
          <section className="form">
            <label htmlFor="login_user">Email?</label>
            <input id="username" type="email"
                placeholder="Digite seu e-mail" value={username}
                onChange={(event) => setUsername(event.target.value)} required></input>
            <label htmlFor="login_senha">Insira sua senha:</label>
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
