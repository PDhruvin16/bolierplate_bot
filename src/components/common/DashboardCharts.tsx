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
import STRINGS from '../../constants/strings';
import CaseCalendar from './CaseCalendar';
import CustomDonutChart from './CustomDonutChart';
import SLAChart from './SLAChart';
import ProductCasesRadar from './ProductCaseRadar';
import Chart from './ChartKit';
import ChartOverlayModal from './ChartOverlayModal';
import { useTheme } from '../../context/ThemeContext';
import useDashboardQueries from '../../hooks/useDashboardQueries';

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

const defaultAccountsData: ChartItem[] = [
  { name: 'Active', value: 0, color: '#9C27B0' },
  { name: 'Inactive', value: 0, color: '#BBDEFB' },
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

const defaultActivityData = [
  { name: 'Email', value: 0, color: '#9C27B0' },
  { name: 'Call', value: 0, color: '#FF9800' },
  { name: 'WhatsApp Chat', value: 0, color: '#E91E63' },
  { name: 'Task', value: 0, color: '#00BCD4' },
];

const defaultProductData = [{ name: 'N/A', value: 0, color: '#9C27B0' }];

const defaultFunnelData = [
  { status: 'Open', value: 0, color: '#34C759' },
  { status: 'Resolved', value: 0, color: '#90EE90' },
  { status: 'On Hold', value: 0, color: '#007AFF' },
  { status: 'Cancelled', value: 0, color: '#FF3B30' },
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
    <Text style={styles.progressLabel}>{label}</Text>
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
    <View
      style={{
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        marginTop: 10,
      }}
    >
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginHorizontal: 8,
          marginBottom: 5,
        }}
      >
        <View
          style={{
            width: 12,
            height: 12,
            backgroundColor: color ?? '#ccc',
            marginRight: 6,
            borderRadius: 50,
          }}
        />
        <Text style={{ fontSize: 12, color: '#333' }}>{label}</Text>
      </View>
    </View>
  </View>
);

const DashboardCharts: React.FC = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedChart, setSelectedChart] = useState<ReactNode>(null);

  // Use dashboard case management hook instead of direct API call
  const { useDashboardCaseManagement } = useDashboardQueries();
  const {
    data,
    isLoading: loading,
    error,
    refetch,
  } = useDashboardCaseManagement();

  const openChart = (chart: ReactNode) => {
    setSelectedChart(chart);
    setModalVisible(true);
  };

  const { theme } = useTheme();

  // Derived datasets from API
  const funnelData = (() => {
    const cs = (data as any)?.case_status || {};
    return [
      { status: 'Open', value: Number(cs.open) || 0, color: '#34C759' },
      {
        status: 'Resolved',
        value: Number(cs['problem solved'] || cs.resolved) || 0,
        color: '#90EE90',
      },
      {
        status: 'On Hold',
        value: Number(cs['On Hold']) || 0,
        color: '#007AFF',
      },
      {
        status: 'Cancelled',
        value: Number(cs.cancelled) || 0,
        color: '#FF3B30',
      },
    ];
  })();

  const last7Data = (() => {
    const items: any[] = Array.isArray(
      (data as any)?.last_7_days_open_and_closed_cases,
    )
      ? (data as any).last_7_days_open_and_closed_cases
      : [];
    const abbrev = (d: string) => (d?.length ? d.slice(0, 3) : '');
    return items.slice(-7).map(it => ({
      label: abbrev(it.date),
      stacks: [
        { value: Number(it.open) || 0, color: '#4CAF50' },
        { value: Number(it.closed) || 0, color: '#3F51B5', marginBottom: 2 },
      ],
    }));
  })();

  const activityData = (() => {
    const a = (data as any)?.case_activity_type || {};
    return [
      { name: 'Email', value: Number(a.email) || 0, color: '#9C27B0' },
      { name: 'Call', value: Number(a.phone_call) || 0, color: '#FF9800' },
      {
        name: 'WhatsApp Chat',
        value: Number(a.whatsapp) || 0,
        color: '#E91E63',
      },
      { name: 'Task', value: Number(a.task) || 0, color: '#00BCD4' },
    ];
  })();

  const productData = (() => {
    const arr: any[] = Array.isArray((data as any)?.product_vs_cases)
      ? (data as any).product_vs_cases
      : [];
    const palette = [
      '#9C27B0',
      '#FF9800',
      '#E91E63',
      '#00BCD4',
      '#2196F3',
      '#4CAF50',
      '#8BC34A',
    ];
    return arr.length
      ? arr.slice(0, 5).map((p, idx) => ({
          name: String(p.product ?? 'N/A'),
          value: Number(p.case_count) || 0,
          color: palette[idx % palette.length],
        }))
      : defaultProductData;
  })();

  const resolutionData = (() => {
    const arr: any[] = Array.isArray(
      (data as any)?.average_resolution_time_by_priority,
    )
      ? (data as any).average_resolution_time_by_priority
      : [];
    const color = '#8338EC';
    return arr.length
      ? arr.map(r => ({
          value: Number(r.average_resolution_hours) || 0,
          label: String(r.priority || ''),
          frontColor: color,
        }))
      : [
          { value: 0, label: 'High', frontColor: color },
          { value: 0, label: 'Medium', frontColor: color },
          { value: 0, label: 'Low', frontColor: color },
        ];
  })();

  const accountsData = (() => {
    const a = (data as any)?.total_accounts || {};
    const total = Number(a.total) || 0;
    const active = Number(a.active) || 0;
    const inactive = Math.max(total - active, 0);
    return total > 0
      ? [
          { name: 'Active', value: active, color: '#9C27B0' },
          { name: 'Inactive', value: inactive, color: '#BBDEFB' },
        ]
      : defaultAccountsData;
  })();

  const themedStyles = {
    container: {
      ...styles.container,
      backgroundColor: theme === 'dark' ? '#000000' : '#ECEFF5',
    },
    card: {
      ...styles.card,
      backgroundColor: theme === 'dark' ? '#1E1E1E' : '#FFFFFF',
    },
    backgroundColor: {
      backgroundColor: theme === 'dark' ? '#121212' : '#ECEFF5',
    },
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
    <TouchableOpacity
      onPress={onPress}
      style={{ backgroundColor: theme === 'dark' ? '#121212' : '#ECEFF5' }}
    >
      <View style={[themedStyles.card, { padding: title ? 10 : 0 }]}>
        {title && <Text style={styles.title}>{title}</Text>}
        {children}
      </View>
    </TouchableOpacity>
  );
  return (
    <ScrollView style={themedStyles.container} bounces={false}>
      {/* Case Status Funnel */}
      <ChartCard
        onPress={() =>
          openChart(
            <>
              <FunnelChart data={funnelData} title={STRINGS.CASE_STATUS} />,
            </>,
          )
        }
      >
        <FunnelChart
          data={funnelData || defaultFunnelData}
          title={STRINGS.CASE_STATUS}
        />
      </ChartCard>

      {/* Case Calendar */}
      <ChartCard
        onPress={() =>
          openChart(
            <CaseCalendar
              key={'openchart'}
              month={8}
              year={2025}
              casesByDate={{
                4: ['escalated'],
                5: ['escalated', 'cancelled', 'resolved', 'open'],
                15: ['resolved'],
                20: ['escalated'],
                28: ['resolved', 'open'],
              }}
            />,
          )
        }
      >
        <CaseCalendar
          month={7}
          year={2025}
          casesByDate={{
            4: ['escalated'],
            5: ['escalated', 'cancelled', 'resolved', 'open'],
            15: ['resolved'],
            20: ['escalated'],
            28: ['resolved', 'open'],
          }}
        />
      </ChartCard>

      {/* Customer Breakdown */}
      <ChartCard
        title="Case Type vs Top Customers Breakdown"
        onPress={() =>
          openChart(
            <>
              <Text style={styles.title}>
                Case Type vs Top Customers Breakdown
              </Text>
              <CustomDonutChart
                innerData={customerData}
                outerData={outerRingData}
                width={chartWidth - 100}
                height={220}
              />
            </>,
          )
        }
      >
        <CustomDonutChart
          innerData={customerData}
          outerData={outerRingData}
          width={chartWidth - 10}
          height={220}
        />
      </ChartCard>

      {/* SLA Status */}
      <ChartCard
        title="Cases vs SLA"
        onPress={() =>
          openChart(
            <>
              <Text style={styles.title}>Cases vs SLA</Text>
              <SLAChart title="SLA Status" />
            </>,
          )
        }
      >
        <SLAChart title="SLA Status" />
      </ChartCard>

      {/* Last 7 Days */}
      <ChartCard
        title="Last 7 Days Open and Closed Cases"
        onPress={() =>
          openChart(
            <>
              <Text style={styles.title}>
                Last 7 Days Open and Closed Cases
              </Text>
              <Chart
                type="stackedBar"
                data={[
                  {
                    label: 'Sun',
                    stacks: [
                      { value: 12, color: '#4CAF50' }, // Opened
                      { value: 8, color: '#3F51B5', marginBottom: 2 }, // Closed
                    ],
                  },
                  {
                    label: 'Mon',
                    stacks: [
                      { value: 8, color: '#4CAF50' },
                      { value: 7, color: '#3F51B5', marginBottom: 2 },
                    ],
                  },
                  {
                    label: 'Tue',
                    stacks: [
                      { value: 6, color: '#4CAF50' },
                      { value: 4, color: '#3F51B5', marginBottom: 2 },
                    ],
                  },
                  {
                    label: 'Wed',
                    stacks: [
                      { value: 10, color: '#4CAF50' },
                      { value: 8, color: '#3F51B5', marginBottom: 2 },
                    ],
                  },
                  {
                    label: 'Thu',
                    stacks: [
                      { value: 7, color: '#4CAF50' },
                      { value: 6, color: '#3F51B5', marginBottom: 2 },
                    ],
                  },
                ]}
                titleData={[
                  { label: 'Opened', color: '#4CAF50' },
                  { label: 'Close', color: '#3F51B5' },
                ]}
                hideLegend
              />
            </>,
          )
        }
      >
        <Chart
          type="stackedBar"
          data={
            last7Data.length
              ? last7Data
              : [
                  {
                    label: 'Sun',
                    stacks: [
                      { value: 0, color: '#4CAF50' },
                      { value: 0, color: '#3F51B5', marginBottom: 2 },
                    ],
                  },
                  {
                    label: 'Mon',
                    stacks: [
                      { value: 0, color: '#4CAF50' },
                      { value: 0, color: '#3F51B5', marginBottom: 2 },
                    ],
                  },
                  {
                    label: 'Tue',
                    stacks: [
                      { value: 0, color: '#4CAF50' },
                      { value: 0, color: '#3F51B5', marginBottom: 2 },
                    ],
                  },
                  {
                    label: 'Wed',
                    stacks: [
                      { value: 0, color: '#4CAF50' },
                      { value: 0, color: '#3F51B5', marginBottom: 2 },
                    ],
                  },
                  {
                    label: 'Thu',
                    stacks: [
                      { value: 0, color: '#4CAF50' },
                      { value: 0, color: '#3F51B5', marginBottom: 2 },
                    ],
                  },
                ]
          }
          titleData={[
            { label: 'Opened', color: '#4CAF50' },
            { label: 'Close', color: '#3F51B5' },
          ]}
          hideLegend
        />
      </ChartCard>

      {/* Activity Types */}
      <ChartCard
        title="Case Activity Types"
        onPress={() =>
          openChart(
            <>
              <Text style={styles.title}>Case Activity Types</Text>
              <Chart
                type="pie"
                data={activityData}
                width={chartWidth}
                mode="full"
              />
            </>,
          )
        }
      >
        <Chart
          type="pie"
          data={activityData?.length ? activityData : defaultActivityData}
          mode="full"
        />
      </ChartCard>

      {/* Product vs Cases Radar */}
      <ChartCard
        onPress={() =>
          openChart(
            <>
              <Text style={styles.title}>Product vs Cases Radar</Text>
              <ProductCasesRadar />
            </>,
          )
        }
      >
        <ProductCasesRadar />
      </ChartCard>

      {/* Top 5 Products */}
      <ChartCard
        title="Top 5 Product vs Case"
        onPress={() =>
          openChart(
            <>
              <Text style={styles.title}>Top 5 Product vs Case</Text>
              <Chart type="pie" data={productData} mode="full" />
            </>,
          )
        }
      >
        <Chart
          type="pie"
          data={productData?.length ? productData : defaultProductData}
          mode="full"
        />
      </ChartCard>

      {/* Resolution Time */}
      <ChartCard
        title="Average Resolution Time by Priority"
        onPress={() =>
          openChart(
            <>
              <Text style={styles.title}>
                Average Resolution Time by Priority
              </Text>
              <Chart
                type="horizontalBar"
                data={[
                  { value: 50, label: 'High', frontColor: '#8338EC' },
                  { value: 80, label: 'Medium', frontColor: '#8338EC' },
                  { value: 100, label: 'Low', frontColor: '#8338EC' },
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
          data={resolutionData}
          width={chartWidth}
          height={220}
          chartConfig={{
            ...chartConfig,
            color: (o = 1) => `rgba(156, 39, 176, ${o})`,
          }}
          titleData={'Resolution time (Hours)'}
          yAxisSuffix="h"
        />
      </ChartCard>

      {/* SLA States */}
      <ChartCard
        title="SLA States"
        onPress={() =>
          openChart(
            <>
              <Text style={styles.title}>SLA States</Text>
              <View>
                <View style={styles.progressRow}>
                  <CircularProgress
                    percentage={56}
                    label="First Response Within SLA"
                    color="#00BCD4"
                  />
                  <CircularProgress
                    percentage={85}
                    label="Resolution Within SLA"
                    color="#9C27B0"
                  />
                </View>
                <View style={styles.progressRow}>
                  <CircularProgress
                    percentage={71}
                    label="First Contact Resolution"
                    color="#2196F3"
                  />
                  <CircularProgress
                    percentage={60}
                    label="Total Accounts Active"
                    color="#9C27B0"
                  />
                </View>
              </View>
            </>,
          )
        }
      >
        <View>
          <View style={styles.progressRow}>
            <CircularProgress
              percentage={56}
              label="First Response Within SLA"
              color="#00BCD4"
            />
            <CircularProgress
              percentage={85}
              label="Resolution Within SLA"
              color="#9C27B0"
            />
          </View>
          <View style={styles.progressRow}>
            <CircularProgress
              percentage={71}
              label="First Contact Resolution"
              color="#2196F3"
            />
            <CircularProgress
              percentage={60}
              label="Total Accounts Active"
              color="#9C27B0"
            />
          </View>
        </View>
      </ChartCard>

      {/* Total Accounts Gauge */}
      <ChartCard
        title="Total Accounts"
        onPress={() =>
          openChart(
            <>
              <Text style={styles.title}>Total Accounts</Text>
              <Chart type="pie" data={accountsData} mode="half" donut={true} />
            </>,
          )
        }
      >
        <Chart type="pie" data={accountsData} mode="half" donut={true} />
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
  container: { flex: 1, padding: 2, backgroundColor: 'red' },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 11.29,
    padding: 16,
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

export default DashboardCharts;
