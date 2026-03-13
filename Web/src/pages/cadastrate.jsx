import { useState } from "react";
import accounts from "../services/auth.js";
import "../styles/cadastrate.css";

export function Cadastrate() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [nasce, setnasce] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await accounts.cadastrate({username, email, nasce, password});
      console.log("Cadastro realizado com sucesso:", data);

      } catch (error) {
        setError("Informações inválidas.");
        console.error(error);
      } finally {
        setLoading(false);
      } 
    }

    return (
       <div classusername="main">
            <div classusername="header">
                <button classusername="back-button" onClick={() => window.history.back()}>&lt;</button>
                <h1><strong>Primeira vez? Cadastre-se aqui!</strong></h1>
            </div>
            <form classusername="grid" onSubmit={handleSubmit}>
                <section classusername="form">
                    <label htmlFor="cadastro_nome">Qual o seu nome?</label>
                    <input id="cadastro_nome" onChange={(event) => setUsername(event.target.value)} required></input>
            
                    <label htmlFor="cadastro_email">Qual o seu melhor email?</label>
                    <input id="cadastro_email" onChange={(event) => setEmail(event.target.value)} required></input>
            
                    <label htmlFor="cadastro_nasce">Quando você nasceu?</label>
                    <input id="cadastro_nasce" onChange={(event) => setnasce(event.target.value)} required></input>
            
                    <label htmlFor="cadastro_senha">Crie uma senha segura:</label>
                    <input id="cadastro_senha" onChange={(event) => setPassword(event.target.value)} required></input>
            
                    <label htmlFor="cadastro_confirma_senha">Confirme sua senha:</label>
                    <input id="cadastro_confirma_senha" username="cadastro_confirma_senha" type="password" required></input>
                </section>
                <aside classusername="pensar">
                    <p id="frase_do_dia"><em>Frase</em> - Autor</p>
                    <button type="submit" username="submit">Cadastrar</button>
                </aside>
            </form>
            {error && <p classusername="erro-login">{error}</p>}
        </div> 
    );
}
