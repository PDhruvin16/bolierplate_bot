import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
  TextInput,
} from 'react-native';
import { FONTS } from '../../constants/fonts';
import CustomButton from './CustomButton';
import colors from '../../constants/colors';
// import { CustomButton } from './CustomButton';

export interface AccountFormData {
  accountName: string;
  email: string;
  phone: string;
  address: string;
}

export interface AccountDropdownProps {
  title?: string;
  placeholder?: string;
  onAccountSubmit: (data: AccountFormData) => void;
  initialData?: Partial<AccountFormData>;
}

const AccountDropdown: React.FC<AccountDropdownProps> = ({
  title = 'Account',
  placeholder = 'Select Account',
  onAccountSubmit,
  initialData = {},
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState<AccountFormData>({
    accountName: initialData.accountName || '',
    email: initialData.email || '',
    phone: initialData.phone || '',
    address: initialData.address || '',
  });

  const handleSubmit = () => {
    if (formData.accountName.trim()) {
      onAccountSubmit(formData);
      setIsOpen(false);
      // Reset form
      setFormData({
        accountName: '',
        email: '',
        phone: '',
        address: '',
      });
    }
  };

  const handleCancel = () => {
    setIsOpen(false);
    // Reset form to initial data
    setFormData({
      accountName: initialData.accountName || '',
      email: initialData.email || '',
      phone: initialData.phone || '',
      address: initialData.address || '',
    });
  };

  return (
    <View style={styles.container}>
      {/* Dropdown Trigger */}
      <TouchableOpacity
        style={styles.dropdownTrigger}
        onPress={() => setIsOpen(true)}
        activeOpacity={0.7}
      >
        <View style={styles.triggerContent}>
          <Text style={styles.triggerTitle}>{title}</Text>
          <Text style={styles.triggerPlaceholder}>
            {formData.accountName || placeholder}
          </Text>
        </View>
        <Text style={styles.chevron}>▼</Text>
      </TouchableOpacity>

      {/* Modal Form */}
      <Modal
        visible={isOpen}
        transparent={true}
        animationType="slide"
        onRequestClose={handleCancel}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {/* Header */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add {title}</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={handleCancel}
              >
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>

            {/* Form */}
            <ScrollView
              style={styles.formContainer}
              showsVerticalScrollIndicator={false}
              bounces={false}
            >
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>
                  Account Name <Text style={styles.required}>*</Text>
                </Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="Enter account name"
                  value={formData.accountName}
                  onChangeText={text =>
                    setFormData(prev => ({ ...prev, accountName: text }))
                  }
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Email</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="Enter email address"
                  value={formData.email}
                  onChangeText={text =>
                    setFormData(prev => ({ ...prev, email: text }))
                  }
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Phone</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="Enter phone number"
                  value={formData.phone}
                  onChangeText={text =>
                    setFormData(prev => ({ ...prev, phone: text }))
                  }
                  keyboardType="phone-pad"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Address</Text>
                <TextInput
                  style={[styles.textInput, styles.multilineInput]}
                  placeholder="Enter address"
                  value={formData.address}
                  onChangeText={text =>
                    setFormData(prev => ({ ...prev, address: text }))
                  }
                  multiline
                  numberOfLines={3}
                />
              </View>
            </ScrollView>

            {/* Buttons */}
            <View style={styles.buttonContainer}>
              <CustomButton
                title="Cancel"
                onPress={handleCancel}
                variant="outline"
                size="medium"
                style={styles.button}
              />
              <CustomButton
                title="Save"
                onPress={handleSubmit}
                variant="primary"
                size="medium"
                style={styles.button}
                disabled={!formData.accountName.trim()}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  dropdownTrigger: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.white,
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.lightGray,
    minHeight: 56,
  },
  triggerContent: {
    flex: 1,
  },
  triggerTitle: {
    fontSize: FONTS.sm,
    fontWeight: '600',
    color: colors.dark,
    marginBottom: 4,
  },
  triggerPlaceholder: {
    fontSize: FONTS.md,
    color: colors.gray,
  },
  chevron: {
    fontSize: 16,
    color: colors.gray,
    marginLeft: 12,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
    paddingBottom: 34, // Safe area for home indicator
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
  },
  modalTitle: {
    fontSize: FONTS.xl,
    fontWeight: '600',
    color: colors.dark,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.lightBackground,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 18,
    color: colors.gray,
    fontWeight: 'bold',
  },
  formContainer: {
    padding: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    padding: 20,
    paddingTop: 0,
    gap: 12,
  },
  button: {
    flex: 1,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: FONTS.sm,
    fontWeight: '500',
    color: colors.dark,
    marginBottom: 8,
  },
  required: {
    color: colors.error,
  },
  textInput: {
    borderWidth: 1,
    borderColor: colors.lightGray,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: FONTS.md,
    color: colors.dark,
    backgroundColor: colors.white,
  },
  multilineInput: {
    height: 80,
    textAlignVertical: 'top',
  },
});

AccountDropdown.displayName = 'AccountDropdown';

export default AccountDropdown;
