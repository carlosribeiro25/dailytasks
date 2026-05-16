import { NavLink } from "react-router-dom";
import { useState } from "react";
import "./Layout.css";

export default function Layout({ children }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen w-full overflow-x-hidden layout">
      <header className="layout__header">
        <div className="layout__header-inner">
          <span className="layout__logo">DalyTaks</span>

          {/* Hamburger button - visible only on mobile */}
          <button
            className={`layout__hamburger ${menuOpen ? "open" : ""}`}
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label="Toggle menu"
          >
            <span />
            <span />
            <span />
          </button>


          <nav className={`layout__nav ${menuOpen ? "layout__nav--open" : ""}`}>
            <NavLink
              to="/tasks"
              className={({ isActive }) =>
                isActive ? "layout__link layout__link--active" : "layout__link"
              }
              onClick={() => setMenuOpen(false)}
            >
              Tarefas
            </NavLink>

            <NavLink
              to="/cadastrar"
              className={({ isActive }) =>
                isActive ? "layout__link layout__link--active" : "layout__link"
              }
              onClick={() => setMenuOpen(false)}
            >
              Nova tarefa
            </NavLink>
          </nav>
        </div>
      </header>

      {/* Overlay for mobile menu */}
      {menuOpen && (
        <div
          className="layout__overlay"
          onClick={() => setMenuOpen(false)}
        />
      )}

      <main className="layout__main">
        <div className="layout__container">{children}</div>
      </main>

      <footer className="layout__footer">
        <div className="layout__container">
          <p>&copy; {new Date().getFullYear()} DalyTaks. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
