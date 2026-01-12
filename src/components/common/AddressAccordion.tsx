import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import Accordion from './Accordion';
import { COLORS, useTheme } from '../../context/ThemeContext';
import { FONTS } from '../../constants/fonts';
import { renderLogo } from '../../utils/renderlogo';
import icons from '../../constants/icons';
import useContactQueries from '../../hooks/useContactQueries';
import ActionSheet, { ActionItem } from './ActionSheet';
import log from '../../utils/logger';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

type AddressAccordionProps = {
  title?: string;
  initiallyExpanded?: boolean;
  regardingObjectId?: string;
  pageSize?: number;
  onAddSelected?: (ids: string[]) => void;
  onEditSelected?: (ids: string[]) => void;
};

interface AddressItem {
  city: string | null;
  contact_name: string | null;
  country: string | null;
  created_on_behalf_by: string | null;
  currency: string | null;
  exchange_rate: string | null;
  full_address: string | null;
  id: string;
  import_sequence_number: number;
  latitude: string | null;
  longitude: string | null;
  name: string | null;
  object_type: string | null;
  owner: string | null;
  owning_team: string | null;
  pincode: string | null;
  shipping_method: string | null;
  state: string | null;
  street_1: string | null;
  street_2: string | null;
  telephone1: string | null;
  telephone2: string | null;
  time_zone_rule_version_number: number | null;
  type: {
    value: number;
    label: string;
  } | null;
  updated_on_behalf_by: string | null;
  utc_conversion_tome_zone: string | null;
  version_number: number | null;
}

const AddressAccordion: React.FC<AddressAccordionProps> = ({
  title = 'Address',
  initiallyExpanded = false,
  regardingObjectId,
  pageSize = 10,
}) => {
  const { theme } = useTheme();
  const [actionSheetVisible, setActionSheetVisible] = useState(false);
  const [moreSheetVisible, setMoreSheetVisible] = useState(false);
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const isDark = theme === 'dark';

  const { useAddressFilter, deleteAddress } = useContactQueries();
  const { data, isLoading, isError, refetch } = useAddressFilter(
    regardingObjectId as string,
  );
  console.log('🚀 ~ AddressAccordion ~ data:', data);

  // Expected shape: { data: Address[] }
  const items = (data as any) ? (data.address as any) : ([] as any[]);
  console.log('🚀 ~ AddressAccordion ~ items:', items);

  const Themed = {
    placeholderTitle: {
      color: isDark ? COLORS.white : COLORS.dark,
    },
    placeholderSub: {
      color: isDark ? COLORS.gray : COLORS.gray,
    },
  } as const;

  const anySelected = selectedIds.length > 0;

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => {
      const exists = prev.includes(id);
      const next = exists ? prev.filter(x => x !== id) : [...prev, id];
      setSelectionMode(next.length > 0);
      return next;
    });
  };

  const clearSelection = () => {
    setSelectedIds([]);
    setSelectionMode(false);
  };

  const onNew = () => {
    clearSelection();
    // NavigationService.navigate('NewAddress', { contactId: regardingObjectId });
  };

  const onEditSelected = async (Ids: string[]) => {
    try {
      setActionSheetVisible(true);
    } catch (error) {
      console.log('🚀 ~ onEditSelected ~ error:', error);
    }
  };

  const onDeleteSelected = async (Ids: string[]) => {
    try {
      await deleteAddress(Ids);
      await refetch();
    } catch (error) {
      console.log('🚀 ~ onDeleteSelected ~ error:', error);
    }
  };

  const handleContactMenu = useCallback((contact: AddressItem) => {
    log.debug('🚀 ~ AddressAccordion ~ contact:', contact);
    setMoreSheetVisible(true);
    setSelectedIds([contact.id]);
  }, []);

  const moreActionItems: ActionItem[] = [
    {
      id: 'excel' as const,
      label: 'Excel Templates',
      icon: (
        <MaterialCommunityIcons name="pencil-outline" size={22} color="#333" />
      ),
      onPress: () => {
        // handleDownloadTemplate();
      },
    },
    {
      id: 'edit' as const,
      label: 'Edit',
      icon: (
        <MaterialCommunityIcons name="pencil-outline" size={22} color="#333" />
      ),
      onPress: () => {
        // handleEditContacts();
      },
    },
    {
      id: 'activate' as const,
      label: 'Activate',
      icon: (
        <MaterialCommunityIcons
          name="contact-switch-outline"
          size={22}
          color="#333"
        />
      ),
      onPress: () => {
        // handleActivate();
      },
    },
    {
      id: 'deactivate' as const,
      label: 'Deactivate',
      icon: (
        <MaterialCommunityIcons
          name="contact-switch-outline"
          size={22}
          color="#333"
        />
      ),
      onPress: () => {
        // handleDeactivate();
      },
    },
    {
      id: 'assign' as const,
      label: 'Assign',
      icon: (
        <MaterialCommunityIcons
          name="contact-switch-outline"
          size={22}
          color="#333"
        />
      ),
      onPress: () => {
        log.debug('Assign');
        // setShowAssignModal(true);
      },
    },
    {
      id: 'share' as const,
      label: 'Share',
      icon: (
        <MaterialCommunityIcons name="share-variant" size={22} color="#333" />
      ),
      onPress: () => {
        log.debug('Share');
        // setShowShareBottom(true);
      },
    },
  ];

  const renderItem = ({ item }: { item: any }) => {
    const title: string =
      item?.address_line_1 || item?.line1 || item?.name || 'Unknown address';
    const subtitle: string = item?.city || item?.state || item?.country || '';
    const id: string = item?.id || `${title}-${subtitle}`;

    return (
      <View style={styles.listRow} onStartShouldSetResponder={() => true}>
        {selectionMode ? (
          <View style={styles.checkboxWrap}>
            <View
              style={[
                styles.checkbox,
                selectedIds.includes(id) && styles.checkboxChecked,
              ]}
            >
              {selectedIds.includes(id) &&
                renderLogo(icons.check, { width: 12, height: 12 })}
            </View>
          </View>
        ) : null}
        <View style={{ flex: 1 }}>
          <Text style={styles.addrTitle} numberOfLines={1}>
            {title}
          </Text>
          {!!subtitle && (
            <Text style={styles.addrSubtitle} numberOfLines={1}>
              {subtitle}
            </Text>
          )}
        </View>
        <TouchableOpacity onPress={() => handleContactMenu(item)}>
          {renderLogo(icons.ic_dots, { width: 18, height: 18 })}
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <>
      <Accordion title={title} initiallyExpanded={initiallyExpanded}>
        {!regardingObjectId && items.length === 0 ? (
          <View style={styles.placeholder}>
            <Text style={[styles.placeholderTitle, Themed.placeholderTitle]}>
              Almost there
            </Text>
            <Text style={[styles.placeholderSub, Themed.placeholderSub]}>
              Select Save to see your activity.
            </Text>
          </View>
        ) : isLoading ? (
          <View style={styles.loaderWrap}>
            <ActivityIndicator color={COLORS.primary} />
          </View>
        ) : isError ? (
          <Text style={styles.error}>Failed to load activities.</Text>
        ) : items.length === 0 ? (
          <Text style={styles.empty}>No recent activities.</Text>
        ) : (
          <>
            <View style={styles.headerRowWrap}>
              <Text style={styles.sectionHeader}>Address</Text>
              <View style={{ flex: 1 }} />
                <View style={styles.actionsInline}>
                  <TouchableOpacity
                    style={styles.headerBtn}
                    onPress={() => {
                      onNew();
                    }}
                  >
                    {renderLogo(icons.ic_Newadd, { width: 16, height: 16 })}
                    <Text style={styles.headerBtnText}>New</Text>
                  </TouchableOpacity>
                </View>
            </View>
            <FlatList
              data={items}
              keyExtractor={(it: any, idx) => String(it?.id ?? idx)}
              renderItem={renderItem}
              ItemSeparatorComponent={() => <View style={styles.itemDivider} />}
              contentContainerStyle={{ paddingTop: 4, paddingBottom: 4 }}
            />
          </>
        )}
      </Accordion>
      <ActionSheet
        visible={actionSheetVisible}
        onClose={() => setActionSheetVisible(false)}
        items={[]}
      >
        <ScrollView style={{ padding: 16 }}>
          {/* Address Form Fields */}
          <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 12 }}>
            Add Address
          </Text>

          <Text style={styles.label}>Address Name *</Text>

          {/* Save / Cancel Buttons */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-end',
              marginTop: 20,
            }}
          >
            <TouchableOpacity
              onPress={() => setActionSheetVisible(false)}
              style={[styles.button, styles.cancelButton]}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => console.log('Save Address')}
              style={[styles.button, styles.saveButton]}
            >
              <Text style={[styles.buttonText, { color: '#fff' }]}>Save</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </ActionSheet>

      <ActionSheet
        visible={moreSheetVisible}
        onClose={() => setMoreSheetVisible(false)}
        items={moreActionItems}
      />
    </>
  );
};

const styles = StyleSheet.create({
  placeholder: {
    paddingVertical: 24,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  placeholderTitle: {
    fontSize: FONTS.md,
    fontWeight: '600',
  },
  placeholderSub: {
    fontSize: FONTS.sm,
  },
  loaderWrap: {
    paddingVertical: 16,
  },
  error: {
    color: COLORS.error,
    paddingVertical: 8,
  },
  empty: {
    color: COLORS.gray,
    paddingVertical: 8,
  },
  sectionHeader: {
    marginTop: 4,
    marginBottom: 8,
    fontSize: FONTS.md,
    fontWeight: '600',
    color: COLORS.dark,
  },
  card: {
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    backgroundColor: COLORS.white,
  },
  headerRowWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  listRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  checkboxWrap: {
    marginRight: 8,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: COLORS.gray,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  addrTitle: {
    fontSize: FONTS.md,
    fontWeight: '600',
    color: COLORS.dark,
  },
  addrSubtitle: {
    fontSize: FONTS.sm,
    color: COLORS.gray,
    marginTop: 2,
  },
  itemDivider: {
    height: 1,
    backgroundColor: COLORS.lightGray,
  },
  actionsInline: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
    backgroundColor: COLORS.lightBackground,
  },
  headerBtnText: {
    color: COLORS.dark,
  },
  iconBtn: {
    padding: 6,
    borderRadius: 6,
    backgroundColor: COLORS.lightBackground,
  },
  rowsMeta: {
    color: COLORS.gray,
    marginRight: 8,
  },
  footerMeta: {
    color: COLORS.gray,
    marginTop: 6,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  avatarWrap: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#D7F2D7',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  avatarText: {
    fontSize: FONTS.xs,
    fontWeight: '700',
    color: '#1F7A1F',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  headerText: {
    fontSize: FONTS.sm,
    color: COLORS.dark,
  },
  headerUser: {
    fontSize: FONTS.sm,
    color: COLORS.primary,
    textDecorationLine: 'underline',
  },
  overdueBadge: {
    marginLeft: 'auto',
    backgroundColor: '#FAD1D1',
    color: '#C0392B',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    fontSize: FONTS.xs,
  },
  cardTitle: {
    fontSize: FONTS.md,
    fontWeight: '600',
    color: COLORS.dark,
    marginBottom: 6,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 6,
    marginBottom: 8,
  },
  actionIcon: {
    backgroundColor: COLORS.lightBackground,
    borderRadius: 8,
    padding: 6,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.lightGray,
    marginVertical: 8,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    gap: 8,
  },
  statusChip: {
    backgroundColor: COLORS.lightBackground,
    color: COLORS.dark,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    fontSize: FONTS.xs,
  },
  detail: {
    fontSize: FONTS.sm,
    color: COLORS.dark,
  },
  detailBold: {
    fontWeight: '600',
  },
  meta: {
    color: COLORS.gray,
    fontSize: FONTS.xs,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginTop: 12,
    marginBottom: 4,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 14,
    backgroundColor: '#fff',
  },
  button: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    marginLeft: 8,
  },
  cancelButton: {
    backgroundColor: '#eee',
  },
  saveButton: {
    backgroundColor: '#0F6CBD',
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '600',
  },
});

export default AddressAccordion;
