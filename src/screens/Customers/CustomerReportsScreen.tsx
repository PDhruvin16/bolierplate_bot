import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { COLORS } from '../../context/ThemeContext';
import CustomButton from '../../components/common/CustomButton';
import log from '../../utils/logger';

const CustomerReportsScreen = () => {
  return (
    <ScrollView style={styles.container} bounces={false}>
      <View style={styles.header}>
        <Text style={styles.title}>Customer Reports</Text>
        <Text style={styles.subtitle}>Generate and view customer reports</Text>
      </View>

      <View style={styles.reportsContainer}>
        <View style={styles.reportCard}>
          <Text style={styles.reportTitle}>Monthly Customer Report</Text>
          <Text style={styles.reportDescription}>
            View customer acquisition and retention metrics for the current
            month
          </Text>
          <CustomButton
            title="Generate Report"
            onPress={() => log.debug('Generate Monthly Report')}
            style={styles.reportButton}
          />
        </View>

        <View style={styles.reportCard}>
          <Text style={styles.reportTitle}>Customer Activity Report</Text>
          <Text style={styles.reportDescription}>
            Track customer interactions and engagement levels
          </Text>
          <CustomButton
            title="Generate Report"
            onPress={() => log.debug('Generate Activity Report')}
            variant="secondary"
            style={styles.reportButton}
          />
        </View>

        <View style={styles.reportCard}>
          <Text style={styles.reportTitle}>Revenue by Customer</Text>
          <Text style={styles.reportDescription}>
            Analyze revenue contribution by individual customers
          </Text>
          <CustomButton
            title="Generate Report"
            onPress={() => log.debug('Generate Revenue Report')}
            variant="outline"
            style={styles.reportButton}
          />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    padding: 20,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.dark,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.gray,
  },
  reportsContainer: {
    padding: 20,
    gap: 16,
  },
  reportCard: {
    backgroundColor: COLORS.white,
    padding: 20,
    borderRadius: 12,
    shadowColor: COLORS.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
  },
  reportTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.dark,
    marginBottom: 8,
  },
  reportDescription: {
    fontSize: 14,
    color: COLORS.gray,
    marginBottom: 16,
    lineHeight: 20,
  },
  reportButton: {
    marginTop: 8,
  },
});

export default CustomerReportsScreen;
