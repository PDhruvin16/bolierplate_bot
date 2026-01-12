import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from 'react-native';
import { COLORS, useTheme } from '../../context/ThemeContext';
import { FONTS } from '../../constants/fonts';
import SearchBar from './SearchBar';
import { renderLogo } from '../../utils/renderlogo';
import icons from '../../constants/icons';
import log from '../../utils/logger';
// import icons from '../../constants/icons';

export interface RelatedTab {
  id: string;
  label: string;
  icon: string;
}

export interface RelatedItem {
  id: string;
  title: string;
  subtitle: string;
  selected?: boolean;
}

export interface RelatedSectionProps {
  title?: string;
  tabs: RelatedTab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  items: RelatedItem[];
  onItemSelect?: (item: RelatedItem) => void;
  onItemMenu?: (item: RelatedItem) => void;
  onAdd?: () => void;
  onEdit?: () => void;
  onSettings?: () => void;
  onViewAll?: () => void;
  searchPlaceholder?: string;
  showCheckboxes?: boolean;
  emptyState?: {
    title: string;
    message: string;
  };
  /**
   * When true, renders only the inner content (tabs, search, list)
   * without the outer header/expand container so it can be embedded
   * inside another Accordion.
   */
  embedded?: boolean;
}

const RelatedSection: React.FC<RelatedSectionProps> = ({
  title = 'Related',
  tabs,
  activeTab,
  onTabChange,
  items,
  onItemSelect,
  onItemMenu,
  onAdd,
  onEdit,
  onSettings,
  onViewAll,
  searchPlaceholder = 'Search',
  showCheckboxes = false,
  emptyState,
  embedded = false,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [searchText, setSearchText] = useState('');
  const { theme } = useTheme();
  const filteredItems = items
  // .filter(
    //   item =>
    //     item.title.toLowerCase().includes(searchText.toLowerCase()) ||
    //     item.subtitle.toLowerCase().includes(searchText.toLowerCase()),
    // );

  const activeTabData = tabs.find(tab => tab.id === activeTab);

  const Content = (
    <View style={[styles.content, embedded && styles.embeddedContent]}>
      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          bounces={false}
        >
          {tabs.map(tab => (
            <TouchableOpacity
              key={tab.id}
              style={[styles.tab, activeTab === tab.id && styles.activeTab]}
              onPress={() => onTabChange(tab.id)}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                {renderLogo(tab.icon, { width: 16, height: 16 })}
                {activeTab === tab.id && (
                  <Text
                    style={[
                      styles.tabText,
                      activeTab === tab.id && styles.activeTabText,
                      { marginLeft: 6 },
                    ]}
                  >
                    {tab.label}
                  </Text>
                )}
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Action Icons */}
        <View style={styles.actionIcons}>
          {onEdit && (
            <TouchableOpacity style={styles.actionIcon} onPress={onEdit}>
              <Text style={styles.actionIconText}>✏️</Text>
            </TouchableOpacity>
          )}
          {onSettings && (
            <TouchableOpacity style={styles.actionIcon} onPress={onSettings}>
              <Text style={styles.actionIconText}>⚙️</Text>
            </TouchableOpacity>
          )}
          {onViewAll && (
            <TouchableOpacity style={styles.actionIcon} onPress={onViewAll}>
              <Text style={styles.actionIconText}>📄</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Content Area */}
      <View style={styles.contentArea}>
        {/* Section Title and Add Button */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            {activeTabData?.label || 'Items'}
          </Text>
          {/* {onAdd && ( */}
          <TouchableOpacity style={styles.addButton} onPress={onAdd}>
            {renderLogo(icons.ic_Newb, { width: 16, height: 16 })}
          </TouchableOpacity>
          {/* )} */}
        </View>

        <View style={styles.searchRow}>
          <View style={{ flex: 1 }}>
            <SearchBar
              value={searchText}
              onChangeText={setSearchText}
              hideFilterButton
              containerStyle={{ marginHorizontal: 0, marginVertical: 12 }}
            />
          </View>
          <TouchableOpacity
            style={styles.standaloneFilterButton}
            activeOpacity={0.8}
          >
            {renderLogo(theme === 'dark' ? icons.Filterd : icons.Filter, {
              width: 16,
              height: 16,
            })}
          </TouchableOpacity>
        </View>

        {/* Items List */}
        <ScrollView
          style={styles.itemsContainer}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          {emptyState && filteredItems.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateTitle}>{emptyState.title}</Text>
              <Text style={styles.emptyStateMessage}>{emptyState.message}</Text>
            </View>
          ) : (
            filteredItems.map(item => {
              return(
              <TouchableOpacity
                key={item.id}
                style={styles.item}
                onPress={() => onItemSelect?.(item)}
                activeOpacity={0.7}
              >
                {showCheckboxes && (
                  <View style={styles.checkboxContainer}>
                    <View
                      style={[
                        styles.checkbox,
                        item.selected && styles.checkedBox,
                      ]}
                    >
                      {item.selected && <Text style={styles.checkmark}>✓</Text>}
                    </View>
                  </View>
                )}

                <View style={styles.itemContent}>
                  <Text style={styles.itemTitle}>{item.title}</Text>
                  <Text style={styles.itemSubtitle}>{item.subtitle}</Text>
                </View>

                <TouchableOpacity
                  style={styles.itemMenu}
                  onPress={() => onItemMenu?.(item)}
                >
                  <Text style={styles.itemMenuText}>⋮</Text>
                </TouchableOpacity>
              </TouchableOpacity>
            )})
          )}
        </ScrollView>
      </View>
    </View>
  );

  if (embedded) {
    return Content;
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <TouchableOpacity
        style={styles.header}
        onPress={() => setIsExpanded(!isExpanded)}
        activeOpacity={0.7}
      >
        <Text style={styles.headerTitle}>{title}</Text>
        <Text style={styles.chevron}>{isExpanded ? '▲' : '▼'}</Text>
      </TouchableOpacity>

      {isExpanded && Content}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: COLORS.lightBackground,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  headerTitle: {
    fontSize: FONTS.lg,
    fontWeight: '600',
    color: COLORS.dark,
  },
  chevron: {
    fontSize: 16,
    color: COLORS.gray,
  },
  content: {
    padding: 16,
  },
  embeddedContent: {
    padding: 0,
  },
  tabsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 6,
    // backgroundColor: COLORS.lightBackground,
  },
  activeTab: {
    backgroundColor: '#E7EEFF',
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 0,
    gap: 10,
  },
  tabIcon: {
    fontSize: 16,
    marginRight: 6,
    color: COLORS.gray,
  },
  activeTabIcon: {
    color: COLORS.white,
  },
  tabText: {
    fontSize: FONTS.sm,
    color: COLORS.gray,
    fontWeight: '500',
  },
  activeTabText: {
    color: 'black',
  },
  actionIcons: {
    flexDirection: 'row',
    marginLeft: 'auto',
  },
  actionIcon: {
    padding: 8,
    marginLeft: 4,
  },
  actionIconText: {
    fontSize: 16,
    color: COLORS.gray,
  },
  contentArea: {
    flex: 1,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: FONTS.md,
    fontWeight: '600',
    color: COLORS.dark,
  },
  addButton: {
    width: 24,
    height: 24,

    backgroundColor: '#E7EEFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.lightBackground,
    borderRadius: 6,
    paddingHorizontal: 12,
    marginBottom: 16,
    height: 40,
  },
  searchIcon: {
    fontSize: 16,
    color: COLORS.gray,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: FONTS.sm,
    color: COLORS.dark,
  },
  filterIcon: {
    padding: 4,
  },
  filterIconText: {
    fontSize: 16,
    color: COLORS.gray,
  },
  itemsContainer: {
    maxHeight: 200,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  checkboxContainer: {
    marginRight: 12,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: COLORS.gray,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkedBox: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  checkmark: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: 'bold',
  },
  itemContent: {
    flex: 1,
  },
  itemTitle: {
    fontSize: FONTS.sm,
    fontWeight: '500',
    color: COLORS.dark,
    marginBottom: 2,
  },
  itemSubtitle: {
    fontSize: FONTS.xs,
    color: COLORS.gray,
  },
  itemMenu: {
    padding: 8,
  },
  itemMenuText: {
    fontSize: 16,
    color: COLORS.gray,
    transform: [{ rotate: '90deg' }],
  },
  emptyState: {
    padding: 32,
    alignItems: 'center',
  },
  emptyStateTitle: {
    fontSize: FONTS.lg,
    fontWeight: '600',
    color: COLORS.dark,
    marginBottom: 8,
  },
  emptyStateMessage: {
    fontSize: FONTS.sm,
    color: COLORS.gray,
    textAlign: 'center',
  },
  standaloneFilterButton: {
    marginLeft: 0,
    height: 40,
    width: 40,
    borderRadius: 8,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

RelatedSection.displayName = 'RelatedSection';

export default RelatedSection;
