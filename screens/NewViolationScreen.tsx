import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function NewViolationScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>New Violation Screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  text: { fontSize: 18, fontWeight: '500' },
});
