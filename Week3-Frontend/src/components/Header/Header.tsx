import { Link, useNavigate } from "react-router-dom";
import { useState, type FormEvent } from "react";
import { useAuth } from "../../context/AuthContext";
import "./Header.css";

interface HeaderProps {
  query: string;
  onQueryChange: (value: string) => void;
  onSearch: () => void;
  onHomeClick: () => void;
}

export function Header({ query, onQueryChange, onSearch, onHomeClick }: HeaderProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    onSearch();
  }

  async function handleLogout() {
    setIsLoggingOut(true);
    await logout();
    setIsLoggingOut(false);
    navigate("/");
  }

  return (
    <header className="app-header">
      <div className="app-header__brand">
        <Link to="/" onClick={onHomeClick} className="app-header__logo">
          Recipe<span>Vault</span>
        </Link>
      </div>

      <form className="app-header__search" onSubmit={handleSubmit}>
        <input
          type="text"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Search a dish, e.g. chicken curry"
          aria-label="Search recipes"
        />
        <button type="submit">Search</button>
      </form>

      <nav className="app-header__nav">
        <Link to="/" onClick={onHomeClick}>
          Home
        </Link>
        <Link to="/favorites">Favorites</Link>
        {user ? (
          <button className="app-header__logout" onClick={handleLogout} disabled={isLoggingOut}>
            {isLoggingOut ? "Signing out…" : "Sign out"}
          </button>
        ) : (
          <Link to="/auth">Sign in</Link>
        )}
      </nav>
    </header>
  );
}
