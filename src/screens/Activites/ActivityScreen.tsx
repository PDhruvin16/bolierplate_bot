import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { COLORS } from '../../context/ThemeContext';
import { FONTS } from '../../constants/fonts';
import BottomActionBar from '../../components/common/BottomActionBar';
import CustomHeader from '../../components/common/CustomHeader';
import SearchBar from '../../components/common/SearchBar';
import { ActionSheet, ActionItem } from '../../components/common';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import icons from '../../constants/icons';
import { renderLogo } from '../../utils/renderlogo';
import { useTheme } from '../../context/ThemeContext';
import { ActivitiesItem } from './types';
import useActivitiesQueries from '../../hooks/useActivitiesQueries';
import useDownload from '../../hooks/useDownload';
import { getBottomActionBarItems } from '../../constants/CommonData';
import { StackNavigationProp } from '@react-navigation/stack';
import log from '../../utils/logger';
import { AssignRecordModal } from '../../components/common/AccountAssignModal';
import ShareSheet from '../../components/common/ShareModal';

type ActivityScreenProps = {
  navigation: StackNavigationProp<any>;
};

const Activity: React.FC<ActivityScreenProps> = ({ navigation }) => {
  const { theme } = useTheme();
  const [activity, setActivity] = useState<ActivitiesItem[]>([]);
  const [searchText, setSearchText] = useState('');
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<string[]>([]);
  const [moreSheetVisible, setMoreSheetVisible] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [totalCount, setTotalCount] = useState<number | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [viewSheetVisible, setViewSheetVisible] = useState(false);
  const [dynamicViews, setDynamicViews] = useState<any[]>([]);
  const [selectedViewIndex, setSelectedViewIndex] = useState<number>(0);
  const [showShareBottom, setShowShareBottom] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);

  const themedStyles = {
    container: {
      ...styles.container,
      backgroundColor: theme === 'dark' ? '#22223b' : COLORS.white,
      borderColor: theme === 'dark' ? '#22223b' : COLORS.lightGray,
    },
    listContainer: {
      ...styles.listContainer,
      backgroundColor: theme === 'dark' ? '#2C2B2B' : 'transparent',
      borderColor: theme === 'dark' ? '#1E1E1E' : COLORS.lightGray,
    },
    activitySeparator: {
      ...styles.activitySeparator,
      backgroundColor: theme === 'dark' ? '#1E1E1E' : COLORS.lightGray,
    },
    standaloneFilterButton: {
      ...styles.standaloneFilterButton,
      backgroundColor: theme === 'dark' ? '#2C2B2B' : COLORS.white,
      borderColor: theme === 'dark' ? '#1E1E1E' : COLORS.lightGray,
    },
  };

  // Use activity queries hook for data fetching
  const {
    useActivitiesList,
    useMetaData,
    deleteActivities,
    statusUpdate,
    useSearchFilter,
  } = useActivitiesQueries();

  const {
    data: metadataData,
    isLoading: metadataLoading,
    error: metadataError,
  } = useMetaData();

  // Extract content type ID from metadata
  const contentTypeId = metadataData?.allow_content_type?.id;
  const navigationModuleId = metadataData?.navigation_module_id;

  // Call search filter API with the content type ID
  const {
    data: searchFilterData,
    isLoading: searchFilterLoading,
    error: searchFilterError,
  } = useSearchFilter(contentTypeId || '', !!contentTypeId);

  useEffect(() => {
    if (Array.isArray(searchFilterData) && searchFilterData.length > 0) {
      const transformed = searchFilterData.map((view: any, idx: number) => {
        const isAllContactsFirst = idx === 0 && view?.title === 'All Contacts';
        const configArray = Array.isArray(view?.config) ? view.config : [];

        if (isAllContactsFirst) {
          // For the first view titled "All Contacts": show exactly 4 fields in order
          const desiredOrder = [
            'subject',
            'activity_type_code.value',
            'due_date',
            'status',
          ];
          const byKey = (c: any) => c?.fieldName || c?.key;
          const picked = desiredOrder
            .map(key => configArray.find((c: any) => byKey(c) === key))
            .filter(Boolean);
          return { ...view, config: picked };
        }

        // For other views: limit to 4 fields. If status exists, keep status + first 3 others
        const statusIndex = configArray.findIndex(
          (c: any) => (c?.fieldName || c?.key) === 'status',
        );

        if (statusIndex !== -1) {
          const statusItem = configArray[statusIndex];
          const others = configArray.filter(
            (_: any, i: number) => i !== statusIndex,
          );
          return { ...view, config: [statusItem, ...others.slice(0, 3)] };
        }

        return { ...view, config: configArray.slice(0, 4) };
      });

      setDynamicViews(transformed);
      setSelectedViewIndex(0);
    }
  }, [searchFilterData]);

  const selectedView = dynamicViews?.[selectedViewIndex] || null;

  const getFieldsFromView = (view: any): string[] => {
    if (!view?.config || !Array.isArray(view.config)) {
      return [
        'id',
        'subject',
        'activity_type_code.value',
        'due_date',
        'status',
      ];
    }

    const fields = view.config
      .map((cfg: any) => cfg.fieldName || cfg.key)
      .filter(Boolean);

    // Always include id and status if not already present
    const requiredFields = ['id', 'status'];
    const allFields = [...new Set([...requiredFields, ...fields])];

    return allFields;
  };
  // Use the query hook for data fetching
  const {
    data,
    isLoading: loading,
    error,
    refetch,
  } = useActivitiesList({
    page: page,
    page_size: 50,
    fields: selectedView
      ? getFieldsFromView(selectedView)
      : ['id', 'subject', 'activity_type_code.value', 'due_date', 'status'],
  });

  //TODO: do not remove this logs
  log.error('🚀 ~ Activity ~ error:', error, error?.message);
  log.debug('🚀 ~ Activity ~ data:', data, getFieldsFromView(selectedView));

  // Update local state when data changes
  useEffect(() => {
    if (Array.isArray(data?.data)) {
      setActivity(data.data as ActivitiesItem[]);
      setTotalCount(data?.count ?? null);
      setHasMore(Boolean(data?.next));
      setPage(data?.page ?? 1);
    }
  }, [data]);

  const permissions: Record<string, boolean> = (() => {
    const perms = (selectedView?.user_permission || []) as string[];
    const has = (p: string) => perms.includes(p);
    return {
      add: has('add'),
      change: has('change'),
      delete: has('delete'),
      export_excel: has('export_excel'),
      assign: has('assign'),
      share: has('share'),
      view: has('view'),
    };
  })();

  const getFieldDisplayValue = (item: any, fieldKey: string) => {
    const value = item?.[fieldKey];
    if (fieldKey === 'activity') {
      return value?.name ?? '';
    }
    if (fieldKey === 'status') {
      return value?.label ?? '';
    }
    if (typeof value === 'object') {
      if (typeof value?.label === 'string') return value.label;
      if (typeof value?.name === 'string') return value.name;
      return '';
    }
    return value ?? '';
  };

  const onAssign = () => {
    setIsSelectionMode(false);
    setSelectedActivity([]);
  };

  const handleLongPress = useCallback(
    (activityId: string) => {
      if (!isSelectionMode) {
        setIsSelectionMode(true);
        setSelectedActivity([activityId]);
      }
    },
    [isSelectionMode],
  );

  const handleActivityPress = useCallback(
    (activity: ActivitiesItem) => {
      if (isSelectionMode) {
        const isSelected = selectedActivity.includes(activity.id);
        if (isSelected) {
          setSelectedActivity(prev => prev.filter(id => id !== activity.id));
        } else {
          setSelectedActivity(prev => [...prev, activity.id]);
        }
      } else {
        // Navigate to activity details
        log.debug('Navigate to account details:', activity.id);
        //TODO: Uncomment when activities screens are implemented
        // navigation.navigate('NewActivityScreen', {
        //   id: activity.id,
        //   navigationModuleId,
        // });
        // Navigate to account details
      }
    },
    [isSelectionMode, selectedActivity, navigationModuleId],
  );

  const handleActivityMenu = useCallback((activity: ActivitiesItem) => {
    setMoreSheetVisible(true);
    setSelectedActivity([activity.id]);
  }, []);

  const handleNewActivity = useCallback(() => {
    //TODO: Uncomment when activities screens are implemented
    // navigation.navigate('NewActivityScreen', { navigationModuleId });
    // log.debug('Create new account');
  }, [navigationModuleId]);

  const handleEditActivity = useCallback(() => {
    //TODO: Uncomment when activities screens are implemented
    // navigation.navigate('NewActivityScreen', {
    //   id: selectedActivity[0],
    //   navigationModuleId,
    // });
  }, [selectedActivity]);

  const handleDeleteActivities = useCallback(() => {
    if (selectedActivity.length > 0) {
      Alert.alert(
        'Delete Activities',
        `Are you sure you want to delete ${selectedActivity.length} activity(s)?`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Delete',
            style: 'destructive',
            onPress: async () => {
              try {
                await deleteActivities(selectedActivity);
                setSelectedActivity([]);
                setIsSelectionMode(false);
                await refetch();
              } catch (error) {
                log.error('Error deleting accounts:', error);
                Alert.alert(
                  'Error',
                  'Failed to delete activitys. Please try again.',
                );
              }
            },
          },
        ],
      );
    } else {
      log.debug('Delete accounts (no selection)');
    }
  }, [selectedActivity, deleteActivities]);

  const handleRefresh = useCallback(async () => {
    log.debug('Refresh accounts');
    try {
      await refetch();
    } catch (error) {
      log.error('Error refreshing accounts:', error);
    }
  }, [refetch]);

  const handleActivate = useCallback(async () => {
    if (selectedActivity.length === 0) return;
    try {
      const payload = selectedActivity.map(id => ({
        id,
        update_data: { status: 'active' },
      }));
      await statusUpdate(payload as any);
      setIsSelectionMode(false);
      setSelectedActivity([]);
      handleRefresh();
    } catch (e) {
      Alert.alert('Error', 'Failed to activate contacts');
    }
  }, [selectedActivity, handleRefresh]);

  const handleDeactivate = useCallback(async () => {
    if (selectedActivity.length === 0) return;
    try {
      const payload = selectedActivity.map(id => ({
        id,
        update_data: { status: 'in_active' },
      }));
      await statusUpdate(payload as any);
      setIsSelectionMode(false);
      setSelectedActivity([]);
      handleRefresh();
    } catch (e) {
      log.debug('🚀 ~ ContactScreen ~ e:', e);
      Alert.alert('Error', 'Failed to deactivate contacts');
    }
  }, [selectedActivity, handleRefresh]);

  const { downloading, handleDownload } = useDownload();

  const handleDownloadTemplate = useCallback(() => {
    handleDownload({
      endpoint: 'http://192.168.7.7:8005/core/activity_pointer/excel_template/',
      fileName: 'activities_template.xlsx',
      description: 'Downloading activity Excel template',
      transport: 'get',
    });
  }, [handleDownload]);

  const handleExport = useCallback(() => {
    handleDownload({
      endpoint: 'http://192.168.7.7:8005/core/activity_pointer/export_excel/',
      fileName: 'activities.xlsx',
      // query: { search: searchText }, // include if backend supports filtering
      description: 'Exporting activities',
      transport: 'post',
      selectedColumns: [
        'subject',
        'regarding',
        'activity_type_code',
        'activity_status',
        'owner',
        'priority_code',
        'start_date',
        'due_date',
        'primary_email',
      ],
      fieldsParam: 'fields',
      postBody: {
        fields: [
          'subject',
          'regarding',
          'activity_type_code',
          'activity_status',
          'owner',
          'priority_code',
          'start_date',
          'due_date',
          'primary_email',
        ],
      },
    });
  }, [handleDownload]);

  const handleMore = useCallback(() => {
    setMoreSheetVisible(true);
  }, []);

  const singleSelected = selectedActivity.length === 1;
  const selectedContact = singleSelected
    ? activity.find(c => c.id === selectedActivity[0])
    : undefined;
  const selectedStatus = selectedContact?.status?.value?.toLowerCase();
  const showActivate = !singleSelected || selectedStatus === 'inactive';
  const showDeactivate = !singleSelected || selectedStatus === 'active';

  const moreActionItems: ActionItem[] = [
    ...(permissions.export_excel
      ? [
          {
            id: 'excel' as const,
            label: 'Excel Templates',
            icon: (
              <MaterialCommunityIcons
                name="pencil-outline"
                size={22}
                color="#333"
              />
            ),
            onPress: () => {
              handleDownloadTemplate();
            },
          },
        ]
      : []),
    ...(permissions.change
      ? [
          {
            id: 'edit' as const,
            label: 'Edit',
            icon: (
              <MaterialCommunityIcons
                name="pencil-outline"
                size={22}
                color="#333"
              />
            ),
            onPress: () => {
              handleEditActivity();
            },
          },
        ]
      : []),
    ...(permissions.change && showActivate
      ? [
          {
            id: 'activate' as const,
            label: 'Activate',
            icon: (
              <MaterialCommunityIcons
                name="contact-switch-outline"
                size={22}
                color="#333"
              />
            ),
            onPress: () => {
              handleActivate();
            },
          },
        ]
      : []),
    ...(permissions.change && showDeactivate
      ? [
          {
            id: 'deactivate' as const,
            label: 'Deactivate',
            icon: (
              <MaterialCommunityIcons
                name="contact-switch-outline"
                size={22}
                color="#333"
              />
            ),
            onPress: () => {
              handleDeactivate();
            },
          },
        ]
      : []),
    ...(permissions.assign
      ? [
          {
            id: 'assign' as const,
            label: 'Assign',
            icon: (
              <MaterialCommunityIcons
                name="contact-switch-outline"
                size={22}
                color="#333"
              />
            ),
            onPress: () => {
              log.debug('Assign');
              setShowAssignModal(true);
            },
          },
        ]
      : []),
    ...(permissions.share
      ? [
          {
            id: 'share' as const,
            label: 'Share',
            icon: (
              <MaterialCommunityIcons
                name="share-variant"
                size={22}
                color="#333"
              />
            ),
            onPress: () => {
              log.debug('Share');
              setShowShareBottom(true);
            },
          },
        ]
      : []),
  ];

  const handleCancelSelection = useCallback(() => {
    setIsSelectionMode(false);
    setSelectedActivity([]);
  }, []);

  const rawActionBarItems = getBottomActionBarItems(
    isSelectionMode,
    handleNewActivity,
    handleEditActivity,
    handleDeleteActivities,
    handleRefresh,
    handleExport,
    handleMore,
  );
  const actionBarItems = rawActionBarItems.filter(item => {
    if (item.id === 'new') return permissions.add;
    if (item.id === 'delete')
      return isSelectionMode ? permissions.delete : false;
    if (item.id === 'export') return permissions.export_excel;
    // refresh and more are always visible
    return true;
  });

  const renderActivityItem = (
    activity: ActivitiesItem,
    index: number,
    arr: ActivitiesItem[],
  ) => {
    const isSelected = selectedActivity.includes(activity.id);

    return (
      <View key={activity.id}>
        <TouchableOpacity
          style={styles.activityItem}
          onPress={() => handleActivityPress(activity)}
          onLongPress={() => handleLongPress(activity.id)}
          activeOpacity={0.7}
        >
          {isSelectionMode && (
            <View style={styles.checkboxContainer}>
              <View style={[styles.checkbox, isSelected && styles.checkedBox]}>
                {isSelected &&
                  // <Text style={styles.checkmark}>✓</Text>
                  renderLogo(icons.check, { width: 18, height: 18 })}
              </View>
            </View>
          )}

          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {
                  activity?.subject?.toUpperCase()
                  // .split(' ')
                  // .map(word => word[0])
                  // .join('')
                }
              </Text>
            </View>
          </View>

          <View style={styles.activityInfo}>
            {(selectedView?.config || [])
              .filter((cfg: any) => (cfg.fieldName || cfg.key) !== 'status')
              .map((cfg: any) => (
                <Text
                  key={cfg.key}
                  style={styles.activityDetails}
                  numberOfLines={1}
                >
                  {getFieldDisplayValue(activity, cfg.fieldName || cfg.key)}
                </Text>
              ))}
          </View>

          <View style={styles.activityActions}>
            <View
              style={[
                styles.statusButton,
                activity.status.value.toLowerCase() === 'active'
                  ? styles.activeStatus
                  : styles.inactiveStatus,
              ]}
            >
              <Text style={styles.statusText}>{activity.status.label}</Text>
            </View>
            <TouchableOpacity
              style={styles.menuButton}
              onPress={() => handleActivityMenu(activity)}
            >
              {/* <Text style={styles.menuIcon}>⋮</Text> */}
              {renderLogo(theme === 'dark' ? icons.icons : icons.ic_dots, {
                width: 16,
                height: 16,
              })}
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
        {/* Add separator except after last item */}
        {index < arr.length - 1 && (
          <View style={themedStyles.activitySeparator} />
        )}
      </View>
    );
  };

  return (
    <View style={themedStyles.container}>
      {/* Header replaced with CustomHeader */}
      <CustomHeader
        variant={{
          type: 'basic',
          title: isSelectionMode
            ? 'Activites Select'
            : selectedView?.title || 'Activites',
          dropdownItems: (dynamicViews || []).map((v, idx) => ({
            id: v.id || String(idx),
            title: v.title || `View ${idx + 1}`,
            onPress: () => setSelectedViewIndex(idx),
          })),
          selectedDropdownId: (dynamicViews?.[selectedViewIndex]?.id ||
            String(selectedViewIndex)) as string,
        }}
        onSearch={() => {}}
        onAdd={handleNewActivity}
        onSettings={() => {
          if (dynamicViews.length > 0) setViewSheetVisible(true);
        }}
      />

      {/* Search Row: search input + standalone filter button (outside input) */}
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
          style={themedStyles.standaloneFilterButton}
          activeOpacity={0.8}
          onPress={() => {
            if (dynamicViews.length > 0) setViewSheetVisible(true);
          }}
        >
          {renderLogo(theme === 'dark' ? icons.Filterd : icons.Filter, {
            width: 16,
            height: 16,
          })}
        </TouchableOpacity>
      </View>

      {/* Selection Mode Header */}
      {isSelectionMode && (
        <View style={styles.selectionHeader}>
          <Text style={styles.selectionText}>
            {selectedActivity.length} selected
          </Text>
          <TouchableOpacity onPress={handleCancelSelection}>
            <Text style={styles.cancelButton}>Cancel</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Activities List */}
      <FlatList
        data={activity}
        keyExtractor={item => item.id}
        renderItem={({ item, index }) =>
          renderActivityItem(item, index, activity)
        }
        style={{ flex: 1 }}
        // contentContainerStyle={styles.contactsList}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        onEndReachedThreshold={0.2}
        // onEndReached={() => {
        //   if ((totalCount ?? 0) > activity.length) {
        //     loadMore();
        //   }
        // }}
        ListHeaderComponent={
          loading && !refreshing && activity.length === 0 ? (
            <View style={{ padding: 16 }}>
              <Text style={{ color: COLORS.gray }}>Loading contacts...</Text>
            </View>
          ) : null
        }
        ListFooterComponent={
          loadingMore ? (
            <View style={{ padding: 16, alignItems: 'center' }}>
              <ActivityIndicator color={COLORS.primary} />
            </View>
          ) : null
        }
        ListEmptyComponent={
          !loading && !refreshing && !error ? (
            <View style={{ padding: 16 }}>
              <Text style={{ color: COLORS.gray }}>No contacts found</Text>
            </View>
          ) : null
        }
      />

      {/* Bottom Action Bar */}
      <BottomActionBar items={actionBarItems} />

      <ActionSheet
        visible={moreSheetVisible}
        onClose={() => setMoreSheetVisible(false)}
        items={moreActionItems}
      />

      <ActionSheet
        visible={viewSheetVisible}
        onClose={() => setViewSheetVisible(false)}
        items={(dynamicViews || []).map((v, idx) => ({
          id: v.id || String(idx),
          label: v.title || `View ${idx + 1}`,
          icon: (
            <MaterialCommunityIcons
              name={
                idx === selectedViewIndex
                  ? 'check-circle-outline'
                  : 'circle-outline'
              }
              size={22}
              color="#333"
            />
          ),
          onPress: () => {
            setSelectedViewIndex(idx);
            setViewSheetVisible(false);
          },
        }))}
      />

      <AssignRecordModal
        visible={showAssignModal}
        onClose={() => setShowAssignModal(false)}
        title="Assign Record"
        subtitle="You have selected raw. To whom would you like to assign it?"
        selectedRecords={selectedActivity}
        onAssign={onAssign}
        route="ASSIGN_RECORD_ACTIVITY"
      />

      <ShareSheet
        visible={showShareBottom}
        onClose={() => setShowShareBottom(false)}
        selectedRecords={selectedActivity}
        route="SHARE_ACTIVITY"
        onSave={onAssign}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIcon: {
    padding: 8,
  },
  headerIconText: {
    fontSize: 18,
    color: COLORS.dark,
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
  },
  headerTitle: {
    fontSize: FONTS.lg,
    fontWeight: '600',
    color: COLORS.dark,
    marginRight: 4,
  },
  headerArrow: {
    fontSize: 12,
    color: COLORS.gray,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    marginHorizontal: 16,
    marginVertical: 12,
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 40,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
  },
  searchInput: {
    flex: 1,
    fontSize: FONTS.sm,
    color: COLORS.dark,
  },
  filterButton: {
    padding: 4,
  },
  filterIcon: {
    fontSize: 16,
    color: COLORS.gray,
  },
  selectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.primary,
  },
  selectionText: {
    fontSize: FONTS.sm,
    color: COLORS.white,
    fontWeight: '500',
  },
  cancelButton: {
    fontSize: FONTS.sm,
    color: COLORS.white,
    fontWeight: '500',
  },
  activitysList: {
    flex: 1,
    paddingHorizontal: 12,
  },
  listContainer: {
    flex: 1,
    // marginHorizontal: 12,
    marginTop: 8,
    backgroundColor: COLORS.white,
    // borderRadius: 8,
    borderWidth: 1,
    // borderColor: COLORS.lightGray,
    overflow: 'hidden',
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  standaloneFilterButton: {
    marginLeft: 8,
    height: 40,
    width: 40,
    borderRadius: 8,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    alignItems: 'center',
    justifyContent: 'center',
  },
  standaloneFilterIcon: {},
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
    paddingVertical: 14,
    paddingHorizontal: 4,
    // borderBottomWidth: 1,
    // borderBottomColor: COLORS.lightGray,
    // borderStyle: 'solid',
  },
  activitySeparator: {
    height: 1,
    width: '130%',
    backgroundColor: COLORS.lightGray,
    marginRight: 5,
    right: 20, // aligns with avatar + checkbox
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
  avatarContainer: {
    marginRight: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.lightBackground,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: FONTS.sm,
    fontWeight: '600',
    color: COLORS.dark,
  },
  activityInfo: {
    flex: 1,
  },
  activityName: {
    fontSize: FONTS.sm,
    fontWeight: '600',
    color: COLORS.dark,
    marginBottom: 2,
  },
  activityDetails: {
    fontSize: FONTS.xs,
    color: COLORS.gray,
    marginBottom: 1,
  },
  activityActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    marginRight: 8,
  },
  activeStatus: {
    backgroundColor: '#E6F0FF',
    borderColor: '#0F6CBD',
  },
  inactiveStatus: {
    backgroundColor: '#F1E6FF',
    borderColor: COLORS.dashboard.purple,
  },
  statusText: {
    fontSize: FONTS.sm,
    color: '#0F6CBD',
    fontWeight: '600',
  },
  menuButton: {
    paddingHorizontal: 8,
  },
  menuIcon: {
    fontSize: 16,
    color: COLORS.gray,
    transform: [{ rotate: '0deg' }],
  },
});

export default Activity;
