import React, { useEffect, useMemo, useState } from 'react';
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
import RelatedSection, {
  RelatedItem,
  RelatedTab,
} from '../../components/common/RelatedSection';
import BottomActionBar from '../../components/common/BottomActionBar';
import { useTheme } from '../../context/ThemeContext';
import { renderLogo } from '../../utils/renderlogo';
import icons from '../../constants/icons';
import useAccountQueries from '../../hooks/useAccountQueries';
import { SchemaField, SchemaSection, SchemaTab } from './types';
import log from '../../utils/logger';

type AccountDetailScreenProps = {
  navigation: any;
  route: {
    params: {
      id: string;
      navigationModuleId?: string;
    };
  };
};

const AccountDetailScreen: React.FC<AccountDetailScreenProps> = ({
  navigation,
  route: { params },
}) => {
  const accountId = params?.id;
  const navigationModuleId = params?.navigationModuleId;
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState<string>('summary');
  const [schemaTabs, setSchemaTabs] = useState<SchemaTab[] | null>(null);
  const [selectedRelated, setSelectedRelated] = useState<string[]>([]);

  // Account queries hook
  const { useFormBuild, useAccountDetail } = useAccountQueries();
  
  // Get account data for top card display
  const accountName =
    account?.name || account?.account_name || 'Account Details';
  const annualRevenue = account?.annual_revenue || account?.revenue || '--';
  const numEmployees =
    account?.number_of_employees || account?.numEmployees || '--';
  // Get form builder data
  const {
    data: formBuildData,
    isLoading: formBuildLoading,
    error: formBuildError,
  } = useFormBuild(navigationModuleId, !!navigationModuleId);

  // Get account details
  const {
    data: accountDetails,
    isLoading: accountDetailsLoading,
    error: accountDetailsError,
    refetch: refetchAccountDetails,
  } = useAccountDetail(accountId, !!accountId);

  const account = accountDetails?.data || accountDetails || {};

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

  // Related data placeholders
  const relatedTabs: RelatedTab[] = [
    { id: 'contacts', label: 'Contacts', icon: icons.ic_contactsd },
    {
      id: 'activities',
      label: 'Activities',
      icon: icons.ic_Recent_Opportunities,
    },
    {
      id: 'opportunities',
      label: 'Opportunities',
      icon: icons.ic_Recent_Cases,
    },
    { id: 'entitlement', label: 'Entitlement', icon: icons.ic_Entitlement },
  ];
  const [activeRelated, setActiveRelated] = useState('contacts');
  const relatedItems: RelatedItem[] = [
    { id: '1', title: 'John Carter', subtitle: 'Primary contact' },
    { id: '2', title: 'Email thread', subtitle: 'Last week' },
  ];

  // Selection handling for RelatedSection checkboxes
  const handleRelatedSelect = (item: RelatedItem) => {
    setSelectedRelated(prev =>
      prev.includes(item.id)
        ? prev.filter(id => id !== item.id)
        : [...prev, item.id],
    );
  };

  // Process form builder data
  useEffect(() => {
    if (formBuildData) {
      const tabs: SchemaTab[] =
        (formBuildData as any)?.data?.tabs ||
        (formBuildData as any)?.data?.data ||
        [];

      if (tabs && tabs.length > 0) {
        setSchemaTabs(tabs);
        setActiveTab(tabs[0]?.id || 'summary');
      }
    }
  }, [formBuildData]);

  const getFieldDisplayValue = (fieldKey: string) => {
    const value = account?.[fieldKey];
    if (fieldKey === 'status') {
      return value?.label ?? '';
    }

    // Handle owner object specifically
    if (fieldKey === 'owner' && typeof value === 'object' && value !== null) {
      return value?.name || value?.username || value?.first_name || '';
    }

    if (typeof value === 'object') {
      if (typeof value?.label === 'string') return value.label;
      if (typeof value?.name === 'string') return value.name;
      if (typeof value?.username === 'string') return value.username;
      if (typeof value?.first_name === 'string') return value.first_name;
      if (Array.isArray(value) && value.length > 0) {
        const first = value[0];
        if (typeof first?.city === 'string') return first.city;
        if (typeof first?.name === 'string') return first.name;
      }
      return '';
    }
    return value ?? '';
  };

  const renderFieldValue = (field: SchemaField) => {
    if (field.hidden) return null;
    const key = field.metadataKey || field.name;
    const value = getFieldDisplayValue(key);

    return (
      <View key={field.id} style={styles.fieldContainer}>
        <Text style={styles.fieldLabel}>{field.label || key}</Text>
        <Text style={styles.fieldValue}>{String(value)}</Text>
      </View>
    );
  };

  // Add this near the top of your component to log the account data
  useEffect(() => {
    if (account) {
      console.log('Account data:', JSON.stringify(account, null, 2));
    }
  }, [account]);

  // Also add this to check what's being rendered
  console.log('Rendering account details:', {
    accountName,
    annualRevenue,
    numEmployees,
  });

  const renderSection = (section: SchemaSection) => {
    if (section.type === 'custom-component') {
      return (
        <Accordion key={section.id} title={section.label || section.id}>
          <View style={styles.activitySummary}>
            <Text style={styles.activitySummaryText}>
              {section.componentType
                ? `${section.componentType} component`
                : 'Custom component'}
            </Text>
          </View>
        </Accordion>
      );
    }
    return (
      <Accordion key={section.id} title={section.label || section.id}>
        {section.fields?.map(renderFieldValue)}
      </Accordion>
    );
  };

  const activeSchemaTab = useMemo(() => {
    return schemaTabs?.find(t => t.id === activeTab) || null;
  }, [schemaTabs, activeTab]);

  const handleEdit = () => {
    navigation.navigate('NewAccountScreen', {
      id: accountId,
      navigationModuleId,
    });
  };

  // Safely handle owner object
  const getOwnerDisplayName = () => {
    const owner = account?.owner;
    if (!owner) return '--';
    if (typeof owner === 'string') return owner;
    if (typeof owner === 'object') {
      return owner?.name || owner?.username || owner?.first_name || '--';
    }
    return '--';
  };

  const owner = getOwnerDisplayName();

  return (
    <View style={themedStyles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => {
            navigation.goBack?.();
          }}
          style={styles.headerBack}
        >
          {renderLogo(theme === 'dark' ? icons.ic_back : icons.ic_backb, {
            width: 19,
            height: 18,
          })}
        </TouchableOpacity>
        <Text style={themedStyles.headerTitle}>Account Details</Text>
        <TouchableOpacity onPress={handleEdit} style={styles.editButton}>
          <Text style={styles.editButtonText}>Edit</Text>
        </TouchableOpacity>
      </View>

      {/* Top summary card */}
      <View style={themedStyles.topCard}>
        <Text style={styles.topCardTitle}>{accountName}</Text>
        <View style={styles.topRow}>
          <View style={styles.topCol}>
            <Text style={styles.topLabel}>Annual Revenue</Text>
            <Text style={styles.topValue}>{annualRevenue}</Text>
          </View>
          <View style={styles.topCol}>
            <Text style={styles.topLabel}>Number of Employees</Text>
            <Text style={styles.topValue}>{numEmployees}</Text>
          </View>
        </View>
        <View style={styles.topRow}>
          <View style={styles.topCol}>
            <Text style={styles.topLabel}>Owner</Text>
            <Text style={styles.topValue}>{owner}</Text>
          </View>
        </View>
      </View>

      {/* Loading state */}
      {(formBuildLoading || accountDetailsLoading) && (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>
            {formBuildLoading
              ? 'Loading form structure...'
              : 'Loading account details...'}
          </Text>
        </View>
      )}

      {/* Error states */}
      {formBuildError && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>
            Failed to load form structure: {formBuildError.message}
          </Text>
        </View>
      )}

      {accountDetailsError && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>
            Failed to load account details: {accountDetailsError.message}
          </Text>
          <TouchableOpacity
            onPress={() => refetchAccountDetails()}
            style={styles.retryButton}
          >
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      )}

      {!accountDetailsLoading && !accountDetailsError && (
        <>
          <Tabs
            tabs={
              schemaTabs
                ? schemaTabs
                    .filter(t => !(t as any).hidden)
                    .map(t => ({ id: t.id, label: t.label }))
                : [
                    { id: 'summary', label: 'Summary' },
                    { id: 'details', label: 'Details' },
                  ]
            }
            activeTab={activeTab}
            onTabChange={tab => setActiveTab(String(tab))}
          />

          <ScrollView
            style={styles.content}
            contentContainerStyle={{ paddingBottom: 24 }}
          >
            {schemaTabs && activeSchemaTab ? (
              <View>
                {activeSchemaTab.sections?.map(renderSection)}
                {/* Related section */}
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
                    showCheckboxes={false}
                    embedded
                  />
                </Accordion>
              </View>
            ) : (
              <View>
                {/* Fallback static sections */}
                <Accordion title="Account Information">
                  <View style={styles.fieldContainer}>
                    <Text style={styles.fieldLabel}>Account Name</Text>
                    <Text style={styles.fieldValue}>
                      {account?.name || '--'}
                    </Text>
                  </View>
                  <View style={styles.fieldContainer}>
                    <Text style={styles.fieldLabel}>Annual Revenue</Text>
                    <Text style={styles.fieldValue}>
                      {getFieldDisplayValue('annual_revenue')}
                    </Text>
                  </View>
                  <View style={styles.fieldContainer}>
                    <Text style={styles.fieldLabel}>Number of Employees</Text>
                    <Text style={styles.fieldValue}>
                      {getFieldDisplayValue('number_of_employees')}
                    </Text>
                  </View>
                  <View style={styles.fieldContainer}>
                    <Text style={styles.fieldLabel}>Phone</Text>
                    <Text style={styles.fieldValue}>
                      {getFieldDisplayValue('phone_number1')}
                    </Text>
                  </View>
                  <View style={styles.fieldContainer}>
                    <Text style={styles.fieldLabel}>Email</Text>
                    <Text style={styles.fieldValue}>
                      {getFieldDisplayValue('email1')}
                    </Text>
                  </View>
                  <View style={styles.fieldContainer}>
                    <Text style={styles.fieldLabel}>Website</Text>
                    <Text style={styles.fieldValue}>
                      {getFieldDisplayValue('website')}
                    </Text>
                  </View>
                </Accordion>

                <Accordion title="Company Profile">
                  <View style={styles.fieldContainer}>
                    <Text style={styles.fieldLabel}>Industry</Text>
                    <Text style={styles.fieldValue}>
                      {getFieldDisplayValue('industry')}
                    </Text>
                  </View>
                  <View style={styles.fieldContainer}>
                    <Text style={styles.fieldLabel}>SIC Code</Text>
                    <Text style={styles.fieldValue}>
                      {getFieldDisplayValue('sic_code')}
                    </Text>
                  </View>
                  <View style={styles.fieldContainer}>
                    <Text style={styles.fieldLabel}>Ownership</Text>
                    <Text style={styles.fieldValue}>
                      {getFieldDisplayValue('ownership')}
                    </Text>
                  </View>
                </Accordion>

                <Accordion title="Address">
                  <View style={styles.fieldContainer}>
                    <Text style={styles.fieldLabel}>Street</Text>
                    <Text style={styles.fieldValue}>
                      {getFieldDisplayValue('street')}
                    </Text>
                  </View>
                  <View style={styles.fieldContainer}>
                    <Text style={styles.fieldLabel}>City</Text>
                    <Text style={styles.fieldValue}>
                      {getFieldDisplayValue('city')}
                    </Text>
                  </View>
                  <View style={styles.fieldContainer}>
                    <Text style={styles.fieldLabel}>Postal Code</Text>
                    <Text style={styles.fieldValue}>
                      {getFieldDisplayValue('postal_code')}
                    </Text>
                  </View>
                </Accordion>

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
                    showCheckboxes={false}
                    embedded
                  />
                </Accordion>
              </View>
            )}
          </ScrollView>
        </>
      )}

      <BottomActionBar
        items={[
          {
            id: 'edit',
            icon: '✏️',
            label: 'Edit',
            onPress: handleEdit,
          },
          {
            id: 'share',
            icon: '📤',
            label: 'Share',
            onPress: () => {
              // Implement share functionality
              log.debug('Share account:', accountId);
            },
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
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  headerBack: {
    padding: 6,
    marginRight: 6,
  },
  headerTitle: {
    flex: 1,
    fontSize: FONTS.md,
    fontWeight: '600',
    color: COLORS.dark,
  },
  editButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: COLORS.primary,
    borderRadius: 6,
  },
  editButtonText: {
    color: COLORS.white,
    fontSize: FONTS.sm,
    fontWeight: '600',
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
    color: COLORS.dark,
    fontWeight: '500',
  },
  content: {
    flex: 1,
    paddingHorizontal: 12,
    marginTop: 8,
  },
  loadingContainer: {
    padding: 16,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: FONTS.sm,
    color: COLORS.gray,
  },
  errorContainer: {
    padding: 16,
    alignItems: 'center',
  },
  errorText: {
    fontSize: FONTS.sm,
    color: 'red',
    textAlign: 'center',
    marginBottom: 8,
  },
  retryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: COLORS.primary,
    borderRadius: 6,
  },
  retryText: {
    color: COLORS.white,
    fontSize: FONTS.sm,
  },
  fieldContainer: {
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: FONTS.sm,
    color: COLORS.gray,
    marginBottom: 4,
    fontWeight: '500',
  },
  fieldValue: {
    fontSize: FONTS.md,
    color: COLORS.dark,
    fontWeight: '400',
  },
  activitySummary: {
    marginVertical: 8,
    padding: 8,
    backgroundColor: COLORS.lightBackground,
    borderRadius: 6,
  },
  activitySummaryText: {
    fontSize: FONTS.sm,
    color: COLORS.gray,
  },
});

export default AccountDetailScreen;
