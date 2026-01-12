import React, { useState, ReactNode } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import Svg, { Circle, Text as SvgText } from 'react-native-svg';
import FunnelChart from './FunnelChart';
import SLAChart from './SLAChart';
import Chart from './ChartKit';
import ChartOverlayModal from './ChartOverlayModal';
import { BarChart, PieChart } from 'react-native-gifted-charts';
import { useTheme } from '../../context/ThemeContext';

const { width } = Dimensions.get('window');
const chartWidth = width - 32;

const chartConfig = {
  backgroundColor: '#fff',
  backgroundGradientFrom: '#fff',
  backgroundGradientTo: '#fff',
  decimalPlaces: 0,
  color: (opacity = 1) => `rgba(81, 150, 244, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  style: { borderRadius: 16 },
  propsForDots: { r: '6', strokeWidth: '2', stroke: '#ffa726' },
};

type ChartItem = {
  name: string;
  value: number;
  color: string;
};

const data: ChartItem[] = [
  { name: 'Active', value: 900, color: '#9C27B0' },
  { name: 'Inactive', value: 600, color: '#BBDEFB' },
];

const customerData = [
  {
    name: 'Mark Pitter',
    population: 20,
    color: '#64B5F6',
    legendFontColor: '#7F7F7F',
    legendFontSize: 12,
  },
  {
    name: 'Samantha Lee',
    population: 15,
    color: '#81C784',
    legendFontColor: '#7F7F7F',
    legendFontSize: 12,
  },
  {
    name: 'James Carter',
    population: 12,
    color: '#FFB74D',
    legendFontColor: '#7F7F7F',
    legendFontSize: 12,
  },
  {
    name: 'Emily Johnson',
    population: 10,
    color: '#F06292',
    legendFontColor: '#7F7F7F',
    legendFontSize: 12,
  },
  {
    name: 'Michael Brown',
    population: 8,
    color: '#9575CD',
    legendFontColor: '#7F7F7F',
    legendFontSize: 12,
  },
  {
    name: 'Others',
    population: 35,
    color: '#A1C181',
    legendFontColor: '#7F7F7F',
    legendFontSize: 12,
  },
];

const activityData = [
  { name: 'Email', value: 40, color: '#9C27B0' },
  { name: 'Call', value: 25, color: '#FF9800' },
  { name: 'WhatsApp Chat', value: 20, color: '#E91E63' },
  { name: 'Task', value: 15, color: '#00BCD4' },
];

const productData = [
  { name: 'Software', value: 30, color: '#9C27B0' },
  { name: 'Hardware', value: 25, color: '#FF9800' },
  { name: 'Network', value: 20, color: '#E91E63' },
  { name: 'Security', value: 15, color: '#00BCD4' },
  { name: 'Inquiry', value: 10, color: '#2196F3' },
];

const funnelData = [
  { status: 'Open', value: 40, color: '#34C759' },
  { status: 'Resolved', value: 30, color: '#90EE90' },
  { status: 'On Hold', value: 20, color: '#007AFF' },
  { status: 'Cancelled', value: 10, color: '#FF3B30' },
  { status: 'waiting for response', value: 0, color: '#F6DF08' },
];

const outerRingData = [
  { name: 'High Priority', population: 30, color: '#FF6B6B' },
  { name: 'Medium Priority', population: 45, color: '#4ECDC4' },
  { name: 'Low Priority', population: 25, color: '#45B7D1' },
];

const CircularProgress = ({
  percentage,
  label,
  color,
}: {
  percentage: number;
  label: string;
  color: string;
}) => (
  <View style={styles.progressContainer}>
    <Svg width={120} height={120}>
      <Circle
        cx={60}
        cy={60}
        r={50}
        stroke="#E0E0E0"
        strokeWidth={8}
        fill="none"
      />
      <Circle
        cx={60}
        cy={60}
        r={50}
        stroke={color}
        strokeWidth={8}
        fill="none"
        strokeDasharray={`${percentage * 3.14} ${(100 - percentage) * 3.14}`}
        strokeLinecap="round"
        transform="rotate(-90 60 60)"
      />
      <SvgText
        x={60}
        y={60}
        textAnchor="middle"
        dy=".3em"
        fontSize={24}
        fontWeight="bold"
        fill="#333"
      >
        {percentage}%
      </SvgText>
    </Svg>
    <Text style={styles.progressLabel}>{label}</Text>
  </View>
);

const TrendsCharts: React.FC = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedChart, setSelectedChart] = useState<ReactNode>(null);
  const { theme } = useTheme();
  const openChart = (chart: ReactNode) => {
    setSelectedChart(chart);
    setModalVisible(true);
  };

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
      <View style={[themedStyles.card, { padding: title ? 10 : 0 }]}>
        {title && <Text style={styles.title}>{title}</Text>}
        {children}
      </View>
    </TouchableOpacity>
  );
  const themedStyles = {
    container: {
      ...styles.container,
      backgroundColor: theme === 'dark' ? '#121212' : '#ECEFF5',
    },
    card: {
      ...styles.card,
      backgroundColor: theme === 'dark' ? '#1E1E1E' : '#FFFFFF',
    },
    backgroundColor: {
      backgroundColor: theme === 'dark' ? '#121212' : '#ECEFF5',
    },
  };
  return (
    <ScrollView style={themedStyles.container} bounces={false}>
      {/* Case Trends by Uthser Group Bar Chart */}
      <ChartCard
        title="Case Trends by User Group"
        onPress={() =>
          openChart(
            <>
              <Text style={styles.title}>Case Trends by User Group</Text>
              <Chart
                type="horizontalBar"
                data={[
                  { value: 50, label: 'Jan', frontColor: '#8338EC' },
                  { value: 80, label: 'Feb', frontColor: '#8338EC' },
                  { value: 100, label: 'Mar', frontColor: '#8338EC' },
                ]}
                width={chartWidth}
                height={220}
                chartConfig={{
                  ...chartConfig,
                  color: (o = 1) => `rgba(156, 39, 176, ${o})`,
                }}
                yAxisSuffix="h"
              />
            </>,
          )
        }
      >
        <Chart
          type="horizontalBar"
          data={[
            { value: 50, label: 'Jan', frontColor: '#8338EC' },
            { value: 80, label: 'Feb', frontColor: '#8338EC' },
            { value: 100, label: 'Mar', frontColor: '#8338EC' },
          ]}
          width={chartWidth}
          height={220}
          chartConfig={{
            ...chartConfig,
            color: (o = 1) => `rgba(156, 39, 176, ${o})`,
          }}
          titleData={'Case Count'}
          yAxisSuffix="h"
        />
      </ChartCard>

      {/*Historical Entitlement Usage
by Product*/}
      <ChartCard
        title="Historical Entitlement Usage
by Product"
        onPress={() =>
          openChart(
            <BarChart
              data={[
                { value: 25, label: '2021', frontColor: '#14B8A6' },
                { value: 35, label: '2022', frontColor: '#14B8A6' },
                { value: 24, label: '2023', frontColor: '#14B8A6' },
                { value: 45, label: '2024', frontColor: '#14B8A6' },
                { value: 24, label: '2025', frontColor: '#14B8A6' },
              ]}
              barWidth={18}
              spacing={30}
              noOfSections={6}
              maxValue={30}
              yAxisTextStyle={{ color: '#718096' }}
            />,
          )
        }
      >
        <BarChart
          data={[
            { value: 25, label: '2021', frontColor: '#14B8A6' },
            { value: 35, label: '2022', frontColor: '#14B8A6' },
            { value: 24, label: '2023', frontColor: '#14B8A6' },
            { value: 45, label: '2024', frontColor: '#14B8A6' },
            { value: 24, label: '2025', frontColor: '#14B8A6' },
          ]}
          barWidth={18}
          spacing={30}
          yAxisThickness={0}
          xAxisThickness={0}
          noOfSections={5}
          maxValue={50}
          yAxisTextStyle={{ color: '#718096' }}
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

export default TrendsCharts;
