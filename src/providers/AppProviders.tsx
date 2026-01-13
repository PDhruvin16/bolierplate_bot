import React, { ReactNode } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { QueryClientProvider } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';

import { store, persistor } from '../store';
import { queryClient } from '../services/queryClient';
// import { ThemeProvider } from '../context/ThemeContext';
import { NotificationProvider } from '../context/NotificationContext';
import Loader from '../components/common/Loader';
import { ThemeProvider } from '../context/ThemeContext';

type Props = {
  children: ReactNode;
};

/**
 * Central place to wire all app-level providers
 * so App.tsx stays minimal and boilerplate-friendly.
 */
const AppProviders = ({ children }: Props) => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <BottomSheetModalProvider>
          <Provider store={store}>
            <PersistGate
              loading={<Loader visible={true} text="Loading..." />}
              persistor={persistor}
            >
              <QueryClientProvider client={queryClient}>
                <ThemeProvider>
                  <NotificationProvider>
                    {children}
                    <Toast />
                  </NotificationProvider>
                </ThemeProvider>
              </QueryClientProvider>
            </PersistGate>
          </Provider>
        </BottomSheetModalProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

export default AppProviders;


