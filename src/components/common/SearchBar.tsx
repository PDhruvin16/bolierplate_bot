import React from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  TextInputProps,
} from 'react-native';
import { FONTS } from '../../constants/fonts';
import icons from '../../constants/icons';
import { renderLogo } from '../../utils/renderlogo';
import { useTheme } from '../../context/ThemeContext';
import colors from '../../constants/colors';

export interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  onFilterPress?: () => void;
  onSubmitEditing?: () => void;
  containerStyle?: object;
  inputProps?: TextInputProps;
  hideFilterButton?: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChangeText,
  placeholder = 'Search',
  onFilterPress,
  onSubmitEditing,
  containerStyle,
  inputProps,
  hideFilterButton,
}) => {
  const { theme } = useTheme();
  const ThemedStyle = {
    container: {
      ...styles.container,
      backgroundColor: theme === 'dark' ? '#2C2B2B' : colors.white,
      borderColor: theme === 'dark' ? '#2C2B2B' : colors.lightGray,
    },
    filterButton: {
      ...styles.filterButton,
      backgroundColor: theme === 'dark' ? '#2C2B2B' : colors.lightBackground,
    },
  };
  return (
    <View style={[ThemedStyle.container, containerStyle]}>
      <View style={styles.leftIcon}>
        {renderLogo(icons.Vector, { width: 16, height: 16 })}
      </View>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor={colors.gray}
        value={value}
        onChangeText={onChangeText}
        returnKeyType="search"
        onSubmitEditing={onSubmitEditing}
        {...inputProps}
      />
      {!hideFilterButton && (
        <TouchableOpacity
          style={ThemedStyle.filterButton}
          onPress={onFilterPress}
          activeOpacity={0.8}
        >
          {renderLogo(icons.Filter, { width: 14, height: 14 })}
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    marginHorizontal: 16,
    marginVertical: 12,
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 40,
    borderWidth: 1,
    borderColor: colors.lightGray,
  },
  leftIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: FONTS.sm,
    color: colors.dark,
    paddingVertical: 0,
  },
  filterButton: {
    marginLeft: 8,
    padding: 6,
    // backgroundColor: colors.lightBackground,
    borderRadius: 6,
  },
});

export default SearchBar;
