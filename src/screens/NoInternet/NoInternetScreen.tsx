import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import networkService from '../../services/networkService';
import CustomHeader from '../../components/common/CustomHeader';
import CustomButton from '../../components/common/CustomButton';
import { useTheme } from '../../context/ThemeContext';
import { navigationRef } from '../../navigation/navigationRef';
import colors from '../../constants/colors';

const NoInternetScreen: React.FC = () => {
  const [checking, setChecking] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleRetry = useCallback(async () => {
    try {
      setChecking(true);
      setMessage(null);
      const reachable = await networkService.isInternetReachable();
      if (!reachable) {
        setMessage('Still offline. Please check your connection.');
      } else {
        if (navigationRef.isReady() && navigationRef.canGoBack()) {
          navigationRef.goBack();
        }
      }
    } catch (e) {
      setMessage('Unable to check connectivity.');
    } finally {
      setChecking(false);
    }
  }, []);

  return (
    <ThemedContainer>
      <CustomHeader
        variant={{ type: 'basic', title: 'No Internet' }}
        onSearch={undefined}
        onAdd={undefined}
        onSettings={undefined}
      />
      <View style={styles.contentBox}> 
        <View style={styles.contentContainer}>
          <Text style={styles.title}>No Data</Text>
          <Text style={styles.subtitle}>Please refresh. You appear to be offline.</Text>
          <CustomButton
            title={checking ? '' : 'Refresh'}
            onPress={handleRetry}
            disabled={checking}
            variant="primary"
            size="medium"
            style={styles.button}
          />
          {checking ? <ActivityIndicator style={styles.spinner} color={COLORS.primary} /> : null}
          {message ? <Text style={styles.message}>{message}</Text> : null}
        </View>
      </View>
    </ThemedContainer>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.dark,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: colors.gray,
    marginBottom: 20,
    textAlign: 'center',
  },
  button: {
    alignSelf: 'center',
    width: 200,
  },
  message: {
    marginTop: 12,
    color: colors.error,
  },
  spinner: {
    marginTop: 12,
  },
  contentBox: {
    backgroundColor: '#ECEFF5',
    borderRadius: 12,
    marginHorizontal: 20,
    marginVertical: 8,
    flex: 1,
  },
  contentContainer: {
    paddingVertical: 32,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
});

export default NoInternetScreen;

// Themed container wrapper to match Dashboard background behavior
const ThemedContainer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { theme } = useTheme();
  const themedStyles = {
    container: {
      flex: 1,
      backgroundColor: theme === 'dark' ? '#000000' : COLORS.background1,
    },
  } as const;
  return <View style={themedStyles.container}>{children}</View>;
};


