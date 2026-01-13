import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import CalendarDropdown from './CalendarDropdown';
import { useTheme } from '../../context/ThemeContext';
import { renderLogo } from '../../utils/renderlogo';
import icons from '../../constants/icons';
import colors from '../../constants/colors';

interface DateSelectorProps {
  startDate?: string;
  endDate?: string;
  onPress: (range: string | string[]) => void;
}

const options = [
  'Today',
  'Last 7 days',
  'This month',
  'Last month',
  'This year',
  'Last year',
  'Custom range',
];

const formatDate = (date: Date) =>
  date.toLocaleDateString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  });

const getPresetDates = (option: string) => {
  const today = new Date();
  let start = today;
  let end = today;

  switch (option) {
    case 'Today':
      start = end = today;
      break;

    case 'Last 7 days':
      start = new Date();
      start.setDate(today.getDate() - 6);
      end = today;
      break;

    case 'This month':
      start = new Date(today.getFullYear(), today.getMonth(), 1);
      end = today;
      break;

    case 'Last month':
      start = new Date(today.getFullYear(), today.getMonth() - 1, 1);
      end = new Date(today.getFullYear(), today.getMonth(), 0);
      break;

    case 'This year':
      start = new Date(today.getFullYear(), 0, 1);
      end = today;
      break;

    case 'Last year':
      start = new Date(today.getFullYear() - 1, 0, 1);
      end = new Date(today.getFullYear() - 1, 11, 31);
      break;

    default:
      break;
  }

  return { start: formatDate(start), end: formatDate(end) };
};

const DateSelector: React.FC<DateSelectorProps> = ({
  startDate,
  endDate,
  onPress,
}) => {
  const today = new Date();
  const defaultDate = formatDate(today);

  const [modalVisible, setModalVisible] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const { theme } = useTheme();
  // keep state for displayed range
  const [range, setRange] = useState({
    start: startDate || defaultDate,
    end: endDate || defaultDate,
  });
  const themedStyles = {
    container: {
      ...styles.container,
      backgroundColor: theme === 'dark' ? '#1E1E1E' : colors.white,
      borderColor: theme === 'dark' ? '#1E1E1E' : '#E0E7FF',
    },
    dateText: {
      ...styles.dateText,
      color: theme === 'dark' ? '#ffffff' : colors.darkGray,
    },
  };
  const handleSelect = (item: string) => {
    if (item === 'Custom range') {
      setShowCalendar(true);
      setModalVisible(false);
    } else {
      const { start, end } = getPresetDates(item);
      setRange({ start, end });
      onPress([start, end]);
      setModalVisible(false);
    }
  };

  const handleApplyCustom = (dates: string[]) => {
    if (dates.length === 1) {
      const formatted = formatDate(new Date(dates[0]));
      setRange({ start: formatted, end: formatted });
      onPress([formatted]);
    } else if (dates.length >= 2) {
      const formattedStart = formatDate(new Date(dates[0]));
      const formattedEnd = formatDate(new Date(dates[dates.length - 1]));
      setRange({ start: formattedStart, end: formattedEnd });
      onPress([formattedStart, formattedEnd]);
    }
    setShowCalendar(false);
  };

  return (
    <>
      <TouchableOpacity
        style={themedStyles.container}
        onPress={() => {
          setModalVisible(!modalVisible);
          setShowCalendar(false);
        }}
      >
        <View style={styles.iconContainer}>
          {/* <Text style={styles.calendarIcon}>📅</Text> */}
          {renderLogo(
            theme === 'dark' ? icons.ic_dcalendar : icons.ic_calendar,
            { width: 18, height: 18 },
          )}
        </View>
        <Text style={themedStyles.dateText}>
          {range.start} - {range.end}
        </Text>
        <Text style={styles.dropdownIcon}>▼</Text>
      </TouchableOpacity>

      {modalVisible && (
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPressOut={() => setModalVisible(false)}
        >
          <View style={styles.dropdown}>
            <FlatList
              data={options}
              keyExtractor={item => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.option}
                  onPress={() => handleSelect(item)}
                >
                  <Text style={styles.optionText}>{item}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      )}

      <View style={styles.overlay}>
        {showCalendar && (
          <CalendarDropdown
            selectionMode="multi"
            onApply={handleApplyCustom}
            openExternally={showCalendar}
            showToggleButton={false}
          />
        )}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginHorizontal: 20,
    marginVertical: 16,
    borderWidth: 1,
    borderColor: '#E0E7FF',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
    position: 'relative',
  },
  iconContainer: { marginRight: 12 },
  calendarIcon: { fontSize: 18, color: colors.darkGray },
  dateText: {
    flex: 1,
    fontSize: 14,
    color: colors.darkGray,
    fontWeight: '500',
  },
  dropdownIcon: { fontSize: 12, color: colors.darkGray },

  overlay: {
    justifyContent: 'center',
    position: 'absolute',
    top: 130,
    left: 0,
    right: 0,
    zIndex: 1,
  },
  dropdown: {
    marginHorizontal: 40,
    backgroundColor: colors.white,
    borderRadius: 12,
    paddingVertical: 4,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3.84,
    elevation: 5,
    flex: 1,
  },
  option: { paddingVertical: 12, paddingHorizontal: 16 },
  optionText: { fontSize: 14, color: colors.darkGray },
});

export default DateSelector;
