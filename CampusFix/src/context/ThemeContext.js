import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(true); // Default to dark mode
  const [isLoading, setIsLoading] = useState(true);

  // Load theme preference from storage
  useEffect(() => {
    loadThemePreference();
  }, []);

  const loadThemePreference = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem('theme_preference');
      if (savedTheme !== null) {
        setIsDarkMode(savedTheme === 'dark');
      }
    } catch (error) {
      console.log('Error loading theme preference:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleTheme = async () => {
    try {
      const newTheme = !isDarkMode;
      setIsDarkMode(newTheme);
      await AsyncStorage.setItem('theme_preference', newTheme ? 'dark' : 'light');
    } catch (error) {
      console.log('Error saving theme preference:', error);
    }
  };

  const setTheme = async (isDark) => {
    try {
      setIsDarkMode(isDark);
      await AsyncStorage.setItem('theme_preference', isDark ? 'dark' : 'light');
    } catch (error) {
      console.log('Error saving theme preference:', error);
    }
  };

  const theme = {
    isDarkMode,
    isLoading,
    toggleTheme,
    setTheme,
    colors: isDarkMode ? {
      // Dark theme colors
      background: '#1a1a1a',
      surface: '#2a2a2a',
      surfaceVariant: '#3a3a3a',
      primary: '#4CAF50',
      secondary: '#2196F3',
      accent: '#FF9800',
      error: '#f44336',
      text: '#ffffff',
      textSecondary: '#888888',
      textTertiary: '#666666',
      border: '#3a3a3a',
      success: '#4CAF50',
      warning: '#FF9800',
      info: '#2196F3',
    } : {
      // Light theme colors
      background: '#ffffff',
      surface: '#f5f5f5',
      surfaceVariant: '#e0e0e0',
      primary: '#4CAF50',
      secondary: '#2196F3',
      accent: '#FF9800',
      error: '#f44336',
      text: '#000000',
      textSecondary: '#666666',
      textTertiary: '#888888',
      border: '#e0e0e0',
      success: '#4CAF50',
      warning: '#FF9800',
      info: '#2196F3',
    }
  };

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
};

