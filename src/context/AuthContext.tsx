import React, { createContext, useState, useEffect, useContext } from "react";
import api from "../services/api";
import { getErrorMessage } from "../utils/errorHandler";

interface User {
  _id: string;
  email: string;
  name: string;
  createdAt: string;
}

interface AuthResponse {
  success: boolean;
  token: string;
  user: User;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  getCurrentUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is authenticated - immediately true if token exists to prevent flash
  // but we still verify with the server
  const isAuthenticated = !!user;

  // Get current user from token
  const getCurrentUser = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setIsLoading(false);
        setUser(null);
        return;
      }

      // Set loading only if we don't have a user yet
      if (!user) setIsLoading(true);

      const response = await api.get<{ success: boolean; user: User }>(
        "/api/auth/me"
      );
      if (response.data.success) {
        setUser(response.data.user);
      } else {
        localStorage.removeItem("token");
        setUser(null);
      }
    } catch (error) {
      console.error("Failed to get current user:", error);
      localStorage.removeItem("token");
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Login function
  const login = async (email: string, password: string) => {
    try {
      const response = await api.post<AuthResponse>("/api/auth/login", {
        email,
        password,
      });

      if (response.data.success) {
        localStorage.setItem("token", response.data.token);
        setUser(response.data.user);
      }
    } catch (error: unknown) {
      console.error("Login failed:", error);
      throw new Error(getErrorMessage(error) || "Login failed");
    }
  };

  // Signup function
  const signup = async (name: string, email: string, password: string) => {
    try {
      const response = await api.post<AuthResponse>("/api/auth/register", {
        name,
        email,
        password,
      });

      if (response.data.success) {
        localStorage.setItem("token", response.data.token);
        setUser(response.data.user);
      }
    } catch (error: unknown) {
      console.error("Signup failed:", error);
      throw new Error(getErrorMessage(error) || "Signup failed");
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  // Load user on mount
  useEffect(() => {
    getCurrentUser();
  }, []);

  const value = {
    user,
    isAuthenticated,
    isLoading,
    login,
    signup,
    logout,
    getCurrentUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
};
