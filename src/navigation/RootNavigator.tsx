import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import AppNavigator from './AppNavigator';
import AuthNavigator from './AuthNavigator';
import NoInternetScreen from '../screens/NoInternet/NoInternetScreen';

type Props = {
  isAuthenticated: boolean;
};

const Stack = createStackNavigator();

const RootNavigator = ({ isAuthenticated }: Props) => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="MainApp"
        component={isAuthenticated ? AppNavigator : AuthNavigator}
      />
      <Stack.Screen name="NoInternet" component={NoInternetScreen} />
    </Stack.Navigator>
  );
};

export default RootNavigator;

