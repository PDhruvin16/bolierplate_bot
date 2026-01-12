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

// Example options (customize for Knowledge Article if needed)
const articleTypeOptions: SelectOption[] = [
  { id: 'faq', label: 'FAQ' },
  { id: 'howto', label: 'How To' },
  { id: 'guide', label: 'Guide' },
];

const relatedTabs: RelatedTab[] = [
  { id: 'contacts', label: 'Contacts', icon: '👥' },
  { id: 'articles', label: 'Articles', icon: '📄' },
  { id: 'cases', label: 'Cases', icon: '📝' },
];

const relatedItems: RelatedItem[] = [
  { id: '1', title: 'John Carter', subtitle: 'Primary contact' },
  { id: '2', title: 'Article thread', subtitle: 'Last week' },
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

const NewKnowledgeArticleScreen: React.FC = () => {
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

  const [articleType, setArticleType] = useState<string>('faq');
  const [companyProfileSection, setCompanyProfileSection] =
    useState('company_profile');

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
          {renderLogo(theme === 'dark' ? icons.ic_back : icons.ic_backb, {
            width: 19,
            height: 18,
          })}
        </TouchableOpacity>
        <Text style={themedStyles.headerTitle}>New Knowledge Article</Text>
      </View>

      <View style={themedStyles.topCard}>
        <Text style={styles.topCardTitle}>New Knowledge Article</Text>
        <View style={styles.topRow}>
          <View style={styles.topCol}>
            <Text style={styles.topLabel}>Type</Text>
            <Text style={styles.topValue}>
              {articleTypeOptions.find(o => o.id === articleType)?.label ??
                '--'}
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
            {/* Article Accordion */}
            <Accordion title="Knowledge Article">
              <SelectDropdown
                options={articleTypeOptions}
                value={articleType}
                onChange={v => setArticleType(v || '')}
                placeholder="Select article type"
                lookup
              />
              <CustomInput
                label="Subject"
                value={form.subject || ''}
                onChangeText={t => onChange('subject', t)}
                placeholder="Subject"
              />
              <CustomInput
                label="Description"
                value={form.description || ''}
                onChangeText={t => onChange('description', t)}
                placeholder="Description"
              />
              <CustomInput
                label="Date"
                value={form.date || ''}
                onChangeText={t => onChange('date', t)}
                placeholder="Date"
              />
            </Accordion>
            {/* Related Accordion */}
            <Accordion title="Related">
              <RelatedSection
                tabs={relatedTabs}
                activeTab={activeRelated}
                items={relatedItems.map(i => ({
                  ...i,
                  selected: selectedRelated.includes(i.id),
                }))}
                searchPlaceholder="Search related..."
                onTabChange={setActiveRelated}
                onItemSelect={handleRelatedSelect}
                showCheckboxes
                embedded
              />
            </Accordion>
          </View>
        ) : (
          <View>
            {/* Company Profile Accordion */}
            <Accordion title="Company Profile" initiallyExpanded>
              <SelectDropdown
                options={companyProfileOptions}
                value={companyProfileSection}
                onChange={setCompanyProfileSection}
                placeholder="Company Profile"
                disabled
              />
              <SelectDropdown
                options={industryOptions}
                value={form.industry || null}
                onChange={v => onChange('industry', v || '')}
                placeholder="Industry"
                lookup
              />
              <CustomInput
                label="SIC Code"
                value={form.sic || ''}
                onChangeText={t => onChange('sic', t)}
                placeholder="SIC Code"
              />
              <SelectDropdown
                options={ownershipOptions}
                value={form.ownership || null}
                onChange={v => onChange('ownership', v || '')}
                placeholder="Ownership"
              />
              <SelectDropdown
                options={contactMethodOptions}
                value={form.contactMethod || null}
                onChange={v => onChange('contactMethod', v || '')}
                placeholder="Contact Method"
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
});

export default NewKnowledgeArticleScreen;
