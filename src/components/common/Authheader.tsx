import { useTheme } from '../../context/ThemeContext';
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  ViewStyle,
  TextStyle,
  Image,
  ImageSourcePropType,
  ImageStyle,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { SvgProps } from 'react-native-svg';

interface GradientHeaderProps {
  title?: string;
  subtitle?: string;
  showBackButton?: boolean;
  onBackPress?: () => void;
  backButtonIcon?: React.ReactNode;
  headerStyle?: ViewStyle;
  titleStyle?: TextStyle;
  subtitleStyle?: TextStyle;
  gradientColors?: string[];
  /** Can be an ImageSource or an SVG React component */
  logoSource?: ImageSourcePropType | React.FC<SvgProps>;
  children?: React.ReactNode;
  logoStyle?: ImageStyle & ViewStyle;
  width?: number;
  height?: number;
}

const GradientHeader: React.FC<GradientHeaderProps> = ({
  title,
  subtitle,
  showBackButton = false,
  onBackPress,
  backButtonIcon,
  headerStyle,
  titleStyle,
  subtitleStyle,
  gradientColors = ['#404698', '#882785'],
  logoSource,
  children,
  logoStyle = {},
}) => {
  const renderLogo = () => {
    if (!logoSource) return null;

    // If it's a function, assume it's an SVG component
    if (typeof logoSource === 'function') {
      const SvgLogo = logoSource as React.FC<SvgProps>;
      return (
        <SvgLogo
          width={logoStyle?.width || 160}
          height={logoStyle?.height || 60}
          {...logoStyle}
        />
      );
    }

    // Otherwise treat as normal image
    return (
      <Image
        source={logoSource}
        style={[styles.logo, logoStyle]}
        resizeMode="contain"
      />
    );
  };
  const { theme, toggleTheme } = useTheme();

  return (
    <>
      <StatusBar barStyle="light-content" />
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={[styles.headerContainer, headerStyle]}>
          {showBackButton && (
            <TouchableOpacity
              style={styles.backButton}
              onPress={onBackPress}
              activeOpacity={0.7}
            >
              {backButtonIcon || <Text style={styles.backButtonText}>←</Text>}
            </TouchableOpacity>
          )}
          <TouchableOpacity onPress={toggleTheme} style={styles.iconButton}>
            <Text style={{ color: '#fff', fontSize: 16 }}>
              {theme === 'dark' ? '🌙' : '☀️'}
            </Text>
          </TouchableOpacity>
          <View style={styles.headerContent}>
            {children ? children : renderLogo()}

            {title && (
              <Text style={[styles.headerTitle, titleStyle]}>{title}</Text>
            )}
            {subtitle && (
              <Text style={[styles.headerSubtitle, subtitleStyle]}>
                {subtitle}
              </Text>
            )}
          </View>
        </View>
      </LinearGradient>
    </>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    paddingTop: 50,
    paddingBottom: 40,
    paddingHorizontal: 20,
    position: 'relative',
    minHeight: 280,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  backButtonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerContent: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  logo: {
    width: 160,
    height: 60,
    marginBottom: 10,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    lineHeight: 22,
  },
});

export default GradientHeader;
