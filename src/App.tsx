import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AppProvider } from "./context/AppContext";
import LoginPage from "./pages/LoginPage";
import SearchPage from "./pages/SearchPage";
import NavBar from "./components/NavBar";

const App: React.FC = () => {
  return (
    <AppProvider>
      <Router>
        <NavBar />
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </AppProvider>
  );
};

export default App;
