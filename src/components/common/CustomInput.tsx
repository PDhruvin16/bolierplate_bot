import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInputProps,
} from 'react-native';
// import { COLORS } from '../../context/ThemeContext';
import { InputProps } from '../../types/components';
import { useTheme } from '../../context/ThemeContext';
import colors from '../../constants/colors';

const CustomInput: React.FC<InputProps & TextInputProps> = ({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry = false,
  keyboardType = 'default',
  autoCapitalize = 'none',
  autoCorrect = false,
  multiline = false,
  numberOfLines = 1,
  error,
  disabled = false,
  leftIcon,
  rightIcon,
  onRightIconPress,
  style,
  inputStyle,
  required = false,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { theme } = useTheme();
  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const themedStyle = {
    label: {
      ...styles.label,
      color: theme === 'dark' ? '#ffffff' : colors.dark,
    },
  };
  const getInputStyle = () => {
    const baseStyle: any[] = [styles.input];

    if (isFocused) {
      baseStyle.push(styles.focused);
    }

    if (error) {
      baseStyle.push(styles.error);
    }

    if (disabled) {
      baseStyle.push(styles.disabled);
    }

    if (leftIcon) {
      baseStyle.push(styles.inputWithLeftIcon);
    }

    if (rightIcon || secureTextEntry) {
      baseStyle.push(styles.inputWithRightIcon);
    }

    return [baseStyle, inputStyle];
  };

  const renderRightIcon = () => {
    if (secureTextEntry) {
      return (
        <TouchableOpacity
          style={styles.iconContainer}
          onPress={togglePasswordVisibility}
        >
          <Text style={styles.iconText}>{showPassword ? '👁️' : '👁️‍🗨️'}</Text>
        </TouchableOpacity>
      );
    }

    if (rightIcon) {
      const content =
        typeof rightIcon === 'string' ? (
          <Text style={styles.iconText}>{rightIcon}</Text>
        ) : (
          rightIcon
        );
      return (
        <TouchableOpacity
          style={styles.iconContainer}
          onPress={onRightIconPress}
        >
          {content}
        </TouchableOpacity>
      );
    }

    return null;
  };

  return (
    <View style={[styles.container, style]}>
      {label && (
        <Text style={themedStyle.label}>
          {label}
          {required && <Text style={styles.required}> *</Text>}
        </Text>
      )}

      <View
        style={[
          styles.inputContainer,
          isFocused ? styles.focused : null,
          error ? styles.error : null,
          disabled ? styles.disabled : null,
        ]}
      >
        {leftIcon && (
          <View style={styles.leftIconContainer}>
            {typeof leftIcon === 'string' ? (
              <Text style={styles.iconText}>{leftIcon}</Text>
            ) : (
              leftIcon
            )}
          </View>
        )}

        <TextInput
          style={getInputStyle()}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={
            theme === 'dark' ? colors.lightGray : colors.gray
          }
          secureTextEntry={secureTextEntry && !showPassword}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          autoCorrect={autoCorrect}
          multiline={multiline}
          numberOfLines={numberOfLines}
          editable={!disabled}
          onFocus={handleFocus}
          onBlur={e => {
            handleBlur();
            props?.onBlur && props.onBlur(e);
          }}
          {...props}
        />

        {renderRightIcon()}
      </View>

      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.dark,
    marginBottom: 8,
  },
  required: {
    color: colors.error,
  },

  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E9ECEF',
    borderRadius: 7,
    borderBottomColor: '#707070', // purple focus like the button
    // backgroundColor: '#F8F9FA',
  },
  input: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#000',
  },
  focused: {
    // borderColor: '#7B68EE', // purple focus like the button
    borderBottomColor: '#0F6CBD',
    // backgroundColor: '#FFFFFF',
  },
  iconContainer: {
    paddingHorizontal: 14,
  },
  iconText: {
    fontSize: 18,
    color: '#6C757D',
  },

  inputWithLeftIcon: {
    paddingLeft: 8,
  },
  inputWithRightIcon: {
    paddingRight: 8,
  },

  error: {
    borderColor: colors.error,
  },
  disabled: {
    backgroundColor: colors.lightGray,
    opacity: 0.6,
  },
  leftIconContainer: {
    paddingLeft: 16,
    paddingRight: 8,
  },
  // iconContainer: {
  //   paddingHorizontal: 16,
  // },
  // iconText: {
  //   fontSize: 18,
  // },
  errorText: {
    color: colors.error,
    fontSize: 14,
    marginTop: 4,
  },
});

CustomInput.displayName = 'CustomInput';

export default CustomInput;
