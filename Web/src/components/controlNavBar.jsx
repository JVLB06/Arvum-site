import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import logo from "../assets/arvum_logo.png";
import "../styles/navBar.css";

function getInitialTheme() {
  if (typeof localStorage === "undefined") return false;
  const stored = localStorage.getItem("theme");
  if (stored === "dark") return true;
  if (stored === "light") return false;
  // Nenhum padrão salvo: usa a preferência do sistema
  if (typeof window !== "undefined" && window.matchMedia) {
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  }
  return false;
}

export function Navbar({ children, onBack }) {
  const [darkMode, setDarkMode] = useState(getInitialTheme);
  const navigate = useNavigate();

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark-mode");
      localStorage.setItem("theme", "dark");
    } else {
      document.body.classList.remove("dark-mode");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  function handleBack() {
    if (onBack) {
      onBack();
    } else {
      navigate("/logged");
    }
  }

  return (
    <nav className="navbar">
      <div className="logo" onClick={handleBack} title="Voltar ao Dashboard">
        <img src={logo} alt="Arvum Logo" className="logo-img" />
        <span>Arvum</span>
      </div>

      <div className="nav-links">
        {children}
      </div>

      <div className="nav-right">
        <button
          className="tema"
          onClick={() => setDarkMode((prev) => !prev)}
          title={darkMode ? "Mudar para modo claro" : "Mudar para modo escuro"}
          aria-label="Alternar tema"
        >
          {darkMode ? "☀️" : "🌙"}
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
