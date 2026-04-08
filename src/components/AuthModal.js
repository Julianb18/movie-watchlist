import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import "../styles/AuthPage.css";

export const AuthModal = ({ isOpen, onClose }) => {
  const {
    user,
    isConfigured,
    signInWithEmail,
    signUpWithEmail,
    signInWithGoogle,
  } = useAuth();
  const [mode, setMode] = useState("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [statusMessage, setStatusMessage] = useState("");

  useEffect(() => {
    if (!isOpen) return;

    const handleEsc = (event) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleEsc);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) {
      setMode("signin");
      setEmail("");
      setPassword("");
      setStatusMessage("");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleEmailAuth = async (event) => {
    event.preventDefault();
    if (mode === "signin") {
      const { error } = await signInWithEmail(email, password);
      if (error) {
        setStatusMessage(error.message);
        return;
      }
      onClose();
      return;
    }

    const { error } = await signUpWithEmail(email, password);
    setStatusMessage(
      error
        ? error.message
        : "Account created. Check your inbox if verification is enabled.",
    );
  };

  const handleGoogleSignIn = async () => {
    const { error } = await signInWithGoogle();
    if (error) setStatusMessage(error.message);
  };

  return (
    <div className="auth-modal-backdrop" onClick={onClose}>
      <div
        className="auth-modal-card"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          className="auth-modal-close"
          type="button"
          onClick={onClose}
          aria-label="Close auth modal"
        >
          ×
        </button>

        {!isConfigured ? (
          <h2 className="heading">Auth is not configured yet.</h2>
        ) : user ? (
          <h2 className="heading">Signed in as {user.email}</h2>
        ) : (
          <>
            <h1 className="heading">
              {mode === "signin"
                ? "Sign in to sync your watchlist"
                : "Create your account"}
            </h1>
            <p className="auth-mode-copy">
              {mode === "signin"
                ? "Use your existing account to sync your watchlist across devices."
                : "Create a new account to save your watchlist and watched titles."}
            </p>

            <div className="auth-mode-container">
              <div
                className="auth-mode-switch"
                role="tablist"
                aria-label="Authentication mode"
              >
                <button
                  className={`auth-mode-btn ${mode === "signin" ? "active" : ""}`}
                  type="button"
                  onClick={() => {
                    setMode("signin");
                    setStatusMessage("");
                  }}
                >
                  Sign In
                </button>
                <button
                  className={`auth-mode-btn ${mode === "signup" ? "active" : ""}`}
                  type="button"
                  onClick={() => {
                    setMode("signup");
                    setStatusMessage("");
                  }}
                >
                  Create Account
                </button>
              </div>

              <form className="auth-form" onSubmit={handleEmailAuth}>
                <input
                  type="email"
                  placeholder="Email address"
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
                    {mode === "signin" ? "Sign In" : "Create Account"}
                  </button>
                  <button
                    className="btn"
                    type="button"
                    onClick={handleGoogleSignIn}
                  >
                    Continue with Google
                  </button>
                </div>
              </form>
            </div>
            {statusMessage ? (
              <p className="auth-status">{statusMessage}</p>
            ) : null}
          </>
        )}
      </div>
    </div>
  );
};
