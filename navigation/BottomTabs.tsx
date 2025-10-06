import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';

import CalendarScreen from '../screens/CalendarScreen';
import NewViolationScreen from '../screens/NewViolationScreen';

const Tab = createBottomTabNavigator();

export default function BottomTabs() {
  const { t } = useTranslation();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName: string = '';

          if (route.name === 'Calendar') iconName = 'calendar-outline';
          else if (route.name === 'Map') iconName = 'map-outline';
          else if (route.name === 'New') iconName = 'add-circle-outline';

          return <Ionicons name={iconName as keyof typeof Ionicons.glyphMap} size={size} color={color} />;

        },
      })}
    >
      <Tab.Screen
        name="New"
        component={NewViolationScreen}
        options={{ tabBarLabel: t('newIncident'), headerShown: false  }
        }
      />
      <Tab.Screen
        name="Calendar"
        component={CalendarScreen}
        options={{ tabBarLabel: t('calendar'), headerShown: false }}
      />
      
    </Tab.Navigator>
  );
}
