import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  LayoutAnimation,
  TouchableWithoutFeedback,
  ScrollView,
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import Icon from 'react-native-vector-icons/AntDesign';
import LinearGradient from 'react-native-linear-gradient';

type SelectionMode = 'single' | 'multi';

interface CalendarDropdownProps {
  selectionMode?: SelectionMode;
  onApply?: (dates: string[]) => void;
  showToggleButton?: boolean;
  openExternally?: boolean;
}

type CalendarDate = {
  dateString: string;
  day: number;
  month: number;
  year: number;
  timestamp: number;
};

const CalendarDropdown: React.FC<CalendarDropdownProps> = ({
  selectionMode = 'single',
  onApply,
  showToggleButton = true,
  openExternally,
}) => {
  const [openInternal, setOpenInternal] = useState(false);
  const open = openExternally !== undefined ? openExternally : openInternal;

  const [selectedDates, setSelectedDates] = useState<string[]>([]);
  const [currentMonth, setCurrentMonth] = useState<string>(
    new Date().toISOString().split('T')[0],
  );
  const [showYearPicker, setShowYearPicker] = useState(false);

  const toggleDropdown = () => {
    if (openExternally === undefined) {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setOpenInternal(!openInternal);
    }
  };

  const handleDayPress = (day: CalendarDate) => {
    if (selectionMode === 'single') {
      setSelectedDates([day.dateString]);
    } else {
      if (selectedDates.includes(day.dateString)) {
        setSelectedDates(selectedDates.filter(d => d !== day.dateString));
      } else {
        setSelectedDates([...selectedDates, day.dateString]);
      }
    }
  };

  const resetSelection = () => setSelectedDates([]);

  const handleApply = () => {
    onApply?.(selectedDates);
    if (openExternally === undefined) {
      setOpenInternal(false);
    }
  };

  const handleMonthChange = (direction: 'prev' | 'next') => {
    const date = new Date(currentMonth);
    date.setMonth(date.getMonth() + (direction === 'next' ? 1 : -1));
    setCurrentMonth(date.toISOString().split('T')[0]);
  };

  const handleYearSelect = (year: number) => {
    const date = new Date(currentMonth);
    date.setFullYear(year);
    setCurrentMonth(date.toISOString().split('T')[0]);
    setShowYearPicker(false);
  };

  const years = Array.from({ length: 21 }, (_, i) => 2015 + i);

  return (
    <View style={styles.wrapper}>
      {showToggleButton && (
        <TouchableOpacity
          onPress={toggleDropdown}
          style={styles.dropdownButton}
        >
          <Text style={styles.dropdownText}>
            {selectedDates.length > 0
              ? `${selectedDates.length} selected`
              : 'Select date(s)'}
          </Text>
          <Icon name={open ? 'up' : 'down'} size={16} color="#333" />
        </TouchableOpacity>
      )}

      {open && (
        <View style={styles.calendarBox}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => setShowYearPicker(!showYearPicker)}
              style={styles.monthWrapper}
            >
              <Text style={styles.monthText}>
                {new Date(currentMonth).toLocaleString('default', {
                  month: 'long',
                  year: 'numeric',
                })}
              </Text>
              <Icon
                name={showYearPicker ? 'up' : 'down'}
                size={14}
                color="#333"
                style={{ marginLeft: 4 }}
              />
            </TouchableOpacity>

            <View style={styles.navButtons}>
              <TouchableOpacity onPress={() => handleMonthChange('prev')}>
                <Icon name="left" size={18} color="#333" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleMonthChange('next')}>
                <Icon name="right" size={18} color="#333" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Year Picker */}
          {showYearPicker && (
            <TouchableWithoutFeedback onPress={() => setShowYearPicker(false)}>
              <View>
                <View style={styles.yearDropdown}>
                  <ScrollView style={{ maxHeight: 200, zIndex: 1001 }}  bounces={false}>
                    {years.map(item => (
                      <TouchableOpacity
                        key={item}
                        style={styles.yearOption}
                        onPress={() => handleYearSelect(item)}
                      >
                        <Text style={styles.yearText}>{item}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              </View>
            </TouchableWithoutFeedback>
          )}

          {/* Calendar */}
          <Calendar
            current={currentMonth}
            hideExtraDays={false}
            hideArrows
            key={currentMonth}
            renderHeader={() => null}
            onDayPress={handleDayPress}
            dayComponent={({ date }) => {
              if (!date) return <View style={styles.dayWrapper} />;

              const isSelected = selectedDates.includes(date.dateString);

              let renderGradient = false;
              let bgColor: string | undefined = undefined;
              let textColor = '#333';

              if (selectionMode === 'multi' && selectedDates.length > 1) {
                const sortedDates = [...selectedDates].sort();
                const first = sortedDates[0];
                const last = sortedDates[sortedDates.length - 1];

                if (date.dateString === first || date.dateString === last) {
                  renderGradient = true;
                  textColor = '#fff';
                } else if (date.dateString > first && date.dateString < last) {
                  bgColor = '#EFEFEF';
                }
              } else if (isSelected) {
                renderGradient = true;
                textColor = '#fff';
              }

              return (
                <TouchableOpacity onPress={() => handleDayPress(date)}>
                  <View style={styles.dayWrapper}>
                    {renderGradient ? (
                      <LinearGradient
                        colors={['#404698', '#882785']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.gradientDay}
                      >
                        <Text style={{ color: textColor }}>{date.day}</Text>
                      </LinearGradient>
                    ) : (
                      <View
                        style={[
                          styles.dayInner,
                          bgColor ? { backgroundColor: bgColor } : null,
                        ]}
                      >
                        <Text style={{ color: textColor }}>{date.day}</Text>
                      </View>
                    )}
                  </View>
                </TouchableOpacity>
              );
            }}
          />

          {/* Footer */}
          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.resetButton}
              onPress={resetSelection}
            >
              <Icon name="reload1" size={18} color="#333" />
            </TouchableOpacity>
            <View style={styles.footerRight}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={toggleDropdown}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.applyButton}
                onPress={handleApply}
              >
                <Text style={styles.applyText}>Apply</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    margin: 10,
  },
  dropdownButton: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdownText: {
    fontSize: 16,
    color: '#333',
  },
  calendarBox: {
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#bbb',
    borderRadius: 12,
    backgroundColor: '#fff',
    overflow: 'hidden',
    elevation: 5,
    zIndex: 1000,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 12,
    borderBottomWidth: 1,
    borderColor: '#eee',
    alignItems: 'center',
  },
  monthWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  monthText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  navButtons: {
    flexDirection: 'row',
    gap: 16,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    borderTopWidth: 1,
    borderColor: '#eee',
    alignItems: 'center',
  },
  resetButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#f1f1f1',
  },
  footerRight: {
    flexDirection: 'row',
    gap: 10,
  },
  cancelButton: {
    paddingVertical: 8,
    paddingHorizontal: 14,
  },
  cancelText: {
    color: '#555',
    fontSize: 15,
  },
  applyButton: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
    backgroundColor: '#0066FF',
  },
  applyText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
  },
  yearDropdown: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#fff',
    marginHorizontal: 12,
    marginBottom: 8,
    elevation: 4,
  },
  yearOption: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  yearText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
  },
  dayWrapper: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayInner: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gradientDay: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default CalendarDropdown;
