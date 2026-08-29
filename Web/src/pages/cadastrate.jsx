import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { getTranslatedQuote } from '../services/phrase.js';
import accounts from "../services/auth.js";
import { BackButtonHeader } from "../components/backButtonHeader.jsx";
import { User, Mail, Calendar, Lock, UserPlus, Sparkles } from "lucide-react";
import "../styles/cadastrate.css";

export function Cadastrate() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [nasce, setNasce] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [dados, setDados] = useState({ content: "Carregando pensamento...", author: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
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

    if (password !== confirmPassword) {
      setError("As senhas informadas não coincidem.");
      setLoading(false);
      return;
    }

    try {
      await accounts.cadastrate({
        userName: username,
        email,
        birthDate: nasce,
        password,
      });

      alert("Cadastro realizado com sucesso! Faça login para continuar.");
      navigate("/login");
    } catch (err) {
      console.error("Erro no cadastro:", err);
      if (err.response?.data?.errors) {
        const mensagens = Object.values(err.response.data.errors).flat().join(" | ");
        setError(mensagens);
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError(err.message || "Erro ao realizar cadastro.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <BackButtonHeader
        title={<>Primeira vez? <span className="highlight">Cadastre-se</span> aqui!</>}
        onBack={() => navigate("/")}
      />

      <div className="auth-card-wrapper">
        <div className="register-card">
          {/* LADO VERDE PROFUNDO (Formulário) */}
          <section className="register-form-side">
            <h2 className="form-side-title">Crie sua conta</h2>
            <p className="form-side-subtitle">Preencha seus dados para começar a organizar seu dinheiro</p>

            <form onSubmit={handleSubmit} id="cadastrate-form" className="register-form">
              <div className="form-field-group">
                <label htmlFor="cadastro_nome">Qual o seu nome?</label>
                <div className="input-with-icon">
                  <User size={18} className="input-icon" />
                  <input
                    id="cadastro_nome"
                    type="text"
                    placeholder="Seu nome completo"
                    value={username}
                    onChange={(event) => setUsername(event.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-field-group">
                <label htmlFor="cadastro_email">Qual o seu melhor e-mail?</label>
                <div className="input-with-icon">
                  <Mail size={18} className="input-icon" />
                  <input
                    id="cadastro_email"
                    type="email"
                    placeholder="seuemail@exemplo.com"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-field-group">
                <label htmlFor="cadastro_nasce">Quando você nasceu?</label>
                <div className="input-with-icon">
                  <Calendar size={18} className="input-icon" />
                  <input
                    id="cadastro_nasce"
                    type="date"
                    value={nasce}
                    onChange={(event) => setNasce(event.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-field-group">
                <label htmlFor="cadastro_senha">Crie uma senha segura:</label>
                <div className="input-with-icon">
                  <Lock size={18} className="input-icon" />
                  <input
                    id="cadastro_senha"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-field-group">
                <label htmlFor="cadastro_confirma_senha">Confirme sua senha:</label>
                <div className="input-with-icon">
                  <Lock size={18} className="input-icon" />
                  <input
                    id="cadastro_confirma_senha"
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    required
                  />
                </div>
              </div>

              {error && (
                <div className="auth-error-box">
                  <span>{error}</span>
                </div>
              )}
            </form>
          </section>

          {/* LADO DOURADO (Frase do dia + Botão Cadastrar) */}
          <aside className="register-quote-side">
            <div className="quote-badge">
              <Sparkles size={16} />
              <span>Frase do dia</span>
            </div>

            <blockquote className="quote-content">
              <p>"{dados.content}"</p>
              {dados.author && <cite className="quote-author">— {dados.author}</cite>}
            </blockquote>

            <div className="register-action-wrapper">
              <button 
                type="submit" 
                form="cadastrate-form" 
                className="register-submit-btn" 
                disabled={loading}
              >
                <UserPlus size={18} />
                <span>{loading ? "Cadastrando..." : "Cadastrar"}</span>
              </button>

              <div className="register-login-link">
                <span>Já possui uma conta?</span>
                <Link to="/login" className="login-link-anchor">Faça login</Link>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

export default Cadastrate;