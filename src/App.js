import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";

// local imports
import { Header } from "./components/Header";
import { AuthModal } from "./components/AuthModal";
import { Search } from "./components/Search";
import { HomePage } from "./pages/HomePage";
import { WatchlistPage } from "./pages/WatchlistPage";
import { WatchedPage } from "./pages/WatchedPage";
import "./styles/App.css";
import "./styles/HomePage.css";
import "./lib/font-awesome/css/all.min.css";
import { GlobalProvider } from "./context/GlobalState";
import { AuthProvider } from "./context/AuthContext";

const RouteThemeManager = () => {
  const location = useLocation();

  useEffect(() => {
    const classes = ["theme-dashboard", "theme-watchlist", "theme-watched"];
    document.body.classList.remove(...classes);

    if (location.pathname === "/") {
      document.body.classList.add("theme-dashboard");
    } else if (location.pathname === "/watched") {
      document.body.classList.add("theme-watched");
    } else {
      document.body.classList.add("theme-watchlist");
    }

    return () => {
      document.body.classList.remove(...classes);
    };
  }, [location.pathname]);

  return null;
};

function App() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  return (
    <AuthProvider>
      <GlobalProvider>
        <Router>
          <RouteThemeManager />
          <Header onOpenAuth={() => setIsAuthModalOpen(true)} />
          <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
          <Search />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/watchlist" element={<WatchlistPage />} />
            <Route path="/watched" element={<WatchedPage />} />
          </Routes>
        </Router>
      </GlobalProvider>
    </AuthProvider>
  );
}

export default App;
