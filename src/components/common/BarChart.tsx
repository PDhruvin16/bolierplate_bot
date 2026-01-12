import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Svg, { Rect, Text as SvgText } from 'react-native-svg';
import { COLORS } from '../../context/ThemeContext';

interface BarData {
  label: string;
  value: number;
  color: string;
}

interface BarChartProps {
  data: BarData[];
  title: string;
}

const BarChart: React.FC<BarChartProps> = ({ data, title }) => {
  const screenWidth = Dimensions.get('window').width;
  const chartWidth = screenWidth - 80;
  const chartHeight = 200;
  const maxValue = Math.max(...data.map(item => item.value));

  const barWidth = (chartWidth - 40) / data.length - 10;
  const barSpacing = 10;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>

      <View style={styles.chartContainer}>
        <Svg width={chartWidth} height={chartHeight}>
          {data.map((item, index) => {
            const barHeight = (item.value / maxValue) * (chartHeight - 60);
            const x = 20 + index * (barWidth + barSpacing);
            const y = chartHeight - 40 - barHeight;

            return (
              <React.Fragment key={index}>
                <Rect
                  x={x}
                  y={y}
                  width={barWidth}
                  height={barHeight}
                  fill={item.color}
                  rx={4}
                  ry={4}
                />
                <SvgText
                  x={x + barWidth / 2}
                  y={chartHeight - 20}
                  fontSize="10"
                  fill={COLORS.gray}
                  textAnchor="middle"
                >
                  {item.label}
                </SvgText>
                <SvgText
                  x={x + barWidth / 2}
                  y={y - 5}
                  fontSize="10"
                  fontWeight="bold"
                  fill={COLORS.dark}
                  textAnchor="middle"
                >
                  {item.value}
                </SvgText>
              </React.Fragment>
            );
          })}
        </Svg>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.dark,
    marginBottom: 16,
    textAlign: 'center',
  },
  chartContainer: {
    alignItems: 'center',
  },
});

export default BarChart;
