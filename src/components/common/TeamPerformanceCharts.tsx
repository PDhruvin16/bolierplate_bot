import React, { useState, ReactNode } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import SLAChart from './SLAChart';
import Chart from './ChartKit';
import ChartOverlayModal from './ChartOverlayModal';
import { LineChart } from 'react-native-chart-kit';
import { useTheme } from '../../context/ThemeContext';

const TeamPerformanceCharts: React.FC = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedChart, setSelectedChart] = useState<ReactNode>(null);
  const { theme } = useTheme();
  const ChartCard = ({
    title,
    onPress,
    children,
  }: {
    title?: string;
    onPress: () => void;
    children: ReactNode;
  }) => (
    <TouchableOpacity onPress={onPress}>
      <View style={[themedstyle.card, { padding: title ? 10 : 0 }]}>
        {title && <Text style={styles.title}>{title}</Text>}
        {children}
      </View>
    </TouchableOpacity>
  );
  const openChart = (chart: ReactNode) => {
    setSelectedChart(chart);
    setModalVisible(true);
  };
  const themedstyle = {
    container: {
      ...styles.container,
      backgroundColor: theme === 'dark' ? '#1E1E1E' : '#FFFFFF',
    },
    card: {
      ...styles.card,
      backgroundColor: theme === 'dark' ? '#23233a' : '#FFFFFF',
    },
  };
  return (
    <ScrollView style={themedstyle.container} bounces={false}>
      {/* team Strength */}
      <ChartCard
        title="Team Strength"
        onPress={() =>
          openChart(
            <>
              <Text style={styles.title}>Team Strength</Text>
              <Chart
                type="pie"
                donut={true}
                mode="half"
                data={[
                  { name: 'Executives', value: 50, color: '#13229F' },
                  { name: 'Resolution', value: 25, color: '#B7CEFF' },
                ]}
              />
            </>,
          )
        }
      >
        <Chart
          type="pie"
          donut={true}
          mode="half"
          data={[
            { name: 'Executives', value: 50, color: '#13229F' },
            { name: 'Resolution', value: 25, color: '#B7CEFF' },
          ]}
        />
      </ChartCard>

      {/* Top 5 CE - Resolution Count */}
      <ChartCard
        title="Top 5 CE - Resolution Count"
        onPress={() =>
          openChart(
            <>
              <Text style={styles.title}>Top 5 CE - Resolution Count</Text>
              <Chart
                type="pie"
                data={[
                  { name: 'CSE1', value: 30, color: '#35A82F' },
                  { name: 'CSE2', value: 30, color: '#2B3674' },
                  { name: 'CSE3', value: 30, color: '#D13438' },
                  { name: 'CSE4', value: 30, color: '#6102FF' },
                  { name: 'CSE5', value: 30, color: '#D9B12D' },
                ]}
                mode="full"
              />
            </>,
          )
        }
      >
        <Chart
          type="pie"
          data={[
            { name: 'CSE1', value: 30, color: '#35A82F' },
            { name: 'CSE2', value: 30, color: '#2B3674' },
            { name: 'CSE3', value: 30, color: '#D13438' },
            { name: 'CSE4', value: 30, color: '#6102FF' },
            { name: 'CSE5', value: 30, color: '#D9B12D' },
          ]}
          mode="full"
        />
      </ChartCard>

      {/* Top 5 Users Group vs Cases */}
      <ChartCard
        title="Top 5 Users Group vs Cases"
        onPress={() =>
          openChart(
            <>
              <Text style={styles.title}>Top 5 Users Group vs Cases</Text>
              <Chart
                type="pie"
                data={[
                  { name: 'Group 1', value: 30, color: '#833D8D' },
                  { name: 'Group 2', value: 30, color: '#1D3C77' },
                  { name: 'Group 3', value: 30, color: '#177477' },
                  { name: 'Group 4', value: 30, color: '#E5EAFC' },
                ]}
                mode="full"
              />
            </>,
          )
        }
      >
        <Chart
          type="pie"
          data={[
            { name: 'Group 1', value: 30, color: '#833D8D' },
            { name: 'Group 2', value: 30, color: '#1D3C77' },
            { name: 'Group 3', value: 30, color: '#177477' },
            { name: 'Group 4', value: 30, color: '#E5EAFC' },
          ]}
          mode="full"
        />
      </ChartCard>

      {/* Resolved Cases Vs. Actual Resolved Cases */}
      <ChartCard
        title="Resolved Cases Vs. Actual Resolved Cases"
        onPress={() =>
          openChart(
            <>
              <Text style={styles.title}>
                Resolved Cases Vs. Actual Resolved Cases
              </Text>
              <LineChart
                data={{
                  labels: ['Manager1', 'Manager2'],
                  datasets: [
                    {
                      data: [15, 18],
                      color: (opacity = 1) => `rgba(131, 61, 141, ${opacity})`,
                      strokeWidth: 3,
                    },
                  ],
                }}
                width={320} // adjust to screen width
                height={220}
                chartConfig={{
                  backgroundGradientFrom: '#fff',
                  backgroundGradientTo: '#fff',
                  decimalPlaces: 0,
                  color: (opacity = 1) => `rgba(0,0,0,${opacity})`,
                }}
                bezier
                style={{ borderRadius: 8 }}
              />
            </>,
          )
        }
      >
        <LineChart
          data={{
            labels: ['Manager1', 'Manager2'],
            datasets: [
              {
                data: [15, 18],
                color: (opacity = 1) => `rgba(131, 61, 141, ${opacity})`,
                strokeWidth: 2,
              },
            ],
          }}
          width={320}
          height={220}
          chartConfig={{
            backgroundGradientFrom: '#fff',
            backgroundGradientTo: '#fff',
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(0,0,0,${opacity})`,
          }}
          bezier
          style={{ borderRadius: 8 }}
        />
      </ChartCard>

      {/* Overlay Modal */}
      <ChartOverlayModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      >
        {selectedChart}
      </ChartOverlayModal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ECEFF5' },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 20,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
    color: '#333',
  },
  progressContainer: { alignItems: 'center', margin: 10 },
  progressLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginTop: 8,
    maxWidth: 120,
  },
  progressRow: {
    flexDirection: 'column',
    justifyContent: 'space-around',
    marginVertical: 10,
  },
});

export default TeamPerformanceCharts;
