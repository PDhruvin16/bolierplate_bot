import React, { useEffect, useMemo, useRef, useState } from 'react';
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
import useAccountQueries from '../../hooks/useAccountQueries';
import {
  NewAccountScreenProps,
  SchemaField,
  SchemaOption,
  SchemaSection,
  SchemaTab,
} from './types';
import axiosClient from '../../api/axiosClient';
import log from '../../utils/logger';

const NewAccountScreen: React.FC<NewAccountScreenProps> = ({
  navigation,
  route: { params },
}) => {
  const accountId = params?.id; // Account ID for editing existing account
  const navigationModuleId = params?.navigationModuleId;
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState<string>('summary');
  const [form, setForm] = useState<Record<string, string>>({});
  const [originalForm, setOriginalForm] = useState<Record<string, string>>({}); // Store original data for comparison
  const [selectedRelated, setSelectedRelated] = useState<string[]>([]);
  const [schemaTabs, setSchemaTabs] = useState<SchemaTab[] | null>(null);
  const optionsCache = useRef<Record<string, SchemaOption[]>>({});
  const [_, forceRerender] = useState(0);
  const fetchingDetailsRef = useRef(false);

  // Account queries hook
  const { useFormBuild, useAccountDetail, useCreateAccount, useUpdateAccount } =
    useAccountQueries();

  // Get form builder data
  const {
    data: formBuildData,
    isLoading: formBuildLoading,
    error: formBuildError,
    refetch: formBuildRefetch,
  } = useFormBuild(navigationModuleId, !!navigationModuleId);

  // Get account details if editing existing account
  const {
    data: accountDetails,
    isLoading: accountDetailsLoading,
    error: accountDetailsError,
    refetch: refetchAccountDetails,
  } = useAccountDetail(accountId || '', !!accountId);

  // Mutations
  const createAccountMutation = useCreateAccount();
  const updateAccountMutation = useUpdateAccount();

  const isEditMode = !!accountId;
  const isCreating = createAccountMutation.isPending;
  const isUpdating = updateAccountMutation.isPending;

  const setOptionsForField = (fieldId: string, options: SchemaOption[]) => {
    optionsCache.current[fieldId] = options;
    forceRerender(x => x + 1);
  };

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

  // Form state handler
  const onChange = (key: string, value: string) =>
    setForm(prev => ({ ...prev, [key]: value }));

  // Selection handling for RelatedSection checkboxes
  const handleRelatedSelect = (item: RelatedItem) => {
    setSelectedRelated(prev =>
      prev.includes(item.id)
        ? prev.filter(id => id !== item.id)
        : [...prev, item.id],
    );
  };

  // Fetch form builder data when navigationModuleId changes
  useEffect(() => {
    if (navigationModuleId && formBuildRefetch) {
      formBuildRefetch();
    }
  }, [navigationModuleId, formBuildRefetch]);

  // Process form builder data
  useEffect(() => {
    if (formBuildData) {
      fetchTabs(formBuildData);
    }
  }, [formBuildData]);

  // Load account details for editing
  useEffect(() => {
    if (accountDetails && schemaTabs && !fetchingDetailsRef.current) {
      fetchingDetailsRef.current = true;

      try {
        const payload = accountDetails?.data || accountDetails;
        log.debug('Loading account details for editing:', payload);

        // Collect keys from schema to map values
        const keys: string[] = [];
        schemaTabs.forEach(t => {
          t.sections?.forEach(s => {
            s.fields?.forEach(f => {
              const k = f.metadataKey || f.name;
              if (k && !keys.includes(k)) keys.push(k);
            });
          });
        });

        const initial: Record<string, any> = {};
        keys.forEach(k => {
          const val = payload?.[k];
          if (val && typeof val === 'object') {
            if (Array.isArray(val)) {
              initial[k] = val;
            } else if (val?.id != null) {
              initial[k] = String(val.id);
            } else if (val?.value != null) {
              initial[k] = String(val.value);
            } else {
              initial[k] = '';
            }
          } else if (typeof val === 'number') {
            initial[k] = String(val);
          } else if (typeof val === 'boolean') {
            initial[k] = val ? 'true' : 'false';
          } else {
            initial[k] = val ?? '';
          }
        });

        setForm(initial);
        setOriginalForm(initial); // Store original data for comparison
        log.debug('Form initialized with account details:', initial);
      } catch (e) {
        log.debug('Failed to load account details', e);
      }
    }
  }, [accountDetails, schemaTabs]);

  // Minimal data transformation - ONLY include fields that are being updated
  const buildMinimalUpdatePayload = (): Record<string, any> => {
    if (!isEditMode) {
      // For create, send all form data
      return buildPayloadFromForm();
    }

    log.info('🔄 Building minimal update payload...');
    log.info('📥 Current form:', form);
    log.info('📋 Original form:', originalForm);

    const payload: Record<string, any> = {};

    // List of fields that can be updated
    const updateableFields = [
      'name',
      'description',
      'account_number',
      'email1',
      'email2',
      'phone_number1',
      'phone_number2',
      'website',
      'number_of_employees',
      'industry',
      'ownership',
      'sic_code',
      'revenue',
      'credit_limit',
      'annual_revenue',
      'numEmployees',
      'phone',
      'primaryContact',
      'parentAccount',
      'email',
      'street',
      'city',
      'postal',
    ];

    // Only include fields that are different from original AND have values
    updateableFields.forEach(field => {
      const newValue = form[field];
      const originalValue = originalForm[field];

      // Only include if the value has changed AND is not empty (unless it's explicitly set to null/empty)
      if (newValue !== undefined && newValue !== originalValue) {
        if (field === 'number_of_employees' || field === 'numEmployees') {
          payload[field === 'numEmployees' ? 'number_of_employees' : field] =
            parseInt(newValue) || 0;
        } else {
          payload[field] = newValue;
        }
      }
    });

    // Special handling for status fields - only include if they're being updated
    if (form.status && form.status !== originalForm.status) {
      // Send only the value, not the object
      payload.status = form.status.value || form.status;
    }

    if (
      form.status_reason &&
      form.status_reason !== originalForm.status_reason
    ) {
      // Send only the value, not the object
      payload.status_reason = form.status_reason.value || form.status_reason;
    }

    log.info('📤 Minimal update payload (only changed fields):', payload);
    return payload;
  };

  const collectApiDropdownFields = (tabs: SchemaTab[]): SchemaField[] => {
    const fields: SchemaField[] = [];
    tabs.forEach(t => {
      t.sections?.forEach(s => {
        s.fields?.forEach(f => {
          if (
            f.type === 'dropdown' &&
            f.optionsConfig &&
            f.optionsConfig.type === 'api' &&
            f.optionsConfig.endpoint
          ) {
            fields.push(f);
          }
        });
      });
    });
    return fields;
  };

  const fetchOptionsForField = async (field: SchemaField) => {
    if (!field.optionsConfig || field.optionsConfig.type !== 'api') return;
    const endpoint = field.optionsConfig.endpoint || '';
    try {
      const data = await axiosClient.get<any>(endpoint);
      const labelKey = field.optionsConfig.labelKey || 'label';
      const valueKey = field.optionsConfig.valueKey || 'id';
      const items = Array.isArray(data?.results || data)
        ? data.results || data
        : [];
      const options: SchemaOption[] = items.map((it: any) => ({
        id: it[valueKey],
        label: it[labelKey],
      }));
      setOptionsForField(field.id, options);
    } catch (e) {
      // leave empty options on error
      setOptionsForField(field.id, []);
    }
  };

  const fetchTabs = (formBuildData: any) => {
    const tabs: SchemaTab[] =
      (formBuildData as any)?.data?.tabs ||
      (formBuildData as any)?.data?.data ||
      [];

    if (!tabs || tabs.length === 0) {
      setSchemaTabs([]);
      return;
    }

    setSchemaTabs(tabs);
    setActiveTab(tabs[0]?.id || 'summary');

    const apiFields = collectApiDropdownFields(tabs);
    Promise.all(apiFields.map(f => fetchOptionsForField(f)));
  };

  const renderField = (field: SchemaField) => {
    if (field.hidden) return null;
    const key = field.metadataKey || field.name;
    const commonProps = {
      label: field.label || key,
      value: form[key] ?? '',
      onChangeText: (t: string) => onChange(key, t),
      placeholder: field.placeholder || '',
      required: field.validation?.required || false,
    } as any;

    switch (field.type) {
      case 'text':
      case 'email':
      case 'url':
      case 'textarea':
        return (
          <CustomInput
            key={field.id}
            {...commonProps}
            keyboardType={field.type === 'email' ? 'email-address' : undefined}
            multiline={field.type === 'textarea'}
          />
        );
      case 'tel':
        return (
          <CustomInput
            key={field.id}
            {...commonProps}
            keyboardType="phone-pad"
          />
        );
      case 'date':
        return (
          <CustomInput
            key={field.id}
            {...commonProps}
            placeholder={field.placeholder || 'YYYY-MM-DD'}
          />
        );
      case 'dropdown': {
        let options: SelectOption[] = [];
        const cfg = field.optionsConfig;
        if (cfg?.type === 'static' && Array.isArray(cfg.options)) {
          options = (cfg.options as any[]).map((opt: any, idx: number) => {
            if (typeof opt === 'string')
              return { id: String(opt), label: String(opt) };
            const label = opt[cfg.labelKey || 'label'] ?? String(opt);
            const id = opt[cfg.valueKey || 'value'] ?? idx;
            return { id: String(id), label };
          });
        } else if (cfg?.type === 'api') {
          const cached = optionsCache.current[field.id] || [];
          options = cached.map(opt => ({
            id: String(opt.id),
            label: opt.label,
          }));
        }
        return (
          <SelectDropdown
            key={field.id}
            options={options}
            value={form[key] ?? null}
            onChange={(v: any) => onChange(key, v ? String(v) : '')}
            placeholder={field.label || key}
            lookup={true}
          />
        );
      }
      default:
        return <CustomInput key={field.id} {...commonProps} />;
    }
  };

  const renderSection = (section: SchemaSection) => {
    if (section.type === 'custom-component') {
      // Minimal placeholders for custom components
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
        {section.fields?.map(renderField)}
      </Accordion>
    );
  };

  const activeSchemaTab = useMemo(() => {
    return schemaTabs?.find(t => t.id === activeTab) || null;
  }, [schemaTabs, activeTab]);

  const buildPayloadFromForm = (): Record<string, any> => {
    if (!schemaTabs) return {};
    const keys: string[] = [];
    schemaTabs.forEach(t => {
      t.sections?.forEach(s => {
        s.fields?.forEach(f => {
          const k = f.metadataKey || f.name;
          if (k && !keys.includes(k)) keys.push(k);
        });
      });
    });

    const payload: Record<string, any> = {};
    keys.forEach(k => {
      let val: any = form[k];
      // normalize simple string booleans and numbers if needed
      if (val === 'true') val = true;
      else if (val === 'false') val = false;
      else if (typeof val === 'string' && /^\d+$/.test(val)) {
        // keep numeric ids as numbers when appropriate for dropdowns
        val = Number(val);
      }
      payload[k] = val;
    });

    // Add full_name (if first_name or last_name exist in form)
    const firstName = form['first_name'] || '';
    const lastName = form['last_name'] || '';
    if (firstName || lastName) {
      payload['full_name'] = `${firstName} ${lastName}`.trim();
    }

    return payload;
  };

  const handleSave = async () => {
    try {
      log.info('=== DEBUG SAVE START ===');
      log.info('Edit Mode:', isEditMode);
      log.info('Account ID:', accountId);

      if (isEditMode && accountId) {
        // For UPDATE: Use minimal payload with only changed fields
        const minimalPayload = buildMinimalUpdatePayload();

        log.info(
          'Minimal update payload:',
          JSON.stringify(minimalPayload, null, 2),
        );

        // Check if there are any fields to update
        if (Object.keys(minimalPayload).length === 0) {
          // Alert.alert('No Changes', 'No fields have been changed.');
          return;
        }

        log.info('Making UPDATE call to:', `/core/account/${accountId}/`);

        // Use the mutation with minimal payload
        await updateAccountMutation.mutateAsync({
          id: accountId,
          data: minimalPayload,
          originalData: originalForm,
        });

        log.info('=== DEBUG SAVE SUCCESS ===');
        navigation.goBack();
      } else {
        // For CREATE: Send all form data
        const createPayload = buildPayloadFromForm();
        log.info('Create payload:', JSON.stringify(createPayload, null, 2));
        log.info('Making CREATE call to:', '/core/account/');

        await createAccountMutation.mutateAsync(createPayload);
        log.info('=== DEBUG SAVE SUCCESS ===');
        navigation.goBack();
      }
    } catch (error: any) {
      log.error('=== DEBUG SAVE ERROR ===');
      log.error('Full error:', error);
      log.error('Error URL:', error.config?.url);
      log.error('Error method:', error.config?.method);
      log.error('=== END DEBUG ===');

      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        'Failed to save account. Please try again.';

      // Alert.alert('Error', errorMessage);
    }
  };

  // Get account name for top card display
  const accountName = form['name'] || form['account_name'] || 'New Account';
  const annualRevenue = form['annual_revenue'] || form['revenue'] || '--';
  const numEmployees =
    form['number_of_employees'] || form['numEmployees'] || '--';
  const owner = form['owner'] || '--';

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
        <Text style={themedStyles.headerTitle}>
          {isEditMode ? 'Edit Account' : 'New Account'}
        </Text>
      </View>

      {/* Top summary card */}
      <View style={themedStyles.topCard}>
        <Text style={styles.topCardTitle}>
          {isEditMode ? accountName : 'New Account'}
        </Text>
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
        <View style={{ padding: 16 }}>
          <Text style={{ color: COLORS.gray }}>
            {formBuildLoading
              ? 'Loading form...'
              : 'Loading account details...'}
          </Text>
        </View>
      )}

      {/* Error states */}
      {formBuildError && (
        <View style={{ padding: 16 }}>
          <Text style={{ color: 'red' }}>
            Failed to load form: {formBuildError.message}
          </Text>
        </View>
      )}

      {accountDetailsError && (
        <View style={{ padding: 16 }}>
          <Text style={{ color: 'red' }}>
            Failed to load account details: {accountDetailsError.message}
          </Text>
        </View>
      )}

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
            {activeTab === 'details' ? (
              <Accordion title="Company Profile">
                <SelectDropdown
                  label="Industry"
                  options={industryOptions}
                  value={form.industry || null}
                  onChange={v => onChange('industry', v || '')}
                  placeholder="Industry"
                  lookup
                />
                <CustomInput
                  label="SIC Code"
                  value={form.sicCode || ''}
                  onChangeText={t => onChange('sicCode', t)}
                  placeholder="SIC Code"
                />
                <SelectDropdown
                  label="Ownership"
                  options={ownershipOptions}
                  value={form.ownership || null}
                  onChange={v => onChange('ownership', v || '')}
                  placeholder="Ownership"
                  lookup
                />
                <SelectDropdown
                  label="Contact Method"
                  options={contactMethodOptions}
                  value={form.contactMethod || null}
                  onChange={v => onChange('contactMethod', v || '')}
                  placeholder="Contact Method"
                  lookup
                />
              </Accordion>
            ) : (
              <>
                {activeSchemaTab.sections?.map(renderSection)}
                {/* Related section kept below for convenience */}
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
                    onAdd={() => {
                      console.log('Add button pressed');
                    }}
                  />
                </Accordion>
              </>
            )}
          </View>
        ) : (
          <View>
            {activeTab === 'details' ? (
              <Accordion title="Company Profile">
                <SelectDropdown
                  label="Industry"
                  options={industryOptions}
                  value={form.industry || null}
                  onChange={v => onChange('industry', v || '')}
                  placeholder="Industry"
                  lookup
                />
                <CustomInput
                  label="SIC Code"
                  value={form.sicCode || ''}
                  onChangeText={t => onChange('sicCode', t)}
                  placeholder="SIC Code"
                />
                <SelectDropdown
                  label="Ownership"
                  options={ownershipOptions}
                  value={form.ownership || null}
                  onChange={v => onChange('ownership', v || '')}
                  placeholder="Ownership"
                  lookup
                />
                <SelectDropdown
                  label="Contact Method"
                  options={contactMethodOptions}
                  value={form.contactMethod || null}
                  onChange={v => onChange('contactMethod', v || '')}
                  placeholder="Contact Method"
                  lookup
                />
              </Accordion>
            ) : (
              <>
                <Accordion title="Account Information">
                  <CustomInput
                    label="Account Name"
                    value={form.name || ''}
                    onChangeText={t => onChange('name', t)}
                    placeholder="Account Name"
                  />
                  <CustomInput
                    label="Annual Revenue"
                    value={form.annualRevenue || ''}
                    onChangeText={t => onChange('annualRevenue', t)}
                    placeholder="Annual Revenue"
                  />
                  <CustomInput
                    label="Number of Employees"
                    value={form.numEmployees || ''}
                    onChangeText={t => onChange('numEmployees', t)}
                    placeholder="Number of Employees"
                  />
                  <CustomInput
                    label="Phone"
                    value={form.phone || ''}
                    onChangeText={t => onChange('phone', t)}
                    placeholder="Phone"
                    keyboardType="phone-pad"
                  />
                  <CustomInput
                    label="Primary Contact"
                    value={form.primaryContact || ''}
                    onChangeText={t => onChange('primaryContact', t)}
                    placeholder="Primary Contact"
                  />
                  <CustomInput
                    label="Parent Account"
                    value={form.parentAccount || ''}
                    onChangeText={t => onChange('parentAccount', t)}
                    placeholder="Parent Account"
                  />
                  <CustomInput
                    label="Email"
                    value={form.email || ''}
                    onChangeText={t => onChange('email', t)}
                    placeholder="Email"
                    keyboardType="email-address"
                  />
                </Accordion>

                <Accordion title="Activity">
                  <View style={{ alignItems: 'center' }}>
                    <Text style={{ fontWeight: 'bold' }}>
                      {isEditMode ? 'Account Activity' : 'Almost there'}
                    </Text>
                    <Text>
                      {isEditMode
                        ? 'Activity data will be loaded here'
                        : 'Select Save to see your activity'}
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
                    showCheckboxes
                    embedded
                  />
                </Accordion>

                <Accordion title="Address">
                  <SelectDropdown
                    options={addressDropdownOptions}
                    value={form.address || null}
                    onChange={v => onChange('address', v || '')}
                    placeholder="Address"
                    lookup
                  />
                  <View style={styles.addressSummary}>
                    <Text style={styles.addressSummaryText}>
                      Select Sendisky Square
                    </Text>
                  </View>
                  <CustomInput
                    label="Street"
                    value={form.street || ''}
                    onChangeText={t => onChange('street', t)}
                    placeholder="Street"
                  />
                  <CustomInput
                    label="City"
                    value={form.city || ''}
                    onChangeText={t => onChange('city', t)}
                    placeholder="City"
                  />
                  <CustomInput
                    label="Postal Code"
                    value={form.postal || ''}
                    onChangeText={t => onChange('postal', t)}
                    placeholder="Postal code"
                    keyboardType="number-pad"
                  />
                </Accordion>
              </>
            )}
          </View>
        )}
      </ScrollView>

      <BottomActionBar
        items={[
          {
            id: 'save',
            icon: '💾',
            label: isCreating || isUpdating ? 'Saving...' : 'Save',
            onPress: handleSave,
            disabled: isCreating || isUpdating,
          },
          {
            id: 'saveClose',
            icon: '🗂️',
            label: 'Save and Close',
            onPress: () => {},
            disabled: isCreating || isUpdating,
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
  placeholderText: {
    fontSize: FONTS.sm,
    color: COLORS.gray,
  },
  contactCard: {
    backgroundColor: COLORS.lightBackground,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  contactName: {
    fontSize: FONTS.md,
    fontWeight: 'bold',
    color: COLORS.dark,
    marginBottom: 4,
  },
  contactEmail: {
    fontSize: FONTS.sm,
    color: COLORS.gray,
    marginBottom: 2,
  },
  contactPhone: {
    fontSize: FONTS.sm,
    color: COLORS.gray,
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
  addressSummary: {
    marginVertical: 8,
    padding: 8,
    backgroundColor: COLORS.lightBackground,
    borderRadius: 6,
  },
  addressSummaryText: {
    fontSize: FONTS.sm,
    color: COLORS.gray,
  },
});

export default NewAccountScreen;

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

const addressDropdownOptions: SelectOption[] = [
  { id: 'sendisky1', label: 'Sendisky Square' },
  { id: 'sendisky2', label: 'Sendisky Square 2' },
];
