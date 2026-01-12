import React, { useState, useCallback, useEffect, use } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';
import { COLORS } from '../../context/ThemeContext';
import { FONTS } from '../../constants/fonts';
import { STRINGS } from '../../constants/strings';

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
import customerApi from '../../api/customerApi';
import useAccountQueries from '../../hooks/useAccountQueries';

// import { TASK_DATA, TaskItem } from '../../constants/taskData';
import {
  PHONE_CALL_DATA,
  PhoneCallItem,
  getActionBarItems,
} from '../../constants/phonecallData';
import log from '../../utils/logger';

type PhoneCallProps = {
  navigation: StackNavigationProp<any>;
};

const PhoneCall: React.FC<PhoneCallProps> = ({ navigation }) => {
  const [phoneCalls, setPhoneCalls] =
    useState<PhoneCallItem[]>(PHONE_CALL_DATA);
  const [searchText, setSearchText] = useState('');
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedPhoneCalls, setSelectedPhoneCalls] = useState<string[]>([]);
  const [moreSheetVisible, setMoreSheetVisible] = useState(false);
  const { theme } = useTheme();
  const filteredPhoneCalls = phoneCalls.filter(
    phoneCall =>
      phoneCall.name.toLowerCase().includes(searchText.toLowerCase()) ||
      phoneCall.email.toLowerCase().includes(searchText.toLowerCase()) ||
      phoneCall.city.toLowerCase().includes(searchText.toLowerCase()),
  );
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
  const { useAccountList, deleteAccount, isDeletingAccount } =
    useAccountQueries();

  // Use the query hook for data fetching
  const {
    data,
    isLoading: loading,
    error,
    refetch,
  } = useAccountList({ page: 1, page_size: 50 });

  log.debug('Fetched account data:', data, loading, error);

  // Update local state when data changes
  //   useEffect(() => {
  //     if (Array.isArray(data?.data)) {
  //       setAccounts(data.data as AccountItem[]);
  //     }
  //   }, [data]);
  const handleLongPress = useCallback(
    (accountId: string) => {
      if (!isSelectionMode) {
        setIsSelectionMode(true);
        setSelectedPhoneCalls([accountId]);
      }
    },
    [isSelectionMode],
  );

  const handleAccountPress = useCallback(
    (account: PhoneCallItem) => {
      if (isSelectionMode) {
        const isSelected = selectedPhoneCalls.includes(account.id);
        if (isSelected) {
          setSelectedPhoneCalls(prev => prev.filter(id => id !== account.id));
        } else {
          setSelectedPhoneCalls(prev => [...prev, account.id]);
        }
      } else {
        // Navigate to account details
        log.debug('Navigate to account details:', account.id);
      }
    },
    [isSelectionMode, selectedPhoneCalls],
  );

  const handleAccountMenu = useCallback((account: PhoneCallItem) => {
    Alert.alert('Account Options', `Options for ${account.name}`, [
      { text: 'View Details', onPress: () => log.debug('View details') },
      { text: 'Edit', onPress: () => log.debug('Edit account') },
      { text: 'Delete', onPress: () => log.debug('Delete account') },
      { text: 'Cancel', style: 'cancel' },
    ]);
  }, []);

  const handleNewPhonecall = useCallback(() => {
    navigation.navigate('NewPhoneCallScreen');
    log.debug('Create new phone call');
  }, []);

  const handleEditAccounts = useCallback(() => {
    log.debug('Edit selected accounts:', selectedPhoneCalls);
  }, [selectedPhoneCalls]);

  const handleDeleteAccounts = useCallback(() => {
    if (selectedPhoneCalls.length > 0) {
      Alert.alert(
        'Delete Accounts',
        `Are you sure you want to delete ${selectedPhoneCalls.length} account(s)?`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Delete',
            style: 'destructive',
            onPress: async () => {
              try {
                // Delete each selected account
                for (const phoneId of selectedPhoneCalls) {
                  await deleteAccount([phoneId]);
                }
                // Update local state
                setPhoneCalls(prev =>
                  prev.filter(task => !selectedPhoneCalls.includes(task.id)),
                );
                setSelectedPhoneCalls([]);
                setIsSelectionMode(false);
                log.debug('Accounts deleted successfully');
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
  }, [selectedPhoneCalls, deleteAccount]);

  const handleRefresh = useCallback(async () => {
    log.debug('Refresh accounts');
    try {
      await refetch();
    } catch (error) {
      log.error('Error refreshing accounts:', error);
    }
  }, [refetch]);

  const handleExport = useCallback(() => {
    log.debug('Export to Excel');
  }, []);

  const handleMore = useCallback(() => {
    setMoreSheetVisible(true);
  }, []);

  const singleSelected = selectedPhoneCalls.length === 1;
  const multiSelected = selectedPhoneCalls.length > 1;

  const moreActionItems: ActionItem[] = [
    ...(singleSelected
      ? [
          {
            id: 'delete',
            label: 'Delete',
            icon:renderLogo(icons.ic_delete1, { width: 18, height: 18 }),
            onPress: () => {
              handleDeleteAccounts();
            },
          },
          {
            id: 'assign',
            label: 'Assign',
            icon: renderLogo(icons.ic_Assign, { width: 18, height: 18 }),
          
            onPress: () => {
              log.debug('Assign');
            },
          },
          {
            id: 'add_to_queue',
            label: 'Add to Queue',
             icon: renderLogo(icons.ic_add_queue, { width: 18, height: 18 }),
            onPress: () => {
              log.debug('Add to Queue');
            },
          },
          {
            id: 'set_regarding',
            label: 'Set Regarding',
            icon: renderLogo(icons.ic_Set_Regarding, { width: 18, height: 18 }),
            onPress: () => {
              log.debug('Set Regarding');
            },
          },
          {
            id: 'export_excel',
            label: 'Export to Excel',
            icon: renderLogo(icons.ic_Export_to_Excel, { width: 18, height: 18 }),
            onPress: () => {
              handleExport();
            },
          },
          {
            id: 'share',
            label: 'Share',
            icon: renderLogo(icons.ic_share, { width: 18, height: 18 }),
            onPress: () => {
              log.debug('Share');
            },
          },
        ]
      : multiSelected
      ? [
          {
            id: 'delete',
            label: 'Delete',
            icon: renderLogo(icons.ic_delete1, { width: 18, height: 18 }),
            onPress: () => {
              handleDeleteAccounts();
            },
          },
          {
            id: 'assign',
            label: 'Assign',
        icon: renderLogo(icons.ic_Assign, { width: 18, height: 18 }),
            onPress: () => {
              log.debug('Assign');
            },
          },
          {
            id: 'add_to_queue',
            label: 'Add to Queue',
           icon: renderLogo(icons.ic_add_queue, { width: 18, height: 18 }),
            onPress: () => {
              log.debug('Add to Queue');
            },
          },
          {
            id: 'set_regarding',
            label: 'Set Regarding',
               icon:renderLogo(icons.ic_Set_Regarding, { width: 18, height: 18 }),
            onPress: () => {
              log.debug('Set Regarding');
            },
          },
          {
            id: 'export_excel',
            label: 'Export to Excel',
            icon: renderLogo(icons.ic_Export_to_Excel, { width: 18, height: 18 }),
            onPress: () => {
              handleExport();
            },
          },
        ]
      : [
          {
            id: 'assign',
            label: 'Assign',
                icon: renderLogo(icons.ic_Assign, { width: 18, height: 18 }),
            onPress: () => {
              log.debug('Assign');
            },
          },
          {
            id: 'share',
            label: 'Share',
             icon: renderLogo(icons.ic_share, { width: 18, height: 18 }),
            onPress: () => {
              log.debug('Share');
            },
          },
        ]),
  ];


  const handleCancelSelection = useCallback(() => {
    setIsSelectionMode(false);
    setSelectedPhoneCalls([]);
  }, []);

  const actionBarItems = getActionBarItems(
    isSelectionMode,
    handleNewPhonecall,
    handleEditAccounts,
    handleDeleteAccounts,
    handleRefresh,
    handleExport,
    handleMore,
  );

  const renderAccountItem = (
    account: PhoneCallItem,
    index: number,
    arr: PhoneCallItem[],
  ) => {
    const isSelected = selectedPhoneCalls.includes(account.id);

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
            <Text style={styles.accountName}>{account.name}</Text>
            <Text style={styles.accountDetails}>{account.phone}</Text>
            <Text style={styles.accountDetails}>
              {account.city} • {account.email}
            </Text>
          </View>

          <View style={styles.accountActions}>
            <View
              style={[
                styles.statusButton,
                account.status.value.toLowerCase() === 'active'
                  ? styles.activeStatus
                  : styles.inactiveStatus,
              ]}
            >
              <Text style={styles.statusText}>{account.status.label}</Text>
            </View>
            <TouchableOpacity
              style={styles.menuButton}
              onPress={() => handleAccountMenu(account)}
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
          <View style={themedStyles.accountSeparator} />
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
          title: isSelectionMode ? 'Phone Select' : 'PhoneCall',
        }}
        onSearch={() => {}}
        onAdd={handleNewPhonecall}
        onSettings={() => {}}
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
            {selectedPhoneCalls.length} selected
          </Text>
          <TouchableOpacity onPress={handleCancelSelection}>
            <Text style={styles.cancelButton}>Cancel</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Accounts List */}
      <View style={themedStyles.listContainer}>
        <ScrollView
          style={styles.accountsList}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          {filteredPhoneCalls.map((account, idx, arr) =>
            renderAccountItem(account, idx, arr),
          )}
        </ScrollView>
      </View>

      {/* Bottom Action Bar */}
      <BottomActionBar items={actionBarItems} />

      <ActionSheet
        visible={moreSheetVisible}
        onClose={() => setMoreSheetVisible(false)}
        items={moreActionItems}
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

export default PhoneCall;
