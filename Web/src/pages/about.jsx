import React from "react";
import { Navbar } from "../components/navBar.jsx";
import { Link } from "react-router-dom";
import "../styles/about.css";

export function About() {
  return (
    <div className="about-container">
      <Navbar>
        <Link to="/">
          <button className="head_button">
            <strong>Home</strong>
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

      <main className="about-main">
        <div className="about-page-card">
          <div className="about-page-header">
            <span className="about-page-tag">Nossa Missão</span>
            <h1 className="about-page-title">Quem somos?</h1>
          </div>

          <div className="about-page-text">
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
      </main>
    </div>
  );
}