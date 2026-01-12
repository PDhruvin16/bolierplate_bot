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
import { getBottomActionBarItems } from '../../constants/CommonData';
import BottomActionBar from '../../components/common/BottomActionBar';
import CustomHeader from '../../components/common/CustomHeader';
import SearchBar from '../../components/common/SearchBar';
import { ActionSheet, ActionItem } from '../../components/common';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { DrawerActions } from '@react-navigation/native';
import icons from '../../constants/icons';
import { renderLogo } from '../../utils/renderlogo';
import { StackNavigationProp } from '@react-navigation/stack';
import { useTheme } from '../../context/ThemeContext';
import { ContactItem } from './types';
import useDownload from '../../hooks/useDownload';
import useContactQueries from '../../hooks/useContactQueries';
import contactApi from '../../api/contactApi';
import log from '../../utils/logger';
import { AssignRecordModal } from '../../components/common/AccountAssignModal';
import ShareSheet from '../../components/common/ShareModal';

type ContactScreenProps = {
  navigation: StackNavigationProp<any>;
};

const ContactScreen: React.FC<ContactScreenProps> = ({ navigation }) => {
  const PAGE_SIZE = 30;
  const { theme } = useTheme();
  const [contacts, setContacts] = useState<ContactItem[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [totalCount, setTotalCount] = useState<number | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);
  const [moreSheetVisible, setMoreSheetVisible] = useState(false);
  const [viewSheetVisible, setViewSheetVisible] = useState(false);
  const [dynamicViews, setDynamicViews] = useState<any[]>([]);
  const [selectedViewIndex, setSelectedViewIndex] = useState<number>(0);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showShareBottom, setShowShareBottom] = useState(false);

  // Use contact queries hook for data fetching
  const {
    useContactList,
    useMetaData,
    useSearchFilter,
    deleteContact,
    isDeletingContact,
  } = useContactQueries();

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
            'full_name',
            'account',
            'business2_phone_number',
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

  // Extract fields from selected view configuration
  const getFieldsFromView = (view: any): string[] => {
    if (!view?.config || !Array.isArray(view.config)) {
      return ['id', 'full_name', 'account', 'business2_phone_number', 'status'];
    }
    
    const fields = view.config.map((cfg: any) => cfg.fieldName || cfg.key).filter(Boolean);
    
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
  } = useContactList({ 
    page: page, 
    page_size: PAGE_SIZE, 
    search: searchText,
    fields: selectedView ? getFieldsFromView(selectedView) : ['id', 'full_name', 'account', 'business2_phone_number', 'status']
  });

  useEffect(() => {
    if (Array.isArray(data?.data)) {
      setContacts(data.data as ContactItem[]);
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
    if (fieldKey === 'account') {
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
    contactSeparator: {
      ...styles.contactSeparator,
      backgroundColor: theme === 'dark' ? '#1E1E1E' : COLORS.lightGray,
    },
    standaloneFilterButton: {
      ...styles.standaloneFilterButton,
      backgroundColor: theme === 'dark' ? '#2C2B2B' : COLORS.white,
      borderColor: theme === 'dark' ? '#1E1E1E' : COLORS.lightGray,
    },
  };

  const handleLongPress = useCallback(
    (contactId: string) => {
      if (!isSelectionMode) {
        setIsSelectionMode(true);
        setSelectedContacts([contactId]);
      }
    },
    [isSelectionMode],
  );

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

  const handleContactPress = useCallback(
    (contact: ContactItem) => {
      if (isSelectionMode) {
        const isSelected = selectedContacts.includes(contact.id);
        if (isSelected) {
          setSelectedContacts(prev => prev.filter(id => id !== contact.id));
        } else {
          setSelectedContacts(prev => [...prev, contact.id]);
        }
      } else {
        navigation.navigate('NewContactScreen', {
          id: contact.id,
          navigationModuleId,
        });
      }
    },
    [isSelectionMode, selectedContacts, navigationModuleId],
  );

  const handleContactMenu = useCallback((contact: ContactItem) => {
    setMoreSheetVisible(true);
    setSelectedContacts([contact.id]);
  }, []);

  const handleNewContact = useCallback(() => {
    navigation.navigate('NewContactScreen', { navigationModuleId });
  }, [navigationModuleId]);

  const handleEditContacts = useCallback(() => {
    navigation.navigate('NewContactScreen', {
      id: selectedContacts[0],
      navigationModuleId,
    });
  }, [selectedContacts]);

  const handleDeleteContacts = useCallback(() => {
    if (selectedContacts.length > 0) {
      Alert.alert(
        'Delete Contacts',
        `Are you sure you want to delete ${selectedContacts.length} contact(s)?`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Delete',
            style: 'destructive',
            onPress: async () => {
              try {
                await deleteContact(selectedContacts);
                setSelectedContacts([]);
                setIsSelectionMode(false);
                refetch();
              } catch (error) {
                Alert.alert('Error', 'Failed to delete contacts');
              }
            },
          },
        ],
      );
    } else {
      log.debug('Delete contacts (no selection)');
    }
  }, [selectedContacts, deleteContact, refetch]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await refetch();
    } catch (_) {
    } finally {
      setRefreshing(false);
    }
  }, [refetch]);

  const handleActivate = useCallback(async () => {
    if (selectedContacts.length === 0) return;
    try {
      const payload = selectedContacts.map(id => ({
        id,
        update_data: { status: 'active' },
      }));
      await contactApi.bulkUpdateContacts(payload as any);
      setIsSelectionMode(false);
      setSelectedContacts([]);
      onRefresh();
    } catch (e) {
      Alert.alert('Error', 'Failed to activate contacts');
    }
  }, [selectedContacts, onRefresh]);

  const handleDeactivate = useCallback(async () => {
    if (selectedContacts.length === 0) return;
    try {
      const payload = selectedContacts.map(id => ({
        id,
        update_data: { status: 'in_active' },
      }));
      await contactApi.bulkUpdateContacts(payload as any);
      setIsSelectionMode(false);
      setSelectedContacts([]);
      onRefresh();
    } catch (e) {
      log.debug('🚀 ~ ContactScreen ~ e:', e);
      Alert.alert('Error', 'Failed to deactivate contacts');
    }
  }, [selectedContacts, onRefresh]);

  const { downloading, handleDownload } = useDownload();

  const handleDownloadTemplate = useCallback(() => {
    handleDownload({
      endpoint: 'http://192.168.7.7:8005/core/contact/excel_template/',
      fileName: 'contacts_template.xlsx',
      description: 'Downloading contacts Excel template',
      transport: 'get',
    });
  }, [handleDownload]);

  const handleExport = useCallback(() => {
    handleDownload({
      endpoint: 'http://192.168.7.7:8005/core/contact/export_excel/',
      fileName: 'contacts.xlsx',
      // query: { search: searchText }, // include if backend supports filtering
      description: 'Exporting contacts',
      transport: 'post',
      selectedColumns: [
        'full_name',
        'email1',
        'account',
        'business2_phone_number',
        'status',
      ],
      fieldsParam: 'fields',
      postBody: {
        fields: [
          'full_name',
          'email1',
          'account',
          'business2_phone_number',
          'status',
        ],
      },
    });

    // Full download no column filter
    //     await downloadExcel({
    //   endpoint: '/core/contact/export_excel/',
    //   fileName: 'contacts_custom.xlsx',
    //   transport: 'post',
    //   postBody: { fields: ['full_name', 'email1'] }
    // });
    // Custom column
    //     await downloadExcel({
    //   endpoint: '/api/reports/export',
    //   fileName: 'report.xlsx',
    //   selectedColumns: ['name', 'email', 'phone'] // array encoded as columns=name,email,phone
    // });
  }, [handleDownload]);

  const handleMore = useCallback(() => {
    setMoreSheetVisible(true);
  }, []);

  const onAssign = () => {
    setIsSelectionMode(false);
    setSelectedContacts([]);
  };

  const singleSelected = selectedContacts.length === 1;
  const selectedContact = singleSelected
    ? contacts.find(c => c.id === selectedContacts[0])
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
              handleEditContacts();
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
    setSelectedContacts([]);
  }, []);

  const rawActionBarItems = getBottomActionBarItems(
    isSelectionMode,
    handleNewContact,
    handleEditContacts,
    handleDeleteContacts,
    onRefresh,
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

  const renderContactItem = (
    contact: ContactItem,
    index: number,
    arr: ContactItem[],
  ) => {
    const isSelected = selectedContacts.includes(contact.id);

    return (
      <View key={contact.id}>
        <TouchableOpacity
          style={styles.contactItem}
          onPress={() => handleContactPress(contact)}
          onLongPress={() => handleLongPress(contact.id)}
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
                {contact?.full_name
                  ?.split(' ')
                  .map(word => word[0])
                  .join('')
                  .toUpperCase()}
              </Text>
            </View>
          </View>

          <View style={styles.contactInfo}>
            {(selectedView?.config || [])
              .filter((cfg: any) => (cfg.fieldName || cfg.key) !== 'status')
              .map((cfg: any) => (
                <Text
                  key={cfg.key}
                  style={styles.contactDetails}
                  numberOfLines={1}
                >
                  {getFieldDisplayValue(contact, cfg.fieldName || cfg.key)}
                </Text>
              ))}
          </View>

          <View style={styles.contactActions}>
            <View
              style={[
                styles.statusButton,
                contact?.status?.value.toLowerCase() === 'active'
                  ? styles.activeStatus
                  : styles.inactiveStatus,
              ]}
            >
              <Text style={styles.statusText}>{contact?.status?.label ==='active' ? 'Active' : 'Inactive'}</Text>
            </View>
            <TouchableOpacity
              style={styles.menuButton}
              onPress={() => handleContactMenu(contact)}
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
          <View style={themedStyles.contactSeparator} />
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
            ? 'Contact Select'
            : selectedView?.title || 'Contact',
          dropdownItems: (dynamicViews || []).map((v, idx) => ({
            id: v.id || String(idx),
            title: v.title || `View ${idx + 1}`,
            onPress: () => setSelectedViewIndex(idx),
          })),
          selectedDropdownId: (dynamicViews?.[selectedViewIndex]?.id ||
            String(selectedViewIndex)) as string,
        }}
        onSearch={() => {}}
        onAdd={handleNewContact}
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
            {selectedContacts.length} selected
          </Text>
          <TouchableOpacity onPress={handleCancelSelection}>
            <Text style={styles.cancelButton}>Cancel</Text>
          </TouchableOpacity>
        </View>
      )}

      {!!error && !loading && (
        <View style={{ padding: 16 }}>
          <Text style={{ color: 'red' }}>Failed to load contacts</Text>
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

      {/* Contacts List */}
      <FlatList
        data={contacts}
        keyExtractor={item => item.id}
        renderItem={({ item, index }) =>
          renderContactItem(item, index, contacts)
        }
        style={{ flex: 1 }}
        // contentContainerStyle={styles.contactsList}
        refreshing={refreshing}
        onRefresh={onRefresh}
        onEndReachedThreshold={0.2}
        onEndReached={() => {
          if ((totalCount ?? 0) > contacts.length) {
            loadMore();
          }
        }}
        ListHeaderComponent={
          loading && !refreshing && contacts.length === 0 ? (
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
        selectedRecords={selectedContacts}
        onAssign={onAssign}
        route="ASSIGN_RECORD_CONTACT"
      />

      <ShareSheet
        visible={showShareBottom}
        onClose={() => setShowShareBottom(false)}
        selectedRecords={selectedContacts}
        route='SHARE_CONTACT'
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
  contactsList: {
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
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
    paddingVertical: 14,
    paddingHorizontal: 4,
    // borderBottomWidth: 1,
    // borderBottomColor: COLORS.lightGray,
    // borderStyle: 'solid',
  },
  contactSeparator: {
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
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: FONTS.sm,
    fontWeight: '600',
    color: COLORS.dark,
    marginBottom: 2,
  },
  contactDetails: {
    fontSize: FONTS.xs,
    color: COLORS.gray,
    marginBottom: 1,
  },
  contactActions: {
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

export default ContactScreen;
