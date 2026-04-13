import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/arvum_logo.png";
import "../styles/navBar.css";

export function Navbar({ children, onBack }) {
  const [darkMode, setDarkMode] = useState(false);
  const navigate = useNavigate();

  // aplica ou remove o tema
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
      navigate(-1);
    }
  }

  // carrega tema salvo
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setDarkMode(true);
    }
  }, []);

  return (
    <nav className="navbar">
      <div className="logo" onClick={handleBack} style={{ cursor: "pointer" }}>
        {/* Se tiver a logo */}
        <img src={logo} alt="Arvum" className="logo-img" />

        {/* fallback (caso a imagem não carregue) */}
        {/* <span className="logo-text">Arvum</span> */}
      </div>

      <div className="nav-links">
        {children}
      </div>

      <div className="nav-right">
        <button
          className="tema"
          onClick={() => setDarkMode(!darkMode)}
        >
          {darkMode ? "☀️" : "🌙"}
        </button>
      </div>
    </nav>
  );
}