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

const ServicesCharts: React.FC = () => {
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
      {/* Total Users Bar Chart */}
      <ChartCard
        title="Total Users"
        onPress={() =>
          openChart(
            <>
              <Text style={styles.title}>Total Users</Text>
              <SLAChart
                title="Total Users"
                data={[
                  {
                    value: 15,
                    label: 'Manager',
                    frontColor: '#833D8D',
                  },
                  {
                    value: 18,
                    label: 'Director',
                    frontColor: '#833D8D',
                  },
                  {
                    value: 10,
                    label: 'L1',
                    frontColor: '#833D8D',
                  },
                  {
                    value: 8,
                    label: 'L2',
                    frontColor: '#833D8D',
                  },
                  {
                    value: 5,
                    label: 'L3',
                    frontColor: '#833D8D',
                  },
                ]}
              />
            </>,
          )
        }
      >
        <SLAChart
          title="Designation"
          data={[
            {
              value: 15,
              label: 'Manager',
              frontColor: '#833D8D',
            },
            {
              value: 18,
              label: 'Director',
              frontColor: '#833D8D',
            },
            {
              value: 10,
              label: 'L1',
              frontColor: '#833D8D',
            },
            {
              value: 8,
              label: 'L2',
              frontColor: '#833D8D',
            },
            {
              value: 5,
              label: 'L3',
              frontColor: '#833D8D',
            },
          ]}
          widthChart={width}
        />
      </ChartCard>

      {/* Business Unit Vs Total Teams (Funnel) */}
      <ChartCard
        title="Business Unit Vs Total Teams"
        onPress={() =>
          openChart(
            <FunnelChart
              data={[
                { status: 'BU 1', value: 50, color: '#00CFFF' },
                { status: 'BU 2', value: 40, color: '#FFB800' },
                { status: 'BU 3', value: 35, color: '#7A3FFF' },
                { status: 'BU 4', value: 25, color: '#2D3FFF' },
                { status: 'BU 5', value: 15, color: '#E91E63' },
              ]}
              title="Business Unit Vs Total Teams"
            />,
          )
        }
      >
        <FunnelChart
          data={[
            { status: 'BU 1', value: 50, color: '#00CFFF' },
            { status: 'BU 2', value: 40, color: '#FFB800' },
            { status: 'BU 3', value: 35, color: '#7A3FFF' },
            { status: 'BU 4', value: 25, color: '#2D3FFF' },
            { status: 'BU 5', value: 15, color: '#E91E63' },
          ]}
          title=""
        />
      </ChartCard>

      {/* Active SLAs (Donut) */}
      <ChartCard
        title="Active SLAs"
        onPress={() =>
          openChart(
            <>
              <Text style={styles.title}>Active SLAs</Text>
              <Chart
                type="pie"
                donut={true}
                data={[
                  { name: 'Response', value: 50, color: '#3B82F6' },
                  { name: 'Resolution', value: 25, color: '#EF4444' },
                ]}
              />
            </>,
          )
        }
      >
        <Chart
          type="pie"
          donut={true}
          data={[
            { name: 'Response', value: 50, color: '#3B82F6' },
            { name: 'Resolution', value: 25, color: '#EF4444' },
          ]}
        />
      </ChartCard>

      {/* Total Entitlements (Pie) */}
      <ChartCard
        title="Total Entitlements"
        onPress={() =>
          openChart(
            <>
              <Text style={styles.title}>Total Entitlements</Text>
              <Chart
                type="pie"
                data={[
                  { name: 'Active', value: 30, color: '#9C27B0' },
                  { name: 'Inactive', value: 15, color: '#FFC107' },
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
            { name: 'Active', value: 30, color: '#9C27B0' },
            { name: 'Inactive', value: 15, color: '#FFC107' },
          ]}
          mode="full"
        />
      </ChartCard>

      {/* Active Knowledgebase Articles (Gauge) */}
      <ChartCard
        title="Active Knowledgebase Articles"
        onPress={() =>
          openChart(
            <>
              <Text style={styles.title}>Active Knowledgebase Articles</Text>
              <Chart
                type="pie"
                data={[
                  { name: 'Active', value: 75, color: '#FFB300' },
                  { name: 'Inactive', value: 25, color: '#f5da9a' },
                ]}
                mode="half"
                donut={true}
              />
            </>,
          )
        }
      >
        <Chart
          type="pie"
          data={[
            { name: 'Active', value: 75, color: '#FFB300' },
            { name: 'Inactive', value: 25, color: '#f5da9a' },
          ]}
          mode="half"
          donut={true}
        />
      </ChartCard>

      {/* Email Templates (Bar) */}
      <ChartCard
        title="Email Templates"
        onPress={() =>
          openChart(
            <>
              <Text style={styles.title}>Email Templates</Text>
              <BarChart
                data={[
                  // Response group
                  {
                    value: 18,
                    label: 'Response',
                    frontColor: '#1A237E', // High Use (dark blue)
                    spacing: 2,
                    labelWidth: 70,
                    labelTextStyle: { color: '#4A5568', fontSize: 12 },
                  },
                  {
                    value: 15,
                    frontColor: '#64B5F6', // Low Use (light blue)
                  },

                  // Follow-up group
                  {
                    value: 10,
                    label: 'Follow-up',
                    frontColor: '#1A237E',
                    spacing: 2,
                    labelWidth: 70,
                    labelTextStyle: { color: '#4A5568', fontSize: 12 },
                  },
                  {
                    value: 8,
                    frontColor: '#64B5F6',
                  },
                ]}
                barWidth={18}
                spacing={30}
                roundedTop
                noOfSections={6}
                maxValue={30}
                yAxisTextStyle={{ color: '#718096' }}
              />
            </>,
          )
        }
      >
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            marginTop: 12,
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginRight: 16,
            }}
          >
            <View
              style={{
                width: 12,
                height: 12,
                borderRadius: 6,
                backgroundColor: '#1A237E',
                marginRight: 6,
              }}
            />
            <Text style={{ fontSize: 12, color: '#4A5568' }}>High Use</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View
              style={{
                width: 12,
                height: 12,
                borderRadius: 6,
                backgroundColor: '#64B5F6',
                marginRight: 6,
              }}
            />
            <Text style={{ fontSize: 12, color: '#4A5568' }}>Low Use</Text>
          </View>
        </View>
        <BarChart
          data={[
            // Response group
            {
              value: 18,
              label: 'Response',
              frontColor: '#1A237E', // High Use (dark blue)
              spacing: 2,
              labelWidth: 70,
              labelTextStyle: { color: '#4A5568', fontSize: 12 },
            },
            {
              value: 15,
              frontColor: '#64B5F6', // Low Use (light blue)
            },

            // Follow-up group
            {
              value: 10,
              label: 'Follow-up',
              frontColor: '#1A237E',
              spacing: 2,
              labelWidth: 70,
              labelTextStyle: { color: '#4A5568', fontSize: 12 },
            },
            {
              value: 8,
              frontColor: '#64B5F6',
            },
          ]}
          barWidth={18}
          spacing={30}
          roundedTop
          noOfSections={6}
          maxValue={30}
          yAxisTextStyle={{ color: '#718096' }}
        />
      </ChartCard>

      {/* Total Knowledge Articles */}
      <ChartCard
        title="Total Knowledge Articles"
        onPress={() =>
          openChart(
            <>
              <Text style={styles.title}>Total Knowledge Articles</Text>
              <Chart
                type="pie"
                data={[
                  { name: 'Technical', value: 25, color: '#DF6A73' },
                  { name: 'FAQs', value: 20, color: '#478E93' },
                  { name: 'Info', value: 10, color: '#6ADFD6' },
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
            { name: 'Technical', value: 25, color: '#DF6A73' },
            { name: 'FAQs', value: 20, color: '#478E93' },
            { name: 'Info', value: 16, color: '#6ADFD6' },
          ]}
          mode="full"
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

export default ServicesCharts;
