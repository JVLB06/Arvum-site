import React, { useState } from "react";
import { Navbar } from "../components/navBar.jsx";
import { Link } from "react-router-dom";
import { ChevronDown, ChevronUp } from "lucide-react";
import "../styles/faq.css";

export function FAQ() {
  const [openItem, setOpenItem] = useState(null);

  // Array vazio para FAQ - será preenchido posteriormente
  const faqItems = [];

  const toggleItem = (index) => {
    setOpenItem(openItem === index ? null : index);
  };

  return (
    <div className="faq-container">
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

      <main className="faq-main">
        <div className="faq-header">
          <h1>Perguntas Frequentes</h1>
          <p>Encontre respostas para as dúvidas mais comuns sobre o Arvum</p>
        </div>

        <div className="faq-content">
          {faqItems.length === 0 ? (
            <div className="faq-empty">
              <p>Em breve teremos perguntas frequentes disponíveis.</p>
              <p>Enquanto isso, entre em contato conosco através do email <a href="mailto:butzenjvlb@gmail.com">butzenjvlb@gmail.com</a></p>
            </div>
          ) : (
            <div className="faq-list">
              {faqItems.map((item, index) => (
                <div key={index} className="faq-item">
                  <button
                    className={`faq-question ${openItem === index ? "active" : ""}`}
                    onClick={() => toggleItem(index)}
                  >
                    <span>{item.question}</span>
                    {openItem === index ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </button>
                  {openItem === index && (
                    <div className="faq-answer">
                      <p>{item.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default FAQ;