import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../api/client';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing authentication on app start
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const storedToken = await AsyncStorage.getItem('authToken');
      const storedUser = await AsyncStorage.getItem('userData');
      
      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email, password, role) => {
    try {
      const form = new URLSearchParams();
      form.append('username', email);
      form.append('password', password);
      const res = await api.post('/api/auth/login', form, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      });
      const tokenValue = res.data?.access_token;
      const userData = res.data?.user || { email, role, name: email.split('@')[0] };
      await AsyncStorage.setItem('authToken', tokenValue);
      await AsyncStorage.setItem('userData', JSON.stringify(userData));
      setToken(tokenValue);
      setUser(userData);
      return { success: true, user: userData };
    } catch (error) {
      console.error('Login error:', error?.response?.data || error.message);
      return { success: false, error: 'Login failed' };
    }
  };

  const signup = async (userData, role) => {
    try {
      const payload = {
        email: userData.email,
        password: userData.password,
        full_name: `${userData.firstName || ''} ${userData.lastName || ''}`.trim(),
        role: role === 'faculty' ? 'technician' : role,
      };
      await api.post('/api/auth/signup', payload);
      return { success: true, message: 'Account created successfully!' };
    } catch (error) {
      console.error('Signup error:', error?.response?.data || error.message);
      return { success: false, error: 'Registration failed' };
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('authToken');
      await AsyncStorage.removeItem('userData');
      setToken(null);
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const value = {
    user,
    token,
    isLoading,
    login,
    signup,
    logout,
    isAuthenticated: !!token,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
