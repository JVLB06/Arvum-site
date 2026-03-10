import { Navbar } from "../components/navBar";
import "../styles/home.css";
import patinhas from "../assets/patinhas_sorrindo.png";

export function Home() {
  return (
    
    <div className="main">
        <Navbar>
            <button data-target="#home" className="head_button"><strong>Home</strong></button>
            <button data-target="#sobre" className="head_button"><strong>Sobre</strong></button>
            
        </Navbar>
    <div className="corpo">
        <div className="superior">
            <div className="texto">
                <h1 id="home"></h1>
                <h2>Venha trabalhar com a Arvum, cadastre-se já e conheça um pouco mais sobre a gente</h2>
                
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