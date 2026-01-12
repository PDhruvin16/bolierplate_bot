import React from 'react';
import { Dimensions, View, StyleSheet, Text } from 'react-native';
import {
  LineChart,
  BarChart,
  ProgressChart,
  ContributionGraph,
  StackedBarChart,
} from 'react-native-chart-kit';
import {
  BarChart as GiftedBarChart,
  PieChart,
} from 'react-native-gifted-charts';
const { width } = Dimensions.get('window');

type ChartItem = {
  name?: string;
  value?: number;
  color?: string;
  label?: string;
  stacks: stacksData[];
};

type stacksData = {
  value?: number;
  color?: string;
};

type ChartType =
  | 'line'
  | 'bar'
  | 'pie'
  | 'progress'
  | 'contribution'
  | 'stackedBar'
  | 'horizontalBar';

type ChartMode = 'full' | 'half';

interface ChartProps {
  type: ChartType;
  data: any;
  mode?: ChartMode;
  width?: number;
  height?: number;
  chartConfig?: any;
  style?: object;
  yAxisLabel?: string;
  yAxisSuffix?: string;
  accessor?: string;
  paddingLeft?: string;
  hasLegend?: boolean;
  hideLegend?: boolean;
  numDays?: number;
  endDate?: Date;
  donut?: boolean;
  titleData?: any;
}

const defaultChartConfig = {
  backgroundGradientFrom: '#fff',
  backgroundGradientTo: '#fff',
  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
};

const Chart: React.FC<ChartProps> = ({
  type,
  data,
  mode = 'full',
  width: chartWidth = width - 32,
  height = 220,
  chartConfig = defaultChartConfig,
  style,
  yAxisLabel = '',
  yAxisSuffix = '',
  numDays = 7,
  endDate = new Date(),
  donut = false,
  titleData = '',
}) => {
  const startAngle = mode === 'half' ? 90 : 0;
  const endAngle = mode === 'half' ? -90 : 360;
  switch (type) {
    case 'line':
      return (
        <LineChart
          data={data}
          width={chartWidth}
          height={height}
          chartConfig={chartConfig}
          style={style}
          yAxisLabel={yAxisLabel}
          yAxisSuffix={yAxisSuffix}
        />
      );

    case 'bar':
      return (
        <BarChart
          data={data}
          width={chartWidth}
          height={height}
          chartConfig={chartConfig}
          style={style}
          yAxisLabel={yAxisLabel}
          yAxisSuffix={yAxisSuffix}
          fromZero
          showValuesOnTopOfBars
        />
      );

    case 'pie':
      return (
        <View style={styles.row}>
          <PieChart
            data={data}
            focusOnPress
            backgroundColor="transparent"
            showText={false}
            textColor="black"
            textSize={12}
            radius={70}
            startAngle={startAngle}
            endAngle={endAngle}
            innerRadius={40}
            showValuesAsLabels
            showTextBackground
            textBackgroundRadius={12}
            donut={donut}
            innerCircleColor={'white'}
            semiCircle={mode == 'half'}
          />
          <View style={styles.legendContainer}>
            {data.map((item: ChartItem, index: number) => (
              <View key={index} style={styles.legendItem}>
                <View style={[styles.dot, { backgroundColor: item.color }]} />
                <Text style={styles.legendText}>{item.name}</Text>
              </View>
            ))}
          </View>
        </View>
      );

    case 'progress':
      return (
        <ProgressChart
          data={data}
          width={chartWidth}
          height={height}
          chartConfig={chartConfig}
          style={style}
        />
      );

    case 'contribution':
      return (
        <ContributionGraph
          values={data}
          endDate={endDate}
          numDays={numDays}
          width={chartWidth}
          height={height}
          chartConfig={chartConfig}
          style={style}
          tooltipDataAttrs={() => ({})}
        />
      );

    case 'stackedBar':
      return (
        <>
          <GiftedBarChart
            stackData={data}
            width={chartWidth - 60}
            height={height}
          />
          <View
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              justifyContent: 'center',
              marginTop: 10,
            }}
          >
            {titleData.map((item: ChartItem, index: number) => (
              <View
                key={index}
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
                    backgroundColor: item?.color ?? '#ccc',
                    marginRight: 6,
                    borderRadius: 50,
                  }}
                />
                <Text style={{ fontSize: 12, color: '#333' }}>
                  {item.label}
                </Text>
              </View>
            ))}
          </View>
        </>
      );

    case 'horizontalBar':
      return (
        <View style={[{ flexDirection: titleData !== '' ? 'column' : 'row' }]}>
          <GiftedBarChart
            data={data}
            horizontal
            barWidth={22}
            barBorderRadius={6}
            noOfSections={5}
            maxValue={100}
            width={chartWidth - 110}
            height={height - 100}
            yAxisLabelWidth={70}
            xAxisThickness={0}
            yAxisThickness={0}
          />
          {titleData !== '' ? (
            <Text style={{ fontSize: 14, color: '#333', textAlign: 'center' }}>
              {titleData}
            </Text>
          ) : (
            <View style={styles.legendContainer}>
              {data.map((item: ChartItem, index: number) => (
                <View key={index} style={styles.legendItem}>
                  <View style={[styles.dot, { backgroundColor: item.color }]} />
                  <Text style={styles.legendText}>{item.name}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
      );

    default:
      return <View />;
  }
};

export default Chart;

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
    borderRadius: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendContainer: {
    marginLeft: 20,
    justifyContent: 'center',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 6,
  },
  legendText: {
    fontSize: 14,
    color: '#333',
  },
});
