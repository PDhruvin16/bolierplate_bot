import { useTheme } from '../../context/ThemeContext';
import React, { useMemo } from 'react';
import { View, Text, StyleSheet, useWindowDimensions } from 'react-native';

interface CaseCalendarProps {
  width?: number | string;
  height?: number | string;
  month?: number;
  year?: number;
  casesByDate?: { [day: number]: string[] };
}

const CaseCalendar: React.FC<CaseCalendarProps> = ({
  width = '90%',
  height = 350,
  month = new Date().getMonth(),
  year = new Date().getFullYear(),
  casesByDate = {},
}) => {
  const weekDays = useMemo(() => ['M', 'T', 'W', 'T', 'F', 'S', 'S'], []);
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  const { theme } = useTheme();

  const statusColors = useMemo(
    () => ({
      cancelled: '#4CAF50',
      escalated: '#8BC34A',
      resolved: '#2196F3',
      open: '#F44336',
    }),
    [],
  );

  const calendarData = useMemo(() => {
    const firstDay = new Date(year, month, 1);
    const startingDay = (firstDay.getDay() + 6) % 7;
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const totalCells = startingDay + daysInMonth;
    const cellsNeeded = Math.ceil(totalCells / 7) * 7;
    const grid = Array(cellsNeeded).fill(null);

    return grid.map((_, index) => {
      if (index < startingDay || index >= startingDay + daysInMonth) {
        return { day: '', isEmpty: true };
      }

      const day = index - startingDay + 1;
      return {
        day: day.toString(),
        cases: casesByDate[day] || [],
      };
    });
  }, [month, year, casesByDate]);

  const renderCaseDots = useMemo(
    () => (cases: string[]) => {
      if (!cases?.length) return null;

      return (
        <View style={styles.dotsContainer}>
          {cases.map((caseType, index) => (
            <View
              key={`${caseType}-${index}`}
              style={[
                styles.caseDot,
                {
                  backgroundColor:
                    statusColors[caseType as keyof typeof statusColors],
                },
                index > 0 && { marginLeft: 2 },
              ]}
            />
          ))}
        </View>
      );
    },
    [statusColors],
  );

  const renderWeekDays = useMemo(
    () =>
      weekDays.map(day => (
        <View key={day} style={styles.weekDay}>
          <Text style={styles.weekDayText}>{day}</Text>
        </View>
      )),
    [weekDays],
  );

  const renderCalendarDays = useMemo(
    () =>
      calendarData.map((dateData, index) => (
        <View key={index} style={styles.dateCell}>
          {!dateData.isEmpty && (
            <>
              <Text style={styles.dateText}>{dateData.day}</Text>
              {renderCaseDots(dateData.cases || [])}
            </>
          )}
        </View>
      )),
    [calendarData, renderCaseDots],
  );

  const renderLegend = useMemo(
    () =>
      Object.entries(statusColors).map(([key, color]) => (
        <View key={key} style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: color }]} />
          <Text style={styles.legendText}>
            {key.charAt(0).toUpperCase() + key.slice(1)}
          </Text>
        </View>
      )),
    [statusColors],
  );

  const themedStyle = useMemo(
    () => ({
      container: {
        ...styles.container,
        backgroundColor: theme === 'dark' ? '#1E1E1E' : '#FFFFFF',
      },
    }),
    [theme],
  );

  // Responsive calculations
  const containerWidth =
    typeof width === 'string'
      ? (windowWidth * parseInt(width)) / 100
      : Math.min(width, windowWidth - 32);

  const containerHeight =
    typeof height === 'string'
      ? (windowHeight * parseInt(height)) / 100
      : height;

  return (
    <View
      style={[
        themedStyle.container,
        {
          width: containerWidth,
          minHeight: containerHeight,
          maxWidth: windowWidth - 32,
        },
      ]}
    >
      <Text style={styles.title}>Case Calendar</Text>
      <View style={styles.content}>
        <View style={styles.calendarSection}>
          <View style={styles.weekHeader}>{renderWeekDays}</View>
          <View style={styles.calendarGrid}>{renderCalendarDays}</View>
        </View>
        <View style={styles.legend}>{renderLegend}</View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    alignSelf: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  calendarSection: {
    flex: 1,
    marginRight: 16,
  },
  weekHeader: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  weekDay: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 4,
  },
  weekDayText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dateCell: {
    width: '14.28%',
    aspectRatio: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 4,
    // height: 35,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#E5E5E5',
  },
  dateText: {
    fontSize: 12,
    color: '#333',
    fontWeight: '400',
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
    height: 12,
    flexWrap: 'wrap',
  },
  caseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  legend: {
    width: 100,
    paddingTop: 8,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  legendText: {
    fontSize: 12,
    color: '#444',
    fontWeight: '500',
    flexShrink: 1,
  },
});

export default CaseCalendar;
