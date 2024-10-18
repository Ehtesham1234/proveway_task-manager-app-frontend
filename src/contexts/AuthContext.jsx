import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuthStatus = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
          const response = await axios.get("http://localhost:5000/api/v1/user");
          setUser(response.data.data.user);
          setIsAuthenticated(true);
        } catch (error) {
          console.error("Error verifying token:", error);
          localStorage.removeItem("token");
          delete axios.defaults.headers.common["Authorization"];
        }
      }
      setIsLoading(false);
    };

    checkAuthStatus();
  }, []);

  const login = async (username, password) => {
    try {
      const response = await axios.post("http://localhost:5000/api/v1/login", {
        username,
        password,
      });
      setUser(response.data.data.user);
      setIsAuthenticated(true);
      localStorage.setItem("token", response.data.data.token);
      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${response.data.data.token}`;
      return true;
    } catch (error) {
      console.error("Login failed:", error);
      return false;
    }
  };

  const signup = async (username, email, password) => {
    try {
      const response = await axios.post("http://localhost:5000/api/v1/signup", {
        username,
        email,
        password,
      });
      return true;
    } catch (error) {
      console.error("Signup failed:", error);
      return false;
    }
  };

  const logout = async () => {
    try {
      await axios.post("http://localhost:5000/api/v1/logout");
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem("token");
      delete axios.defaults.headers.common["Authorization"];
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, isLoading, login, signup, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
