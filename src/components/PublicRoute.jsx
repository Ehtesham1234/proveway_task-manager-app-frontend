import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const PublicRoute = () => {
  const { isAuthenticated, isLoading } = useAuth();

 
  return isAuthenticated ? <Navigate to="/" /> : <Outlet />;
};

export default PublicRoute;
