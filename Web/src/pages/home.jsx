import { Navbar } from "../components/navBar";
import "./syles/home.css";
import patinhas from "../assets/patinhas_sorrindo.png";

export function Home() {
  return (
    
    <div className="main">
        <Navbar>
            <button data-target="#home" class="head_button"><strong>Home</strong></button>
            <button data-target="#sobre" class="head_button"><strong>Sobre</strong></button>
            <a href="{{ url('/login') }}"><button class="head_button"><strong>Login</strong></button></a>
            <a href="{{ url('/cadastro') }}"><button class="cadastre"><strong>Cadastre-se</strong></button></a>
        </Navbar>
    <div className="corpo">
        <div class="superior">
            <div class="texto">
                <h1 id="home"></h1>
                <h2>Venha trabalhar com a Arvum, cadastre-se já e conheça um pouco mais sobre a gente</h2>
                <a href="{{ url('/cadastro') }}"><button class="cadastre2"><strong>Cadastre-se</strong></button></a>
            </div>
            <div class="imagem">
                <img src="./assets/patinhas_sorrindo.png" alt="Tio patinhas"></img>
            </div>
        </div>
        <div class="inferior">
            <div class="sobre">
                <h1 id="sobre"></h1>
                <h1>Quem somos?</h1>
                <p>A Nome nasceu de...</p>
            </div>
        </div>
    </div>
    <footer>
        <div class="sugest">
            <h3>Nos dê sugestões</h3>
        </div>
        <div class="redes_sociais">
            <h3>Siga nossas redes sociais</h3>
        </div>
        <div class="sla">
            <h3>E eu sei lá</h3>
        </div>
    </footer>
    </div>
    );  
}