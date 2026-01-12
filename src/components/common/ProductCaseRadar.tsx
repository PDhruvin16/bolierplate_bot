import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { RadarChart } from 'react-native-gifted-charts';

const ProductCasesRadar: React.FC = () => {
  const data = [70, 100, 80];
  const labels = ['Product B', 'Product A', 'Product C'];

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Product vs Cases</Text>

      <RadarChart
        data={data}
        labels={labels}
        maxValue={100}
        noOfSections={5}
        gridConfig={{
          stroke: '#B0BEC5',
          strokeWidth: 1,
          opacity: 0.5,
        }}
        labelConfig={{
          fontSize: 12,
          stroke: '#333',
          fontWeight: '500',
          textAnchor: 'middle',
          alignmentBaseline: 'middle',
        }}
        polygonConfig={{
          stroke: '#1E88E5',
          strokeWidth: 2,
          fill: 'rgba(30,136,229,0.4)',
          opacity: 0.8,
          isAnimated: true,
          animationDuration: 800,
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    padding: 16,
    margin: 12,
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    alignSelf: 'flex-start',
  },
});

export default ProductCasesRadar;
