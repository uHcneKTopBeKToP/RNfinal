import React, { useContext } from 'react';
import { Text, TextProps } from 'react-native';
import { ThemeContext } from '../context/ThemeContext';

export default function ThemedText(props: TextProps) {
  const { navigationTheme } = useContext(ThemeContext);

  return (
    <Text
      {...props}
      style={[
        { color: navigationTheme.colors.text },
        props.style,
      ]}
    >
      {props.children}
    </Text>
  );
}
