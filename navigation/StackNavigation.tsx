import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import RegistrationScreen from '../screens/RegisterScreen';
import ViolationsScreen from '../screens/NewViolationScreen';
import CalendarScreen from '../screens/CalendarScreen';

export type RootStackParamList = {
  Registration: undefined;
  Violations: undefined;
  Calendar: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

export default function StackNavigation() {
  return (
    <Stack.Navigator
      initialRouteName="Registration" 
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Registration" component={RegistrationScreen} />
      <Stack.Screen name="Violations" component={ViolationsScreen} />
      <Stack.Screen name="Calendar" component={CalendarScreen} />
    </Stack.Navigator>
  );
}
