import React from "react";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { logout } from "../api";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";

const NavBar: React.FC = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useAppContext();

  const handleLogout = async () => {
    await logout();
    dispatch({ type: "LOGOUT" });
    navigate("/");
  };

  if (!state.user) return null; // Hide NavBar if not logged in

  return (
    <AppBar position="static" color="default" elevation={1}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography variant="h6">Fetch Dog Adoption</Typography>
          <Button onClick={handleLogout} color="error" variant="outlined">
            Logout
          </Button>
        </Toolbar>
    </AppBar>
  );
};

export default NavBar;