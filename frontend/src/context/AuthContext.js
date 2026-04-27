import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiRequest } from '../services/api';

const STORAGE_KEY = 'nowtify_auth';
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (raw) {
        setUser(JSON.parse(raw));
      }
      setLoading(false);
    })();
  }, []);

  const register = async (email, password) => {
    const response = await apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email: email.trim(), password })
    });

    const nextUser = { id: response.userId, email: response.email };
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(nextUser));
    setUser(nextUser);
  };

  const login = async (email, password) => {
    const response = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: email.trim(), password })
    });

    const nextUser = { id: response.userId, email: response.email };
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(nextUser));
    setUser(nextUser);
  };

  const logout = async () => {
    await AsyncStorage.removeItem(STORAGE_KEY);
    setUser(null);
  };

  const value = useMemo(() => ({ user, loading, register, login, logout }), [user, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
