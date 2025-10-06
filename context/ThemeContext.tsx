import React, { createContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  DarkTheme as NavDarkTheme,
  DefaultTheme as NavDefaultTheme,
  Theme as NavTheme,
} from '@react-navigation/native';

type ThemeName = 'light' | 'dark';

interface ThemeContextProps {
  themeName: ThemeName;
  navigationTheme: NavTheme;
  setThemeName: (t: ThemeName) => void;
}

export const ThemeContext = createContext<ThemeContextProps>({
  themeName: 'light',
  navigationTheme: NavDefaultTheme,
  setThemeName: () => {},
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [themeName, setThemeNameState] = useState<ThemeName>('light');
  const STORAGE_KEY = 'theme';

  useEffect(() => {
    (async () => {
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEY);
        if (saved === 'dark' || saved === 'light') {
          setThemeNameState(saved);
        }
      } catch (e) {
        console.warn('Failed to load theme from storage', e);
      }
    })();
  }, []);

  const setThemeName = async (newTheme: ThemeName) => {
    try {
      setThemeNameState(newTheme);
      await AsyncStorage.setItem(STORAGE_KEY, newTheme);
    } catch (e) {
      console.warn('Failed to save theme', e);
    }
  };

  const navigationTheme = themeName === 'dark' ? NavDarkTheme : NavDefaultTheme;

  return (
    <ThemeContext.Provider value={{ themeName, navigationTheme, setThemeName }}>
      {children}
    </ThemeContext.Provider>
  );
};
