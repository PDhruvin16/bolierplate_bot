import React, { use } from 'react';
import { View, StyleSheet } from 'react-native';
import MainCard from './MainCard';
import PercentageCard from './PercentageCard';
import { useTheme } from '../../context/ThemeContext';
import {COLORS} from '../../context/ThemeContext';

interface DashboardCardProps {
  icon: React.ReactNode;
  number: string | number;
  label: string;
  percentageChange: string;
  isPositive: boolean;
}

const DashboardCard: React.FC<DashboardCardProps> = ({
  icon,
  number,
  label,
  percentageChange,
  isPositive,
}) => {
  const { theme } = useTheme();
  
  return (
    <View style={styles.cardContainer}>
      <MainCard icon={icon} number={number} label={label} />
      <PercentageCard
        percentageChange={percentageChange}
        isPositive={isPositive}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    flex: 1,
    height: 120,
    gap: 8,
    // backgroundColor: COLORS.background1,
  },
});

export default DashboardCard;
