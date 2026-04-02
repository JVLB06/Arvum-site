import { useEffect, useState } from "react";
import logo from "../assets/arvum_logo.png";
import "../styles/navBar.css";

export function Navbar({ children, onBack }) {
  const [darkMode, setDarkMode] = useState(false);

  // aplica ou remove a classe no body
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
            onBack(); // permite comportamento customizado
        } else {
            navigate(-1); // volta uma página no histórico
        }
    }

  // carrega tema salvo ao iniciar
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setDarkMode(true);
    }
  }, []);

  return (
    <nav className="navbar">
      <div className="logo">
        <button
                className="back-button"
                onClick={handleBack}
                type="button"
            >
                &lt;
        </button>
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