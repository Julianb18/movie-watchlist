import React, { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/Header.css";

export const Header = ({ onOpenAuth }) => {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!isMenuOpen) return undefined;

    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        setIsMenuOpen(false);
      }
    };

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [isMenuOpen]);

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header>
      <div className="container">
        <div className="inner-content">
          <div className="brand">
            <Link to="/" onClick={closeMenu}>
              WatchList
            </Link>
          </div>
          <nav className="header-nav" aria-label="Main">
            <ul
              id="primary-navigation"
              className={`nav-links ${isMenuOpen ? "nav-open" : ""}`}
            >
              <li>
                <NavLink
                  to="/"
                  end
                  className={({ isActive }) => (isActive ? "nav-active" : "")}
                  onClick={closeMenu}
                >
                  Dashboard
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/watchlist"
                  className={({ isActive }) => (isActive ? "nav-active" : "")}
                  onClick={closeMenu}
                >
                  Watch Next
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/watched"
                  className={({ isActive }) => (isActive ? "nav-active" : "")}
                  onClick={closeMenu}
                >
                  Seen
                </NavLink>
              </li>
            </ul>
          </nav>
          <div className="header-auth">
            {user ? (
              <button className="btn" type="button" onClick={signOut}>
                Sign Out
              </button>
            ) : (
              <button className="btn" type="button" onClick={onOpenAuth}>
                Sign In
              </button>
            )}
          </div>
          <button
            type="button"
            className={`nav-toggle ${isMenuOpen ? "is-open" : ""}`}
            aria-expanded={isMenuOpen}
            aria-controls="primary-navigation"
            onClick={() => setIsMenuOpen((open) => !open)}
          >
            <span className="sr-only">{isMenuOpen ? "Close menu" : "Open menu"}</span>
            <span className="nav-toggle-bars" aria-hidden="true">
              <span className="nav-toggle-line" />
              <span className="nav-toggle-line" />
              <span className="nav-toggle-line" />
            </span>
          </button>
        </div>
      </div>
      {isMenuOpen ? (
        <button
          type="button"
          className="nav-backdrop"
          aria-label="Close menu"
          tabIndex={-1}
          onClick={closeMenu}
        />
      ) : null}
    </header>
  );
};
