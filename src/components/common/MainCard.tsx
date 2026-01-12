import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../../context/ThemeContext';
import { useTheme } from '../../context/ThemeContext';

interface MainCardProps {
  icon: React.ReactNode;
  number: string | number;
  label: string;
}

const MainCard: React.FC<MainCardProps> = ({ icon, number, label }) => {
  const { theme } = useTheme();

  const themedstyle = {
    card: {
      ...styles.card,
      backgroundColor: theme === 'dark' ? '#1E1E1E' : COLORS.background,
    },
    number: {
      ...styles.number,
      color: theme === 'dark' ? '#FFFFFF' : COLORS.dark,
    },
    label: {
      ...styles.label,
      color: theme === 'dark' ? '#FFFFFF' : COLORS.dark,
    },
  };
  return (
    <View style={themedstyle.card}>
      <View style={styles.innerView}>
        <View style={styles.topSection}>
          <View style={styles.iconContainer}>{icon}</View>
          <Text style={themedstyle.number}>{number}</Text>
        </View>
        <Text style={themedstyle.label}>{label}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    padding: 16,
    // backgroundColor: '#FFFFFF',
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  innerView: {
    justifyContent: 'space-between',
  },
  topSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 35,
  },
  iconContainer: {
    borderRadius: 10.42,
    padding: 8,
    backgroundColor: '#CCE2EB33',
    borderWidth: 1,
    borderColor: '#0C324114',
    justifyContent: 'center',
    alignItems: 'center',
  },
  number: {
    fontFamily: 'DM Sans',
    fontWeight: '700',
    fontSize: 20,
    lineHeight: 24,
    color: '#0C3241',
  },
  label: {
    marginTop: 8,
    fontFamily: 'DM Sans',
    fontWeight: '400',
    fontSize: 12,
    lineHeight: 16,
    color: '#0C3241',
  },
});

export default MainCard;
