import {COLORS} from '../../context/ThemeContext';
import { useTheme } from '../../context/ThemeContext';
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface PercentageCardProps {
  percentageChange: string;
  isPositive: boolean;
}

const PercentageCard: React.FC<PercentageCardProps> = ({
  percentageChange,
  isPositive,
}) => {
  const { theme } = useTheme();
  const themedstyle = {
    card: {
      ...styles.card,
      backgroundColor: theme === 'dark' ? '' : COLORS.background,
    },
    percentageView: {
      ...styles.percentageView,
      backgroundColor: isPositive ? '#E1F6E7' : '#F6E1E1',
    },
    percentageText: {
      ...styles.percentageText,
      color: isPositive ? '#34C759' : '#FF3B30',
    },
    label: {
      ...styles.label,
      color: theme === 'dark' ? '#FFFFFF' : COLORS.dark,
    },
  };

  return (
    <View style={themedstyle.card}>
      <View
        style={[
          styles.percentageView,
          { backgroundColor: isPositive ? '#E1F6E7' : '#F6E1E1' },
        ]}
      >
        <Text
          style={[
            styles.percentageText,
            { color: isPositive ? '#34C759' : '#FF3B30' },
          ]}
        >
          {isPositive ? '↗' : '↘'} {percentageChange}
        </Text>
      </View>
      <Text style={themedstyle.label}>From last year</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
    // backgroundColor: COLORS.background,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    
  },
  label: {
    fontSize: 10,
    fontWeight: '500',
    color: COLORS.text,
    lineHeight: 14,
  },

  percentageView: {
    borderRadius: 8.88,
    paddingHorizontal: 8,
    paddingVertical: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  percentageText: {
    fontSize: 10,
    fontWeight: '500',
    lineHeight: 14,
    color: COLORS.text,
  },
});

export default PercentageCard;
