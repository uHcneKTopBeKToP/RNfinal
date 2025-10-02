import React, { useContext } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { ThemeContext } from '../context/ThemeContext';

export default function ThemeScreen() {
  const { toggleTheme, isDark } = useContext(ThemeContext);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        Current theme: {isDark ? 'Dark' : 'Light'}
      </Text>
      <Button
        title={isDark ? 'Switch to Light' : 'Switch to Dark'}
        onPress={toggleTheme}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  text: { fontSize: 18, marginBottom: 20 },
});
