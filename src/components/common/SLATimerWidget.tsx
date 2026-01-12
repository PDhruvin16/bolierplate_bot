import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { COLORS } from '../../context/ThemeContext';
import { FONTS } from '../../constants/fonts';

const { width } = Dimensions.get('window');

export interface SLATimerData {
  firstResponseTime: string;
  resolutionTime: string;
  firstResponseProgress: number; // 0-100
  resolutionProgress: number; // 0-100
  lastUpdated: string;
}

export interface SLATimerWidgetProps {
  data: SLATimerData;
  onRefresh?: () => void;
  style?: any;
}

const SLATimerWidget: React.FC<SLATimerWidgetProps> = ({
  data,
  onRefresh,
  style,
}) => {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    if (onRefresh) {
      setIsRefreshing(true);
      await onRefresh();
      setIsRefreshing(false);
    }
  };

  const CircularProgress = ({
    progress,
    time,
    label,
    size = 100,
  }: {
    progress: number;
    time: string;
    label: string;
    size?: number;
  }) => {
    const radius = (size - 8) / 2;
    const circumference = 2 * Math.PI * radius;
    const strokeDasharray = circumference;
    const strokeDashoffset = circumference - (progress / 100) * circumference;

    return (
      <View style={styles.progressContainer}>
        <Svg width={size} height={size} style={styles.progressSvg}>
          {/* Background circle */}
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={COLORS.lightGray}
            strokeWidth={4}
            fill="transparent"
          />
          {/* Progress circle */}
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={COLORS.dashboard.purple}
            strokeWidth={4}
            fill="transparent"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
          />
        </Svg>
        <View style={styles.progressContent}>
          <Text style={styles.progressTime}>{time}</Text>
          <Text style={styles.progressLabel}>{label}</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={[styles.container, style]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>SLA Timer</Text>
        <TouchableOpacity
          onPress={handleRefresh}
          style={styles.refreshButton}
          disabled={isRefreshing}
        >
          <Text style={styles.refreshIcon}>{isRefreshing ? '⟳' : '↻'}</Text>
        </TouchableOpacity>
      </View>

      {/* Last Updated */}
      <Text style={styles.lastUpdated}>Last Updated: {data.lastUpdated}</Text>

      {/* Divider */}
      <View style={styles.divider} />

      {/* Progress Circles */}
      <View style={styles.progressSection}>
        <CircularProgress
          progress={data.firstResponseProgress}
          time={data.firstResponseTime}
          label="First Response KPI"
        />

        <Text style={styles.remainingTime}>Remaining Time</Text>

        <CircularProgress
          progress={data.resolutionProgress}
          time={data.resolutionTime}
          label="Resolution KPI"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    margin: 8,
    shadowColor: COLORS.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: FONTS.lg,
    fontWeight: FONTS.weight.semiBold,
    color: COLORS.dark,
  },
  refreshButton: {
    padding: 4,
  },
  refreshIcon: {
    fontSize: 18,
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  lastUpdated: {
    fontSize: FONTS.sm,
    color: COLORS.gray,
    marginBottom: 12,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginBottom: 16,
  },
  progressSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  progressSvg: {
    position: 'absolute',
  },
  progressContent: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 80,
    height: 80,
  },
  progressTime: {
    fontSize: FONTS.xs,
    fontWeight: FONTS.weight.semiBold,
    color: COLORS.dark,
    textAlign: 'center',
  },
  progressLabel: {
    fontSize: FONTS.xs,
    color: COLORS.gray,
    textAlign: 'center',
    marginTop: 2,
  },
  remainingTime: {
    fontSize: FONTS.sm,
    color: COLORS.gray,
    textAlign: 'center',
    fontWeight: FONTS.weight.medium,
  },
});

export default SLATimerWidget;
