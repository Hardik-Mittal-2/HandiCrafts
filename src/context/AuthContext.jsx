import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../lib/api';

const AuthContext = createContext(undefined);

const getStoredAuthUser = () => {
  const storedUser = localStorage.getItem('user');
  const token = localStorage.getItem('token');

  if (!storedUser || !token) return null;

  try {
    const parsed = JSON.parse(storedUser);
    const normalized = {
      id: parsed._id || parsed.id,
      email: parsed.email,
      name: parsed.name,
      role: parsed.role,
      isBlocked: parsed.isBlocked,
    };

    if (normalized.id && normalized.email && normalized.name && normalized.role) {
      return normalized;
    }
  } catch {
    // ignore
  }

  return null;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => getStoredAuthUser());
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');

    if (!storedUser || !token) return;

    const normalized = getStoredAuthUser();
    if (!normalized) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
    }
  }, []);

  const login = async (email, password) => {
    try {
      const data = await authAPI.login(email, password);
      
      const userData = {
        id: data._id || data.id,
        email: data.email,
        name: data.name,
        role: data.role,
        isBlocked: data.isBlocked,
      };

      setUser(userData);
    } catch (error) {
      throw new Error(error.message || 'Invalid credentials');
    }
  };

  const signup = async (data) => {
    try {
      const response = await authAPI.register(data);
      
      const userData = {
        id: response._id || response.id,
        email: response.email,
        name: response.name,
        role: response.role,
      };

      setUser(userData);
    } catch (error) {
      throw new Error(error.message || 'Signup failed');
    }
  };

  const logout = () => {
    authAPI.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
