import React from 'react';
import { View, StyleSheet } from 'react-native';
import CustomButton from './CustomButton';
import { useTheme } from '../../context/ThemeContext';
import {COLORS} from '../../context/ThemeContext';
// import CustomButton from './CustomButton';

interface FooterButtonGroupProps {
  onSave: () => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

const FooterButtonGroup: React.FC<FooterButtonGroupProps> = ({
  onSave,
  onCancel,
  isSubmitting = false,
}) => {
  const { theme } = useTheme();
  const themedStyles = {
    footer: {
      ...styles.footer,
      backgroundColor: COLORS.background,
      borderColor: theme === 'dark' ? '#2F2F2F' : '#E0E0E0',
    },
  };
  return (
    <View style={themedStyles.footer}>
      <CustomButton
        title="Save"
        onPress={onSave}
        loading={isSubmitting}
        size="medium"
        variant="custom"
        customColors="#0F6CBD"
        style={styles.saveButton}
      />
      <CustomButton
        title="Cancel"
        onPress={onCancel}
        size="medium"
        variant="outline"
        style={styles.cancelButton}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    // flex: 1,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderColor: '#E0E0E0',
  },
  saveButton: {
    flex: 1,
    marginRight: 8,
    minHeight: 48,
    minWidth: 50,
  },
  cancelButton: {
    flex: 1,
    marginLeft: 8,
    minHeight: 48,
    minWidth: 50,
  },
});

export default FooterButtonGroup;
