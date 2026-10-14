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
        <Link to="/about">
          <button className="head_button">
            <strong>Sobre</strong>
          </button>
        </Link>
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


      </main>

      <footer className="home-footer">
        <div className="footer-content">
          <div className="footer-brand">
            <strong>Arvum</strong> • Gestão Financeira Pessoal
          </div>
          
          <div className="footer-section">
            <div className="footer-links">
              <Link to="/about" className="footer-link">Sobre nós</Link>
              <span className="footer-sep">•</span>
              <Link to="/faq" className="footer-link">FAQ</Link>
              <span className="footer-sep">•</span>
              <Link to="/terms" className="footer-link">Termos de Uso</Link>
              <span className="footer-sep">•</span>
              <Link to="/privacy" className="footer-link">Política de Privacidade</Link>
            </div>
            
            <div className="footer-contact">
              <span className="footer-contact-item">
                <strong>Email:</strong> <a href="mailto:butzenjvlb@gmail.com">butzenjvlb@gmail.com</a>
              </span>
              <span className="footer-sep">•</span>
              <span className="footer-contact-item">
                <strong>Telefone:</strong> <a href="tel:+5541987992869">+55 41 98799-2869</a>
              </span>
            </div>
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