import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import SelectDropdown from './SelectDropdown';
import { COLORS } from '../../context/ThemeContext';
import useCommonQueries from '../../hooks/useCommonQueries';
import AsyncStorage from '@react-native-async-storage/async-storage';
import log from '../../utils/logger';
import Toast from 'react-native-toast-message';

const { height } = Dimensions.get('window');

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

interface AssignmentData {
  assignTo: string;
  userOrTeam: string | null;
  selectedTab: string;
}

interface AssignRecordModalProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  selectedRecords?: any[];
  onAssign: () => void;
  route?: string;
}

const AssignRecordModal: React.FC<AssignRecordModalProps> = ({
  visible,
  onClose,
  title = 'Assign Record',
  subtitle = 'You have selected raw. To whom would you like to assign it?',
  selectedRecords = [],
  onAssign,
  route,
}) => {
  const { useAssignList, assignRecordMutation } = useCommonQueries();
  const { data: assignListData } = useAssignList();
  const assignToOptions: Option[] = [
    { id: '1', label: 'Me' },
    { id: '2', label: 'User or Team' },
  ];

  const userTabOptions: Option[] = assignListData?.data?.users?.map(
    (user: any, index: number) => ({
      id: user.id,
      label: user.name,
    }),
  );

  const teamTabOptions: Option[] = assignListData?.data?.groups?.map(
    (team: any, index: number) => ({
      id: team.id,
      label: team.name,
    }),
  );

  const [assignTo, setAssignTo] = useState<string>(assignToOptions[0]?.id);
  const [userTo, setUserTo] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>('users');

  // Reset form when modal opens or closes
  useEffect(() => {
    if (visible) {
      setAssignTo(assignToOptions[0]?.id);
      setUserTo(null);
      setActiveTab('users');
    }
  }, [visible]);

  const handleAssign = async (): Promise<void> => {
    try {
      const user = await AsyncStorage.getItem('userData');
      const userData = user ? JSON.parse(user) : null;
      if (!userData) {
        throw new Error('User data not found in AsyncStorage');
      }
      const userObj = assignListData?.data?.users?.find(
        (e: { email: string }) => e.email === userData.email,
      );
      const userId = userObj?.id;

      // Build data array in one go
      const dataArray = selectedRecords.map(record => ({
        id: record,
        [activeTab === 'teams' ? 'owning_team' : 'owner']:
          assignTo === '1' ? userId : userTo,
      }));
      assignRecordMutation.mutate(
        { data: dataArray, route },
        {
          onSuccess: data => {
            Toast.show({
              type: 'success',
              text1: 'Assigned successfully!',
              text2: data?.message || '',
            });
          },
          onError: error => {
            log.debug('error assign modal :', error);
          },
        },
      );
      onAssign();
      onClose();
    } catch (error) {
      log.error('Error in handleAssign:', error);
    }
  };

  // Check if assign button should be disabled
  const isAssignDisabled: boolean = assignTo === '2' && !userTo;

  const tabs: Tab[] = [
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
  ];

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerContent}>
              <Text style={styles.title}>{title}</Text>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>×</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.subtitle}>{subtitle}</Text>
          </View>

          {/* Body */}
          <View style={styles.body}>
            {/* Assign to Field */}
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Assign to</Text>
              <SelectDropdown
                placeholder={'Select a User'}
                options={assignToOptions}
                mode="single"
                value={assignTo}
                onChange={(id: string) => {
                  setAssignTo(id);
                  if (id === '1') {
                    setUserTo(null);
                  }
                }}
                lookup={true}
              />
            </View>

            {/* User or Team Field - Only show when "User or Team" is selected */}
            {assignTo === '2' && (
              <View style={styles.fieldContainer}>
                <Text style={styles.label}>User or Team</Text>
                <SelectDropdown
                  placeholder={'Select user or team'}
                  options={[]} // Options will come from tabs
                  mode="single"
                  showTabs={true}
                  tabs={tabs}
                  activeTab={activeTab}
                  onTabChange={(tabId: string) => {
                    setActiveTab(tabId);
                    // Reset selection when tab changes
                    setUserTo(null);
                  }}
                  value={userTo}
                  onChange={(id: string) => setUserTo(id)}
                  lookup={true}
                />
              </View>
            )}
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.assignButton,
                isAssignDisabled && styles.assignButtonDisabled,
              ]}
              onPress={handleAssign}
              disabled={isAssignDisabled}
            >
              <Text
                style={[
                  styles.assignButtonText,
                  isAssignDisabled && styles.assignButtonTextDisabled,
                ]}
              >
                Assign
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    width: '100%',
    maxWidth: 400,
    maxHeight: height * 0.8,
    shadowColor: COLORS.dark,
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 20,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.darkGray,
  },
  closeButton: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 20,
    color: COLORS.lightGray,
    fontWeight: '300',
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.darkGray,
    lineHeight: 20,
  },
  body: {
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  fieldContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.darkGray,
    marginBottom: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGray,
    gap: 12,
  },
  cancelButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    backgroundColor: COLORS.white,
    minWidth: 80,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 14,
    color: COLORS.darkGray,
    fontWeight: '500',
  },
  assignButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    backgroundColor: COLORS.primary,
    minWidth: 80,
    alignItems: 'center',
  },
  assignButtonDisabled: {
    backgroundColor: COLORS.lightGray,
  },
  assignButtonText: {
    fontSize: 14,
    color: COLORS.white,
    fontWeight: '500',
  },
  assignButtonTextDisabled: {
    color: COLORS.darkGray,
  },
});

export { AssignRecordModal };
export type { AssignRecordModalProps, AssignmentData, Option, Tab };
