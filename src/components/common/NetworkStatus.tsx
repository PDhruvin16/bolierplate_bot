import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { useNetworkState } from '../../hooks/useRedux';
import { navigationRef } from '../../navigation/navigationRef';
import { COLORS } from '../../context/ThemeContext';

const NetworkStatus: React.FC = () => {
  const { isConnected, connectionType, isInternetReachable } =
    useNetworkState();

  const wasOfflineRef = useRef(false);

  useEffect(() => {
    const isOffline = !(isConnected && isInternetReachable);
    if (isOffline) {
      wasOfflineRef.current = true;
      if (navigationRef.isReady()) {
        navigationRef.navigate('NoInternet' as never);
      }
    } else if (wasOfflineRef.current) {
      // Return to previous screen when back online
      if (navigationRef.isReady() && navigationRef.canGoBack()) {
        navigationRef.goBack();
      }
      wasOfflineRef.current = false;
    }
  }, [isConnected, isInternetReachable]);

  if (isConnected && isInternetReachable) return null;

 
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignItems: 'center',
    zIndex: 1000,
  },
  text: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '600',
  },
  subText: {
    color: COLORS.white,
    fontSize: 12,
    opacity: 0.8,
    marginTop: 2,
  },
});

export default NetworkStatus;
