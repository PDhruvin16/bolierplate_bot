import React from 'react';
import { Dimensions, Text, View } from 'react-native';
import { BarChart } from 'react-native-gifted-charts';

const { width } = Dimensions.get('window');

interface SLAChartProps {
  title?: string;
  data?: any;
  widthChart?: number;
}

const SLAChart: React.FC<SLAChartProps> = ({
  title = '',
  data = [
    {
      value: 70,
      label: 'On Track',
      frontColor: '#833D8D',
    },
    {
      value: 25,
      label: 'Overdue',
      frontColor: '#833D8D',
    },
  ],
  widthChart = width,
}) => {
  return (
    <View
      style={{
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <BarChart
        data={data}
        width={widthChart - 32}
        barWidth={30}
        height={220}
        barBorderTopLeftRadius={40}
        barBorderTopRightRadius={40}
        noOfSections={5}
        yAxisThickness={0}
        xAxisThickness={0}
        xAxisLabelTextStyle={{ fontSize: 14, color: '#000' }}
      />
      <Text style={{ fontSize: 14, color: '#000' }}>{title}</Text>
    </View>
  );
};

export default SLAChart;
