import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import AppLayout from '../../components/layouts/AppLayout';
import colors from '../../constants/colors';
import { CalendarDays } from 'lucide-react-native';
import { CustomHeaderProps } from '../../components/common/CustomHeader';

const BeatPlanScreen: React.FC = () => {
  const headerProps: CustomHeaderProps = {
    variant: { type: 'basic', title: 'Beat Plan', subtitle: 'Tuesday, 13 Jan' },
    bottomContent: (
      <View style={styles.headerBottomRow}>
        <View style={styles.datePill}>
          <CalendarDays size={16} color={colors.headerOrange} />
          <Text style={styles.dateText}>Tuesday, 13 Jan</Text>
        </View>
      </View>
    ),
  };

  return (
    <AppLayout headerProps={headerProps}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <View style={styles.card}>
          <Text style={styles.title}>Beat Plan</Text>
          <Text style={styles.subtitle}>Manage your daily beat plans</Text>
        </View>
      </ScrollView>
    </AppLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  headerBottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  datePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.9)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  dateText: {
    marginLeft: 6,
    fontSize: 13,
    color: colors.dark,
    fontWeight: '500',
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.dark,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: colors.gray,
  },
});

export default BeatPlanScreen;

