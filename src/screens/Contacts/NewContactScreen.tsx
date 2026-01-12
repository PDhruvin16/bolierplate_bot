import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
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
import useContactQueries from '../../hooks/useContactQueries';
import {
  NewContactScreenProps,
  SchemaField,
  SchemaOption,
  SchemaSection,
  SchemaTab,
} from './types';
import log from '../../utils/logger';
import useCommonQueries from '../../hooks/useCommonQueries';
import { ActivityAccordion, AddressAccordion } from '../../components/common';

const NewContactScreen: React.FC<NewContactScreenProps> = ({
  navigation,
  route: { params },
}) => {
  console.log('🚀 ~ NewContactScreen ~ params:', params);
  const contactId = params?.id;
  const navigationModuleId = params?.navigationModuleId;
  const { theme } = useTheme();
  const { useRecentCasesList, useEntitlementList } = useCommonQueries();
  const [activeTab, setActiveTab] = useState<string>('summary');
  const [form, setForm] = useState<Record<string, string>>({});
  const [originalForm, setOriginalForm] = useState<Record<string, string>>({});
  const [selectedRelated, setSelectedRelated] = useState<string[]>([]);
  const [relatedItems, setRelatedItems] = useState<RelatedItem[]>([]);
  const [schemaTabs, setSchemaTabs] = useState<SchemaTab[] | null>(null);
  const optionsCache = useRef<Record<string, SchemaOption[]>>({});
  const [_, forceRerender] = useState(0);
  const fetchingDetailsRef = useRef(false);

  // Contact queries hook
  const { useFormBuild, useContactDetail, useCreateContact, useUpdateContact } =
    useContactQueries();

  // Get form builder data
  const {
    data: formBuildData,
    isLoading: formBuildLoading,
    error: formBuildError,
    refetch: formBuildRefetch,
  } = useFormBuild(navigationModuleId, !!navigationModuleId);

  // Get contact details if editing existing contact
  const {
    data: contactDetails,
    isLoading: contactDetailsLoading,
    error: contactDetailsError,
    refetch: refetchContactDetails,
  } = useContactDetail(contactId || '', !!contactId);

  // Mutations
  const createContactMutation = useCreateContact();
  const updateContactMutation = useUpdateContact();

  const isEditMode = !!contactId;
  const isCreating = createContactMutation.isPending;
  const isUpdating = updateContactMutation.isPending;

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
    { id: 'recent_cases', label: 'Recent Cases', icon: '👥' },
    { id: 'entitlement', label: 'Entitlement', icon: '📝' },
  ];

  const [activeRelated, setActiveRelated] = useState('contacts');
  const {
    data: recentCasesData,
    isLoading: recentCasesLoading,
    error: recentCasesError,
    refetch: recentCasesRefetch,
  } = useRecentCasesList(params?.id, !!params?.id);

  const {
    data: entitlementData,
    isLoading: entitlementLoading,
    error: entitlementError,
    refetch: entitlementRefetch,
  } = useEntitlementList(params?.id, !!params?.id);

  useEffect(() => {
    if (params?.id && activeRelated === 'recent_cases') {
      recentCasesRefetch();
    } else if (params?.id && activeRelated === 'entitlement') {
      entitlementRefetch();
    }
  }, [params?.id, activeRelated]);

  useEffect(() => {
    // Update related items based on active tab
    if (activeRelated === 'recent_cases') {
      setRelatedItems(recentCasesData?.data || []);
    } else if (activeRelated === 'entitlement') {
      setRelatedItems(entitlementData?.data || []);
    }
  }, [recentCasesData, entitlementData, activeRelated]);

  // Form state
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

  // Load contact details for editing
  useEffect(() => {
    if (contactDetails && schemaTabs && !fetchingDetailsRef.current) {
      fetchingDetailsRef.current = true;

      try {
        const payload = contactDetails?.data || contactDetails;
        log.debug('Loading contact details for editing:', payload);

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
        setOriginalForm(initial);
        log.debug('Form initialized with contact details:', initial);
      } catch (e) {
        log.debug('Failed to load contact details', e);
      }
    }
  }, [contactDetails, schemaTabs]);

  const buildMinimalUpdatePayload = (): Record<string, any> => {
    if (!isEditMode) {
      return buildPayloadFromForm();
    }

    log.info('🔄 Building minimal update payload...');
    log.info('📥 Current form:', form);
    log.info('📋 Original form:', originalForm);

    const payload: Record<string, any> = {};

    // List of fields that can be updated
    const updateableFields = [
      'first_name',
      'last_name',
      'full_name',
      'email1',
      'email2',
      'business2_phone_number',
      'mobile_phone',
      'account',
      'title',
      'department',
      'assistant',
      'reports_to',
      'description',
      'mailing_street',
      'mailing_city',
      'mailing_state',
      'mailing_postal_code',
      'mailing_country',
      // Personal section fields
      'gender',
      'marital_status',
      'spouse_name',
      'birthday',
      'anniversary',
      'personal_notes', // Added personal notes field
      // Marketing section fields
      'originating_lead',
      'last_campaign_date',
      'marketing_materials',
      // Contact preferences fields
      'contact_method',
      'email_allowed',
      'follow_email_allowed',
      'bulk_email_allowed',
      'phone_allowed',
      // Billing section fields
      'currency',
      'credit_limit',
      'credit_hold',
      'payment_terms',
      // Shipping section fields
      'shipping_method',
      'freight_terms',
    ];

    // Only include fields that are different from original AND have values
    updateableFields.forEach(field => {
      const newValue = form[field];
      const originalValue = originalForm[field];

      if (newValue !== undefined && newValue !== originalValue) {
        payload[field] = newValue;
      }
    });

    // Special handling for status fields
    if (form.status && form.status !== originalForm.status) {
      payload.status = form.status?.value || form.status;
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
      const response = await fetch(endpoint);
      const data = await response.json();
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
      if (section.id === 'activity-panel') {
        return (
          <ActivityAccordion
            key={section.id}
            title={section.label || section.id}
            regardingObjectId={params?.id}
          />
        );
      } else if (section.id === 'address') {
        return (
          <AddressAccordion
            key={section.id}
            title={section.label || section.id}
            regardingObjectId={params?.id}
          />
        );
      } else if (section.id === 'contact' && section.label === 'RELATED') {
        return (
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
        );
      } else {
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
      if (val === 'true') val = true;
      else if (val === 'false') val = false;
      else if (typeof val === 'string' && /^\d+$/.test(val)) {
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
      log.info('Contact ID:', contactId);

      if (isEditMode && contactId) {
        const minimalPayload = buildMinimalUpdatePayload();

        log.info(
          'Minimal update payload:',
          JSON.stringify(minimalPayload, null, 2),
        );

        if (Object.keys(minimalPayload).length === 0) {
          Alert.alert('No Changes', 'No fields have been changed.');
          return;
        }

        log.info('Making UPDATE call to:', `/core/contact/${contactId}/`);

        await updateContactMutation.mutateAsync({
          id: contactId,
          data: minimalPayload,
        });

        log.info('=== DEBUG SAVE SUCCESS ===');
        navigation.goBack();
      } else {
        const createPayload = buildPayloadFromForm();
        log.info('Create payload:', JSON.stringify(createPayload, null, 2));
        log.info('Making CREATE call to:', '/core/contact/');

        await createContactMutation.mutateAsync(createPayload);
        log.info('=== DEBUG SAVE SUCCESS ===');
        navigation.goBack();
      }
    } catch (error: any) {
      log.error('=== DEBUG SAVE ERROR ===');
      log.error('Full error:', error);

      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        'Failed to save contact. Please try again.';

      Alert.alert('Error', errorMessage);
    }
  };

  // Get contact name for top card display
  const contactName = form['full_name'] || form['first_name'] || 'New Contact';
  const email = form['email1'] || '--';
  const phone = form['business2_phone_number'] || form['mobile_phone'] || '--';
  const account = form['account'] || '--';

  // Render the detailed sections as per the image
  const renderDetailsSections = () => (
    <View>
      {/* Personal Section */}
      <Accordion title="PERSONAL">
        <SelectDropdown
          label="Gender"
          options={genderOptions}
          value={form.gender || null}
          onChange={v => onChange('gender', v || '')}
          placeholder="Select Gender"
          lookup
        />
        <SelectDropdown
          label="Marital Status"
          options={maritalStatusOptions}
          value={form.marital_status || null}
          onChange={v => onChange('marital_status', v || '')}
          placeholder="Select Marital Status"
          lookup
        />
        <CustomInput
          label="Spouse/Partner Name"
          value={form.spouse_name || ''}
          onChangeText={t => onChange('spouse_name', t)}
          placeholder="Enter spouse/partner name"
        />
        <CustomInput
          label="Birthday"
          value={form.birthday || ''}
          onChangeText={t => onChange('birthday', t)}
          placeholder="MM/DD/YYYY"
        />
        <SelectDropdown
          label="Anniversary"
          options={anniversaryOptions}
          value={form.anniversary || null}
          onChange={v => onChange('anniversary', v || '')}
          placeholder="Select Anniversary"
          lookup
        />
        {/* Personal Notes Section */}
        <CustomInput
          label="Personal Notes"
          value={form.personal_notes || ''}
          onChangeText={t => onChange('personal_notes', t)}
          placeholder="Enter personal notes here..."
          multiline={true}
          numberOfLines={4}
          style={styles.personalNotesInput}
        />
      </Accordion>

      {/* Marketing Section */}
      <Accordion title="MARKETING">
        <CustomInput
          label="Originating Lead"
          value={form.originating_lead || ''}
          onChangeText={t => onChange('originating_lead', t)}
          placeholder="Enter originating lead"
        />
        <CustomInput
          label="Last Campaign Date"
          value={form.last_campaign_date || ''}
          onChangeText={t => onChange('last_campaign_date', t)}
          placeholder="MM/DD/YYYY"
        />
        <SelectDropdown
          label="Marketing Materials"
          options={marketingMaterialsOptions}
          value={form.marketing_materials || null}
          onChange={v => onChange('marketing_materials', v || '')}
          placeholder="Select option"
          lookup
        />
      </Accordion>

      {/* Contact Preferences Section */}
      <Accordion title="CONTACT PREFERENCES">
        <SelectDropdown
          label="Contact Method"
          options={contactMethodOptions}
          value={form.contact_method || null}
          onChange={v => onChange('contact_method', v || '')}
          placeholder="Select Contact Method"
          lookup
        />
        <SelectDropdown
          label="Email"
          options={allowedOptions}
          value={form.email_allowed || null}
          onChange={v => onChange('email_allowed', v || '')}
          placeholder="Select Email Preference"
          lookup
        />
        <SelectDropdown
          label="Follow Up Email"
          options={allowedOptions}
          value={form.follow_email_allowed || null}
          onChange={v => onChange('follow_email_allowed', v || '')}
          placeholder="Select Follow Up Email Preference"
          lookup
        />
        <SelectDropdown
          label="Bulk Email"
          options={allowedOptions}
          value={form.bulk_email_allowed || null}
          onChange={v => onChange('bulk_email_allowed', v || '')}
          placeholder="Select Bulk Email Preference"
          lookup
        />
        <SelectDropdown
          label="Phone"
          options={allowedOptions}
          value={form.phone_allowed || null}
          onChange={v => onChange('phone_allowed', v || '')}
          placeholder="Select Phone Preference"
          lookup
        />
      </Accordion>

      {/* Billing Section */}
      <Accordion title="BILLING">
        <SelectDropdown
          label="Currency"
          options={currencyOptions}
          value={form.currency || null}
          onChange={v => onChange('currency', v || '')}
          placeholder="Select Currency"
          lookup
        />
        <CustomInput
          label="Credit Limit"
          value={form.credit_limit || ''}
          onChangeText={t => onChange('credit_limit', t)}
          placeholder="$0.00"
          keyboardType="numeric"
        />
        <View style={styles.creditHoldContainer}>
          <Text style={styles.creditHoldLabel}>Credit Hold</Text>
          <View style={styles.creditHoldValueContainer}>
            <Text style={styles.creditHoldValue}>No</Text>
          </View>
        </View>
        <SelectDropdown
          label="Payment Terms"
          options={paymentTermsOptions}
          value={form.payment_terms || null}
          onChange={v => onChange('payment_terms', v || '')}
          placeholder="Select Payment Terms"
          lookup
        />
      </Accordion>

      {/* Shipping Section */}
      <Accordion title="SHIPPING">
        <SelectDropdown
          label="Shipping Method"
          options={shippingMethodOptions}
          value={form.shipping_method || null}
          onChange={v => onChange('shipping_method', v || '')}
          placeholder="Select Shipping Method"
          lookup
        />
        <SelectDropdown
          label="Freight Terms"
          options={freightTermsOptions}
          value={form.freight_terms || null}
          onChange={v => onChange('freight_terms', v || '')}
          placeholder="Select Freight Terms"
          lookup
        />
      </Accordion>
    </View>
  );

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
          {isEditMode ? 'Edit Contact' : 'New Contact'}
        </Text>
      </View>

      {/* Top summary card */}
      <View style={themedStyles.topCard}>
        <Text style={styles.topCardTitle}>
          {isEditMode ? contactName : 'New Contact'}
        </Text>
        <View style={styles.topRow}>
          <View style={styles.topCol}>
            <Text style={styles.topLabel}>Email</Text>
            <Text style={styles.topValue}>{email}</Text>
          </View>
          <View style={styles.topCol}>
            <Text style={styles.topLabel}>Phone</Text>
            <Text style={styles.topValue}>{phone}</Text>
          </View>
        </View>
        <View style={styles.topRow}>
          <View style={styles.topCol}>
            <Text style={styles.topLabel}>Account Name</Text>
            <Text style={styles.topValue}>{account}</Text>
          </View>
        </View>
      </View>

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
            {/* <Accordion title="Related">
              <RelatedSection
                tabs={relatedTabs}
                activeTab={activeRelated}
                items={relatedItems}
                searchPlaceholder="Search related..."
                onTabChange={setActiveRelated}
                onItemSelect={handleRelatedSelect}
                showCheckboxes={false}
                embedded
              />
            </Accordion> */}
          </View>
        ) : (
          <View>
            {activeTab === 'summary' ? (
              // Original summary sections
              <>
                <Accordion title="General Information">
                  <CustomInput
                    label="First Name"
                    value={form.first_name || ''}
                    onChangeText={t => onChange('first_name', t)}
                    placeholder="First Name"
                  />
                  <CustomInput
                    label="Last Name"
                    value={form.last_name || ''}
                    onChangeText={t => onChange('last_name', t)}
                    placeholder="Last Name"
                  />
                  <CustomInput
                    label="Email"
                    value={form.email1 || ''}
                    onChangeText={t => onChange('email1', t)}
                    placeholder="Email"
                    keyboardType="email-address"
                  />
                  <CustomInput
                    label="Phone"
                    value={form.business2_phone_number || ''}
                    onChangeText={t => onChange('business2_phone_number', t)}
                    placeholder="Phone"
                    keyboardType="phone-pad"
                  />
                  <SelectDropdown
                    label="Account"
                    options={accountOptions}
                    value={form.account || null}
                    onChange={v => onChange('account', v || '')}
                    placeholder="Select Account"
                    lookup
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
                    showCheckboxes={false}
                    embedded
                  />
                </Accordion>

                <Accordion title="Address">
                  <CustomInput
                    label="Street"
                    value={form.mailing_street || ''}
                    onChangeText={t => onChange('mailing_street', t)}
                    placeholder="Street"
                  />
                  <CustomInput
                    label="City"
                    value={form.mailing_city || ''}
                    onChangeText={t => onChange('mailing_city', t)}
                    placeholder="City"
                  />
                  <CustomInput
                    label="Postal Code"
                    value={form.mailing_postal_code || ''}
                    onChangeText={t => onChange('mailing_postal_code', t)}
                    placeholder="Postal Code"
                  />
                </Accordion>
              </>
            ) : (
              // Details tab with the new sections from the image
              renderDetailsSections()
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
    color: COLORS.dark,
    fontWeight: '500',
  },
  content: {
    flex: 1,
    paddingHorizontal: 12,
    marginTop: 8,
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
  contactPreferencesContainer: {
    marginVertical: 8,
  },
  contactPreferencesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  contactPreferencesLabel: {
    fontSize: FONTS.sm,
    color: COLORS.dark,
    flex: 1,
  },
  contactPreferencesValue: {
    fontSize: FONTS.sm,
    color: COLORS.gray,
    fontWeight: '500',
  },
  creditHoldContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  creditHoldLabel: {
    fontSize: FONTS.sm,
    color: COLORS.dark,
    fontWeight: '500',
  },
  creditHoldValueContainer: {
    backgroundColor: COLORS.lightBackground,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  creditHoldValue: {
    fontSize: FONTS.sm,
    color: COLORS.dark,
    fontWeight: '500',
  },
  personalNotesInput: {
    minHeight: 80, // Give it more height for multiline text
    textAlignVertical: 'top', // Start text from top on Android
  },
});

export default NewContactScreen;

// Options for dropdowns
const accountOptions: SelectOption[] = [
  { id: '1', label: 'Acme Corporation' },
  { id: '2', label: 'Tech Solutions Inc' },
  { id: '3', label: 'Global Services Ltd' },
];

const genderOptions: SelectOption[] = [
  { id: 'male', label: 'Male' },
  { id: 'female', label: 'Female' },
  { id: 'other', label: 'Other' },
];

const maritalStatusOptions: SelectOption[] = [
  { id: 'single', label: 'Single' },
  { id: 'married', label: 'Married' },
  { id: 'divorced', label: 'Divorced' },
  { id: 'widowed', label: 'Widowed' },
];

const anniversaryOptions: SelectOption[] = [
  { id: '1', label: 'Select' },
  { id: '2', label: 'Wedding Anniversary' },
  { id: '3', label: 'Work Anniversary' },
];

const marketingMaterialsOptions: SelectOption[] = [
  { id: 'send', label: 'Send' },
  { id: 'dont_send', label: "Don't Send" },
];

const currencyOptions: SelectOption[] = [
  { id: 'usd', label: 'USD' },
  { id: 'eur', label: 'EUR' },
  { id: 'gbp', label: 'GBP' },
  { id: 'jpy', label: 'JPY' },
];

const paymentTermsOptions: SelectOption[] = [
  { id: 'net_15', label: 'Net 15' },
  { id: 'net_30', label: 'Net 30' },
  { id: 'net_45', label: 'Net 45' },
  { id: 'net_60', label: 'Net 60' },
];

const shippingMethodOptions: SelectOption[] = [
  { id: 'standard', label: 'Standard' },
  { id: 'express', label: 'Express' },
  { id: 'overnight', label: 'Overnight' },
  { id: 'pickup', label: 'Pickup' },
];

const freightTermsOptions: SelectOption[] = [
  { id: 'prepaid', label: 'Prepaid' },
  { id: 'collect', label: 'Collect' },
  { id: 'third_party', label: 'Third Party' },
];
const contactMethodOptions: SelectOption[] = [
  { id: 'any', label: 'Any' },
  { id: 'whatsapp', label: 'WhatsApp' },
  { id: 'email', label: 'Email' },
  { id: 'phone', label: 'Phone' },
];

const allowedOptions: SelectOption[] = [
  { id: 'allow', label: 'Allow' },
  { id: 'not_allow', label: 'Not Allow' },
];
