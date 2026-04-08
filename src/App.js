import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// local imports
import { Header } from "./components/Header";
import { Search } from "./components/Search";
import { HomePage } from "./pages/HomePage";
import { WatchlistPage } from "./pages/WatchlistPage";
import { WatchedPage } from "./pages/WatchedPage";
import { AuthPage } from "./pages/AuthPage";
import "./styles/App.css";
import "./styles/HomePage.css";
import "./lib/font-awesome/css/all.min.css";
import { GlobalProvider } from "./context/GlobalState";
import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    <AuthProvider>
      <GlobalProvider>
        <Router>
          <Header />
          <Search />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/watchlist" element={<WatchlistPage />} />
            <Route path="/watched" element={<WatchedPage />} />
            <Route path="/auth" element={<AuthPage />} />
          </Routes>
        </Router>
      </GlobalProvider>
    </AuthProvider>
  );
}

export default App;
