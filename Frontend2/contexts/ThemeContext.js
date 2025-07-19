import React, { createContext, useState, useEffect, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Appearance, useColorScheme } from 'react-native';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [isDark, setIsDark] = useState(systemColorScheme === 'dark');
  const [isThemeLoaded, setIsThemeLoaded] = useState(false);

  // Load saved theme preference
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem('themePreference');
        if (savedTheme !== null) {
          setIsDark(savedTheme === 'dark');
        }
      } catch (error) {
        console.error('Failed to load theme preference', error);
      } finally {
        setIsThemeLoaded(true);
      }
    };

    loadTheme();
  }, []);

  // Theme configuration
  const theme = useMemo(() => ({
    isDark,
    colors: {
      background: isDark ? '#121212' : '#f8f9fa',
      card: isDark ? '#1e1e1e' : '#ffffff',
      text: isDark ? '#f0f0f0' : '#333333',
      secondaryText: isDark ? '#aaaaaa' : '#666666',
      border: isDark ? '#333333' : '#e0e0e0',
      primary: isDark ? '#90caf9' : '#F8AFA6',
      danger: isDark ? '#ef9a9a' : '#e74c3c',
      // header: isDark ? '#90caf9' : '#F8AFA6', // Your pink accent color
      alertBox: isDark ? "#3E3E3E" : "#FBEFC4"
    },
    toggleTheme: async () => {
      const newMode = !isDark;
      setIsDark(newMode);
      try {
        await AsyncStorage.setItem('themePreference', newMode ? 'dark' : 'light');
      } catch (error) {
        console.error('Failed to save theme preference', error);
      }
    },
    setTheme: async (dark) => {
      setIsDark(dark);
      try {
        await AsyncStorage.setItem('themePreference', dark ? 'dark' : 'light');
      } catch (error) {
        console.error('Failed to save theme preference', error);
      }
    },
  }), [isDark]);

  if (!isThemeLoaded) {
    return null; // Or a loading indicator
  }

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
};