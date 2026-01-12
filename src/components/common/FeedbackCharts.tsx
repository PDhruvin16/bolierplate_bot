import { useTheme } from '../../context/ThemeContext';
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { BarChart } from 'react-native-gifted-charts';

const { width } = Dimensions.get('window');

interface FeedbackRating {
  rating: string;
  percentage: number;
  color: string;
  emoji: string;
}

interface CategoryMetric {
  category: string;
  NPS: number;
  CSAT: number;
  CES: number;
}

interface ApiResponse {
  feedbackRatings: FeedbackRating[];
  categoryMetrics: CategoryMetric[];
}

interface DashboardProps {
  refreshInterval?: number;
  apiEndpoint?: string;
}

const FeedbackCharts: React.FC<DashboardProps> = ({
  refreshInterval = 30000,
  apiEndpoint = 'https://your-api-endpoint.com/dashboard',
}) => {
  const [feedbackData, setFeedbackData] = useState<FeedbackRating[]>([
    { rating: 'Very Poor', percentage: 10, color: '#C53030', emoji: '😞' },
    { rating: 'Poor', percentage: 15, color: '#ED8936', emoji: '😕' },
    { rating: 'Average', percentage: 20, color: '#F6E05E', emoji: '😐' },
    { rating: 'Good', percentage: 20, color: '#9AE6B4', emoji: '🙂' },
    { rating: 'Excellent', percentage: 35, color: '#68D391', emoji: '😄' },
  ]);

  const [categoryData, setCategoryData] = useState<CategoryMetric[]>([
    { category: 'Product', NPS: 12, CSAT: 25, CES: 20 },
    { category: 'Tenant', NPS: 15, CSAT: 8, CES: 16 },
    { category: 'Service', NPS: 22, CSAT: 16, CES: 6 },
  ]);

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { theme } = useTheme();
  const themedstyle = {
    container: {
      ...styles.container,
      backgroundColor: theme === 'dark' ? '#1E1E1E' : '#FFFFFF',
    },
    chartContainer: {
      ...styles.chartContainer,
      backgroundColor: theme === 'dark' ? '#23233a' : '#FFFFFF',
    },
    // card:{
    //   ...styles.card,
    //   backgroundColor: theme === 'dark' ? '#23233a' : '#FFFFFF',
    // }
  };
  const fetchDashboardData = async (): Promise<void> => {
    try {
      // setLoading(true);
      // setError(null);
      // const response = await fetch(apiEndpoint);
      // if (!response.ok) {
      //   throw new Error(`HTTP error! status: ${response.status}`);
      // }
      // const data: ApiResponse = await response.json();
      // setFeedbackData(data.feedbackRatings);
      // setCategoryData(data.categoryMetrics);
    } catch (err) {
      // const errorMessage =
      //   err instanceof Error ? err.message : 'Unknown error occurred';
      // setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, refreshInterval);
    return () => clearInterval(interval);
  }, [apiEndpoint, refreshInterval]);

  const FeedbackRatingBars: React.FC = () => (
    <View style={themedstyle.chartContainer}>
      <Text style={styles.chartTitle}>Feedback Ratings</Text>

      {loading && <Text style={styles.loadingText}>Loading...</Text>}
      {error && <Text style={styles.errorText}>Error: {error}</Text>}

      {/* Stacked Bar */}
      <View style={styles.stackedBarContainer}>
        {feedbackData.map((item, index) => (
          <View
            key={`${item.rating}-${index}`}
            style={{
              flex: item.percentage,
              backgroundColor: item.color,
              borderTopLeftRadius: index === 0 ? 8 : 0,
              borderBottomLeftRadius: index === 0 ? 8 : 0,
              borderTopRightRadius: index === feedbackData.length - 1 ? 8 : 0,
              borderBottomRightRadius:
                index === feedbackData.length - 1 ? 8 : 0,
            }}
          />
        ))}
      </View>

      <View style={styles.legendContainer}>
        {feedbackData.map((item, index) => (
          <View key={index} style={styles.legendItem}>
            <Text style={styles.ratingEmoji}>{item.emoji}</Text>
            <Text style={styles.legendText}>{item.rating}</Text>
            <Text style={styles.legendPercentage}>{item.percentage}%</Text>
          </View>
        ))}
      </View>
    </View>
  );

  const CategoryMetricsChart: React.FC = () => {
    const barData = categoryData.flatMap(c => [
      {
        value: c.NPS,
        label: c.category,
        frontColor: '#3182CE',
        spacing: 2,
        labelWidth: 60,
        labelTextStyle: { color: '#4A5568', fontSize: 12 },
      },
      {
        value: c.CSAT,
        spacing: 1,
        frontColor: '#E53E3E',
      },
      {
        value: c.CES,
        frontColor: '#805AD5',
      },
    ]);

    return (
      <View style={themedstyle.chartContainer}>
        <Text style={styles.chartTitle}>NPS, CSAT, CES by Category</Text>

        <BarChart
          data={barData}
          barWidth={18}
          spacing={30}
          roundedTop
          hideRules
          yAxisThickness={0}
          xAxisThickness={0}
          noOfSections={6}
          maxValue={30}
          yAxisTextStyle={{ color: '#718096' }}
        />

        {/* Legend */}
        <View style={styles.metricsLegend}>
          <View style={styles.metricsLegendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#3182CE' }]} />
            <Text style={styles.metricsLegendText}>NPS</Text>
          </View>
          <View style={styles.metricsLegendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#E53E3E' }]} />
            <Text style={styles.metricsLegendText}>CSAT</Text>
          </View>
          <View style={styles.metricsLegendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#805AD5' }]} />
            <Text style={styles.metricsLegendText}>CES</Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <ScrollView style={themedstyle.container}  bounces={false}>
      <FeedbackRatingBars />
      <CategoryMetricsChart />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ECEFF5' },
  chartContainer: {
    backgroundColor: '#FFFFFF',
    marginVertical: 10,
    padding: 20,
    borderRadius: 12,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2D3748',
    marginBottom: 20,
    textAlign: 'center',
  },
  loadingText: {
    textAlign: 'center',
    color: '#718096',
    fontStyle: 'italic',
    marginBottom: 10,
  },
  errorText: {
    textAlign: 'center',
    color: '#E53E3E',
    fontSize: 14,
    marginBottom: 10,
  },

  // Feedback Rating Styles
  stackedBarContainer: {
    flexDirection: 'row',
    width: '100%',
    height: 40,
    marginBottom: 20,
    overflow: 'hidden',
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  legendItem: {
    alignItems: 'center',
    width: '20%', // 5 items in one row
  },
  ratingEmoji: { fontSize: 22, marginBottom: 2 },
  legendText: { fontSize: 12, color: '#2D3748', fontWeight: '600' },
  legendPercentage: { fontSize: 11, color: '#718096' },

  // Category Metrics Styles
  legendDot: { width: 12, height: 12, borderRadius: 6, marginRight: 6 },
  metricsLegend: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
  },
  metricsLegendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  metricsLegendText: { fontSize: 12, color: '#4A5568' },
});

export default FeedbackCharts;
