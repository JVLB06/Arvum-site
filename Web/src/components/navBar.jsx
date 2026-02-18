export function Navbar({ children }) {
  return (
    <nav className="navbar">
        <div className="logo">
            <img className="logo-image" src="./assets/arvum_logo.png" alt="Logo"/>
            <span>Arvum</span>
            <div className="nav-links">
                {children}
            </div>
            <div class="nav-right">
                <button class="tema" id="troca_tema"></button>
            </div>
        </div>
    </nav>
  );
}
