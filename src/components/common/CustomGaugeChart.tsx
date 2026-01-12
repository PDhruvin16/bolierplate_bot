import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle, Text as SvgText } from 'react-native-svg';

type GaugeProps = {
  percentage: number; // e.g., 60
  total: number; // e.g., 1500
  activeColor?: string;
  inactiveColor?: string;
};

const CustomGaugeChart: React.FC<GaugeProps> = ({
  percentage,
  total,
  activeColor = '#9C27B0',
  inactiveColor = '#BBDEFB',
}) => {
  const radius = 90;
  const strokeWidth = 14;
  const center = 120;
  const circumference = Math.PI * radius; // semi-circle
  const progress = (percentage / 100) * circumference;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Total Accounts</Text>
      <Svg width={center * 2} height={center + 20}>
        {/* Background arc */}
        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke={inactiveColor}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={`${circumference} ${circumference}`}
          strokeLinecap="round"
          rotation="-180"
          origin={`${center}, ${center}`}
        />
        {/* Active arc */}
        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke={activeColor}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={`${progress} ${circumference - progress}`}
          strokeLinecap="round"
          rotation="-180"
          origin={`${center}, ${center}`}
        />
        {/* Center text */}
        <SvgText
          x={center}
          y={center}
          textAnchor="middle"
          dy="0.3em"
          fontSize="28"
          fontWeight="bold"
          fill="#000"
        >
          {percentage}%
        </SvgText>
      </Svg>

      {/* Legend */}
      <View style={styles.legendRow}>
        <View style={styles.legendItem}>
          <View style={[styles.dot, { backgroundColor: activeColor }]} />
          <Text style={styles.legendText}>Active</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.dot, { backgroundColor: inactiveColor }]} />
          <Text style={styles.legendText}>Inactive</Text>
        </View>
      </View>

      {/* Range values */}
      <View style={styles.rangeRow}>
        <Text style={styles.rangeText}>0</Text>
        <Text style={styles.rangeText}>{total}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { alignItems: 'center', padding: 10 },
  title: { fontSize: 16, fontWeight: '600', marginBottom: 8 },
  legendRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 6,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  dot: { width: 10, height: 10, borderRadius: 5, marginRight: 6 },
  legendText: { fontSize: 12, color: '#666' },
  rangeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '85%',
    marginTop: 6,
  },
  rangeText: { fontSize: 12, color: '#666' },
});

export default CustomGaugeChart;
