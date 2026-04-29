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
    <main>
        <div className="superior">
            <div className="texto">
                <h1 id="home"></h1>
                <h2>Dê o próximo passo para uma vida financeira mais inteligente! Cadastre-se hoje!</h2>
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
                <p>
                    A Arvum nasceu com o propósito de ajudar os brasileiros a conquistarem uma vida financeira mais organizada e equilibrada. Em um cenário marcado por constantes variações econômicas, identificamos a dificuldade de muitas pessoas em gerenciar seus recursos e evoluir financeiramente de forma consistente.
                </p>

                <p>
                    Diante desse contexto, desenvolvemos uma plataforma pensada para simplificar a gestão financeira no dia a dia. A Arvum atende diferentes perfis, oferecendo ferramentas intuitivas que auxiliam no controle de gastos, planejamento e tomada de decisões mais conscientes.
                </p>

                <p>
                    Mais do que organizar finanças, nossa proposta é apoiar o desenvolvimento financeiro dos nossos usuários. Por meio de sugestões e insights personalizados, buscamos contribuir para escolhas mais estratégicas e sustentáveis ao longo do tempo.
                </p>

                <p>
                    Acreditamos que uma boa gestão financeira é um passo essencial para alcançar objetivos e ter mais tranquilidade. Por isso, convidamos você a conhecer a Arvum e dar início a uma nova forma de cuidar do seu futuro financeiro.
                </p>
            </div>
        </div>
    </main>
    <footer>
        <div className="sugest">
            <h3>Nos dê sugestões</h3>
        </div>
        <div className="redes_sociais">
            <h3>Siga nossas redes sociais</h3>
        </div>
        <div className="sla">
            <h3>Confira o nosso FAQ</h3>
        </div>
    </footer>
    </div>
    );  
}