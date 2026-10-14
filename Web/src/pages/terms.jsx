import React from "react";
import { Navbar } from "../components/navBar.jsx";
import { Link } from "react-router-dom";
import "../styles/legal.css";

export function Terms() {
  return (
    <div className="legal-container">
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

      <main className="legal-main">
        <div className="legal-content">
          <h1>Termos e Condições de Uso de Arvum Gestão Financeira</h1>
          
          <p>Seja bem-vindo ao Arvum Gestão Financeira. Ao acessar e utilizar este site, você concorda em cumprir e ficar vinculado aos seguintes termos e condições de uso.</p>
          
          <h2>1. Aceitação dos Termos</h2>
          <p>Ao acessar o Arvum Gestão Financeira, você concorda em cumprir estes termos de serviço, todas as leis e regulamentos aplicáveis e concorda que é responsável pelo cumprimento de todas as leis locais aplicáveis. Se você não concordar com algum destes termos, está proibido de usar ou acessar este site.</p>
          
          <h2>2. Licença de Uso e Propriedade Intelectual</h2>
          <p>É concedida permissão para baixar temporariamente uma cópia dos materiais (informações ou software) no site Arvum Gestão Financeira, apenas para visualização transitória pessoal e não comercial.</p>
          <p>Esta é a concessão de uma licença, não uma transferência de título, e sob esta licença você não pode:</p>
          <ul>
            <li>Modificar ou copiar os materiais;</li>
            <li>Usar os materiais para qualquer finalidade comercial ou para exibição pública;</li>
            <li>Tentar descompilar ou fazer engenharia reversa de qualquer software contido no site Arvum Gestão Financeira;</li>
            <li>Remover quaisquer direitos autorais ou outras notações de propriedade dos materiais.</li>
          </ul>
          
          <h2>3. Isenção de Responsabilidade</h2>
          <p>Os materiais no site do Arvum Gestão Financeira são fornecidos 'como estão'. O Arvum Gestão Financeira não oferece garantias, expressas ou implícitas, e por este meio isenta e nega todas as outras garantias, incluindo, sem limitação, garantias implícitas ou condições de comercialização, adequação a um fim específico ou não violação de propriedade intelectual.</p>
          
          <h2>4. Limitações</h2>
          <p>Em nenhum caso o Arvum Gestão Financeira ou seus fornecedores serão responsáveis por quaisquer danos (incluindo, sem limitação, danos por perda de dados ou lucro ou devido a interrupção dos negócios) decorrentes do uso ou da incapacidade de usar os materiais no Arvum Gestão Financeira.</p>
          
          <h2>5. Links para Sites de Terceiros</h2>
          <p>O Arvum Gestão Financeira não analisou todos os sites vinculados ao seu site e não é responsável pelo conteúdo de nenhum site vinculado. A inclusão de qualquer link não implica endosso por Arvum Gestão Financeira. O uso de qualquer site vinculado é por conta e risco do usuário.</p>
          
          <h2>6. Modificações dos Termos</h2>
          <p>O Arvum Gestão Financeira pode revisar estes termos de serviço do site a qualquer momento, sem aviso prévio. Ao usar este site, você concorda em ficar vinculado à versão atual desses termos de serviço.</p>
          
          <p className="legal-footer">Estes termos são regidos e interpretados de acordo com as leis do Brasil.</p>
        </div>
      </main>
    </div>
  );
}

export default Terms;