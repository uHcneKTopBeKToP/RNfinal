import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import DrawerNavigation from './navigation/DrawerNavigation';
import { ThemeProvider, ThemeContext } from './context/ThemeContext';

function AppContent() {
  const { theme } = useContext(ThemeContext);
  return (
    <NavigationContainer theme={theme}>
      <DrawerNavigation />
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}
