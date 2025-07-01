// AuthContext.js - Corrected register function
"use client";

import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const backendUrl = process.env.REACT_APP_ENV === 'production'
  ? process.env.REACT_APP_BACKEND_URL_PROD
  : process.env.REACT_APP_BACKEND_URL_DEV;

  // Check if token is expired
  const isTokenExpired = (token) => {
    if (!token) return true;
    
    try {
      const parts = token.split('.');
      if (parts.length !== 3) return true;
      
      const payload = JSON.parse(atob(parts[1]));
      const expiryTime = payload.exp * 1000; // Convert to milliseconds
      const currentTime = Date.now();
      
      return currentTime >= expiryTime;
    } catch (error) {
      console.error('Error checking token expiration:', error);
      return true;
    }
  };

  // Check token on mount
  useEffect(() => {
    const initAuth = () => {
      const storedUser = localStorage.getItem("user");
      const storedToken = localStorage.getItem("token");
      
      console.log('InitAuth - Stored user:', storedUser);
      console.log('InitAuth - Has token:', !!storedToken);
      
      if (storedUser && storedToken) {
        if (isTokenExpired(storedToken)) {
          console.log('InitAuth - Token expired, clearing storage');
          localStorage.removeItem("user");
          localStorage.removeItem("token");
          setUser(null);
          setToken(null);
        } else {
          console.log('InitAuth - Token valid, setting user');
          setUser(JSON.parse(storedUser));
          setToken(storedToken);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    try {
      console.log('Login attempt - URL:', `${backendUrl}/api/auth/login`);
      console.log('Login attempt - Email:', email);
      
      const response = await fetch(`${backendUrl}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        mode:"cors",
        body: JSON.stringify({ email, password }),
      });

      console.log('Login response status:', response.status);
      
      const data = await response.json();
      console.log('Login response data:', data);

      if (!response.ok) {
        console.error('Login failed:', data);
        throw new Error(data.message || "Login failed");
      }

      // Store user and token
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("token", data.token);
      setUser(data.user);
      setToken(data.token);
      
      console.log('Login successful - User role:', data.user.role);
      
      return data;
    } catch (error) {
      console.error("Login error:", error.message);
      console.error("Full error:", error);
      throw error;
    }
  };

  const register = async (firstName, lastName, email, password, companyName, industry, role, phoneNumber) => {
    try {
      console.log('Register attempt - URL:', `${backendUrl}/api/auth/register`);
      console.log('Register attempt - Email:', email);
      
      const response = await fetch(`${backendUrl}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
         credentials: "include",
        mode:"cors",
        body: JSON.stringify({ 
          firstName, 
          lastName, 
          email, 
          password, 
          companyName, 
          industry, 
          role, 
          phoneNumber 
        }),
      });

      console.log('Register response status:', response.status);
      
      const data = await response.json();
      console.log('Register response data:', data);

      if (!response.ok) {
        console.error('Registration failed:', data);
        throw new Error(data.message || "Registration failed");
      }

      // Store user and token if provided
      if (data.token) {
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("token", data.token);
        setUser(data.user);
        setToken(data.token);
      }
      
      console.log('Registration successful');
      
      return data;
    } catch (error) {
      console.error("Registration error:", error.message);
      console.error("Full error:", error);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  const value = {
    user,
    token,
    login,
    register,
    logout,
    loading,
    isTokenExpired,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};