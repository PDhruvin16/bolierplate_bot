import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import storage from '../utils/storage';
import { dark, light } from '../constants/colors';

export type ThemeType = 'light' | 'dark';

interface ThemeContextProps {
  theme: ThemeType;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

export let COLORS = light;
const setGlobalColors = (theme: ThemeType) => {
  COLORS = theme === 'dark' ? dark : light;
};

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<ThemeType>('light');

  // Load theme from storage
  useEffect(() => {
    (async () => {
      const storedTheme = await storage.getString('app_theme');
      if (storedTheme === 'dark' || storedTheme === 'light') {
        setTheme(storedTheme);
        setGlobalColors(storedTheme);
      }
    })();
  }, []);

  // Save + update global colors when theme changes
  useEffect(() => {
    AsyncStorage.setItem('app_theme', theme);
    setGlobalColors(theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
