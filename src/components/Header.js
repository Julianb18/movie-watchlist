import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const Header = () => {
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
              <Link to="/">Watch List</Link>
            </li>
            <li>
              <Link to="/watched">Watched</Link>
            </li>
            <li>
              <Link to="/add" className="btn">
                + Add
              </Link>
            </li>
            <li>
              {user ? (
                <button className="btn" type="button" onClick={signOut}>
                  Sign Out
                </button>
              ) : (
                <Link to="/auth" className="btn">
                  Sign In
                </Link>
              )}
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
};
