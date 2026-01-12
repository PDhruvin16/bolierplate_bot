import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  FlatList,
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
import { StackNavigationProp } from '@react-navigation/stack';
import { useTheme } from '../../context/ThemeContext';
import log from '../../utils/logger';
import useEmailQueries from '../../hooks/useEmailQueries';
import emailApi from '../../api/emailApi';
import useDownload from '../../hooks/useDownload';
import { getBottomActionBarItems } from '../../constants/CommonData';
import ShareSheet from '../../components/common/ShareModal';
import { EmailsItem } from './types';
import { AssignRecordModal } from '../../components/common/AccountAssignModal';

type EmailScreenProps = {
  navigation: StackNavigationProp<any>;
};

const EmailScreen: React.FC<EmailScreenProps> = ({ navigation }) => {
  const PAGE_SIZE = 30;
  const { theme } = useTheme();
  const [emails, setEmails] = useState<EmailsItem[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [totalCount, setTotalCount] = useState<number | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedEmails, setSelectedEmails] = useState<string[]>([]);
  const [moreSheetVisible, setMoreSheetVisible] = useState(false);
  const [viewSheetVisible, setViewSheetVisible] = useState(false);
  const [dynamicViews, setDynamicViews] = useState<any[]>([]);
  const [selectedViewIndex, setSelectedViewIndex] = useState<number>(0);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showShareBottom, setShowShareBottom] = useState(false);

  // Use email queries hook for data fetching
  const {
    useEmailList,
    useMetaData,
    useSearchFilter,
    deleteEmail,
    isDeletingEmail,
  } = useEmailQueries();

  // Call metadata API first to get allow_content_type.id
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
            'Subject',
            'From',
            'To',
            'Regarding',
            'Priority',
            'Status',
            'Reason',
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

  // Extract fields from selected view configuration
  const getFieldsFromView = (view: any): string[] => {
    if (!view?.config || !Array.isArray(view.config)) {
      return ['id', 'subject', 'from', 'to', 'priority', 'status'];
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
  } = useEmailList({
    page: page,
    page_size: PAGE_SIZE,
    search: searchText,
    fields: selectedView
      ? getFieldsFromView(selectedView)
      : [
          'id',
          'subject',
          'email_sender.model',
          'to',
          'priority.value',
          'status',
        ],
  });
  log.debug('🚀 ~ EmailScreen ~ data:', data);

  useEffect(() => {
    if (Array.isArray(data?.data)) {
      setEmails(data.data as EmailsItem[]);
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
    if (fieldKey === 'email') {
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
    emailSeparator: {
      ...styles.emailSeparator,
      backgroundColor: theme === 'dark' ? '#1E1E1E' : COLORS.lightGray,
    },
    standaloneFilterButton: {
      ...styles.standaloneFilterButton,
      backgroundColor: theme === 'dark' ? '#2C2B2B' : COLORS.white,
      borderColor: theme === 'dark' ? '#1E1E1E' : COLORS.lightGray,
    },
  };

  const handleLongPress = useCallback(
    (emailId: string) => {
      if (!isSelectionMode) {
        setIsSelectionMode(true);
        setSelectedEmails([emailId]);
      }
    },
    [isSelectionMode],
  );

  const handleEmailPress = useCallback(
    (email: EmailsItem) => {
      if (isSelectionMode) {
        const isSelected = selectedEmails.includes(email.id);
        if (isSelected) {
          setSelectedEmails(prev => prev.filter(id => id !== email.id));
        } else {
          setSelectedEmails(prev => [...prev, email.id]);
        }
      } else {
        // Navigate to email details
        log.debug('Navigate to email details:', email.id);
      }
    },
    [isSelectionMode, selectedEmails],
  );

  const handleEmailMenu = useCallback((email: EmailsItem) => {
    setMoreSheetVisible(true);
    setSelectedEmails([email.id]);
  }, []);

  const handleNewEmail = useCallback(() => {
    navigation.navigate('NewEmailScreen', navigationModuleId);
  }, [navigationModuleId]);

  const handleEditEmails = useCallback(() => {
    log.debug('Edit selected emails:', selectedEmails);
    navigation.navigate('NewAccountScreen', {
      id: selectedEmails[0],
      navigationModuleId,
    });
  }, [selectedEmails]);

  const handleDeleteEmails = useCallback(() => {
    if (selectedEmails.length > 0) {
      Alert.alert(
        'Delete Emails',
        `Are you sure you want to delete ${selectedEmails.length} email(s)?`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Delete',
            style: 'destructive',
            onPress: async () => {
              try {
                await deleteEmail(selectedEmails);
                setSelectedEmails([]);
                setIsSelectionMode(false);
                refetch();
              } catch (error) {
                log.error('Error deleting emails:', error);
                Alert.alert(
                  'Error',
                  'Failed to delete emails. Please try again.',
                );
              }
            },
          },
        ],
      );
    } else {
      log.debug('Delete emails (no selection)');
    }
  }, [selectedEmails, deleteEmail, refetch]);

  const handleRefresh = useCallback(async () => {
    try {
      await refetch();
    } catch (error) {
      log.error('Error refreshing emails:', error);
    }
  }, [refetch]);

  const handleActivate = useCallback(async () => {
    if (selectedEmails.length === 0) return;
    try {
      const payload = selectedEmails.map(id => ({
        id,
        update_data: { status: 'active' },
      }));
      await emailApi.bulkUpdateEmails(payload as any);
      setIsSelectionMode(false);
      setSelectedEmails([]);
      handleRefresh();
    } catch (e) {
      Alert.alert('Error', 'Failed to activate contacts');
    }
  }, [selectedEmails, handleRefresh]);

  const handleDeactivate = useCallback(async () => {
    if (selectedEmails.length === 0) return;
    try {
      const payload = selectedEmails.map(id => ({
        id,
        update_data: { status: 'in_active' },
      }));
      await emailApi.bulkUpdateEmails(payload as any);
      setIsSelectionMode(false);
      setSelectedEmails([]);
      handleRefresh();
    } catch (e) {
      log.debug('🚀 ~ ContactScreen ~ e:', e);
      Alert.alert('Error', 'Failed to deactivate contacts');
    }
  }, [selectedEmails, handleRefresh]);

  const { downloading, handleDownload } = useDownload();

  const handleDownloadTemplate = useCallback(() => {
    handleDownload({
      endpoint: 'http://192.168.7.7:8005/core/email/excel_template/',
      fileName: 'email_template.xlsx',
      description: 'Downloading contacts email template',
      transport: 'get',
    });
  }, [handleDownload]);

  const handleExport = useCallback(() => {
    handleDownload({
      endpoint: 'http://192.168.7.7:8005/core/email/export_excel/',
      fileName: 'email.xlsx',
      // query: { search: searchText }, // include if backend supports filtering
      description: 'Exporting email',
      transport: 'post',
      selectedColumns: ['subject', 'from', 'to', 'priority'],
      fieldsParam: 'fields',
      postBody: {
        fields: ['subject', 'from', 'to', 'priority'],
      },
    });
  }, [handleDownload]);

  const handleMore = useCallback(() => {
    setMoreSheetVisible(true);
  }, []);

  const onAssign = () => {
    setIsSelectionMode(false);
    setSelectedEmails([]);
  };

  const singleSelected = selectedEmails.length === 1;
  const selectedContact = singleSelected
    ? emails.find(c => c.id === selectedEmails[0])
    : undefined;
  const selectedStatus = selectedContact?.status?.value?.toLowerCase?.();
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
              setMoreSheetVisible(false);
              handleEditEmails();
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
    setSelectedEmails([]);
  }, []);

  const rawActionBarItems = getBottomActionBarItems(
    isSelectionMode,
    handleNewEmail,
    handleEditEmails,
    handleDeleteEmails,
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

  const renderEmailItem = (
    email: EmailsItem,
    index: number,
    arr?: EmailsItem[],
  ) => {
    const isSelected = selectedEmails.includes(email.id);

    return (
      <View key={email.id}>
        <TouchableOpacity
          style={styles.emailItem}
          onPress={() => handleEmailPress(email)}
          onLongPress={() => handleLongPress(email.id)}
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
                  email.subject?.toUpperCase()
                  // .split(' ')
                  //   .map(word => word[0])
                  //   .join('')
                }
              </Text>
            </View>
          </View>

          <View style={styles.emailInfo}>
            <Text style={styles.emailName} numberOfLines={1}>
              {email.subject}
            </Text>
            {(selectedView?.config || [])
              .filter(
                (cfg: any) =>
                  (cfg.fieldName || cfg.key) !== 'status' &&
                  (cfg.fieldName || cfg.key) !== 'name',
              )
              .map((cfg: any, i: number) => (
                <Text
                  key={cfg.key || `${cfg.fieldName}-${i}`}
                  style={styles.emailDetails}
                  numberOfLines={1}
                >
                  {getFieldDisplayValue(email, cfg.fieldName || cfg.key)}
                </Text>
              ))}
          </View>

          <View style={styles.emailActions}>
            <View
              style={[
                styles.statusButton,
                email.status.value.toLowerCase() === 'active'
                  ? styles.activeStatus
                  : styles.inactiveStatus,
              ]}
            >
              <Text style={styles.statusText}>
                {email.status.label === 'active' ? 'Active' : 'Inactive'}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.menuButton}
              onPress={() => handleEmailMenu(email)}
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
        {/* {index < arr?.length - 1 && (
          <View style={themedStyles.emailSeparator} />
        )} */}
      </View>
    );
  };

  const loadMore = useCallback(async () => {
    if (loading || loadingMore || !hasMore) return;
    setLoadingMore(true);
    try {
      await refetch();
    } catch (_) {
    } finally {
      setLoadingMore(false);
    }
  }, [loading, loadingMore, hasMore, refetch]);

  return (
    <View style={themedStyles.container}>
      {/* Header replaced with CustomHeader */}

      <CustomHeader
        variant={{
          type: 'basic',
          title: isSelectionMode
            ? 'Email Select'
            : selectedView?.title || 'Email',
          dropdownItems: (dynamicViews || []).map((v, idx) => ({
            id: v.id || String(idx),
            title: v.title || `View ${idx + 1}`,
            onPress: () => setSelectedViewIndex(idx),
          })),
          selectedDropdownId: (dynamicViews?.[selectedViewIndex]?.id ||
            String(selectedViewIndex)) as string,
        }}
        onSearch={() => {}}
        onAdd={handleNewEmail}
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
            {selectedEmails.length} selected
          </Text>
          <TouchableOpacity onPress={handleCancelSelection}>
            <Text style={styles.cancelButton}>Cancel</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Emails List */}
      <View style={themedStyles.listContainer}>
        {loading ? (
          <View style={{ padding: 16 }}>
            <Text style={{ color: COLORS.gray }}>Loading emails...</Text>
          </View>
        ) : (
          // <ScrollView
          //   style={styles.emailsList}
          //   showsVerticalScrollIndicator={false}
          // >
          //   {emails.map((email, idx, arr) =>
          //     renderEmailItem(email, idx, arr),
          //   )}
          // </ScrollView>
          <FlatList
            data={emails}
            keyExtractor={item => item.id}
            renderItem={({ item, index }) => renderEmailItem(item, index)}
            style={{ flex: 1 }}
            // contentContainerStyle={styles.contactsList}
            refreshing={refreshing}
            onRefresh={handleRefresh}
            onEndReachedThreshold={0.2}
            onEndReached={() => {
              if ((totalCount ?? 0) > emails.length) {
                loadMore();
              }
            }}
            ListHeaderComponent={
              loading && !refreshing && emails.length === 0 ? (
                <View style={{ padding: 16 }}>
                  <Text style={{ color: COLORS.gray }}>
                    Loading contacts...
                  </Text>
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
        )}
      </View>

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
        selectedRecords={selectedEmails}
        onAssign={onAssign}
        route="ASSIGN_RECORD_EMAIL"
      />

      <ShareSheet
        visible={showShareBottom}
        onClose={() => setShowShareBottom(false)}
        selectedRecords={selectedEmails}
        route="SHARE_EMAIL"
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
  emailsList: {
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
  emailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
    paddingVertical: 14,
    paddingHorizontal: 4,
    // borderBottomWidth: 1,
    // borderBottomColor: COLORS.lightGray,
    // borderStyle: 'solid',
  },
  emailSeparator: {
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
  emailInfo: {
    flex: 1,
  },
  emailName: {
    fontSize: FONTS.sm,
    fontWeight: '600',
    color: COLORS.dark,
    marginBottom: 2,
  },
  emailDetails: {
    fontSize: FONTS.xs,
    color: COLORS.gray,
    marginBottom: 1,
  },
  emailActions: {
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

export default EmailScreen;
