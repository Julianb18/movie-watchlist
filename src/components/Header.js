import React from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/Header.css";

export const Header = ({ onOpenAuth }) => {
  const { user, signOut } = useAuth();

  return (
    <header>
      <div className="container">
        <div className="inner-content">
          <div className="brand">
            <Link to="/">WatchList</Link>
          </div>
          <ul className="nav-links">
            <li>
              <NavLink to="/" end className={({ isActive }) => (isActive ? "nav-active" : "")}>
                Dashboard
              </NavLink>
            </li>
            <li>
              <NavLink to="/watchlist" className={({ isActive }) => (isActive ? "nav-active" : "")}>
                Watch Next
              </NavLink>
            </li>
            <li>
              <NavLink to="/watched" className={({ isActive }) => (isActive ? "nav-active" : "")}>
                Seen
              </NavLink>
            </li>
          </ul>
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
        </div>
      </div>
    </header>
  );
};
