import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import Svg, { Path, G } from 'react-native-svg';

const { width: screenWidth } = Dimensions.get('window');

interface ChartConfig {
  backgroundColor: string;
  backgroundGradientFrom: string;
  backgroundGradientTo: string;
  decimalPlaces: number;
  color: (opacity?: number) => string;
  labelColor: (opacity?: number) => string;
  style: {
    borderRadius: number;
  };
  propsForDots: {
    r: string;
    strokeWidth: string;
    stroke: string;
  };
}

const chartConfig: ChartConfig = {
  backgroundColor: '#ffffff',
  backgroundGradientFrom: '#ffffff',
  backgroundGradientTo: '#ffffff',
  decimalPlaces: 0,
  color: (opacity = 1) => `rgba(81, 150, 244, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  style: {
    borderRadius: 16,
  },
  propsForDots: {
    r: '6',
    strokeWidth: '2',
    stroke: '#ffa726',
  },
};

interface ChartDataItem {
  name: string;
  population: number;
  color: string;
  legendFontColor: string;
  legendFontSize: number;
}

interface OuterRingDataItem {
  name: string;
  population: number;
  color: string;
}

interface CustomDonutChartProps {
  innerData: ChartDataItem[];
  outerData: OuterRingDataItem[];
  width?: number;
  height?: number;
  chartConfig?: ChartConfig;
}

interface SegmentData extends OuterRingDataItem {
  path: string;
  percentage: string;
}

const CustomDonutChart: React.FC<CustomDonutChartProps> = ({
  innerData,
  outerData,
  width: chartWidthProp,
  height = 220,
  chartConfig: chartConfigProp = chartConfig,
}) => {
  const containerWidth = chartWidthProp || screenWidth - 32;

  // Fixed dimensions to prevent overflow
  const chartContainerWidth = containerWidth * 0.55; // 55% for chart
  const legendContainerWidth = containerWidth * 0.45; // 45% for legend
  const chartSize = 160; // Fixed chart size
  const svgSize = chartSize + 40; // Container for outer ring

  const centerX = svgSize / 2;
  const centerY = svgSize / 2;

  // Ring dimensions
  const outerRadius = chartSize / 2 + 15;
  const innerRadius = chartSize / 2 + 5;

  // Calculate total value for outer ring
  const total = outerData.reduce((sum, item) => sum + item.population, 0);

  // Create path data for each outer ring segment
  const createPath = (
    startAngle: number,
    endAngle: number,
    outerR: number,
    innerR: number,
  ): string => {
    const startAngleRad = (startAngle * Math.PI) / 180;
    const endAngleRad = (endAngle * Math.PI) / 180;

    const x1 = centerX + outerR * Math.cos(startAngleRad);
    const y1 = centerY + outerR * Math.sin(startAngleRad);
    const x2 = centerX + outerR * Math.cos(endAngleRad);
    const y2 = centerY + outerR * Math.sin(endAngleRad);

    const x3 = centerX + innerR * Math.cos(endAngleRad);
    const y3 = centerY + innerR * Math.sin(endAngleRad);
    const x4 = centerX + innerR * Math.cos(startAngleRad);
    const y4 = centerY + innerR * Math.sin(startAngleRad);

    const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';

    return `M ${x1} ${y1} A ${outerR} ${outerR} 0 ${largeArcFlag} 1 ${x2} ${y2} L ${x3} ${y3} A ${innerR} ${innerR} 0 ${largeArcFlag} 0 ${x4} ${y4} Z`;
  };

  let currentAngle = -90; // Start from top
  const outerSegments: SegmentData[] = outerData.map(item => {
    const percentage = (item.population / total) * 100;
    const angle = (percentage / 100) * 360;
    const startAngle = currentAngle;
    const endAngle = currentAngle + angle;

    const path = createPath(startAngle, endAngle, outerRadius, innerRadius);
    currentAngle = endAngle;

    return {
      ...item,
      path,
      percentage: percentage.toFixed(1),
    };
  });

  return (
    <View style={[styles.container, { width: containerWidth }]}>
      <View style={styles.chartRow}>
        {/* Chart Area - Fixed width to prevent overflow */}
        <View style={[styles.chartArea, { width: chartContainerWidth }]}>
          <View
            style={[styles.chartWrapper, { width: svgSize, height: svgSize }]}
          >
            {/* Outer Ring SVG */}
            <Svg
              width={svgSize - 20}
              height={svgSize - 20}
              style={[StyleSheet.absoluteFillObject]}
              viewBox={`0 0 ${svgSize} ${svgSize}`}
            >
              <G>
                {outerSegments.map((segment, index) => (
                  <Path
                    key={`outer-${segment.name}-${index}`}
                    d={segment.path}
                    fill={segment.color}
                    stroke="#fff"
                    strokeWidth="2"
                  />
                ))}
              </G>
            </Svg>

            {/* Inner Pie Chart - Centered */}
            <View style={styles.pieContainer}>
              <PieChart
                data={innerData}
                width={300}
                height={chartSize}
                chartConfig={chartConfigProp}
                accessor={'population'}
                backgroundColor={'transparent'}
                paddingLeft={'0'}
                center={[0, 0]}
                hasLegend={true}
                absolute={false}
              />
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignSelf: 'center',
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  chartRow: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 220,
  },
  chartArea: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  chartWrapper: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pieContainer: {
    position: 'absolute',
    top: 10,
    left: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  legendArea: {
    justifyContent: 'center',
    paddingLeft: 15,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
    paddingVertical: 2,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 10,
    flexShrink: 0,
  },
  legendText: {
    fontSize: 13,
    color: '#666',
    fontWeight: '500',
    flex: 1,
  },
});

export default CustomDonutChart;
