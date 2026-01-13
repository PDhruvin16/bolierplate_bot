import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { FONTS } from '../../constants/fonts';
import { renderLogo } from '../../utils/renderlogo';
import icons from '../../constants/icons';
import colors from '../../constants/colors';

export interface CheckboxProps {
  label?: string;
  checked: boolean;
  onChange: (next: boolean) => void;
  disabled?: boolean;
  containerStyle?: ViewStyle;
  labelStyle?: TextStyle;
}

const Checkbox: React.FC<CheckboxProps> = ({
  label,
  checked,
  onChange,
  disabled = false,
  containerStyle,
  labelStyle,
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() => !disabled && onChange(!checked)}
      style={[styles.container, containerStyle, disabled && { opacity: 0.6 }]}
      disabled={disabled}
    >
      <View style={[styles.checkbox, checked && styles.checkedBox]}>
        {checked && renderLogo(icons.check, { width: 12, height: 12 })}
      </View>
      {label ? <Text style={[styles.label, labelStyle]}>{label}</Text> : null}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 4,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: colors.gray,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkedBox: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  checkmark: {
    color: colors.white,
    fontSize: 12,
    fontWeight: 'bold',
  },
  label: {
    fontSize: FONTS.sm,
    color: colors.dark,
  },
});

export default Checkbox;
