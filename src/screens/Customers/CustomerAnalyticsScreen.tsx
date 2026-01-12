import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { COLORS } from '../../context/ThemeContext';

const CustomerAnalyticsScreen = () => {
  return (
    <ScrollView style={styles.container} bounces={false}>
      <View style={styles.header}>
        <Text style={styles.title}>Customer Analytics</Text>
        <Text style={styles.subtitle}>
          Analyze customer behavior and trends
        </Text>
      </View>

      <View style={styles.analyticsContainer}>
        <View style={styles.metricCard}>
          <Text style={styles.metricNumber}>85%</Text>
          <Text style={styles.metricLabel}>Customer Satisfaction</Text>
        </View>

        <View style={styles.metricCard}>
          <Text style={styles.metricNumber}>42</Text>
          <Text style={styles.metricLabel}>Avg. Days to Close</Text>
        </View>
      </View>

      <View style={styles.chartContainer}>
        <Text style={styles.sectionTitle}>Customer Growth Trend</Text>
        <View style={styles.chartPlaceholder}>
          <Text style={styles.chartText}>📈 Chart will be displayed here</Text>
        </View>
      </View>

      <View style={styles.chartContainer}>
        <Text style={styles.sectionTitle}>Customer Segmentation</Text>
        <View style={styles.chartPlaceholder}>
          <Text style={styles.chartText}>
            🥧 Pie chart will be displayed here
          </Text>
        </View>
      </View>

      <View style={styles.insightsContainer}>
        <Text style={styles.sectionTitle}>Key Insights</Text>

        <View style={styles.insightCard}>
          <Text style={styles.insightTitle}>Top Performing Segment</Text>
          <Text style={styles.insightText}>
            Enterprise customers show 23% higher retention rate
          </Text>
        </View>

        <View style={styles.insightCard}>
          <Text style={styles.insightTitle}>Growth Opportunity</Text>
          <Text style={styles.insightText}>
            Small business segment has potential for 15% growth
          </Text>
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
  analyticsContainer: {
    flexDirection: 'row',
    padding: 20,
    gap: 16,
  },
  metricCard: {
    flex: 1,
    backgroundColor: COLORS.white,
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: COLORS.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
  },
  metricNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 8,
  },
  metricLabel: {
    fontSize: 14,
    color: COLORS.gray,
    textAlign: 'center',
  },
  chartContainer: {
    margin: 20,
    marginTop: 0,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.dark,
    marginBottom: 16,
  },
  chartPlaceholder: {
    backgroundColor: COLORS.white,
    height: 200,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
  },
  chartText: {
    fontSize: 16,
    color: COLORS.gray,
  },
  insightsContainer: {
    padding: 20,
    paddingTop: 0,
  },
  insightCard: {
    backgroundColor: COLORS.white,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: COLORS.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
  },
  insightTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.dark,
    marginBottom: 8,
  },
  insightText: {
    fontSize: 14,
    color: COLORS.gray,
    lineHeight: 20,
  },
});

export default CustomerAnalyticsScreen;
