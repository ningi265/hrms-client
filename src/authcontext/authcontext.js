// AuthContext.js - Fixed with better error handling
"use client";

import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fix environment variable handling with fallback
  const getBackendUrl = () => {
    const env = process.env.REACT_APP_ENV || 'development';
    const devUrl = process.env.REACT_APP_BACKEND_URL_DEV;
    const prodUrl = process.env.REACT_APP_BACKEND_URL_PROD;
    
    console.log('Environment variables:', {
      REACT_APP_ENV: env,
      REACT_APP_BACKEND_URL_DEV: devUrl,
      REACT_APP_BACKEND_URL_PROD: prodUrl
    });
    
    let backendUrl;
    if (env === 'production') {
      backendUrl = prodUrl;
    } else {
      backendUrl = devUrl;
    }
    
    // Fallback if environment variables are not set
    if (!backendUrl) {
      console.warn('Backend URL not found in environment variables, using fallback');
      backendUrl = 'https://api.nexusmwi.com';
    }
    
    console.log('Using backend URL:', backendUrl);
    return backendUrl;
  };

  const backendUrl = getBackendUrl();

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

  // ADD THIS GOOGLE LOGIN METHOD
  const googleLogin = async (googleUserData) => {
    try {
      console.log('Google login attempt - URL:', `${backendUrl}/api/auth/google-login`);
      console.log('Google login attempt - Data:', googleUserData);
      
      if (!backendUrl || backendUrl === 'undefined') {
        throw new Error('Backend URL is not configured properly');
      }
      
      const response = await fetch(`${backendUrl}/api/auth/google-login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        mode: "cors",
        body: JSON.stringify(googleUserData),
      });

      console.log('Google login response status:', response.status);
      
      const data = await response.json();
      console.log('Google login response data:', data);

      if (!response.ok) {
        console.error('Google login failed:', data);
        throw new Error(data.message || "Google login failed");
      }

      if (data.exists && data.user && data.token) {
        // Store user and token for existing user
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("token", data.token);
        setUser(data.user);
        setToken(data.token);
        
        console.log('Google login successful - User role:', data.user.role);
        
        return {
          success: true,
          user: data.user,
          requiresRegistration: false
        };
      } else {
        // User doesn't exist, needs registration
        return {
          success: true,
          requiresRegistration: true,
          userData: googleUserData
        };
      }
    } catch (error) {
      console.error("Google login error:", error.message);
      console.error("Full error:", error);
      return {
        success: false,
        error: error.message
      };
    }
  };

  const login = async (email, password) => {
    try {
      console.log('Login attempt - URL:', `${backendUrl}/api/auth/login`);
      console.log('Login attempt - Email:', email);
      
      if (!backendUrl || backendUrl === 'undefined') {
        throw new Error('Backend URL is not configured properly');
      }
      
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
      
      if (!backendUrl || backendUrl === 'undefined') {
        throw new Error('Backend URL is not configured properly');
      }
      
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
    googleLogin, // ADD THIS
    register,
    logout,
    loading,
    isTokenExpired,
    backendUrl,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
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