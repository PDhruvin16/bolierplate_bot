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
import useAccountQueries from '../../hooks/useAccountQueries';
import useDownload from '../../hooks/useDownload';
import { getBottomActionBarItems } from '../../constants/CommonData';
import { AccountItem } from './types';
import log from '../../utils/logger';
import { AssignRecordModal } from '../../components/common/AccountAssignModal';
import ShareSheet from '../../components/common/ShareModal';

type AccountScreenProps = {
  navigation: StackNavigationProp<any>;
};

const AccountScreen: React.FC<AccountScreenProps> = ({ navigation }) => {
  const PAGE_SIZE = 30;
  const [accounts, setAccounts] = useState<AccountItem[]>([]);
  const [searchText, setSearchText] = useState('');
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedAccounts, setSelectedAccounts] = useState<string[]>([]);
  const [moreSheetVisible, setMoreSheetVisible] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showShareBottom, setShowShareBottom] = useState(false);
  const [viewSheetVisible, setViewSheetVisible] = useState(false);
  const [dynamicViews, setDynamicViews] = useState<any[]>([]);
  log.debug('🚀 ~ AccountScreen ~ dynamicViews:', dynamicViews);
  const [selectedViewIndex, setSelectedViewIndex] = useState<number>(0);
  const [totalCount, setTotalCount] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  const { theme } = useTheme();
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
    accountSeparator: {
      ...styles.accountSeparator,
      backgroundColor: theme === 'dark' ? '#1E1E1E' : COLORS.lightGray,
    },
    standaloneFilterButton: {
      ...styles.standaloneFilterButton,
      backgroundColor: theme === 'dark' ? '#2C2B2B' : COLORS.white,
      borderColor: theme === 'dark' ? '#1E1E1E' : COLORS.lightGray,
    },
  };

  // Use account queries hook for data fetching
  const {
    useAccountList,
    deleteAccount,
    isDeletingAccount,
    statusUpdate,
    useMetaData,
    useSearchFilter,
  } = useAccountQueries();

  const {
    data: metadataData,
    isLoading: metadataLoading,
    error: metadataError,
  } = useMetaData();

  // Extract content type ID from metadata
  const contentTypeId: string = metadataData?.data.allow_content_type?.id;
  const navigationModuleId: string = metadataData?.data.navigation_module_id;

  const {
    data: searchFilterData,
    isLoading: searchFilterLoading,
    error: searchFilterError,
  } = useSearchFilter(contentTypeId || '', !!contentTypeId);

  useEffect(() => {
    if (
      Array.isArray(searchFilterData?.data) &&
      searchFilterData?.data?.length > 0
    ) {
      const transformed = searchFilterData?.data?.map(
        (view: any, idx: number) => {
          const isAllAccountsFirst =
            idx === 0 && view?.title === 'All Accounts';
          const configArray = Array.isArray(view?.config) ? view.config : [];

          if (isAllAccountsFirst) {
            const desiredOrder = ['name', 'phone_number1', 'city', 'status'];
            const byKey = (c: any) => c?.fieldName || c?.key;
            const picked = desiredOrder
              .map(key => configArray.find((c: any) => byKey(c) === key))
              .filter(Boolean);
            return { ...view, config: picked };
          }

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
        },
      );

      setDynamicViews(transformed);
      setSelectedViewIndex(0);
    }
  }, [searchFilterData]);

  const selectedView = dynamicViews?.[selectedViewIndex] || null;

  // Extract fields from selected view configuration
  const getFieldsFromView = (view: any): string[] => {
    if (!view?.config || !Array.isArray(view.config)) {
      return ['id', 'name', 'phone_number1', 'status'];
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
  } = useAccountList({
    page: page,
    page_size: PAGE_SIZE,
    fields: selectedView
      ? getFieldsFromView(selectedView)
      : ['id', 'name', 'phone_number1', 'status'],
  });

  // Update local state when data changes
  useEffect(() => {
    if (Array.isArray(data?.data)) {
      setAccounts(data.data as AccountItem[]);
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
    if (fieldKey === 'status') {
      return value?.label ?? '';
    }
    if (typeof value === 'object') {
      if (typeof value?.label === 'string') return value.label;
      if (typeof value?.name === 'string') return value.name;
      if (Array.isArray(value) && value.length > 0) {
        // e.g., address array: show city or first textual field
        const first = value[0];
        if (typeof first?.city === 'string') return first.city;
        if (typeof first?.name === 'string') return first.name;
      }
      return '';
    }
    return value ?? '';
  };

  const handleLongPress = useCallback(
    (accountId: string) => {
      if (!isSelectionMode) {
        setIsSelectionMode(true);
        setSelectedAccounts([accountId]);
      }
    },
    [isSelectionMode],
  );

  const handleAccountPress = useCallback(
    (account: AccountItem) => {
      if (isSelectionMode) {
        const isSelected = selectedAccounts.includes(account.id);
        if (isSelected) {
          setSelectedAccounts(prev => prev.filter(id => id !== account.id));
        } else {
          setSelectedAccounts(prev => [...prev, account.id]);
        }
      } else {
        // Navigate to account details
         navigation.navigate('AccountDetailScreen', {
          id: account.id,
          navigationModuleId,
        });
      }
    },
    [isSelectionMode, selectedAccounts],
  );

  // const handleAccountMenu = useCallback((account: AccountItem) => {
  //   setMoreSheetVisible(true);
  //   setSelectedAccounts([account.id]);
  // }, []);
  const handleAccountMenu = useCallback((account: AccountItem) => {
    // Add a small delay to prevent gesture conflicts
    setTimeout(() => {
      setSelectedAccounts([account.id]);
      setMoreSheetVisible(true);
    }, 50);
  }, []);

  const handleNewAccount = useCallback(() => {
    navigation.navigate('NewAccountScreen', { navigationModuleId });
  }, []);

  const handleEditAccounts = useCallback(() => {
    navigation.navigate('NewAccountScreen', {
      id: selectedAccounts[0],
      navigationModuleId,
    });
  }, [selectedAccounts]);

  const onAssign = () => {
    setIsSelectionMode(false);
    setSelectedAccounts([]);
  };

  const handleDeleteAccounts = useCallback(() => {
    if (selectedAccounts.length > 0) {
      Alert.alert(
        'Delete Accounts',
        `Are you sure you want to delete ${selectedAccounts.length} account(s)?`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Delete',
            style: 'destructive',
            onPress: async () => {
              try {
                await deleteAccount(selectedAccounts);
                setSelectedAccounts([]);
                setIsSelectionMode(false);
                await refetch();
              } catch (error) {
                log.error('Error deleting accounts:', error);
                Alert.alert(
                  'Error',
                  'Failed to delete accounts. Please try again.',
                );
              }
            },
          },
        ],
      );
    } else {
      log.debug('Delete accounts (no selection)');
    }
  }, [selectedAccounts, deleteAccount]);

  const handleRefresh = useCallback(async () => {
    try {
      setRefreshing(true);
      await refetch();
    } catch (error) {
      log.error('Error refreshing accounts:', error);
    } finally {
      setRefreshing(false);
    }
  }, [refetch]);

  const handleActivate = useCallback(async () => {
    if (selectedAccounts.length === 0) return;
    try {
      const payload = selectedAccounts.map(id => ({
        id,
        update_data: { status: 'active' },
      }));
      await statusUpdate(payload as any);
      setIsSelectionMode(false);
      setSelectedAccounts([]);
      handleRefresh();
    } catch (e) {
      Alert.alert('Error', 'Failed to activate contacts');
    }
  }, [selectedAccounts, handleRefresh]);

  const handleDeactivate = useCallback(async () => {
    if (selectedAccounts.length === 0) return;
    try {
      const payload = selectedAccounts.map(id => ({
        id,
        update_data: { status: 'in_active' },
      }));
      await statusUpdate(payload as any);
      setIsSelectionMode(false);
      setSelectedAccounts([]);
      handleRefresh();
    } catch (e) {
      log.debug('🚀 ~ ContactScreen ~ e:', e);
      Alert.alert('Error', 'Failed to deactivate contacts');
    }
  }, [selectedAccounts, handleRefresh]);

  const { downloading, handleDownload } = useDownload();

  const handleDownloadTemplate = useCallback(() => {
    handleDownload({
      endpoint: 'http://192.168.7.7:8005/core/account/excel_template/',
      fileName: 'account_template.xlsx',
      description: 'Downloading account Excel template',
      transport: 'get',
    });
  }, [handleDownload]);

  const handleExport = useCallback(() => {
    handleDownload({
      endpoint: 'http://192.168.7.7:8005/core/account/export_excel/',
      fileName: 'account.xlsx',
      // query: { search: searchText }, // include if backend supports filtering
      description: 'Exporting account',
      transport: 'post',
      selectedColumns: [
        'name',
        'phone_number1',
        'city',
        'contact',
        'email1',
        'status',
      ],
      fieldsParam: 'fields',
      postBody: {
        fields: [
          'name',
          'phone_number1',
          'city',
          'contact',
          'email1',
          'status',
        ],
      },
    });
  }, [handleDownload]);

  const handleMore = useCallback(() => {
    setMoreSheetVisible(true);
  }, []);

  const singleSelected = selectedAccounts.length === 1;
  const selectedContact = singleSelected
    ? accounts.find(c => c.id === selectedAccounts[0])
    : undefined;
  const selectedStatus = selectedContact?.status?.value?.toLowerCase?.();
  const showActivate = !singleSelected || selectedStatus === 'inactive';
  const showDeactivate = !singleSelected || selectedStatus === 'active';
  const showEdit = singleSelected;

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
    ...(permissions.change && showEdit
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
              handleEditAccounts();
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
              setMoreSheetVisible(false);
              setTimeout(() => {
                log.debug('Opening Share bottom sheet');
                setShowShareBottom(true);
              }, 450);
            },
          },
        ]
      : []),
  ];

  const handleCancelSelection = useCallback(() => {
    setIsSelectionMode(false);
    setSelectedAccounts([]);
  }, []);

  const rawActionBarItems = getBottomActionBarItems(
    isSelectionMode,
    handleNewAccount,
    handleEditAccounts,
    handleDeleteAccounts,
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
  const renderAccountItem = (account: AccountItem, index: number) => {
    const isSelected = selectedAccounts.includes(account.id);

    return (
      <View key={account.id}>
        <TouchableOpacity
          style={styles.accountItem}
          onPress={() => handleAccountPress(account)}
          onLongPress={() => handleLongPress(account.id)}
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
                {account.name
                  .split(' ')
                  .map(word => word[0])
                  .join('')
                  .toUpperCase()}
              </Text>
            </View>
          </View>

          <View style={styles.accountInfo}>
            {(selectedView?.config || [])
              .filter((cfg: any) => (cfg.fieldName || cfg.key) !== 'status')
              .map((cfg: any, i: number) => (
                <Text
                  key={cfg.key || `${cfg.fieldName}-${i}`}
                  style={i === 0 ? styles.accountName : styles.accountDetails}
                  numberOfLines={1}
                >
                  {getFieldDisplayValue(account, cfg.fieldName || cfg.key)}
                </Text>
              ))}
          </View>

          <View style={styles.accountActions}>
            <View
              style={[
                styles.statusButton,
                account?.status?.value.toLowerCase() === 'active'
                  ? styles.activeStatus
                  : styles.inactiveStatus,
              ]}
            >
              <Text style={styles.statusText}>
                {account?.status?.label === 'active' ? 'Active' : 'Inactive'}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.menuButton}
              onPress={() => handleAccountMenu(account)}
            >
              {renderLogo(theme === 'dark' ? icons.icons : icons.ic_dots, {
                width: 16,
                height: 16,
              })}
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
        <View style={themedStyles.accountSeparator} />
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
            ? 'Account Select'
            : selectedView?.title || 'Account',
          dropdownItems: (dynamicViews || []).map((v, idx) => ({
            id: v.id || String(idx),
            title: v.title || `View ${idx + 1}`,
            onPress: () => setSelectedViewIndex(idx),
          })),
          selectedDropdownId: (dynamicViews?.[selectedViewIndex]?.id ||
            String(selectedViewIndex)) as string,
        }}
        onSearch={() => {}}
        onAdd={handleNewAccount}
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
            {selectedAccounts.length} selected
          </Text>
          <TouchableOpacity onPress={handleCancelSelection}>
            <Text style={styles.cancelButton}>Cancel</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Error and Loading UI */}
      {!!error && !loading && (
        <View style={{ padding: 16 }}>
          <Text style={{ color: 'red' }}>Failed to load accounts</Text>
          <TouchableOpacity onPress={() => refetch()} style={{ marginTop: 8 }}>
            <Text style={{ color: COLORS.primary }}>Retry</Text>
          </TouchableOpacity>
        </View>
      )}

      {!!metadataError && (
        <View style={{ padding: 16 }}>
          <Text style={{ color: 'red' }}>
            Failed to load metadata: {metadataError.message}
          </Text>
        </View>
      )}

      {!!searchFilterError && (
        <View style={{ padding: 16 }}>
          <Text style={{ color: 'red' }}>
            Failed to load search filter: {searchFilterError.message}
          </Text>
        </View>
      )}

      {/* Accounts List */}
      <View style={themedStyles.listContainer}>
        {loading ? (
          <View style={{ padding: 16 }}>
            <Text style={{ color: COLORS.gray }}>Loading accounts...</Text>
          </View>
        ) : (
          // <ScrollView
          //   style={styles.accountsList}
          //   showsVerticalScrollIndicator={false}
          // >
          //   {accounts.map((account, idx, arr) =>
          //     renderAccountItem(account, idx, arr),
          //   )}
          // </ScrollView>
          <FlatList
            data={accounts}
            keyExtractor={item => item.id}
            renderItem={({ item, index }) => renderAccountItem(item, index)}
            style={{ flex: 1 }}
            refreshing={refreshing}
            onRefresh={handleRefresh}
            onEndReachedThreshold={0.2}
            onEndReached={() => {
              if ((totalCount ?? 0) > accounts.length) {
                loadMore();
              }
            }}
            ListHeaderComponent={
              loading && !refreshing && accounts.length === 0 ? (
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
        selectedRecords={selectedAccounts}
        onAssign={onAssign}
        route="ASSIGN_RECORD_ACCOUNT"
      />

      <ShareSheet
        visible={showShareBottom}
        onClose={() => setShowShareBottom(false)}
        selectedRecords={selectedAccounts}
        route="SHARE_ACCONT"
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
  accountsList: {
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
  accountItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
    paddingVertical: 14,
    paddingHorizontal: 4,
    // borderBottomWidth: 1,
    // borderBottomColor: COLORS.lightGray,
    // borderStyle: 'solid',
  },
  accountSeparator: {
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
  accountInfo: {
    flex: 1,
  },
  accountName: {
    fontSize: FONTS.sm,
    fontWeight: '600',
    color: COLORS.dark,
    marginBottom: 2,
  },
  accountDetails: {
    fontSize: FONTS.xs,
    color: COLORS.gray,
    marginBottom: 1,
  },
  accountActions: {
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

export default AccountScreen;
