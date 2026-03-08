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
        const parsed = JSON.parse(storedUser);
        const normalized = normalizeUser(parsed);
        setUser(normalized);
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const normalizeUser = (u) => {
    if (!u) return u;
    const normalized = { ...u };
    // prefer name, fall back to full_name
    if (!normalized.name && normalized.full_name) normalized.name = normalized.full_name;
    if (!normalized.name && normalized.displayName) normalized.name = normalized.displayName;
    // ensure user_id exists
    if (!normalized.user_id && normalized.uid) normalized.user_id = normalized.uid;
    if (!normalized.user_id && normalized.id) normalized.user_id = normalized.id;
    return normalized;
  };

  // const login = async (email, password, role) => {
  //   try {
  //     // Try real API login first
  //     try {
  //       const form = new URLSearchParams();
  //       form.append('username', email);
  //       form.append('password', password);
  //       const res = await api.post('/api/v1/auth/login', form, {
  //         headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  //       });
  //       // Support different backend response shapes
  //       const tokenValue = res.data?.access_token || res.data?.token || res.data?.jwt || res.data?.tokenValue;
  //       const userData = res.data?.user || res.data?.userData || { email, role, name: email.split('@')[0] };
  //       if (tokenValue) {
  //         await AsyncStorage.setItem('authToken', tokenValue);
  //         await AsyncStorage.setItem('userData', JSON.stringify(userData));
  //         setToken(tokenValue);
  //         setUser(userData);
  //         return { success: true, user: userData };
  //       }
  //       // If server responded but without token, fallthrough to fallback
  //       console.warn('Login response did not include a token, falling back to local auth');
  //     } catch (err) {
  //       console.warn('API login failed, falling back to local auth:', err?.message || err);
  //     }

  //     // Fallback/local auth (offline-friendly). This allows the frontend to function
  //     // without a backend during development. It creates a fake token and user object.
  //     const fallbackToken = `local-token-${Date.now()}`;
  //     const fallbackUser = { email, role: role === 'faculty' ? 'technician' : role, name: email.split('@')[0] };
  //     await AsyncStorage.setItem('authToken', fallbackToken);
  //     await AsyncStorage.setItem('userData', JSON.stringify(fallbackUser));
  //     setToken(fallbackToken);
  //     setUser(fallbackUser);
  //     return { success: true, user: fallbackUser, fallback: true };
  //   } catch (error) {
  //     console.error('Login error:', error?.response?.data || error.message);
  //     return { success: false, error: 'Login failed' };
  //   }
  // };
   
  const login = async (email, password) => {
  try {
    // Send correct JSON payload
    const res = await api.post(
      'http://192.168.1.5:8000/api/v1/auth/login',
      { email, password }, // use field names exactly as backend expects
      { headers: { 'Content-Type': 'application/json' } }
    );
    
    // Extract token & user data
    const tokenValue = res.data?.access_token || res.data?.token || res.data?.jwt || res.data?.tokenValue;
    const rawUser = res.data?.user || res.data?.userData || { email, name: email.split('@')[0] };
    const userData = normalizeUser(rawUser);

    if (tokenValue) {
      await AsyncStorage.setItem('authToken', tokenValue);
      await AsyncStorage.setItem('userData', JSON.stringify(userData));
      setToken(tokenValue);
      setUser(userData);
      return { success: true, user: userData };
    }

    console.warn('Login response did not include a token');
    return { success: false, error: 'No token returned from server' };
  } catch (err) {
    console.warn('API login failed, falling back to local auth:', err?.response?.data || err.message);

    // Offline fallback
    const fallbackToken = `local-token-${Date.now()}`;
    const fallbackUser = normalizeUser({ email, name: email.split('@')[0] });
    await AsyncStorage.setItem('authToken', fallbackToken);
    await AsyncStorage.setItem('userData', JSON.stringify(fallbackUser));
    setToken(fallbackToken);
    setUser(fallbackUser);
    return { success: true, user: fallbackUser, fallback: true };
  }
};
  const signup = async (userData, role) => {
    try {
      const payload = {
        email: userData.email,
        password: userData.password,
        full_name: `${userData.firstName || ''} ${userData.lastName || ''}`.trim(),
        role: role === 'faculty' ? 'technician' : role,
        studentId: userData.studentId || null,
        department: userData.department || null,
        specialization: userData.specialization || null,
      };

      // Try signup endpoint(s). Support multiple backend path shapes.
      try {
        const res = await api.post('http://192.168.1.5:8000/api/v1/auth/signup', payload);
        const tokenValue = res?.data?.access_token || res?.data?.token || res?.data?.jwt || res?.data?.tokenValue;
        const createdUser = res?.data?.user || res?.data?.userData;
        if (tokenValue) {
          await AsyncStorage.setItem('authToken', tokenValue);
          const userToStore = createdUser || { email: payload.email, role: payload.role, name: payload.full_name || payload.email.split('@')[0] };
          await AsyncStorage.setItem('userData', JSON.stringify(userToStore));
          setToken(tokenValue);
          setUser(userToStore);
          return { success: true, message: 'Account created successfully!', user: userToStore };
        }
        // If signup endpoint succeeded without token, treat as success (user must log in)
        if (res && res.status >= 200 && res.status < 300) {
          return { success: true, message: 'Account created successfully!' };
        }
      } catch (err) {
        console.warn('Primary signup endpoint failed, trying alternate path or falling back:', err?.message || err);
        try {
          const res2 = await api.post('/api/v1/auth/register', payload);
          if (res2 && res2.status >= 200 && res2.status < 300) {
            return { success: true, message: 'Account created successfully!' };
          }
        } catch (err2) {
          console.warn('Alternate signup endpoint failed:', err2?.message || err2);
        }
      }

      // Fallback/local signup (development): create a fake user and token so app can continue
      const fallbackToken = `local-token-${Date.now()}`;
      const fallbackUser = {
        email: payload.email,
        role: payload.role,
        name: payload.full_name || payload.email.split('@')[0],
        studentId: payload.studentId,
        department: payload.department,
      };
      await AsyncStorage.setItem('authToken', fallbackToken);
      await AsyncStorage.setItem('userData', JSON.stringify(fallbackUser));
      setToken(fallbackToken);
      setUser(fallbackUser);
      return { success: true, message: 'Account created (local)', user: fallbackUser, fallback: true };
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

  const updateUser = async (newUser) => {
    try {
      const normalized = normalizeUser(newUser);
      setUser(normalized);
      await AsyncStorage.setItem('userData', JSON.stringify(normalized));
    } catch (err) {
      console.error('updateUser error', err);
    }
  };

  const value = {
    user,
    token,
    isLoading,
    login,
    signup,
    logout,
    updateUser,
    isAuthenticated: !!token,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
