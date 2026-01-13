import React, { useState, ReactNode } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

import { FONTS } from '../../constants/fonts';
import { renderLogo } from '../../utils/renderlogo';
import icons from '../../constants/icons';
import { useTheme } from '../../context/ThemeContext';
import colors from '../../constants/colors';

export interface AccordionProps {
  title: string;
  children: ReactNode;
  initiallyExpanded?: boolean;
  rightAccessory?: ReactNode;
  containerStyle?: any;
}

const Accordion: React.FC<AccordionProps> = ({
  title,
  children,
  initiallyExpanded = false,
  rightAccessory,
  containerStyle,
}) => {
  const [expanded, setExpanded] = useState(initiallyExpanded);
  const { theme } = useTheme();

  const ThemedStyle = {
    container: {
      ...styles.container,
      backgroundColor: theme === 'dark' ? '#1E1E1E' : colors.white,
      borderColor: theme === 'dark' ? '#1E1E1E' : colors.lightGray,
    },
    title: {
      ...styles.title,
      color: theme === 'dark' ? '#ffffff' : colors.dark,
    },
    header: {
      ...styles.header,
      backgroundColor: theme === 'dark' ? '#1E1E1E' : colors.white,

      borderColor: theme === 'dark' ? '#1E1E1E' : colors.lightGray,
      // borderBottomWidth: expanded ? 0 : 1,
    },
    content: {
      ...styles.content,
      backgroundColor: theme === 'dark' ? '#22223b' : colors.white,
    },
  };

  return (
    <View style={[ThemedStyle.container, containerStyle]}>
      <TouchableOpacity
        style={ThemedStyle.header}
        onPress={() => setExpanded(prev => !prev)}
        activeOpacity={0.8}
      >
        <Text style={ThemedStyle.title}>{title}</Text>
        <View style={styles.headerRight}>
          {rightAccessory}
          {/* <Text style={styles.chevron}>{expanded ? '▴' : '▾'}</Text> */}
          {renderLogo(expanded ? icons.ic_dropdown1 : icons.ic_dropdown, {
            width: 18,
            height: 18,
          })}
        </View>
      </TouchableOpacity>

      {expanded && <View style={styles.content}>{children}</View>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.lightGray,
    marginBottom: 12,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: colors.white,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: FONTS.md,
    fontWeight: '600',
    color: colors.dark,
  },
  chevron: {
    fontSize: 16,
    color: colors.gray,
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
});

Accordion.displayName = 'Accordion';

export default Accordion;
