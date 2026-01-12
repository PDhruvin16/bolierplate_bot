import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { COLORS } from '../../context/ThemeContext';
import { FONTS } from '../../constants/fonts';
import { useTheme } from '../../context/ThemeContext';

export interface TabItem {
  id: string;
  label: string;
}

export interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

const Tabs: React.FC<TabsProps> = ({ tabs, activeTab, onTabChange }) => {
  const { theme } = useTheme();

  const ThemedStyle = {
    wrapper: {
      ...styles.wrapper,
      backgroundColor: theme === 'dark' ? '#000000' : COLORS.white,
    },
    label: {
      ...styles.label,
      color: theme === 'dark' ? '#ffffff' : COLORS.darkGray,
    },
    labelActive: {
      ...styles.labelActive,
      color: theme === 'dark' ? '#ffffff' : COLORS.dark,
    },
    bottomDivider: {
      ...styles.bottomDivider,
      backgroundColor: theme === 'dark' ? '#333333' : COLORS.lightGray,
    },
  };
  return (
    <View style={ThemedStyle.wrapper}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.container}
        bounces={false}
      >
        {tabs.map(tab => {
          const isActive = tab.id === activeTab;
          return (
            <TouchableOpacity
              key={tab.id}
              style={styles.tab}
              onPress={() => onTabChange(tab.id)}
              activeOpacity={0.8}
            >
              <Text
                style={[ThemedStyle.label, isActive && ThemedStyle.labelActive]}
              >
                {tab.label}
              </Text>
              <View
                style={[styles.indicator, isActive && styles.indicatorActive]}
              />
            </TouchableOpacity>
          );
        })}
      </ScrollView>
      <View style={ThemedStyle.bottomDivider} />
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: COLORS.white,
  },
  container: {
    paddingHorizontal: 12,
  },
  tab: {
    marginRight: 20,
    alignItems: 'center',
  },
  label: {
    fontSize: FONTS.sm,
    color: COLORS.darkGray,
    fontWeight: '500',
    paddingVertical: 10,
    fontFamily: FONTS.regular,
  },
  labelActive: {
    color: COLORS.dark,
    fontWeight: '600',
  },
  indicator: {
    height: 2,
    backgroundColor: 'transparent',
    width: '100%',
    borderRadius: 2,
  },
  indicatorActive: {
    backgroundColor: COLORS.primary,
  },
  bottomDivider: {
    height: 1,
    backgroundColor: COLORS.lightGray,
  },
});

Tabs.displayName = 'Tabs';

export default Tabs;
