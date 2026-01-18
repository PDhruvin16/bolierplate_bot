import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import AppLayout from '../../components/layouts/AppLayout';
import colors from '../../constants/colors';
import { CalendarDays, List, Map, Plus, Play, X, Clock } from 'lucide-react-native';
import { CustomHeaderProps } from '../../components/common/CustomHeader';

const { width } = Dimensions.get('window');

interface BeatLocation {
  id: number;
  name: string;
  address: string;
  type: string;
  class: string;
  status: 'Planned' | 'Visited';
}

const BeatPlanScreen: React.FC = () => {
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');

  const locations: BeatLocation[] = [
    {
      id: 1,
      name: 'Sharma Hardware',
      address: '45 Linking Road, Bandra West',
      type: 'Retailer',
      class: 'Class A',
      status: 'Planned',
    },
    {
      id: 2,
      name: 'Patel Building Materials',
      address: '12 SV Road, Andheri',
      type: 'Retailer',
      class: 'Class A',
      status: 'Planned',
    },
    {
      id: 3,
      name: 'Singh Adhesives',
      address: '78 Hill Road, Bandra',
      type: 'Retailer',
      class: 'Class B',
      status: 'Planned',
    },
  ];

  const visitedCount = locations.filter(l => l.status === 'Visited').length;
  const totalCount = locations.length;

  const headerProps: CustomHeaderProps = {
    variant: { type: 'basic', title: 'Beat Plan', subtitle: 'Sunday, 18 Jan' },
    bottomContent: (
      <View style={styles.headerBottomRow}>
        <View style={styles.datePill}>
          <CalendarDays size={16} color={colors.headerGradientStart} />
          <Text style={styles.dateText}>Sunday, 18 Jan</Text>
        </View>
      </View>
    ),
  };

  const renderListView = () => (
    <>
      {locations.map((location, index) => (
        <View key={location.id} style={styles.locationCard}>
          <View style={styles.locationHeader}>
            <View style={styles.numberBadge}>
              <Text style={styles.numberText}>{index + 1}</Text>
            </View>
            <View style={styles.locationInfo}>
              <View style={styles.locationTitleRow}>
                <Text style={styles.locationName}>{location.name}</Text>
                <Text style={styles.statusText}>{location.status}</Text>
              </View>
              <View style={styles.addressRow}>
                <Text style={styles.addressIcon}>📍</Text>
                <Text style={styles.addressText}>{location.address}</Text>
              </View>
              <View style={styles.tagsRow}>
                <View style={styles.tag}>
                  <Text style={styles.tagText}>{location.type}</Text>
                </View>
                <View style={styles.tag}>
                  <Text style={styles.tagText}>{location.class}</Text>
                </View>
              </View>
            </View>
          </View>
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.startButton}>
              <Play size={16} color={colors.white} fill={colors.white} />
              <Text style={styles.startButtonText}>Start Visit</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton}>
              <X size={20} color={colors.headerGradientStart} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.timeButton}>
              <Clock size={20} color={colors.dark} />
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </>
  );

  const renderMapView = () => (
    <View style={styles.mapPlaceholder}>
      <Map size={48} color={colors.gray} />
      <Text style={styles.mapText}>Map View</Text>
      <Text style={styles.mapSubtext}>Coming Soon</Text>
    </View>
  );

  return (
    <AppLayout headerProps={headerProps}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        {/* Stats Card */}
        <View style={styles.statsCard}>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{visitedCount}</Text>
              <Text style={styles.statLabel}>Visited</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{totalCount}</Text>
              <Text style={styles.statLabel}>Total</Text>
            </View>
            <View style={styles.viewToggle}>
              <TouchableOpacity
                style={[
                  styles.viewButton,
                  viewMode === 'list' && styles.viewButtonActive,
                ]}
                onPress={() => setViewMode('list')}
              >
                <List
                  size={20}
                  color={viewMode === 'list' ? colors.headerGradientStart : colors.gray}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.viewButton,
                  viewMode === 'map' && styles.viewButtonActive,
                ]}
                onPress={() => setViewMode('map')}
              >
                <Map
                  size={20}
                  color={viewMode === 'map' ? colors.headerGradientStart : colors.gray}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Content based on view mode */}
        {viewMode === 'list' ? renderListView() : renderMapView()}
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity style={styles.fab}>
        <Plus size={24} color={colors.white} />
      </TouchableOpacity>
    </AppLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingBottom: 80,
  },
  headerBottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  datePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  dateText: {
    marginLeft: 6,
    fontSize: 13,
    color: colors.dark,
    fontWeight: '500',
  },
  statsCard: {
    backgroundColor: colors.white,
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 12,
    borderRadius: 12,
    padding: 16,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.dark,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 13,
    color: colors.gray,
    fontWeight: '500',
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: colors.lightGray,
    marginHorizontal: 8,
  },
  viewToggle: {
    flexDirection: 'row',
    backgroundColor: colors.background,
    borderRadius: 8,
    padding: 4,
    marginLeft: 12,
  },
  viewButton: {
    padding: 8,
    borderRadius: 6,
  },
  viewButtonActive: {
    backgroundColor: colors.white,
  },
  locationCard: {
    backgroundColor: colors.white,
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 12,
    padding: 16,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  locationHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  numberBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFE8E0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  numberText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.headerGradientStart,
  },
  locationInfo: {
    flex: 1,
  },
  locationTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  locationName: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.dark,
    flex: 1,
    marginRight: 8,
  },
  statusText: {
    fontSize: 12,
    color: colors.gray,
    fontWeight: '500',
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  addressIcon: {
    fontSize: 12,
    marginRight: 4,
    marginTop: 2,
  },
  addressText: {
    fontSize: 13,
    color: colors.gray,
    flex: 1,
    lineHeight: 18,
  },
  tagsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  tag: {
    backgroundColor: colors.background,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  tagText: {
    fontSize: 11,
    color: colors.gray,
    fontWeight: '500',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  startButton: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },
  startButtonText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '600',
  },
  cancelButton: {
    width: 44,
    height: 44,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: colors.headerGradientStart,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timeButton: {
    width: 44,
    height: 44,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: colors.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 80,
  },
  mapText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.dark,
    marginTop: 16,
  },
  mapSubtext: {
    fontSize: 14,
    color: colors.gray,
    marginTop: 4,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.headerGradientStart,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
});

export default BeatPlanScreen;