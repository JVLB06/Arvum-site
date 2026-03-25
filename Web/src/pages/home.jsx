import { Navbar } from "../components/navBar.jsx";
import "../styles/home.css";
import patinhas from "../assets/patinhas_sorrindo.png";
import { Link } from 'react-router-dom';

export function Home() {
  return (
    
    <div className="main">
        <Navbar>
            <button className="head_button"
                onClick={() =>
                document.getElementById("home").scrollIntoView({ behavior: "smooth" })}>
                <strong>Home</strong></button>
            <button className="head_button"
                onClick={() =>
                document.getElementById("sobre").scrollIntoView({ behavior: "smooth" })}>
            <strong>Sobre</strong></button>            
            <Link to="/login">
                <button className="head_button"><strong>Login</strong></button>
            </Link>
        </Navbar>
    <div className="corpo">
        <div className="superior">
            <div className="texto">
                <h1 id="home"></h1>
                <h2>Venha trabalhar com a Arvum, cadastre-se já e conheça um pouco mais sobre a gente</h2>
                <Link to="/cadastrate">
                    <button className="cadastre2"><strong>Cadastre-se</strong></button>
                </Link>
            </div>
            <div className="imagem">
                <img src={patinhas} alt="Tio patinhas"></img>
            </div>
        </div>
        <div className="inferior">
            <div className="sobre">
                <h1 id="sobre"></h1>
                <h1>Quem somos?</h1>
                <p>A Nome nasceu de...</p>
            </div>
        </div>
    </div>
    <footer>
        <div className="sugest">
            <h3>Nos dê sugestões</h3>
        </div>
        <div className="redes_sociais">
            <h3>Siga nossas redes sociais</h3>
        </div>
        <div className="sla">
            <h3>E eu sei lá</h3>
        </div>
    </footer>
    </div>
    );  
}