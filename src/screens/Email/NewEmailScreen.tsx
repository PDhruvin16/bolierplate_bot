import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { COLORS } from '../../context/ThemeContext';
import { FONTS } from '../../constants/fonts';
import Tabs from '../../components/common/Tabs';
import Accordion from '../../components/common/Accordion';
import CustomInput from '../../components/common/CustomInput';
import RelatedSection, {
  RelatedItem,
  RelatedTab,
} from '../../components/common/RelatedSection';
import BottomActionBar from '../../components/common/BottomActionBar';
import SelectDropdown, {
  SelectOption,
} from '../../components/common/SelectDropdown';
import { useTheme } from '../../context/ThemeContext';
import { renderLogo } from '../../utils/renderlogo';
import icons from '../../constants/icons';
import MaterialIcons  from 'react-native-vector-icons/MaterialIcons'; // Add this if you use Expo, or use any icon lib

const emailTypeOptions: SelectOption[] = [
  { id: 'personal', label: 'Personal' },
  { id: 'work', label: 'Work' },
  { id: 'other', label: 'Other' },
];

const relatedTabs: RelatedTab[] = [
  { id: 'contacts', label: 'Contacts', icon: '👥' },
  { id: 'activities', label: 'Activities', icon: '📝' },
  { id: 'opportunities', label: 'Opportunities', icon: '💼' },
];

const relatedItems: RelatedItem[] = [
  { id: '1', title: 'John Carter', subtitle: 'Primary contact' },
  { id: '2', title: 'Email thread', subtitle: 'Last week' },
];

const companyProfileOptions: SelectOption[] = [
  { id: 'company_profile', label: 'Company Profile' },
];

const industryOptions: SelectOption[] = [
  { id: 'tech', label: 'Technology' },
  { id: 'finance', label: 'Finance' },
  { id: 'health', label: 'Healthcare' },
];

const ownershipOptions: SelectOption[] = [
  { id: 'private', label: 'Private' },
  { id: 'public', label: 'Public' },
];

const contactMethodOptions: SelectOption[] = [
  { id: 'email', label: 'Email' },
  { id: 'phone', label: 'Phone' },
  { id: 'sms', label: 'SMS' },
];

const priorityOptions: SelectOption[] = [
  { id: 'high', label: 'High' },
  { id: 'medium', label: 'Medium' },
  { id: 'low', label: 'Low' },
];

const activityStatusOptions: SelectOption[] = [
  { id: 'open', label: 'Open' },
  { id: 'in_progress', label: 'In Progress' },
  { id: 'closed', label: 'Closed' },
];

const NewEmailScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'summary' | 'details'>('summary');
  const { theme } = useTheme();
  const themedStyles = {
    container: {
      ...styles.container,
      backgroundColor: theme === 'dark' ? '#000000' : COLORS.white,
      borderColor: theme === 'dark' ? '#2C2B2B' : COLORS.lightGray,
    },
    headerTitle: {
      ...styles.headerTitle,
      color: theme === 'dark' ? '#ffffff' : COLORS.dark,
    },
    topCard: {
      ...styles.topCard,
      backgroundColor: theme === 'dark' ? '#1E1E1E' : COLORS.white,
      borderColor: theme === 'dark' ? '#2C2B2B' : COLORS.lightGray,
    },
  };

  // Form state
  const [form, setForm] = useState<Record<string, string>>({});
  const onChange = (key: string, value: string) =>
    setForm(prev => ({ ...prev, [key]: value }));

  // Related selection
  const [activeRelated, setActiveRelated] = useState('contacts');
  const [selectedRelated, setSelectedRelated] = useState<string[]>([]);
  const handleRelatedSelect = (item: RelatedItem) => {
    setSelectedRelated(prev =>
      prev.includes(item.id)
        ? prev.filter(id => id !== item.id)
        : [...prev, item.id],
    );
  };

  const [emailType, setEmailType] = useState<string>('personal');
  const [companyProfileSection, setCompanyProfileSection] =
    useState('company_profile');
  const [priority, setPriority] = useState<string>('medium');
  const [activityStatus, setActivityStatus] = useState<string>('open');

  return (
    <View style={themedStyles.container}>
      {/* Minimal header with back + title */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => {
            /* navigation.goBack?.(); */
          }}
          style={styles.headerBack}
        >
          {/* <Text style={styles.backIcon}>‹</Text> */}
          {renderLogo(theme === 'dark' ? icons.ic_back : icons.ic_backb, {
            width: 19,
            height: 18,
          })}
        </TouchableOpacity>
        <Text style={themedStyles.headerTitle}>New Email</Text>
      </View>

      <View style={themedStyles.topCard}>
        <Text style={styles.topCardTitle}>New Email</Text>
        <View style={styles.topRow}>
          <View style={styles.topCol}>
            <Text style={styles.topLabel}>Type</Text>
            <Text style={styles.topValue}>
              {emailTypeOptions.find(o => o.id === emailType)?.label ?? '--'}
            </Text>
          </View>
          <View style={styles.topCol}>
            <Text style={styles.topLabel}>Owner</Text>
            <Text style={styles.topValue}>--</Text>
          </View>
        </View>
      </View>

      <Tabs
        tabs={[
          { id: 'summary', label: 'Summary' },
          { id: 'details', label: 'Details' },
        ]}
        activeTab={activeTab}
        onTabChange={tab => setActiveTab(tab as 'summary' | 'details')}
      />

      <ScrollView
        style={styles.content}
        contentContainerStyle={{ paddingBottom: 24 }}
        bounces={false}
      >
        {activeTab === 'summary' ? (
          <View>
            {/* Email Accordion */}
            <Accordion title="Email Details">
              <CustomInput
                label="From"
                value={form.from || ''}
                onChangeText={t => onChange('from', t)}
                placeholder="From"
                required
              />
              <CustomInput
                label="To"
                value={form.to || ''}
                onChangeText={t => onChange('to', t)}
                placeholder="To"
                required
              />
              <CustomInput
                label="CC"
                value={form.cc || ''}
                onChangeText={t => onChange('cc', t)}
                placeholder="CC"
              />
              <CustomInput
                label="Subject"
                value={form.subject || ''}
                onChangeText={t => onChange('subject', t)}
                placeholder="Subject"
              />
             
              <SelectDropdown
                label="Priority"
                options={priorityOptions}
                value={priority}
                onChange={v => setPriority(v || '')}
                placeholder="Priority"
                lookup
              />
               <CustomInput
                label="Regarding"
                value={form.regarding || ''}
                onChangeText={t => onChange('regarding', t)}
                placeholder="Regarding"
              />
            </Accordion>
            {/* Message Compose Box */}
            <View style={styles.composeBox}>
              <CustomInput
                label="Message"
                value={form.message || ''}
                onChangeText={t => onChange('message', t)}
                placeholder="Compose message..."
                multiline
                numberOfLines={6}
                inputStyle={styles.composeInput}
              />
            </View>
            {/* Attachment Accordion */}
            <Accordion title="Attachments">
              <View style={styles.attachmentBox}>
                <View style={styles.attachmentRow}>
                  {/* Use icon library or your own icon */}
                  <MaterialIcons name="attach-file" size={28} color={COLORS.gray} style={styles.attachmentIcon} />
                 
                </View>
                 <Text style={styles.attachmentText}>No attachment found</Text>
                {/* <View style={styles.dottedLine} /> */}
                <View style={styles.attachmentRow}>
                  <TouchableOpacity style={styles.attachmentButton}>
                    <Text style={styles.attachmentButtonText}>Add File</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Accordion>
          </View>
        ) : (
          <View>
            {/* Company Profile Accordion */}
            <Accordion title="Email Details" initiallyExpanded>
             
              {/* Activity Status Dropdown */}
              <SelectDropdown
                label="Activity Status"
                options={activityStatusOptions}
                value={activityStatus}
                onChange={v => setActivityStatus(v || '')}
                placeholder="Activity Status"
              />
              {/* Owner TextInput (static value) */}
              <CustomInput
                label="Owner"
                value="John Doe"
                onChangeText={() => {}}
                placeholder="Owner"
                editable={false}
              />
              <CustomInput
                label="Created on"
                value="30/09/2025"
                onChangeText={() => {}}
                placeholder="Created on"
                editable={false}
              />
            </Accordion>
          </View>
        )}
      </ScrollView>

      <BottomActionBar
        items={[
          { id: 'save', icon: '💾', label: 'Save', onPress: () => {} },
          {
            id: 'saveClose',
            icon: '🗂️',
            label: 'Save and Close',
            onPress: () => {},
          },
        ]}
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
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  headerBack: {
    padding: 6,
    marginRight: 6,
  },
  backIcon: {
    fontSize: 22,
    color: COLORS.dark,
  },
  headerTitle: {
    fontSize: FONTS.md,
    fontWeight: '600',
    color: COLORS.dark,
  },
  topCard: {
    marginHorizontal: 12,
    marginTop: 8,
    backgroundColor: COLORS.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    padding: 12,
  },
  topCardTitle: {
    fontSize: FONTS.sm,
    fontWeight: '600',
    color: COLORS.dark,
    marginBottom: 8,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  topCol: {
    flex: 1,
  },
  topLabel: {
    fontSize: FONTS.xs,
    color: COLORS.gray,
  },
  topValue: {
    fontSize: FONTS.xs,
    color: COLORS.gray,
  },
  content: {
    flex: 1,
    paddingHorizontal: 12,
    marginTop: 8,
  },
  composeBox: {
    marginTop: 12,
    marginBottom: 12,
    borderWidth:1,
    borderColor:'#E5E5EA',
    padding: 8,
    borderRadius: 10,
  },
  composeInput: {
    minHeight: 120,
    textAlignVertical: 'top',
  
  },
  attachmentBox: {
    alignItems: 'center',
    paddingVertical: 16,
    justifyContent: 'center',
    borderWidth: 1,
    borderStyle: 'dashed',
  },
  attachmentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 8,
  },
  attachmentIcon: {
    marginRight: 10,
  },
  attachmentText: {
    color: COLORS.gray,
    fontSize: FONTS.sm,
  },
  dottedLine: {
    borderStyle: 'dotted',
    borderWidth: 1,
    borderRadius: 1,
    borderColor: COLORS.gray,
    width: '80%',
    alignSelf: 'center',
    marginVertical: 8,
  },
  attachmentButton: {
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: 6,
    paddingHorizontal: 18,
    paddingVertical: 8,
    backgroundColor: COLORS.white,
  },
  attachmentButtonText: {
    color: COLORS.primary,
    fontWeight: '500',
    fontSize: FONTS.sm,
  },
});

export default NewEmailScreen;
