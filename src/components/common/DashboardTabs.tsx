import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { COLORS } from '../../context/ThemeContext';
import { useTheme } from '../../context/ThemeContext';

interface Tab {
  id: string;
  label: string;
}

interface DashboardTabsProps {
  tabs: Tab[];
  activeTab: string;
  onTabPress: (tabId: string) => void;
}

const DashboardTabs: React.FC<DashboardTabsProps> = ({
  tabs,
  activeTab,
  onTabPress,
}) => {
  const { theme } = useTheme();

  const themedStyles = {
    container: {
      ...styles.container,
    },
    tabText: {
      ...styles.tabText,
      color: theme === 'dark' ? COLORS.lightGray : COLORS.darkGray,
    },
  };
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={themedStyles.container}
      bounces={false}
    >
      {tabs.map(tab => (
        <TouchableOpacity
          key={tab.id}
          style={styles.tab}
          onPress={() => onTabPress(tab.id)}
        >
          {activeTab === tab.id ? (
            <LinearGradient
              colors={['#404698', '#882785']}
              style={{ borderRadius: 20 }}
            >
              <View style={styles.activeTabGradient}>
                <Text style={styles.activeTabText}>{tab.label}</Text>
              </View>
            </LinearGradient>
          ) : (
            <Text style={themedStyles.tabText}>{tab.label}</Text>
          )}
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    // backgroundColor: COLORS.background,
    borderRadius: 25,
  },
  tab: {
    marginRight: 12,
  },
  activeTabGradient: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.darkGray,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  activeTabText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '500',
  },
});

export default DashboardTabs;
