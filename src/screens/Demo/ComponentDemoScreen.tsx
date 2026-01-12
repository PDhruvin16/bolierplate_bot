import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { COLORS } from '../../context/ThemeContext';
import { FONTS } from '../../constants/fonts';
import {
  CustomButton,
  CommonPopup,
  SLATimerWidget,
  SelectDropdown,
  SelectOption,
  PopupField,
  PopupToggle,
  SLATimerData,
  RelatedSection,
  AccountDropdown,
  RelatedTab,
  RelatedItem,
  AccountFormData,
  ActionSheet,
  ActionItem,
  FormBuilder,
  RadioOption,
} from '../../components/common';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const ComponentDemoScreen: React.FC = () => {
  const [deletePopupVisible, setDeletePopupVisible] = useState(false);
  const [warningPopupVisible, setWarningPopupVisible] = useState(false);
  const [templatePopupVisible, setTemplatePopupVisible] = useState(false);
  const [settingsPopupVisible, setSettingsPopupVisible] = useState(false);

  // Template popup fields
  const [templateField, setTemplateField] = useState('');
  const [dueField, setDueField] = useState('');

  // Settings popup toggles
  const [allowPause, setAllowPause] = useState(false);
  const [allowCustomTime, setAllowCustomTime] = useState(true);

  // Related Section state
  const [activeTab, setActiveTab] = useState('contact');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  // Account Dropdown state
  const [accountData, setAccountData] = useState<AccountFormData | null>(null);

  // SLA Timer data
  const slaData: SLATimerData = {
    firstResponseTime: '12:34 min',
    resolutionTime: '24:20 min',
    firstResponseProgress: 65,
    resolutionProgress: 40,
    lastUpdated: '19 June 12:30 PM',
  };

  // ActionSheet state
  const [actionSheetVisible, setActionSheetVisible] = useState(false);

  const handleDeleteConfirm = () => {
    Alert.alert('Success', 'Item deleted successfully!');
  };

  const handleWarningConfirm = () => {
    Alert.alert('Success', 'Copilot drafts cleared!');
  };

  const handleTemplateConfirm = () => {
    Alert.alert('Success', `Template: ${templateField}, Due: ${dueField}`);
  };

  const handleSettingsConfirm = () => {
    Alert.alert(
      'Success',
      `Pause: ${allowPause}, Custom Time: ${allowCustomTime}`,
    );
  };

  const handleRefreshSLA = async () => {
    // Simulate API call
    await new Promise<void>(resolve => setTimeout(resolve, 1000));
    Alert.alert('Success', 'SLA Timer refreshed!');
  };

  // Related Section data
  const relatedTabs: RelatedTab[] = [
    { id: 'contact', label: 'Contact', icon: '👤' },
    { id: 'opportunities', label: 'Recent Opportunities', icon: '💼' },
    { id: 'cases', label: 'Recent Cases', icon: '🔧' },
    { id: 'entitlement', label: 'Entitlement', icon: '📄' },
  ];

  const relatedItems: RelatedItem[] = [
    {
      id: '1',
      title: 'Fabrikam Technologies',
      subtitle: 'haroun@fabrikaminc.com',
    },
    { id: '2', title: 'Contoso Ltd', subtitle: 'john@contoso.com' },
    { id: '3', title: 'Adventure Works', subtitle: 'sarah@adventureworks.com' },
    { id: '4', title: 'Northwind Traders', subtitle: 'mike@northwind.com' },
    { id: '5', title: 'Wide World Importers', subtitle: 'lisa@wideworld.com' },
  ];

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
  };

  const handleItemSelect = (item: RelatedItem) => {
    if (selectedItems.includes(item.id)) {
      setSelectedItems(selectedItems.filter(id => id !== item.id));
    } else {
      setSelectedItems([...selectedItems, item.id]);
    }
  };

  const handleItemMenu = (item: RelatedItem) => {
    Alert.alert('Item Menu', `Options for ${item.title}`);
  };

  const handleAddItem = () => {
    Alert.alert('Add Item', 'Add new item functionality');
  };

  const handleEditRelated = () => {
    Alert.alert('Edit', 'Edit related items');
  };

  const handleSettingsRelated = () => {
    Alert.alert('Settings', 'Related section settings');
  };

  const handleViewAll = () => {
    Alert.alert('View All', 'View all items');
  };

  // Account Dropdown handlers
  const handleAccountSubmit = (data: AccountFormData) => {
    setAccountData(data);
    Alert.alert('Success', `Account "${data.accountName}" saved successfully!`);
  };

  // Select/Lookup demo data
  const dropdownOptions: SelectOption[] = [
    { id: '1', label: 'Action' },
    { id: '2', label: 'Action' },
    { id: '3', label: 'Action' },
  ];

  const [singleValue, setSingleValue] = useState<string | null>(null);
  const [multiValues, setMultiValues] = useState<string[]>([]);
  const [singleLookup, setSingleLookup] = useState<string | null>(null);
  const [multiLookup, setMultiLookup] = useState<string[]>([]);

  const templateFields: PopupField[] = [
    {
      label: 'Choose Template',
      placeholder: '---',
      value: templateField,
      onChangeText: setTemplateField,
      type: 'search',
    },
    {
      label: 'Due',
      placeholder: '---',
      value: dueField,
      onChangeText: setDueField,
      type: 'search',
    },
  ];

  const settingsToggles: PopupToggle[] = [
    {
      label: 'Allow Pause and Resume',
      value: allowPause,
      onValueChange: setAllowPause,
    },
    {
      label: 'Allow Custom Time Calculation',
      value: allowCustomTime,
      onValueChange: setAllowCustomTime,
    },
  ];

  // ActionSheet handlers
  const handleExcelTemplates = () => Alert.alert('Excel Templates');
  const handleEdit = () => Alert.alert('Edit');
  const handleActivate = () => Alert.alert('Activate');
  const handleDeactivate = () => Alert.alert('Deactivate');
  const handleAssign = () => Alert.alert('Assign');
  const handleShare = () => Alert.alert('Share');

  // ActionSheet items
  const actionSheetItems: ActionItem[] = [
    {
      id: 'excel',
      label: 'Excel Templates',
      icon: (
        <MaterialCommunityIcons
          name="microsoft-excel"
          size={22}
          color="#217346"
        />
      ),
      onPress: handleExcelTemplates,
    },
    {
      id: 'edit',
      label: 'Edit',
      icon: (
        <MaterialCommunityIcons name="pencil-outline" size={22} color="#333" />
      ),
      onPress: handleEdit,
    },
    {
      id: 'activate',
      label: 'Activate',
      icon: (
        <MaterialCommunityIcons
          name="checkbox-marked-circle-outline"
          size={22}
          color="#388e3c"
        />
      ),
      onPress: handleActivate,
    },
    {
      id: 'deactivate',
      label: 'Deactivate',
      icon: (
        <MaterialCommunityIcons
          name="close-circle-outline"
          size={22}
          color="#d32f2f"
        />
      ),
      onPress: handleDeactivate,
    },
    {
      id: 'assign',
      label: 'Assign',
      icon: (
        <MaterialCommunityIcons
          name="account-switch-outline"
          size={22}
          color="#333"
        />
      ),
      onPress: handleAssign,
    },
    {
      id: 'share',
      label: 'Share',
      icon: (
        <MaterialCommunityIcons name="share-variant" size={22} color="#333" />
      ),
      onPress: handleShare,
    },
  ];

  // FormBuilder demo
  const radioOptions: RadioOption[] = [
    { id: 'all', label: 'All Account' },
    { id: 'mine', label: 'My View' },
  ];

  const formFields = [
    {
      type: 'text',
      name: 'accountName',
      label: 'Account Name',
      placeholder: 'Enter name',
      required: true,
    } as const,
    {
      type: 'dropdown',
      name: 'category',
      label: 'Category',
      placeholder: 'Select',
      options: dropdownOptions,
    } as const,
    {
      type: 'multi-dropdown',
      name: 'tags',
      label: 'Tags',
      placeholder: 'Select tags',
      options: dropdownOptions,
    } as const,
    {
      type: 'lookup',
      name: 'owner',
      label: 'Owner (Lookup)',
      placeholder: 'Search user',
      options: dropdownOptions,
    } as const,
    {
      type: 'multi-lookup',
      name: 'followers',
      label: 'Followers (Multi Lookup)',
      placeholder: 'Search users',
      options: dropdownOptions,
    } as const,
    { type: 'checkbox', name: 'active', label: 'Active' } as const,
    {
      type: 'radio',
      name: 'scope',
      label: 'Action_menu',
      options: radioOptions,
    } as const,
  ];

  const formInitial = {
    accountName: '',
    category: null as string | null,
    tags: [] as string[],
    owner: null as string | null,
    followers: [] as string[],
    active: true,
    scope: 'all',
  };

  const handleFormSubmit = (values: typeof formInitial) => {
    Alert.alert('Form Submit', JSON.stringify(values, null, 2));
  };

  return (
    <ScrollView style={styles.container} bounces={false}>
      <Text style={styles.title}>Component Demo</Text>

      {/* Account Dropdown */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account Dropdown</Text>
        <AccountDropdown
          title="Account"
          placeholder="Select Account"
          onAccountSubmit={handleAccountSubmit}
          initialData={accountData || undefined}
        />
      </View>

      {/* Related Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Related Section</Text>
        <RelatedSection
          title="Related"
          tabs={relatedTabs}
          activeTab={activeTab}
          onTabChange={handleTabChange}
          items={relatedItems.map(item => ({
            ...item,
            selected: selectedItems.includes(item.id),
          }))}
          onItemSelect={handleItemSelect}
          onItemMenu={handleItemMenu}
          onAdd={handleAddItem}
          onEdit={handleEditRelated}
          onSettings={handleSettingsRelated}
          onViewAll={handleViewAll}
          showCheckboxes={true}
          searchPlaceholder="Search"
        />
      </View>

      {/* SLA Timer Widget */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>SLA Timer Widget</Text>
        <SLATimerWidget data={slaData} onRefresh={handleRefreshSLA} />
      </View>

      {/* Button Variants */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Button Variants</Text>

        {/* Primary Buttons */}
        <View style={styles.buttonRow}>
          <CustomButton
            title="Button"
            onPress={() => Alert.alert('Primary Button')}
            variant="primary"
            size="medium"
            icon={true}
            style={styles.button}
          />
          <CustomButton
            title="Button"
            onPress={() => Alert.alert('Primary Hover')}
            variant="primary"
            size="medium"
            icon={true}
            style={styles.button}
          />
        </View>

        {/* Secondary Buttons */}
        <View style={styles.buttonRow}>
          <CustomButton
            title="Button"
            onPress={() => Alert.alert('Secondary Button')}
            variant="outline"
            size="medium"
            icon={true}
            style={styles.button}
          />
          <CustomButton
            title="Button"
            onPress={() => Alert.alert('Gray Button')}
            variant="gray"
            size="medium"
            icon={true}
            style={styles.button}
          />
        </View>

        {/* Disabled Buttons */}
        <View style={styles.buttonRow}>
          <CustomButton
            title="Button"
            onPress={() => {}}
            variant="light"
            size="medium"
            icon={true}
            disabled={true}
            style={styles.button}
          />
          <CustomButton
            title="Button"
            onPress={() => {}}
            variant="light"
            size="medium"
            icon={true}
            disabled={true}
            style={styles.button}
          />
        </View>
      </View>

      {/* Popup Triggers */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Common Popups</Text>

        <View style={styles.buttonRow}>
          <CustomButton
            title="Delete Popup"
            onPress={() => setDeletePopupVisible(true)}
            variant="primary"
            size="medium"
            style={styles.button}
          />
          <CustomButton
            title="Warning Popup"
            onPress={() => setWarningPopupVisible(true)}
            variant="primary"
            size="medium"
            style={styles.button}
          />
        </View>

        <View style={styles.buttonRow}>
          <CustomButton
            title="Template Popup"
            onPress={() => setTemplatePopupVisible(true)}
            variant="primary"
            size="medium"
            style={styles.button}
          />
          <CustomButton
            title="Settings Popup"
            onPress={() => setSettingsPopupVisible(true)}
            variant="primary"
            size="medium"
            style={styles.button}
          />
        </View>
      </View>

      {/* Select/Lookup Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Dropdowns & Lookups</Text>

        {/* Single Select Dropdown */}
        <SelectDropdown
          placeholder="Placeholder text"
          options={dropdownOptions}
          mode="single"
          value={singleValue}
          onChange={setSingleValue}
        />

        {/* Multi Select Dropdown */}
        <SelectDropdown
          placeholder="Placeholder text"
          options={dropdownOptions}
          mode="multi"
          values={multiValues}
          onChangeMulti={setMultiValues}
        />

        {/* Single Select Lookup */}
        <SelectDropdown
          placeholder="Placeholder text"
          options={dropdownOptions}
          mode="single"
          lookup
          value={singleLookup}
          onChange={setSingleLookup}
          onCreateNew={() => Alert.alert('New', 'Create new item')}
        />

        {/* Multi Select Lookup */}
        <SelectDropdown
          placeholder="Placeholder text"
          options={dropdownOptions}
          mode="multi"
          lookup
          values={multiLookup}
          onChangeMulti={setMultiLookup}
          onCreateNew={() => Alert.alert('New', 'Create new item')}
        />
      </View>

      {/* Form Builder Demo */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Form Builder</Text>
        <FormBuilder
          fields={formFields as any}
          initialValues={formInitial}
          onSubmit={handleFormSubmit}
          submitText="Save"
        />
      </View>

      {/* Delete Confirmation Popup */}
      <CommonPopup
        visible={deletePopupVisible}
        onClose={() => setDeletePopupVisible(false)}
        title="Delete"
        message="Do you want to delete this? You can't undo, but you can request an admin attempt to recover if needed."
        primaryButtonText="Apply"
        secondaryButtonText="Cancel"
        onPrimaryPress={handleDeleteConfirm}
        onSecondaryPress={() => setDeletePopupVisible(false)}
        variant="delete"
      />

      {/* Warning Popup */}
      <CommonPopup
        visible={warningPopupVisible}
        onClose={() => setWarningPopupVisible(false)}
        title="Title"
        message="This will erase any suggested Copilot drafts that you haven't added to the email. You won't be able to undo this action. Text that you've already added (with 'Keep it') or manually typed in the email message are not affected."
        primaryButtonText="Apply"
        secondaryButtonText="Cancel"
        onPrimaryPress={handleWarningConfirm}
        onSecondaryPress={() => setWarningPopupVisible(false)}
        variant="warning"
      />

      {/* Template Popup */}
      <CommonPopup
        visible={templatePopupVisible}
        onClose={() => setTemplatePopupVisible(false)}
        title="Title"
        fields={templateFields}
        primaryButtonText="Apply"
        secondaryButtonText="Cancel"
        onPrimaryPress={handleTemplateConfirm}
        onSecondaryPress={() => setTemplatePopupVisible(false)}
        variant="template"
      />

      {/* Settings Popup */}
      <CommonPopup
        visible={settingsPopupVisible}
        onClose={() => setSettingsPopupVisible(false)}
        title="Title"
        fields={[
          {
            label: 'Choose Template',
            placeholder: '---',
            value: templateField,
            onChangeText: setTemplateField,
            type: 'search',
          },
        ]}
        toggles={settingsToggles}
        primaryButtonText="Apply"
        secondaryButtonText="Cancel"
        onPrimaryPress={handleSettingsConfirm}
        onSecondaryPress={() => setSettingsPopupVisible(false)}
        variant="settings"
        showButtons={false}
      />

      {/* Action Sheet Demo */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Action Sheet</Text>
        <CustomButton
          title="Show Action Sheet"
          onPress={() => setActionSheetVisible(true)}
          variant="primary"
          size="medium"
          style={styles.button}
        />
      </View>

      {/* ActionSheet */}
      <ActionSheet
        visible={actionSheetVisible}
        onClose={() => setActionSheetVisible(false)}
        items={actionSheetItems}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 16,
  },
  title: {
    fontSize: FONTS['2xl'],
    fontWeight: '700',
    color: COLORS.dark,
    textAlign: 'center',
    marginBottom: 24,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: FONTS.lg,
    fontWeight: '600',
    color: COLORS.dark,
    marginBottom: 16,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  button: {
    flex: 0.45,
  },
});

export default ComponentDemoScreen;
