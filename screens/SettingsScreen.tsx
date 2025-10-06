import React, { useContext } from 'react';
import { View, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemeContext } from '../context/ThemeContext';
import ThemedText from '../components/ThemedText';
import { useTranslation } from 'react-i18next';

export default function ThemeScreen() {
  const { themeName, setThemeName } = useContext(ThemeContext);
  const { i18n } = useTranslation();

  const isDark = themeName === 'dark';

  const languages = [
    { code: 'uk', label: 'Українська' },
    { code: 'en', label: 'English' },
  ];

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#121212' : '#fff' }]}>
      <ThemedText style={styles.title}>{i18n.t('theme')}</ThemedText>

      <TouchableOpacity style={styles.option} onPress={() => setThemeName('light')}>
        <Ionicons
          name={themeName === 'light' ? 'radio-button-on' : 'radio-button-off'}
          size={24}
          color={themeName === 'light' ? '#007AFF' : '#9AA0A6'}
        />
        <ThemedText style={styles.optionText}>🌞 {i18n.t('lightTheme')}</ThemedText>
      </TouchableOpacity>

      <TouchableOpacity style={styles.option} onPress={() => setThemeName('dark')}>
        <Ionicons
          name={themeName === 'dark' ? 'radio-button-on' : 'radio-button-off'}
          size={24}
          color={themeName === 'dark' ? '#007AFF' : '#9AA0A6'}
        />
        <ThemedText style={styles.optionText}>🌙 {i18n.t('darkTheme')}</ThemedText>
      </TouchableOpacity>

      <ThemedText style={[styles.title, { marginTop: 30 }]}>{i18n.t('language')}</ThemedText>

      {languages.map(lang => (
        <TouchableOpacity
          key={lang.code}
          style={styles.option}
          onPress={() => i18n.changeLanguage(lang.code)}
        >
          <Ionicons
            name={i18n.language === lang.code ? 'radio-button-on' : 'radio-button-off'}
            size={24}
            color={i18n.language === lang.code ? '#007AFF' : '#9AA0A6'}
          />
          <ThemedText style={styles.optionText}>{lang.label}</ThemedText>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 20, marginBottom: 20, fontWeight: '600' },
  option: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  optionText: { marginLeft: 12, fontSize: 18 },
  flag: { width: 24, height: 24, marginLeft: 12, borderRadius: 4 },
});
