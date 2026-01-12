import React, { useEffect } from 'react';
import { StatusBar, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import networkService from './services/networkService';
import NetworkStatus from './components/common/NetworkStatus';
import Loader from './components/common/Loader';
import { useAuthState, useAppDispatch } from './hooks/useRedux';
import { checkAuthStatus } from './store/slices/authSlice';
import { navigationRef } from './navigation/navigationRef';
import startupService from './services/startupService';
import RootNavigator from './navigation/RootNavigator';
import AppProviders from './providers/AppProviders';

const AppContent = () => {
  const dispatch = useAppDispatch();
  const { isAuthenticated, isLoading } = useAuthState();

  // Initialize network monitoring
  useEffect(() => {
    networkService.initialize();
    dispatch(checkAuthStatus());
    // Initialize permissions and folders at app start
    startupService.initializeAppOnStart();

    return () => {
      networkService.cleanup();
    };
  }, [dispatch]);

  if (isLoading) {
    return <Loader visible={true} text="Loading..." />;
  }

  return (
    <View style={{ flex: 1 }}>
      <StatusBar
        translucent
        barStyle="light-content"
        backgroundColor="transparent"
      />
      <NavigationContainer ref={navigationRef}>
        <NetworkStatus />
        <RootNavigator isAuthenticated={isAuthenticated} />
      </NavigationContainer>
    </View>
  );
};
const App = () => {
  return (
    <AppProviders>
      <AppContent />
    </AppProviders>
  );
};

export default App;
