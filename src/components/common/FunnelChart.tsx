import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Svg, { Polygon } from 'react-native-svg';
import { COLORS } from '../../context/ThemeContext';

interface FunnelData {
  status: string;
  value: number;
  color: string;
}

interface FunnelChartProps {
  data: FunnelData[];
  title: string;
}

const FunnelChart: React.FC<FunnelChartProps> = ({ data, title }) => {
  const screenWidth = Dimensions.get('window').width;
  const chartWidth = screenWidth - 80;
  const chartHeight = 200;

  const segments = data.map((item, index) => {
    const segmentHeight = 35;
    const maxWidth = chartWidth * 0.6;
    const minWidth = chartWidth * 0.15;

    const topWidth =
      maxWidth - (index * (maxWidth - minWidth)) / data.length + 2;
    const bottomWidth =
      index === data.length - 1
        ? 0
        : maxWidth - ((index + 1) * (maxWidth - minWidth)) / data.length;

    const y = index * (segmentHeight - 2) + 10;
    const centerX = chartWidth * 0.3;

    let points;
    if (index === data.length - 1) {
      const topLeft = centerX - topWidth / 2 - 1;
      const topRight = centerX + topWidth / 2 + 1;
      const bottomPoint = `${centerX},${y + segmentHeight}`;
      points = `${topLeft},${y} ${topRight},${y} ${bottomPoint}`;
    } else {
      const topLeft = centerX - topWidth / 2;
      const topRight = centerX + topWidth / 2;
      const bottomLeft = centerX - bottomWidth / 2;
      const bottomRight = centerX + bottomWidth / 2;
      points = `${topLeft},${y} ${topRight},${y} ${bottomRight},${
        y + segmentHeight
      } ${bottomLeft},${y + segmentHeight}`;
    }

    return { ...item, points };
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.mainContent}>
        <View style={styles.chartContainer}>
          <Svg width={chartWidth * 0.65} height={chartHeight}>
            {segments.map((segment, index) => (
              <Polygon
                key={index}
                points={segment.points}
                fill={segment.color}
              />
            ))}
          </Svg>
        </View>

        <View style={styles.legend}>
          {data.map((item, index) => (
            <View key={index} style={styles.legendItem}>
              <View
                style={[styles.legendDot, { backgroundColor: item.color }]}
              />
              <Text style={styles.legendText}>{item.status}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20 },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.dark,
    marginBottom: 20,
  },
  mainContent: { flexDirection: 'row', justifyContent: 'space-between' },
  chartContainer: { flex: 1, alignItems: 'flex-start' },
  legend: { paddingLeft: 170, justifyContent: 'flex-end', minWidth: 120 },
  legendItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  legendDot: { width: 12, height: 12, borderRadius: 6 },
  legendText: { fontSize: 13, color: COLORS.gray, fontWeight: '500' },
});

export default FunnelChart;
