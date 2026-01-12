import React, {
  useEffect,
  useMemo,
  useRef,
  useCallback,
  useState,
} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {
  BottomSheetModal,
  BottomSheetScrollView,
  BottomSheetBackdrop,
} from '@gorhom/bottom-sheet';
import { COLORS } from '../../context/ThemeContext';
import { FONTS } from '../../constants/fonts';
import { useTheme } from '../../context/ThemeContext';
import log from '../../utils/logger';
import SelectDropdown from './SelectDropdown';
import useCommonQueries from '../../hooks/useCommonQueries';
import Toast from 'react-native-toast-message';

interface ShareSheetProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  onSave?: () => void;
  route: string;
  selectedRecords: string[];
}

// Type definitions
interface Option {
  id: string;
  label: string;
}

interface Tab {
  id: string;
  label: string;
  options: Option[];
}

interface PermissionUser {
  user_id: string;
  permission_type: string[];
}

const PERMISSION_TYPES = [
  'Read',
  'Write',
  'Delete',
  'Append',
  'Append to',
  'Assign',
  'Share',
];

const ShareSheet: React.FC<ShareSheetProps> = ({
  visible,
  onClose,
  title = 'Share Module',
  onSave,
  selectedRecords,
  route,
}) => {
  const { theme } = useTheme();
  const modalRef = useRef<BottomSheetModal>(null);
  // Set default snap point to 70%
  const snapPoints = useMemo(() => ['90%'], []);
  const isVisibleRef = useRef(false);

  const [activeTab, setActiveTab] = useState<string>('users');
  const [userTo, setUserTo] = useState<string[]>([]);
  const [userPermissions, setUserPermissions] = useState<PermissionUser[]>([]);
  const [validationErrors, setValidationErrors] = useState<{
    [key: string]: boolean;
  }>({});

  const { useAssignList, shareModuleMutation } = useCommonQueries();
  const { data: userTeamListData } = useAssignList();

  // Memoize options to prevent unnecessary re-renders
  const userTabOptions: Option[] = useMemo(
    () =>
      userTeamListData?.data?.users?.map((user: any) => ({
        id: user.id,
        label: user.name,
      })) || [],
    [userTeamListData],
  );

  const teamTabOptions: Option[] = useMemo(
    () =>
      userTeamListData?.data?.groups?.map((team: any) => ({
        id: team.id,
        label: team.name,
      })) || [],
    [userTeamListData],
  );

  // Memoize tabs configuration
  const tabs: Tab[] = useMemo(
    () => [
      {
        id: 'users',
        label: 'Users',
        options: userTabOptions,
      },
      {
        id: 'teams',
        label: 'Teams',
        options: teamTabOptions,
      },
    ],
    [userTabOptions, teamTabOptions],
  );

  // Handle backdrop press
  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        onPress={onClose}
      />
    ),
    [onClose],
  );

  const themedStyles = useMemo(
    () => ({
      container: {
        ...styles.container,
        backgroundColor: theme === 'dark' ? '#000000' : COLORS.white,
      },
      title: {
        ...styles.title,
        color: theme === 'dark' ? '#ffffff' : COLORS.gray,
      },
      subtitle: {
        ...styles.subtitle,
        color: theme === 'dark' ? '#ffffff' : COLORS.darkGray,
      },
      buttonContainer: {
        ...styles.buttonContainer,
        backgroundColor: theme === 'dark' ? '#1a1a1a' : COLORS.white,
        borderTopColor: theme === 'dark' ? '#333' : COLORS.lightGray,
      },
      cancelButton: {
        ...styles.cancelButton,
        backgroundColor: theme === 'dark' ? '#333' : COLORS.lightGray,
      },
      cancelButtonText: {
        ...styles.cancelButtonText,
        color: theme === 'dark' ? '#fff' : COLORS.dark,
      },
      saveButton: {
        ...styles.saveButton,
        backgroundColor: theme === 'dark' ? '#007AFF' : COLORS.primary,
      },
      saveButtonText: {
        ...styles.saveButtonText,
        color: COLORS.white,
      },
    }),
    [theme],
  );

  // Validate permissions
  const validatePermissions = useCallback(() => {
    const errors: { [key: string]: boolean } = {};

    userTo.forEach(userId => {
      const userPermission = userPermissions.find(
        perm => perm.user_id === userId,
      );
      if (!userPermission || userPermission.permission_type.length === 0) {
        errors[userId] = true;
      }
    });

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  }, [userTo, userPermissions]);

  // Initialize permissions when userTo changes
  useEffect(() => {
    if (userTo.length > 0) {
      const newPermissions: PermissionUser[] = userTo.map(userId => {
        const existingPermission = userPermissions.find(
          perm => perm.user_id === userId,
        );
        if (existingPermission) {
          return existingPermission;
        }
        // Default permissions: always include 'Read'
        return {
          user_id: userId,
          permission_type: [],
        };
      });

      // Only update if there are changes
      if (JSON.stringify(newPermissions) !== JSON.stringify(userPermissions)) {
        setUserPermissions(newPermissions);
      }
    } else {
      setUserPermissions([]);
    }
  }, [userTo]);

  // Reset state when sheet becomes visible
  useEffect(() => {
    if (visible) {
      setActiveTab('users');
      setUserTo([]);
      setUserPermissions([]);
      setValidationErrors({});
    }
  }, [visible]);

  // Handle modal visibility
  useEffect(() => {
    if (visible && !isVisibleRef.current) {
      isVisibleRef.current = true;
      const timer = setTimeout(() => {
        try {
          modalRef.current?.present();
        } catch (error) {
          log.warn('Error presenting bottom sheet:', error);
          onClose();
        }
      }, 100);
      return () => clearTimeout(timer);
    } else if (!visible && isVisibleRef.current) {
      isVisibleRef.current = false;
      try {
        modalRef.current?.dismiss();
      } catch (error) {
        log.warn('Error dismissing bottom sheet:', error);
      }
    }
  }, [visible, onClose]);

  const handleDismiss = useCallback(() => {
    isVisibleRef.current = false;
    onClose();
  }, [onClose]);

  const handleTabChange = useCallback((tabId: string) => {
    setActiveTab(tabId);
    log.debug('Tab changed to:', tabId);
  }, []);

  const handleMultiChange = useCallback((ids: string[]) => {
    log.debug('Selected IDs:', ids);
    setUserTo(ids);
  }, []);

  // Check if a permission is selected for a user
  const isSelected = (permission: string, userId: string) => {
    const userPermission = userPermissions.find(
      perm => perm.user_id === userId,
    );
    return userPermission
      ? userPermission.permission_type.includes(permission)
      : false;
  };

  // Handle permission toggle
  const handlePermissionToggle = (permission: string, userId: string) => {
    setUserPermissions(prevPermissions => {
      const updatedPermissions = prevPermissions.map(perm => {
        if (perm.user_id === userId) {
          const hasPermission = perm.permission_type.includes(permission);

          if (hasPermission) {
            // Remove permission, but ensure at least 'Read' remains
            const newPermissions = perm.permission_type.filter(
              p => p !== permission,
            );
            return {
              ...perm,
              permission_type: newPermissions.length > 0 ? newPermissions : [],
            };
          } else {
            // Add permission
            return {
              ...perm,
              permission_type: [...perm.permission_type, permission],
            };
          }
        }
        return perm;
      });

      // Clear validation error for this user when permission is selected
      if (validationErrors[userId]) {
        const userPermission = updatedPermissions.find(
          perm => perm.user_id === userId,
        );
        if (userPermission && userPermission.permission_type.length > 0) {
          setValidationErrors(prev => {
            const newErrors = { ...prev };
            delete newErrors[userId];
            return newErrors;
          });
        }
      }

      return updatedPermissions;
    });
  };

  const handleCancel = useCallback(() => {
    setUserTo([]);
    setUserPermissions([]);
    setValidationErrors({});
    modalRef.current?.dismiss();
    handleDismiss();
  }, [handleDismiss]);

  const handleSave = useCallback(() => {
    // Validate permissions before saving
    const isValid = validatePermissions();

    if (!isValid) {
      // Show error message or handle validation failure
      log.warn(
        'Validation failed: At least one permission is required for each user',
      );
      return;
    }
    if (selectedRecords.length === 0) {
      onClose();
      Toast.show({
        type: 'error',
        text1: 'Share Error!',
        text2: 'No records selected to share.',
      });
      return;
    }
    selectedRecords.forEach(recordId => {
      // log.debug('Sharing record ID:', recordId);
      shareModuleMutation.mutate(
        {
          data: { share_permissions: userPermissions },
          route,
          id: recordId,
        },
        {
          onSuccess: data => {
            Toast.show({
              type: 'success',
              text1: 'Share successfully!',
              text2: data?.message || '',
            });
          },
          onError: error => {
            log.debug('error share modal :', error);
          },
        },
      );
    });

    if (onSave) {
      onSave();
    }
    modalRef.current?.dismiss();
    handleDismiss();
  }, [onSave, userPermissions, handleDismiss, validatePermissions]);

  // Get user label by ID
  const getUserLabel = (userId: string) => {
    const allOptions = tabs.flatMap(tab => tab.options);
    return (
      allOptions.find(option => option.id === userId)?.label || 'Unknown User'
    );
  };

  // Check if user has validation error
  const hasValidationError = (userId: string) => {
    return validationErrors[userId] || false;
  };

  // Don't render if not visible to prevent gesture conflicts
  if (!visible) {
    return null;
  }

  return (
    <BottomSheetModal
      ref={modalRef}
      snapPoints={snapPoints}
      enablePanDownToClose
      onDismiss={handleDismiss}
      handleIndicatorStyle={styles.handle}
      backgroundStyle={[
        styles.sheet,
        { backgroundColor: theme === 'dark' ? '#000000' : COLORS.white },
      ]}
      backdropComponent={renderBackdrop}
      enableDismissOnClose={true}
      enableOverDrag={false}
      keyboardBehavior="extend" // Better keyboard handling
      keyboardBlurBehavior="restore"
    >
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 25}
      >
        <View style={themedStyles.container}>
          {/* Scrollable Content */}
          <BottomSheetScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.subtitle}>
              Manage who can see your record and how much access they get.
              Changes made to all users or teams will be shared and options
              saved after clicking on the Share button.
            </Text>

            <View style={styles.dividerContainer} />

            <SelectDropdown
              placeholder="Select user or team"
              options={tabs}
              mode="multi"
              showTabs={true}
              tabs={tabs}
              activeTab={activeTab}
              onTabChange={handleTabChange}
              values={userTo}
              onChangeMulti={handleMultiChange}
              lookup={true}
            />

            {/* Add some bottom padding to ensure content is not hidden behind buttons */}
            <View style={styles.bottomSpacer} />

            {/* Permissions Section */}
            {userTo.map(userId => (
              <View key={userId} style={styles.userPermissionContainer}>
                <Text style={styles.userTitle}>{getUserLabel(userId)}</Text>
                <Text style={styles.userSubtitle}>
                  Grant this user or team access to this record by assigning
                  them permission
                </Text>
                <Text style={styles.permissionSectionTitle}>Permission</Text>
                {/* Validation Error Message */}
                {hasValidationError(userId) && (
                  <Text style={styles.errorText}>
                    At least one permission is required
                  </Text>
                )}

                {/* Permission checkboxes */}
                <View style={styles.permissionsContainer}>
                  {PERMISSION_TYPES.map(permission => (
                    <TouchableOpacity
                      key={permission}
                      style={styles.checkboxContainer}
                      onPress={() => handlePermissionToggle(permission, userId)}
                      activeOpacity={0.7}
                    >
                      <View
                        style={[
                          styles.checkbox,
                          isSelected(permission, userId) && styles.checkedBox,
                        ]}
                      >
                        {isSelected(permission, userId) && (
                          <Text style={styles.checkmark}>✓</Text>
                        )}
                      </View>
                      <Text style={styles.permissionLabel}>{permission}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            ))}
          </BottomSheetScrollView>

          {/* Fixed Bottom Buttons */}
          <View style={themedStyles.buttonContainer}>
            <TouchableOpacity
              style={themedStyles.cancelButton}
              onPress={handleCancel}
              activeOpacity={0.7}
            >
              <Text style={themedStyles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={themedStyles.saveButton}
              onPress={handleSave}
              activeOpacity={0.7}
            >
              <Text style={themedStyles.saveButtonText}>Save</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.bottomSpacer} />
        </View>
      </KeyboardAvoidingView>
    </BottomSheetModal>
  );
};

const styles = StyleSheet.create({
  sheet: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  handle: {
    backgroundColor: COLORS.lightGray,
    width: 40,
    height: 4,
  },
  container: {
    flex: 1,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.darkGray,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.darkGray,
    lineHeight: 20,
    marginBottom: 16,
  },
  dividerContainer: {
    height: 1,
    backgroundColor: COLORS.lightGray,
    marginVertical: 16,
  },
  bottomSpacer: {
    height: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGray,
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    fontSize: FONTS.base,
    fontWeight: '600',
  },
  saveButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonText: {
    fontSize: FONTS.base,
    fontWeight: '600',
    color: COLORS.white,
  },
  userPermissionContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  userTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.dark,
    marginBottom: 4,
  },
  userSubtitle: {
    fontSize: 14,
    color: COLORS.darkGray,
    marginBottom: 12,
    lineHeight: 18,
  },
  permissionSectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.dark,
    marginBottom: 8,
  },
  permissionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    marginBottom: 12,
    minWidth: '30%',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: COLORS.gray,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
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
  permissionLabel: {
    fontSize: 14,
    color: COLORS.dark,
  },
  errorText: {
    fontSize: 12,
    color: COLORS.error,
    marginVertical: 4,
  },
});

export default ShareSheet;
