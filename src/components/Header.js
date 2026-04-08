import React from "react";
import { Link } from "react-router-dom";
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
              <Link to="/">Dashboard</Link>
            </li>
            <li>
              <Link to="/watchlist">Watch Next</Link>
            </li>
            <li>
              <Link to="/watched">Seen</Link>
            </li>
            <li>
              {user ? (
                <button className="btn" type="button" onClick={signOut}>
                  Sign Out
                </button>
              ) : (
                <button className="btn" type="button" onClick={onOpenAuth}>
                  Sign In
                </button>
              )}
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
};
