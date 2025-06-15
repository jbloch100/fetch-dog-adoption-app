import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AppProvider, useAppContext } from "./context/AppContext";
import LoginPage from "./pages/LoginPage";
import SearchPage from "./pages/SearchPage";
import NavBar from "./components/NavBar";

const AppRoutes: React.FC = () => {
  const { state } = useAppContext();
  const location = useLocation();

  // ✅ Show NavBar only on /search if user is logged in
  const showNavBar = state.user && location.pathname === "/search";

  return (
    <>
      {showNavBar && <NavBar />}
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
};

const App: React.FC = () => {
  return (
    <AppProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AppProvider>
  );
};

export default App;