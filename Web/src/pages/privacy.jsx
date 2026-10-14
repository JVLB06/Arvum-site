import React from "react";
import { Navbar } from "../components/navBar.jsx";
import { Link } from "react-router-dom";
import "../styles/legal.css";

export function Privacy() {
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
          <h1>Política de Privacidade de Arvum Gestão Financeira</h1>
          
          <p>A sua privacidade é importante para nós. É política do Arvum Gestão Financeira respeitar a sua privacidade em relação a qualquer informação sua que possamos coletar no site Arvum Gestão Financeira, e outros sites que possuímos e operamos.</p>
          
          <h2>1. Coleta e Uso de Informações Pessoais</h2>
          <p>Solicitamos informações pessoais (como nome, e-mail) apenas quando realmente precisamos delas para lhe fornecer um serviço. Fazemo-lo por meios justos e legais, com o seu conhecimento e consentimento. Também informamos por que estamos coletando e como será usado.</p>
          <p>As informações financeiras são todas obtidas mediante seu consentimento e devidamente explicitadas no momento da inserção. As mesmas também são individualizadas de seus registros com criptografia, evitando o vínculo direto entre nome, endereço de email e as demais informações pessoais.</p>
          <p>Não compartilhamos informações de identificação pessoal publicamente ou com terceiros, exceto quando exigido por lei.</p>
          
          <h2>2. Cookies e Anúncios do Google AdSense</h2>
          <p>O Arvum Gestão Financeira utiliza cookies e tecnologias semelhantes para melhorar a experiência do usuário e exibir anúncios personalizados.</p>
          <ul>
            <li>Terceiros, incluindo o <strong>Google</strong>, utilizam cookies para veicular anúncios com base em visitas anteriores do usuário a este ou a outros websites.</li>
            <li>Com o uso do cookie de publicidade, o Google e os seus parceiros podem veicular anúncios para os usuários com base nas visitas feitas aos seus sites e/ou a outros sites na Internet.</li>
            <li>Os usuários podem desativar a publicidade personalizada acessando as <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer">Configurações de anúncios do Google</a>.</li>
            <li>Como alternativa, você pode optar por desativar o uso de cookies de terceiros para publicidade personalizada acessando o site <a href="https://www.aboutads.info" target="_blank" rel="noopener noreferrer">www.aboutads.info</a>.</li>
          </ul>
          
          <h2>3. Direitos do Titular dos Dados (LGPD)</h2>
          <p>Conforme a Lei Geral de Proteção de Dados (LGPD), você tem o direito de confirmar a existência de tratamento dos seus dados, acessar seus dados, corrigir dados incompletos ou solicitar a exclusão de suas informações da nossa base de dados a qualquer momento.</p>
          <p>Para exercer seus direitos ou tirar dúvidas sobre privacidade, entre em contato com nosso encarregado de dados através do e-mail: <a href="mailto:butzenjvlb@gmail.com">butzenjvlb@gmail.com</a>.</p>
          
          <h2>4. Compromisso do Usuário</h2>
          <p>O usuário se compromete a fazer uso adequado dos conteúdos e da informação que o Arvum Gestão Financeira oferece no site:</p>
          <ul className="legal-list-alpha">
            <li>Não se envolver em atividades que sejam ilegais ou contrárias à boa fé e à ordem pública;</li>
            <li>Não difundir propaganda ou conteúdo de natureza racista, xenofóbica, jogos de sorte ou azar, qualquer tipo de pornografia ilegal, de apologia ao terrorismo ou contra os direitos humanos.</li>
          </ul>
          
          <p className="legal-footer">Esta política é efetiva a partir de 14/10/2026.</p>
        </div>
      </main>
    </div>
  );
}

export default Privacy;