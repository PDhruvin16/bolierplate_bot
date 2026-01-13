import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View } from 'react-native';
import { Home, Map, Store, FileText, User } from 'lucide-react-native';
import colors from '../constants/colors';
import HomeScreen from '../screens/Home/HomeScreen';
import BeatPlanScreen from '../screens/BeatPlan/BeatPlanScreen';
import OutletsScreen from '../screens/Outlets/OutletsScreen';
import RequestsScreen from '../screens/Requests/RequestsScreen';
import ProfileScreen from '../screens/Profile/ProfileScreen';

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.headerOrange,
        tabBarInactiveTintColor: colors.gray,
        tabBarStyle: {
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
          borderTopWidth: 1,
          borderTopColor: colors.border,
          backgroundColor: colors.white,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '500',
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ focused, color }) => (
            <Home size={22} color={focused ? colors.headerOrange : colors.gray} />
          ),
        }}
      />
      <Tab.Screen
        name="BeatPlan"
        component={BeatPlanScreen}
        options={{
          tabBarLabel: 'Beat Plan',
          tabBarIcon: ({ focused }) => (
            <Map size={22} color={focused ? colors.headerOrange : colors.gray} />
          ),
        }}
      />
      <Tab.Screen
        name="Outlets"
        component={OutletsScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <Store size={22} color={focused ? colors.headerOrange : colors.gray} />
          ),
        }}
      />
      <Tab.Screen
        name="Requests"
        component={RequestsScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <FileText size={22} color={focused ? colors.headerOrange : colors.gray} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <User size={22} color={focused ? colors.headerOrange : colors.gray} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;
