import React from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  FlatList,
  StyleSheet,
} from 'react-native';
import Accordion from './Accordion';
import { COLORS, useTheme } from '../../context/ThemeContext';
import { FONTS } from '../../constants/fonts';
import { useQuery } from '@tanstack/react-query';
import { activitiesApi } from '../../api/activityApi';
import { renderLogo } from '../../utils/renderlogo';
import icons from '../../constants/icons';
import log from '../../utils/logger';
import NoteEditor from './NoteEditor';

type ActivityAccordionProps = {
  title?: string;
  initiallyExpanded?: boolean;
  regardingObjectId?: string;
  pageSize?: number;
};

const ActivityAccordion: React.FC<ActivityAccordionProps> = ({
  title = 'Activity',
  initiallyExpanded = false,
  regardingObjectId,
  pageSize = 10,
}) => {
  const { theme } = useTheme();

  const isDark = theme === 'dark';

  const { data, isLoading, isError } = useQuery({
    queryKey: [
      'activities',
      'regarding',
      { id: regardingObjectId, page_size: pageSize },
    ],
    queryFn: () =>
      regardingObjectId
        ? activitiesApi.getActivitiesByRegarding(regardingObjectId, {
            page: 1,
            page_size: pageSize,
          })
        : activitiesApi.getActivities({ page: 1, page_size: pageSize }),
    enabled: true,
  });

  const items = (
    Array.isArray((data as any)?.data) ? (data as any).data : []
  ) as any[];

  const Themed = {
    placeholderTitle: {
      color: isDark ? COLORS.white : COLORS.dark,
    },
    placeholderSub: {
      color: isDark ? COLORS.gray : COLORS.gray,
    },
  } as const;

  const getInitials = (name?: string) => {
    if (!name) return 'DU';
    const parts = String(name).trim().split(/\s+/);
    const first = parts[0]?.[0] || '';
    const last = parts[1]?.[0] || '';
    return (first + last || first || 'D').toUpperCase();
  };

  const isOverdue = (status: any) => {
    const label = status?.label ?? status;
    return typeof label === 'string' && label.toLowerCase().includes('overdue');
  };

  const renderItem = ({ item }: { item: any }) => {
    const subject: string = item?.subject ?? item?.title ?? 'Untitled';
    const statusLabel: string = item?.status?.label ?? item?.status ?? '';
    const modifiedOn: string | undefined =
      item?.modified_on ?? item?.modifiedOn ?? item?.updated_at;
    const modifiedBy: string | undefined =
      item?.modified_by?.name ??
      item?.modifiedBy?.name ??
      item?.owner?.name ??
      item?.owner_name;
    const owner: string | undefined = item?.owner?.name ?? item?.owner_name;
    const potentialCustomer: string | undefined =
      item?.customer?.name ?? item?.account?.name ?? item?.regarding?.name;
    const description: string | undefined =
      item?.description ?? item?.notes ?? '';

    return (
      <View style={styles.card}>
        <View style={styles.row}>
          <View style={styles.avatarWrap}>
            <Text style={styles.avatarText}>{getInitials(modifiedBy)}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <View style={styles.headerRow}>
              {renderLogo(icons.ic_task, { width: 16, height: 16 })}
              <Text style={styles.headerText} numberOfLines={1}>
                Task modified by:
              </Text>
              <Text style={styles.headerUser} numberOfLines={1}>
                {' '}
                {modifiedBy || 'Demo-user1'}
              </Text>
              {isOverdue(item?.status) && (
                <Text style={styles.overdueBadge}>Overdue</Text>
              )}
            </View>

            {!!modifiedOn && (
              <Text style={styles.meta} numberOfLines={1}>
                Modified on: {modifiedOn}
              </Text>
            )}
            <Text style={styles.cardTitle} numberOfLines={2}>
              {subject}
            </Text>
            {!!modifiedOn && (
              <Text style={styles.meta} numberOfLines={1}>
                Modified On: {modifiedOn}
              </Text>
            )}

            <View style={styles.actionsRow}>
              <View style={styles.actionIcon}>
                {renderLogo(icons.ic_account, { width: 18, height: 18 })}
              </View>
              <View style={styles.actionIcon}>
                {renderLogo(icons.check, { width: 18, height: 18 })}
              </View>
              <View style={styles.actionIcon}>
                {renderLogo(icons.ic_feedback, { width: 18, height: 18 })}
              </View>
              <View style={styles.actionIcon}>
                {renderLogo(icons.ic_delete1, { width: 18, height: 18 })}
              </View>
            </View>

            <View style={styles.divider} />

            {!!statusLabel && (
              <View style={styles.statusRow}>
                <Text style={styles.statusChip}>{statusLabel}</Text>
                <View style={{ flex: 1 }} />
                {renderLogo(icons.Vector, { width: 14, height: 14 })}
              </View>
            )}

            {!!owner && (
              <Text style={styles.detail} numberOfLines={1}>
                Owner: <Text style={styles.detailBold}>{owner}</Text>
              </Text>
            )}
            {!!potentialCustomer && (
              <Text style={styles.detail} numberOfLines={1}>
                Potential Customer:{' '}
                <Text style={styles.detailBold}>{potentialCustomer}</Text>
              </Text>
            )}
            {!!description && (
              <Text style={styles.detail} numberOfLines={2}>
                Description: {description}
              </Text>
            )}
          </View>
        </View>
      </View>
    );
  };

  return (
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
        <NoteEditor onSave={()=>{}} initialTitle='Enter Note'/>
          <Text style={styles.sectionHeader}>Recent</Text>
          <FlatList
            data={items}
            keyExtractor={(it: any, idx) => String(it?.id ?? idx)}
            renderItem={renderItem}
            contentContainerStyle={{ paddingTop: 8 }}
          />
        </>
      )}
    </Accordion>
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
});

export default ActivityAccordion;
