import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

import { FONTS } from '../../constants/fonts';
import { ActionBarItem } from '../../constants/accountData';
import { useTheme } from '../../context/ThemeContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import colors from '../../constants/colors';

export interface BottomActionBarProps {
  items: ActionBarItem[];
}

const BottomActionBar: React.FC<BottomActionBarProps> = ({ items }) => {
  const { theme } = useTheme();
  const ThemedStyle = {
    container: {
      ...styles.container,
      backgroundColor: theme === 'dark' ? '#000000' : colors.white,
      borderTopColor: theme === 'dark' ? '#000000' : colors.lightGray,
    },
    actionLabel: {
      ...styles.actionLabel,
      color: theme === 'dark' ? '#ffffff' : colors.dark,
    },
  };
  return (
      <View style={ThemedStyle.container}>
        {items.map(item => (
          <TouchableOpacity
            key={item.id}
            style={[
              styles.actionItem,
              item.disabled && styles.disabledActionItem,
            ]}
            onPress={item.onPress}
            disabled={item.disabled}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.actionIcon,
                item.disabled && styles.disabledActionIcon,
              ]}
            >
              {item.icon}
            </Text>
            <Text
              style={[
                ThemedStyle.actionLabel,
                item.disabled && styles.disabledActionLabel,
              ]}
            >
              {item.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: colors.white,
  },
  container: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.lightGray,
    paddingHorizontal: 16,
    paddingVertical: 12,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  actionItem: {
    alignItems: 'center',
    flex: 1,
    paddingVertical: 8,
  },
  disabledActionItem: {
    opacity: 0.5,
  },
  actionIcon: {
    fontSize: 20,
    marginBottom: 4,
    color: colors.dark,
  },
  disabledActionIcon: {
    color: colors.gray,
  },
  actionLabel: {
    fontSize: FONTS.xs,
    color: colors.dark,
    fontWeight: '500',
    textAlign: 'center',
  },
  disabledActionLabel: {
    color: colors.gray,
  },
});

BottomActionBar.displayName = 'BottomActionBar';

export default BottomActionBar;
