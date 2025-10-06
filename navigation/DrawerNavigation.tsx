import React, { useContext } from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { useTranslation } from 'react-i18next';
import BottomTabs from './BottomTabs';
import ProfileScreen from '../screens/ProfileScreen';
import SettingsScreen from '../screens/SettingsScreen';
import { AuthContext } from '../context/AuthContext';

const Drawer = createDrawerNavigator();

export default function DrawerNavigation() {
  const { t } = useTranslation();
  const { logout } = useContext(AuthContext); 

  return (
    <Drawer.Navigator>
      <Drawer.Screen
        name="HomeTabs"
        component={BottomTabs}
        options={{ title: t('home') }}
      />
      <Drawer.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ title: t('profile') }}
      />
      <Drawer.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ title: t('settings') }}
      />
      <Drawer.Screen
        name="Logout"
        component={ProfileScreen} 
        options={{ title: t('logout') }}
        listeners={{
          drawerItemPress: (e) => {
            e.preventDefault(); 
            logout();
          },
        }}
      />
    </Drawer.Navigator>
  );
}
