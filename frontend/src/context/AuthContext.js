import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [authLoading, setAuthLoading] = useState(true);

  const login = async (email, password) => {
    const response = await axios.post('/api/auth/login', { email, password });
    const token = response.data.token;
    localStorage.setItem('token', token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    setToken(token);
    const profile = await axios.get('/api/auth/profile');
    setUser(profile.data);
  };

  const register = async (firstName, lastName, email, roomNumber, password) => {
    const response = await axios.post('/api/auth/register', { firstName, lastName, email, roomNumber, password });
    const token = response.data.token;
    localStorage.setItem('token', token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    setToken(token);
    const profile = await axios.get('/api/auth/profile');
    setUser(profile.data);
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
    setToken(null);
  };

  useEffect(() => {
    const initialize = async () => {
      if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        try {
          const profile = await axios.get('/api/auth/profile');
          setUser(profile.data);
        } catch (err) {
          logout();
        }
      }
      setAuthLoading(false);
    };
    initialize();
  }, [token]);

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, authLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;