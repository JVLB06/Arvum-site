import React from "react";
import { Navbar } from "../components/navBar.jsx";
import "../styles/home.css";
import patinhas from "../assets/patinhas_sorrindo.png";
import { Link } from "react-router-dom";
import { ArrowRight, ShieldCheck, TrendingUp, Sparkles } from "lucide-react";

export function Home() {
  return (
    <div className="home-container">
      <Navbar>
        <button
          className="head_button"
          onClick={() =>
            document.getElementById("home")?.scrollIntoView({ behavior: "smooth" })
          }
        >
          <strong>Home</strong>
        </button>
        <button
          className="head_button"
          onClick={() =>
            document.getElementById("sobre")?.scrollIntoView({ behavior: "smooth" })
          }
        >
          <strong>Sobre</strong>
        </button>
        <Link to="/login">
          <button className="head_button">
            <strong>Login</strong>
          </button>
        </Link>
        <Link to="/cadastrate">
          <button className="head_button head_button--highlight">
            <strong>Cadastre-se</strong>
          </button>
        </Link>
      </Navbar>

      <main className="home-main">
        {/* HERO SECTION */}
        <section className="hero-section" id="home">
          <div className="hero-content">
            <div className="hero-badge">
              <Sparkles size={16} />
              <span>Gestão Financeira Descomplicada</span>
            </div>
            
            <h1 className="hero-title">
              Dê o próximo passo para uma <span className="hero-highlight">vida financeira inteligente</span>
            </h1>
            
            <p className="hero-description">
              Organize seus ganhos, corte gastos desnecessários, acompanhe investimentos e alcance suas metas financeiras com ferramentas intuitivas e insights personalizados.
            </p>

            <div className="hero-actions">
              <Link to="/cadastrate" className="btn-primary">
                <span>Criar Conta Gratuita</span>
                <ArrowRight size={18} />
              </Link>
              <Link to="/login" className="btn-secondary">
                <span>Acessar Minha Conta</span>
              </Link>
            </div>

            <div className="hero-features">
              <div className="feature-item">
                <ShieldCheck size={18} className="feature-icon" />
                <span>100% Seguro</span>
              </div>
              <div className="feature-item">
                <TrendingUp size={18} className="feature-icon" />
                <span>Insights em Tempo Real</span>
              </div>
            </div>
          </div>

          <div className="hero-image-wrapper">
            <div className="hero-image-backdrop"></div>
            <img src={patinhas} alt="Arvum Gestão Financeira" className="hero-image" />
          </div>
        </section>

        {/* QUEM SOMOS SECTION */}
        <section className="about-section" id="sobre">
          <div className="about-card">
            <div className="about-header">
              <span className="about-tag">Nossa Missão</span>
              <h2 className="about-title">Quem somos?</h2>
            </div>

            <div className="about-text-grid">
              <p>
                A <strong>Arvum</strong> nasceu com o propósito de ajudar os brasileiros a conquistarem uma vida financeira mais organizada e equilibrada. Em um cenário marcado por constantes variações econômicas, identificamos a dificuldade de muitas pessoas em gerenciar seus recursos e evoluir financeiramente de forma consistente.
              </p>
              <p>
                Diante desse contexto, desenvolvemos uma plataforma pensada para simplificar a gestão financeira no dia a dia. A Arvum atende diferentes perfis, oferecendo ferramentas intuitivas que auxiliam no controle de gastos, planejamento e tomada de decisões mais conscientes.
              </p>
              <p>
                Mais do que organizar finanças, nossa proposta é apoiar o desenvolvimento financeiro dos nossos usuários. Por meio de sugestões e insights personalizados, buscamos contribuir para escolhas mais estratégicas e sustentáveis ao longo do tempo.
              </p>
              <p>
                Acreditamos que uma boa gestão financeira é um passo essencial para alcançar objetivos e ter mais tranquilidade. Convidamos você a conhecer a Arvum e dar início a uma nova forma de cuidar do seu futuro financeiro.
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer className="home-footer">
        <div className="footer-content">
          <div className="footer-brand">
            <strong>Arvum</strong> • Gestão Financeira Pessoal
          </div>
          <div className="footer-links">
            <a href="#sobre" className="footer-link">Sobre nós</a>
            <span className="footer-sep">•</span>
            <span className="footer-link">Siga nossas redes</span>
            <span className="footer-sep">•</span>
            <span className="footer-link">FAQ & Suporte</span>
          </div>
          <div className="footer-copy">
            © {new Date().getFullYear()} Arvum. Todos os direitos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;