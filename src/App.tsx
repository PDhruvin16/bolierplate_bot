// import React, { useEffect } from 'react';
// import { StatusBar, View } from 'react-native';
// import { NavigationContainer } from '@react-navigation/native';
// import networkService from './services/networkService';
// import NetworkStatus from './components/common/NetworkStatus';
// import Loader from './components/common/Loader';
// import { useAuthState, useAppDispatch } from './hooks/useRedux';
// import { checkAuthStatus } from './store/slices/authSlice';
// import { navigationRef } from './navigation/navigationRef';
// import notificationService, { setNavigationRef as setNotificationNavRef } from './services/notificationService';
// import startupService from './services/startupService';
// import RootNavigator from './navigation/RootNavigator';
// import AppProviders from './providers/AppProviders';

// const AppContent = () => {
//   const dispatch = useAppDispatch();
//   const authState = useAuthState();
  
//   // Safely extract values with defaults
//   const isAuthenticated = authState?.isAuthenticated ?? false;
//   const isLoading = authState?.isLoading ?? true;

//   // Initialize services
//   useEffect(() => {
//     // Initialize network monitoring
//     networkService.initialize();
    
//     // Check auth status (will restore session if user was logged in)
//     dispatch(checkAuthStatus());
    
//     // Initialize notification service with Redux dispatch
//     notificationService.setDispatch(dispatch);
    
//     // Set navigation ref for notification service
//     setNotificationNavRef(navigationRef);
    
//     // Initialize permissions and folders at app start
//     startupService.initializeAppOnStart();

//     return () => {
//       networkService.cleanup();
//     };
//   }, [dispatch]);

//   if (isLoading) {
//     return <Loader visible={true} text="Loading..." />;
//   }

//   return (
//     <View style={{ flex: 1 }}>
//       <StatusBar
//         translucent
//         barStyle="dark-content"
//         backgroundColor="transparent"
//       />
//       <NavigationContainer 
//         ref={navigationRef}
//         onReady={() => {
//           setNotificationNavRef(navigationRef);
//         }}
//       >
//         <NetworkStatus />
//         <RootNavigator isAuthenticated={isAuthenticated} />
//       </NavigationContainer>
//     </View>
//   );
// };
// const App = () => {
//   return (
//     <AppProviders>
//       <AppContent />
//     </AppProviders>
//   );
// };

// export default App;
import React, { useEffect, useState } from 'react';
import { StatusBar, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import networkService from './services/networkService';
import NetworkStatus from './components/common/NetworkStatus';
import Loader from './components/common/Loader';
import { useAuthState, useAppDispatch } from './hooks/useRedux';
import { checkAuthStatus } from './store/slices/authSlice';
import { navigationRef } from './navigation/navigationRef';
import notificationService, { setNavigationRef as setNotificationNavRef } from './services/notificationService';
import startupService from './services/startupService';
import RootNavigator from './navigation/RootNavigator';
import AppProviders from './providers/AppProviders';

const AppContent = () => {
  const dispatch = useAppDispatch();
  const authState = useAuthState();
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Safely extract values with defaults
  const isAuthenticated = authState?.isAuthenticated ?? false;
  const isLoading = authState?.isLoading ?? true;

  // Initialize services
  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Initialize network monitoring
        networkService.initialize();
        
        // Check auth status (will restore session if user was logged in)
        await dispatch(checkAuthStatus());
        
        // Initialize notification service with Redux dispatch
        notificationService.setDispatch(dispatch);
        
        // Set navigation ref for notification service
        setNotificationNavRef(navigationRef);
        
        // Initialize permissions and folders at app start
        await startupService.initializeAppOnStart();
        
        // Mark as initialized
        setIsInitialized(true);
      } catch (error) {
        console.error('App initialization error:', error);
        // Even on error, mark as initialized to show the app
        setIsInitialized(true);
      }
    };

    initializeApp();

    return () => {
      networkService.cleanup();
    };
  }, [dispatch]);

  // Show loader only during initial setup
  if (!isInitialized || isLoading) {
    return <Loader visible={true} text="Loading..." />;
  }

  return (
    <View style={{ flex: 1 }}>
      <StatusBar
        translucent
        barStyle="dark-content"
        backgroundColor="transparent"
      />
      <NavigationContainer 
        ref={navigationRef}
        onReady={() => {
          setNotificationNavRef(navigationRef);
        }}
      >
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