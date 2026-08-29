import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { getTranslatedQuote } from '../services/phrase.js';
import accounts from "../services/auth.js";
import { BackButtonHeader } from "../components/backButtonHeader.jsx";
import { Mail, Lock, LogIn, Sparkles } from "lucide-react";
import "../styles/login.css";

export function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
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

        try {
            const data = await accounts.login({ username, password });
            if (!data.token) {
                throw new Error("Token não retornado pela API.");
            }
            navigate("/logged");
        } catch (err) {
            console.error("Erro no login:", err);
            if (err.response?.data?.message) {
                setError(err.response.data.message);
            } else if (err.message) {
                setError(err.message);
            } else {
                setError("Erro ao realizar login. Verifique suas credenciais.");
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="auth-page">
            <BackButtonHeader 
                title={<>Acesse sua <span className="highlight">conta</span> aqui!</>} 
                onBack={() => navigate("/")} 
            />

            <div className="auth-card-wrapper">
                <div className="auth-card">
                    {/* LADO DOURADO (Frase do dia) */}
                    <aside className="auth-quote-side">
                        <div className="quote-badge">
                            <Sparkles size={16} />
                            <span>Frase do dia</span>
                        </div>
                        <blockquote className="quote-content">
                            <p>"{dados.content}"</p>
                            {dados.author && <cite className="quote-author">— {dados.author}</cite>}
                        </blockquote>
                        <div className="auth-quote-footer">
                            <span>Não tem uma conta?</span>
                            <Link to="/cadastrate" className="quote-link">Cadastre-se aqui</Link>
                        </div>
                    </aside>

                    {/* LADO VERDE PROFUNDO (Formulário) */}
                    <section className="auth-form-side">
                        <h2 className="form-side-title">Bem-vindo de volta!</h2>
                        <p className="form-side-subtitle">Insira seus dados para gerenciar suas finanças</p>

                        <form onSubmit={handleSubmit} className="auth-form">
                            <div className="form-field-group">
                                <label htmlFor="username">Nome de usuário ou e-mail</label>
                                <div className="input-with-icon">
                                    <Mail size={18} className="input-icon" />
                                    <input 
                                        id="username" 
                                        type="email"
                                        placeholder="seuemail@exemplo.com" 
                                        value={username}
                                        onChange={(event) => setUsername(event.target.value)} 
                                        required 
                                    />
                                </div>
                            </div>

                            <div className="form-field-group">
                                <label htmlFor="senha">Senha de acesso</label>
                                <div className="input-with-icon">
                                    <Lock size={18} className="input-icon" />
                                    <input 
                                        id="senha" 
                                        type="password"
                                        placeholder="••••••••" 
                                        value={password}
                                        onChange={(event) => setPassword(event.target.value)} 
                                        required 
                                    />
                                </div>
                            </div>

                            {error && (
                                <div className="auth-error-box">
                                    <span>{error}</span>
                                </div>
                            )}

                            <button className="auth-submit-btn" type="submit" disabled={loading}>
                                <LogIn size={18} />
                                <span>{loading ? "Entrando..." : "Entrar"}</span>
                            </button>
                        </form>
                    </section>
                </div>
            </div>
        </div>
    );
}

export default Login;
