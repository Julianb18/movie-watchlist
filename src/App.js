import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// local imports
import { Header } from "./components/Header";
import { Watchlist } from "./components/Watchlist";
import { Watched } from "./components/Watched";
import { Search } from "./components/Search";
import { AuthPage } from "./components/AuthPage";
import "./styles/App.css";
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
            <Route path="/" element={<Watchlist />} />
            <Route path="/watched" element={<Watched />} />
            <Route path="/auth" element={<AuthPage />} />
          </Routes>
        </Router>
      </GlobalProvider>
    </AuthProvider>
  );
}

export default App;
