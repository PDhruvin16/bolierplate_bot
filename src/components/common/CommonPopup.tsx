import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  Switch,
  Dimensions,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { FONTS } from '../../constants/fonts';
import CustomButton from './CustomButton';
import colors from '../../constants/colors';

const { width } = Dimensions.get('window');

export interface PopupField {
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  type?: 'text' | 'search';
}

export interface PopupToggle {
  label: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
}

export interface CommonPopupProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  message?: string;
  fields?: PopupField[];
  toggles?: PopupToggle[];
  primaryButtonText?: string;
  secondaryButtonText?: string;
  onPrimaryPress?: () => void;
  onSecondaryPress?: () => void;
  showButtons?: boolean;
  variant?: 'delete' | 'warning' | 'template' | 'settings';
}

const CommonPopup: React.FC<CommonPopupProps> = ({
  visible,
  onClose,
  title,
  message,
  fields = [],
  toggles = [],
  primaryButtonText = 'Apply',
  secondaryButtonText = 'Cancel',
  onPrimaryPress,
  onSecondaryPress,
  showButtons = true,
  variant = 'template',
}) => {
  const handlePrimaryPress = () => {
    if (onPrimaryPress) {
      onPrimaryPress();
    }
    onClose();
  };

  const handleSecondaryPress = () => {
    if (onSecondaryPress) {
      onSecondaryPress();
    }
    onClose();
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'delete':
        return {
          primaryButtonStyle: styles.deleteButton,
          primaryButtonTextStyle: styles.deleteButtonText,
        };
      case 'warning':
        return {
          primaryButtonStyle: styles.warningButton,
          primaryButtonTextStyle: styles.warningButtonText,
        };
      default:
        return {
          primaryButtonStyle: styles.primaryButton,
          primaryButtonTextStyle: styles.primaryButtonText,
        };
    }
  };

  const variantStyles = getVariantStyles();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.popupContainer}>
          {/* Drag Handle */}
          <View style={styles.dragHandle} />

          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>{title}</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeIcon}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Content */}
          <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 20 : 0}
          >
            <ScrollView
              style={styles.scroll}
              contentContainerStyle={styles.content}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
               bounces={false}
            >
              {message && <Text style={styles.message}>{message}</Text>}

              {/* Input Fields */}
              {fields.map((field, index) => (
                <View key={index} style={styles.fieldContainer}>
                  <Text style={styles.fieldLabel}>{field.label}</Text>
                  <View style={styles.inputContainer}>
                    <TextInput
                      style={styles.input}
                      placeholder={field.placeholder}
                      value={field.value}
                      onChangeText={field.onChangeText}
                      placeholderTextColor={colors.gray}
                    />
                    {field.type === 'search' && (
                      <TouchableOpacity style={styles.searchIcon}>
                        <Text style={styles.searchIconText}>🔍</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              ))}

              {/* Toggle Switches */}
              {toggles.map((toggle, index) => (
                <View key={index} style={styles.toggleContainer}>
                  <Text style={styles.toggleLabel}>{toggle.label}</Text>
                  <View style={styles.toggleWrapper}>
                    <Text style={styles.toggleStatus}>
                      {toggle.value ? 'Yes' : 'No'}
                    </Text>
                    <Switch
                      value={toggle.value}
                      onValueChange={toggle.onValueChange}
                      trackColor={{
                        false: colors.lightGray,
                        true: colors.success,
                      }}
                      thumbColor={toggle.value ? colors.white : colors.white}
                    />
                  </View>
                </View>
              ))}
            </ScrollView>
          </KeyboardAvoidingView>

          {/* Action Buttons */}
          {showButtons && (
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={handleSecondaryPress}
              >
                <Text style={styles.secondaryButtonText}>
                  {secondaryButtonText}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={variantStyles.primaryButtonStyle}
                onPress={handlePrimaryPress}
              >
                <Text style={variantStyles.primaryButtonTextStyle}>
                  {primaryButtonText}
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Home Indicator */}
          <View style={styles.homeIndicator} />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  popupContainer: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 0,
    maxHeight: '85%',
    minHeight: 300,
  },
  dragHandle: {
    width: 40,
    height: 4,
    backgroundColor: colors.lightGray,
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    fontSize: FONTS.lg,
    fontWeight: '600',
    color: colors.dark,
  },
  closeButton: {
    padding: 4,
  },
  closeIcon: {
    fontSize: 20,
    color: colors.gray,
    fontWeight: 'bold',
  },
  scroll: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  message: {
    fontSize: FONTS.base,
    color: colors.dark,
    lineHeight: 24,
    marginBottom: 24,
    flexShrink: 1,
  },
  fieldContainer: {
    marginBottom: 24,
  },
  fieldLabel: {
    fontSize: FONTS.sm,
    fontWeight: '500',
    color: colors.dark,
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: colors.white,
    minHeight: 44,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: FONTS.base,
    color: colors.dark,
    minHeight: 20,
  },
  searchIcon: {
    padding: 4,
  },
  searchIconText: {
    fontSize: 16,
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingVertical: 4,
  },
  toggleLabel: {
    fontSize: FONTS.base,
    color: colors.dark,
    flex: 1,
  },
  toggleWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  toggleStatus: {
    fontSize: FONTS.sm,
    color: colors.gray,
    marginRight: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 20,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  secondaryButton: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButtonText: {
    fontSize: FONTS.base,
    fontWeight: '500',
    color: colors.dark,
  },
  primaryButton: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    fontSize: FONTS.base,
    fontWeight: '500',
    color: colors.white,
  },
  deleteButton: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
    backgroundColor: colors.error,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteButtonText: {
    fontSize: FONTS.base,
    fontWeight: '500',
    color: colors.white,
  },
  warningButton: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
    backgroundColor: colors.warning,
    alignItems: 'center',
    justifyContent: 'center',
  },
  warningButtonText: {
    fontSize: FONTS.base,
    fontWeight: '500',
    color: colors.white,
  },
  homeIndicator: {
    width: 134,
    height: 5,
    backgroundColor: colors.dark,
    borderRadius: 3,
    alignSelf: 'center',
    marginTop: 8,
    marginBottom: 8,
  },
});

export default CommonPopup;
