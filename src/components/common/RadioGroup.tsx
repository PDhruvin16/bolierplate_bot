import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { COLORS } from '../../context/ThemeContext';
import { FONTS } from '../../constants/fonts';

export interface RadioOption {
  id: string;
  label: string;
}

export interface RadioGroupProps {
  value: string | null;
  onChange: (id: string) => void;
  options: RadioOption[];
  disabled?: boolean;
  horizontal?: boolean;
  containerStyle?: ViewStyle;
  label?: string;
  labelStyle?: TextStyle;
}

const RadioGroup: React.FC<RadioGroupProps> = ({
  value,
  onChange,
  options,
  disabled = false,
  horizontal = false,
  containerStyle,
  label,
  labelStyle,
}) => {
  return (
    <View style={containerStyle}>
      {label ? (
        <Text style={[styles.groupLabel, labelStyle]}>{label}</Text>
      ) : null}
      <View
        style={[
          styles.row,
          horizontal && styles.rowHorizontal,
          disabled && { opacity: 0.6 },
        ]}
      >
        {options.map(opt => (
          <TouchableOpacity
            key={opt.id}
            style={styles.item}
            activeOpacity={0.7}
            onPress={() => !disabled && onChange(opt.id)}
            disabled={disabled}
          >
            <View style={styles.radioOuter}>
              {value === opt.id ? <View style={styles.radioInner} /> : null}
            </View>
            <Text style={styles.label}>{opt.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  groupLabel: {
    fontSize: FONTS.sm,
    color: COLORS.dark,
    marginBottom: 8,
    fontWeight: '500',
  },
  row: {
    flexDirection: 'column',
    gap: 10,
  },
  rowHorizontal: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.white,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.primary,
  },
  label: {
    fontSize: FONTS.sm,
    color: COLORS.dark,
  },
});

export default RadioGroup;
