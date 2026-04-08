import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import "../styles/AuthPage.css";
import "../styles/ListPage.css";

export const AuthPage = () => {
  const { user, isConfigured, signInWithEmail, signUpWithEmail, signInWithGoogle } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [statusMessage, setStatusMessage] = useState("");

  const handleSignIn = async (event) => {
    event.preventDefault();
    const { error } = await signInWithEmail(email, password);
    setStatusMessage(error ? error.message : "Signed in successfully.");
  };

  const handleSignUp = async (event) => {
    event.preventDefault();
    const { error } = await signUpWithEmail(email, password);
    setStatusMessage(
      error ? error.message : "Sign-up submitted. Check your email if confirmation is required."
    );
  };

  const handleGoogleSignIn = async () => {
    const { error } = await signInWithGoogle();
    if (error) setStatusMessage(error.message);
  };

  if (!isConfigured) {
    return (
      <div className="movie-page">
        <div className="container">
          <h2 className="heading">Auth is not configured yet.</h2>
        </div>
      </div>
    );
  }

  if (user) {
    return (
      <div className="movie-page">
        <div className="container">
          <h2 className="heading">Signed in as {user.email}</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="movie-page">
      <div className="container auth-card">
        <h1 className="heading">Sign in to sync your watchlist</h1>
        <form className="auth-form" onSubmit={handleSignIn}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
          <div className="auth-actions">
            <button className="btn" type="submit">
              Sign In
            </button>
            <button className="btn" type="button" onClick={handleSignUp}>
              Create Account
            </button>
            <button className="btn" type="button" onClick={handleGoogleSignIn}>
              Continue with Google
            </button>
          </div>
        </form>
        {statusMessage ? <p className="auth-status">{statusMessage}</p> : null}
      </div>
    </div>
  );
};
