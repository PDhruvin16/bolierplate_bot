import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { FONTS } from '../../constants/fonts';
import { ButtonProps } from '../../types/components';
import colors from '../../constants/colors';

// Add customColors prop to ButtonProps
interface CustomButtonProps extends ButtonProps {
  customColors?: string | string[];
}

const CustomButton: React.FC<CustomButtonProps> = ({
  title,
  onPress,
  style,
  textStyle,
  disabled = false,
  loading = false,
  variant = 'primary',
  size = 'medium',
  icon,
  customColors, // new prop
}) => {
  const getButtonSizeStyle = (): ViewStyle => {
    switch (size) {
      case 'small':
        return styles.small;
      case 'large':
        return styles.large;
      default:
        return styles.medium;
    }
  };

  const getTextStyle = (): TextStyle[] => {
    const baseTextStyle: TextStyle[] = [
      styles.text,
      styles[`${size}Text`] as TextStyle,
    ];

    switch (variant) {
      case 'secondary':
        baseTextStyle.push(styles.secondaryText as TextStyle);
        break;
      case 'outline':
        baseTextStyle.push(styles.outlineText as TextStyle);
        break;
      case 'gray':
        baseTextStyle.push(styles.grayText as TextStyle);
        break;
      case 'light':
        baseTextStyle.push(styles.lightText as TextStyle);
        break;
      default:
        baseTextStyle.push(styles.primaryText as TextStyle);
    }

    if (disabled) {
      baseTextStyle.push(styles.disabledText as TextStyle);
    }

    return [baseTextStyle, textStyle].filter(Boolean) as TextStyle[];
  };

  const renderContent = () => {
    if (loading) {
      return (
        <ActivityIndicator
          color={
            variant === 'outline' || variant === 'gray' || variant === 'light'
              ? colors.dark
              : colors.white
          }
          size="small"
        />
      );
    }

    return (
      <View style={styles.contentContainer}>
        {icon && <Text style={[getTextStyle(), styles.iconText]}>+</Text>}
        <Text style={getTextStyle() as any}>{title}</Text>
        {icon && <Text style={[getTextStyle(), styles.iconText]}>+</Text>}
      </View>
    );
  };

  // New variant: custom
  if (variant === 'custom') {
    // If customColors is array, use LinearGradient
    if (Array.isArray(customColors) && customColors.length > 1) {
      return (
        <TouchableOpacity
          onPress={onPress}
          disabled={disabled || loading}
          activeOpacity={0.8}
          style={[style]}
        >
          <LinearGradient
            colors={customColors}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{ borderRadius: 8 }}
          >
            <View
              style={[
                styles.button,
                getButtonSizeStyle(),
                disabled && styles.disabled,
              ]}
            >
              {renderContent()}
            </View>
          </LinearGradient>
        </TouchableOpacity>
      );
    }
    // If customColors is a string, use View with backgroundColor
    if (typeof customColors === 'string') {
      return (
        <TouchableOpacity
          onPress={onPress}
          disabled={disabled || loading}
          activeOpacity={0.8}
          style={[style]}
        >
          <View
            style={[
              styles.button,
              getButtonSizeStyle(),
              { backgroundColor: customColors },
              disabled && styles.disabled,
            ]}
          >
            {renderContent()}
          </View>
        </TouchableOpacity>
      );
    }
    // fallback to default color if no customColors
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={disabled || loading}
        activeOpacity={0.8}
        style={[style]}
      >
        <View
          style={[
            styles.button,
            getButtonSizeStyle(),
            { backgroundColor: colors.primary },
            disabled && styles.disabled,
          ]}
        >
          {renderContent()}
        </View>
      </TouchableOpacity>
    );
  }

  if (variant === 'primary') {
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={disabled || loading}
        activeOpacity={0.8}
        style={[style]}
      >
        <LinearGradient
          colors={['#404698', '#882785']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{ borderRadius: 8 }}
        >
          <View
            style={[
              styles.button,
              getButtonSizeStyle(),
              disabled && styles.disabled,
            ]}
          >
            {renderContent()}
          </View>
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      style={[
        styles.button,
        getButtonSizeStyle(),
        variant === 'secondary' && styles.secondary,
        variant === 'outline' && styles.outline,
        variant === 'gray' && styles.gray,
        variant === 'light' && styles.light,
        disabled && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {renderContent()}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  small: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    minHeight: 36,
  },
  medium: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    minHeight: 48,
  },
  large: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    minHeight: 56,
  },
  secondary: {
    backgroundColor: colors.secondary,
  },
  outline: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
  },
  gray: {
    backgroundColor: '#8E8E93', // Medium gray like in the image
  },
  light: {
    backgroundColor: '#F2F2F7', // Light gray like in the image
  },
  disabled: {
    opacity: 0.6,
  },
  text: {
    fontWeight: '600',
    textAlign: 'center',
  },
  iconText: {
    marginHorizontal: 8,
    fontSize: 16,
  },
  smallText: {
    fontSize: FONTS.sm,
  },
  mediumText: {
    fontSize: FONTS.base,
  },
  largeText: {
    fontSize: FONTS.lg,
  },
  primaryText: {
    color: colors.white,
  },
  secondaryText: {
    color: colors.white,
  },
  outlineText: {
    color: colors.dark,
  },
  grayText: {
    color: colors.dark,
  },
  lightText: {
    color: colors.darkGray,
  },
  disabledText: {
    color: colors.darkGray,
  },
});

export default CustomButton;
