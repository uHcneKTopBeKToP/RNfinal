import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import BottomTabs from './BottomTabs';
import ProfileScreen from '../screens/ProfileScreen';
import LanguageScreen from '../screens/LanguageScreen';
import ThemeScreen from '../screens/ThemeScreen';

const Drawer = createDrawerNavigator();

export default function DrawerNavigation() {
  return (
    <Drawer.Navigator>
      <Drawer.Screen
        name="HomeTabs"
        component={BottomTabs}
        options={{ title: 'Home' }}
      />
      <Drawer.Screen name="Profile" component={ProfileScreen} />
      <Drawer.Screen name="Language" component={LanguageScreen} />
      <Drawer.Screen name="Theme" component={ThemeScreen} />
      <Drawer.Screen name="Logout" component={ProfileScreen} />
    </Drawer.Navigator>
  );
}
