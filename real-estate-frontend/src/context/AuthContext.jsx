// src/context/AuthContext.jsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import api from '../lib/axios';
import { toast } from 'react-hot-toast';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null); // { id, name, email, role }
  const [loading, setLoading] = useState(true);

  const updateUser = (updatedUser) => {
  setCurrentUser(updatedUser);
  localStorage.setItem("user", JSON.stringify(updatedUser));
  };

  // Persist token in localStorage only (per backend requirement)
  const setToken = (token) => {
    if (token) localStorage.setItem('token', token);
    else localStorage.removeItem('token');
  };

  // Load user from token (GET /api/auth/me)
  const loadUser = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setCurrentUser(null);
        setLoading(false);
        return;
      }

      const res = await api.get('/api/auth/me');
      const user = res.data?.user ?? null;
      setCurrentUser(user);
    } catch (err) {
      console.error('loadUser error', err);
      setToken(null);
      setCurrentUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // LOGIN -> POST /api/auth/login { email, password } => { token, user }
  const login = async (email, password) => {
    try {
      const res = await api.post('/api/auth/login', { email, password });
      const token = res.data?.token ?? res.data?.data?.token;
      const user = res.data?.user ?? res.data?.data?.user;

      if (!token) {
        return { success: false, error: res.data?.message || 'Invalid login response' };
      }

      setToken(token);
      if (user) setCurrentUser(user);
      else await loadUser();

      toast.success('Logged in successfully');
      return { success: true, user: user ?? null };
    } catch (err) {
      console.error('login error', err);
      const errMsg = err.response?.data?.message || err.response?.data?.error || 'Login failed';
      return { success: false, error: errMsg };
    }
  };

  // SIGNUP -> POST /api/auth/register
  // We will send role = 'agent' only if userType === 'agent'; otherwise default 'user'.
  // IMPORTANT: Do NOT allow frontend-driven admin registration. If userType === 'admin', block and instruct user to contact admin.
  const signup = async (formData) => {
    try {
      // Prepare payload - explicitly choose role (no isAdmin from client)
      const payload = {
        name: formData.fullName || formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode,
        role: formData.userType === 'agent' ? 'agent' : 'user',
      };

      const res = await api.post('/api/auth/register', payload);
      // Backend may or may not return token+user. If token, auto-login.
      const token = res.data?.token ?? res.data?.data?.token;
      const user = res.data?.user ?? res.data?.data?.user;

      if (token) {
        setToken(token);
        if (user) setCurrentUser(user);
        else await loadUser();
      }

      return { success: true, user: user ?? null, message: res.data?.message ?? 'Registered' };
    } catch (err) {
      console.error('signup error', err);
      const errMsg = err.response?.data?.message || err.response?.data?.error || 'Registration failed';
      return { success: false, error: errMsg };
    }
  };

  // Optional: createAdmin for dev only (requires backend endpoint /api/auth/create-admin and must be protected on server)
  const createAdmin = async (email, password) => {
    try {
      const res = await api.post('/api/auth/create-admin', { email, password });
      const token = res.data?.token ?? res.data?.data?.token;
      const user = res.data?.user ?? res.data?.data?.user;
      if (token) {
        setToken(token);
        setCurrentUser(user ?? null);
      }
      return { success: true };
    } catch (err) {
      console.error('createAdmin error', err);
      const errMsg = err.response?.data?.message || 'Create admin failed';
      return { success: false, error: errMsg };
    }
  };

  const logout = () => {
    setToken(null);
    setCurrentUser(null);
    toast.success('Logged out');
  };

  const isAuthenticated = () => !!currentUser;
  const isAdmin = () => currentUser?.role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        user: currentUser,
        loading,
        updateUser,
        login,
        signup,
        logout,
        isAuthenticated,
        isAdmin,
        createAdmin,
        loadUser,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

export default AuthContext;
