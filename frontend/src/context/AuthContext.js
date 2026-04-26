import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiRequest } from '../services/api';

const STORAGE_KEY = 'nowtify_guest';
const AuthContext = createContext(null);

const generateId = () => `guest_${Date.now()}_${Math.floor(Math.random() * 100000)}`;

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

  const onboard = async (username) => {
    const payload = { username: username.trim(), userId: generateId() };
    const created = await apiRequest('/users/guest', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(created));
    setUser(created);
  };

  const value = useMemo(() => ({ user, loading, onboard }), [user, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
