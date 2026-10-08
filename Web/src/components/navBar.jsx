import { useEffect, useState } from "react";
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

export function Navbar({ children }) {
  const [darkMode, setDarkMode] = useState(getInitialTheme);

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark-mode");
      localStorage.setItem("theme", "dark");
    } else {
      document.body.classList.remove("dark-mode");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

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
          onClick={() => setDarkMode((prev) => !prev)}
        >
          {darkMode ? "☀️" : "🌙"}
        </button>
      </div>
    </nav>
  );
}
