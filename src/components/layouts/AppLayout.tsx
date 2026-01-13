import React, { ReactNode } from 'react';
import { View, StyleSheet, StatusBar, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomHeader, { CustomHeaderProps } from '../common/CustomHeader';
import colors from '../../constants/colors';
import LinearGradient from 'react-native-linear-gradient';

interface AppLayoutProps {
  children: ReactNode;
  headerProps?: CustomHeaderProps;
  showHeader?: boolean;
}

const AppLayout: React.FC<AppLayoutProps> = ({
  children,
  headerProps,
  showHeader = true,
}) => {
  const shouldShowHeader = showHeader && headerProps;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar
        translucent
        barStyle="light-content"
        backgroundColor="transparent"
      />

      <LinearGradient
        colors={[colors.headerGradientStart, colors.headerGradientEnd]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.gradientBar}
      />

      {shouldShowHeader && headerProps ? (
        <CustomHeader {...headerProps} />
      ) : null}
      <View style={styles.content}>{children}</View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  content: {
    flex: 1,
    backgroundColor: colors.background,
  },
  gradientBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: Platform.OS === 'ios' ? 70 : 55,
  },
});

export default AppLayout;
