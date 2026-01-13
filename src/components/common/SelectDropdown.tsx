import React, { useMemo, useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from 'react-native';
import { FONTS } from '../../constants/fonts';
import { renderLogo } from '../../utils/renderlogo';
import icons from '../../constants/icons';
import colors from '../../constants/colors';

export interface SelectOption {
  id: string;
  label: string;
}

export interface TabData {
  id: string;
  label: string;
  options: SelectOption[];
}

export interface SelectDropdownProps {
  label?: string; // <-- add label prop
  placeholder?: string;
  options?: SelectOption[]; // Keep for backward compatibility
  mode?: 'single' | 'multi';
  lookup?: boolean; // shows a search bar and "+ New" row
  newFeild?: boolean; // shows a new field to add new option
  value?: string | null; // for single
  values?: string[]; // for multi
  onChange?: (value: string | null) => void;
  onChangeMulti?: (values: string[]) => void;
  onCreateNew?: () => void;
  disabled?: boolean;
  // New props for tabs
  showTabs?: boolean;
  tabs?: TabData[];
  activeTab?: string;
  onTabChange?: (tabId: string) => void;
}

const SelectDropdown: React.FC<SelectDropdownProps> = ({
  label, // <-- destructure label
  placeholder = 'Placeholder text',
  options = [],
  mode = 'single',
  lookup = false,
  newFeild = false,
  value = null,
  values = [],
  onChange,
  onChangeMulti,
  onCreateNew,
  disabled = false,
  // New props
  showTabs = false,
  tabs = [],
  activeTab = '',
  onTabChange,
}) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [internalActiveTab, setInternalActiveTab] = useState(activeTab || '');

  // Set default active tab
  useEffect(() => {
    if (showTabs && tabs.length > 0 && !activeTab && !internalActiveTab) {
      const defaultTab = tabs[0].id;
      setInternalActiveTab(defaultTab);
      onTabChange?.(defaultTab);
    }
  }, [showTabs, tabs, activeTab, internalActiveTab, onTabChange]);

  // Get current tab options
  const getCurrentTabOptions = (): SelectOption[] => {
    if (!showTabs || tabs.length === 0) {
      return options;
    }

    const currentTabId = activeTab || internalActiveTab;
    const currentTab = tabs.find(tab => tab.id === currentTabId);
    return currentTab?.options || [];
  };

  const currentOptions = getCurrentTabOptions();

  const filtered = useMemo(() => {
    if (!lookup || query.trim().length === 0) return currentOptions;
    const q = query.toLowerCase();
    return currentOptions.filter(o => o.label.toLowerCase().includes(q));
  }, [currentOptions, lookup, query]);

  const toggleOpen = () => {
    if (disabled) return;
    setOpen(!open);
  };

  const isSelected = (id: string): boolean => {
    return mode === 'single' ? value === id : values.includes(id);
  };

  const handleSelect = (id: string) => {
    if (mode === 'single') {
      onChange?.(id);
      setOpen(false);
    } else {
      const next = values.includes(id)
        ? values.filter(v => v !== id)
        : [...values, id];
      onChangeMulti?.(next);
    }
  };

  const handleTabChange = (tabId: string) => {
    const newTabId = activeTab ? activeTab : internalActiveTab;
    if (newTabId !== tabId) {
      setInternalActiveTab(tabId);
      onTabChange?.(tabId);
      setQuery(''); // Clear search when tab changes
      // Clear selections when tab changes
      if (mode === 'single') {
        onChange?.(null);
      } else {
      }
    }
  };

  const getSelectedLabel = (): string => {
    if (mode === 'single') {
      if (!value) return placeholder;
      const selectedOption = currentOptions.find(o => o.id === value);
      return selectedOption?.label || placeholder;
    }
    return placeholder;
  };

  return (
    <View style={styles.container}>
      {label && (
        <Text style={styles.label}>
          {label}
        </Text>
      )}
      <TouchableOpacity
        activeOpacity={0.7}
        style={[styles.input, disabled && styles.inputDisabled]}
        onPress={toggleOpen}
      >
        {/* Left: placeholder or selected */}
        <View style={styles.inputContent}>
          {mode === 'single' ? (
            <Text style={[styles.inputText, !value && styles.placeholder]}>
              {getSelectedLabel()}
            </Text>
          ) : (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.chipsRow}
              bounces={false}
            >
              {values.length === 0 ? (
                <Text style={[styles.inputText, styles.placeholder]}>
                  {placeholder}
                </Text>
              ) : (
                values.map(v => (
                  <View key={v} style={styles.chip}>
                    <Text style={styles.chipText}>
                      {showTabs
                        ? tabs.flatMap(tab => tab.options).find(o => o.id === v)
                            ?.label
                        : currentOptions.find(o => o.id === v)?.label}
                    </Text>
                    <Text
                      style={styles.chipClose}
                      onPress={() => handleSelect(v)}
                    >
                      ✕
                    </Text>
                  </View>
                ))
              )}
            </ScrollView>
          )}
        </View>

        {/* Right: icons */}
        <View style={styles.chevron}>
          {renderLogo(open ? icons.ic_dropdown1 : icons.ic_dropdown, {
            width: 18,
            height: 18,
          })}
        </View>
      </TouchableOpacity>

      {open && (
        <View style={styles.dropdown}>
          {lookup && (
            <View style={styles.searchBar}>
              <Text style={styles.searchIcon}>🔍</Text>
              <TextInput
                style={styles.searchInput}
                placeholder={placeholder}
                placeholderTextColor={colors.gray}
                value={query}
                onChangeText={setQuery}
              />
            </View>
          )}

          {/* Tabs - Only show if showTabs is true and tabs exist */}
          {showTabs && tabs.length > 0 && (
            <View style={styles.tabContainer}>
              {tabs.map(tab => (
                <TouchableOpacity
                  key={tab.id}
                  style={[
                    styles.tab,
                    (activeTab || internalActiveTab) === tab.id &&
                      styles.activeTab,
                  ]}
                  onPress={() => handleTabChange(tab.id)}
                >
                  <Text
                    style={[
                      styles.tabText,
                      (activeTab || internalActiveTab) === tab.id &&
                        styles.activeTabText,
                    ]}
                  >
                    {tab.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          <ScrollView style={styles.menu} nestedScrollEnabled bounces={false}>
            {filtered.map(opt => (
              <TouchableOpacity
                key={opt.id}
                style={styles.option}
                onPress={() => handleSelect(opt.id)}
                activeOpacity={0.7}
              >
                {mode === 'multi' ? (
                  <View style={styles.checkboxContainer}>
                    <View
                      style={[
                        styles.checkbox,
                        isSelected(opt.id) && styles.checkedBox,
                      ]}
                    >
                      {isSelected(opt.id) && (
                        <Text style={styles.checkmark}>✓</Text>
                      )}
                    </View>
                  </View>
                ) : null}
                <Text style={styles.optionText}>{opt.label}</Text>
                {/* {mode === 'single' && <Text style={styles.optionRight}>›</Text>} */}
              </TouchableOpacity>
            ))}

            {filtered.length === 0 && query.trim().length > 0 && (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No results found</Text>
              </View>
            )}

            {newFeild && (
              <TouchableOpacity style={styles.newRow} onPress={onCreateNew}>
                <Text style={styles.plus}>＋</Text>
                <Text style={styles.newText}>New</Text>
              </TouchableOpacity>
            )}
          </ScrollView>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.dark,
    marginBottom: 8,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 6,
    paddingHorizontal: 12,
    backgroundColor: colors.white,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  inputDisabled: {
    backgroundColor: colors.lightBackground,
  },
  inputContent: {
    flex: 1,
    marginRight: 8,
  },
  inputText: {
    fontSize: FONTS.sm,
    color: colors.dark,
  },
  placeholder: {
    color: colors.gray,
  },
  chevron: {
    // Removed color property; add layout styles here if needed
  },
  dropdown: {
    marginTop: 6,
    borderRadius: 8,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 3,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    height: 40,
  },
  searchIcon: {
    fontSize: 16,
    color: colors.gray,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: FONTS.sm,
    color: colors.dark,
  },
  // New tab styles
  tabContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: colors.primary,
  },
  tabText: {
    fontSize: FONTS.sm,
    color: colors.gray,
    fontWeight: '500',
  },
  activeTabText: {
    color: colors.primary,
  },
  menu: {
    maxHeight: 150,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
  },
  optionText: {
    flex: 1,
    fontSize: FONTS.sm,
    color: colors.dark,
  },
  optionRight: {
    fontSize: 18,
    color: colors.gray,
  },
  // Checkbox styles copied from RelatedSection for consistency
  checkboxContainer: {
    marginRight: 12,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: colors.gray,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkedBox: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  checkmark: {
    color: colors.white,
    fontSize: 12,
    fontWeight: 'bold',
  },
  // Chips for multiselect values
  chipsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.lightBackground,
    marginRight: 6,
  },
  chipText: {
    fontSize: FONTS.xs,
    color: colors.dark,
  },
  chipClose: {
    fontSize: 12,
    color: colors.gray,
  },
  newRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
  },
  plus: {
    fontSize: 16,
    color: colors.gray,
    marginRight: 6,
  },
  newText: {
    fontSize: FONTS.sm,
    color: colors.dark,
  },
  emptyContainer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: FONTS.sm,
    color: colors.gray,
    fontStyle: 'italic',
  },
});

export default SelectDropdown;
