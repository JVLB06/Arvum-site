import { useEffect, useState } from "react";
import logo from "../assets/arvum_logo.png";
import "../styles/navBar.css";

export function Navbar({ children }) {
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
        <img className="logo-image" src={logo} alt="Logo" />
        <span>Arvum</span>
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