import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import logo from "../assets/arvum_logo.png";
import "../styles/navBar.css";

export function Navbar({ children, onBack }) {
  const [darkMode, setDarkMode] = useState(false);
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

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setDarkMode(true);
    }
  }, []);

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
          onClick={() => setDarkMode(!darkMode)}
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