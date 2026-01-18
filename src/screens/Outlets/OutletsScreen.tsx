import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import AppLayout from '../../components/layouts/AppLayout';
import colors from '../../constants/colors';
import { Search, SlidersHorizontal, ChevronRight, Phone, MapPin } from 'lucide-react-native';
import { CustomHeaderProps } from '../../components/common/CustomHeader';

interface Outlet {
  id: number;
  name: string;
  type: 'Retailer' | 'Distributor' | 'Vendor';
  location: string;
  address: string;
  phone: string;
  rating: 'A' | 'B' | 'C';
  icon: string;
}

const OutletsScreen: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const outlets: Outlet[] = [
    {
      id: 1,
      name: 'Maharashtra Adhesives Distributors',
      type: 'Distributor',
      location: 'Mumbai',
      address: 'MIDC Andheri East',
      phone: '9821234577',
      rating: 'A',
      icon: '🏢',
    },
    {
      id: 2,
      name: 'Western India Chemicals',
      type: 'Distributor',
      location: 'Pune',
      address: 'Hadapsar Industrial Area',
      phone: '9821234578',
      rating: 'A',
      icon: '🏢',
    },
    {
      id: 3,
      name: 'North Zone Supplies',
      type: 'Distributor',
      location: 'Delhi',
      address: 'Okhla Industrial Area',
      phone: '9821234579',
      rating: 'B',
      icon: '🏢',
    },
    {
      id: 4,
      name: 'Sharma Hardware',
      type: 'Retailer',
      location: 'Mumbai',
      address: '45 Linking Road, Bandra West',
      phone: '9821234580',
      rating: 'A',
      icon: '🏪',
    },
    {
      id: 5,
      name: 'Patel Building Materials',
      type: 'Retailer',
      location: 'Ahmedabad',
      address: '12 SV Road, Satellite',
      phone: '9821234581',
      rating: 'A',
      icon: '🏪',
    },
    {
      id: 6,
      name: 'Singh Adhesives',
      type: 'Retailer',
      location: 'Jaipur',
      address: '78 MI Road, Pink City',
      phone: '9821234582',
      rating: 'B',
      icon: '🏪',
    },
    {
      id: 7,
      name: 'Royal Enterprises',
      type: 'Vendor',
      location: 'Bangalore',
      address: 'Whitefield Industrial Zone',
      phone: '9821234583',
      rating: 'A',
      icon: '🏭',
    },
    {
      id: 8,
      name: 'Metro Supplies',
      type: 'Vendor',
      location: 'Chennai',
      address: 'Ambattur Industrial Estate',
      phone: '9821234584',
      rating: 'B',
      icon: '🏭',
    },
  ];

  const retailersCount = outlets.filter(o => o.type === 'Retailer').length;
  const distributorsCount = outlets.filter(o => o.type === 'Distributor').length;
  const vendorsCount = outlets.filter(o => o.type === 'Vendor').length;

  const headerProps: CustomHeaderProps = {
    variant: { type: 'basic', title: 'Outlets' },
    bottomContent: (
      <View style={styles.searchRow}>
        <View style={styles.searchInput}>
          <Search size={18} color={colors.gray} />
          <TextInput
            style={styles.searchText}
            placeholder="Search outlets..."
            placeholderTextColor={colors.gray}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        <TouchableOpacity style={styles.filterButton}>
          <SlidersHorizontal size={18} color={colors.white} />
        </TouchableOpacity>
      </View>
    ),
  };

  const getRatingColor = (rating: 'A' | 'B' | 'C') => {
    switch (rating) {
      case 'A':
        return '#4CAF50';
      case 'B':
        return '#2196F3';
      case 'C':
        return '#FF9800';
      default:
        return colors.gray;
    }
  };

  return (
    <AppLayout headerProps={headerProps}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statIcon}>🏪</Text>
            <Text style={styles.statValue}>{retailersCount}</Text>
            <Text style={styles.statLabel}>Retailers</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statIcon}>🏢</Text>
            <Text style={styles.statValue}>{distributorsCount}</Text>
            <Text style={styles.statLabel}>Distributors</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statIcon}>🏭</Text>
            <Text style={styles.statValue}>{vendorsCount}</Text>
            <Text style={styles.statLabel}>Vendors</Text>
          </View>
        </View>

        {/* Outlets List */}
        {outlets.map((outlet) => (
          <TouchableOpacity key={outlet.id} style={styles.outletCard}>
            <View style={styles.outletHeader}>
              <View style={styles.iconContainer}>
                <Text style={styles.outletIcon}>{outlet.icon}</Text>
              </View>
              <View style={styles.outletInfo}>
                <View style={styles.outletTitleRow}>
                  <Text style={styles.outletName} numberOfLines={1}>
                    {outlet.name}
                  </Text>
                  <View
                    style={[
                      styles.ratingBadge,
                      { backgroundColor: getRatingColor(outlet.rating) },
                    ]}
                  >
                    <Text style={styles.ratingText}>{outlet.rating}</Text>
                  </View>
                </View>
                <View style={styles.metaRow}>
                  <Text style={styles.metaText}>
                    {outlet.type} • {outlet.location}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <MapPin size={12} color={colors.gray} />
                  <Text style={styles.detailText}>{outlet.address}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Phone size={12} color={colors.gray} />
                  <Text style={styles.detailText}>{outlet.phone}</Text>
                </View>
              </View>
              <ChevronRight size={20} color={colors.gray} style={styles.chevron} />
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity style={styles.fab}>
        <Text style={styles.fabText}>+</Text>
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
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  searchInput: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  searchText: {
    marginLeft: 8,
    fontSize: 14,
    color: colors.dark,
    flex: 1,
  },
  filterButton: {
    marginLeft: 12,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingTop: 16,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  statIcon: {
    fontSize: 28,
    marginBottom: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.dark,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: colors.gray,
    fontWeight: '500',
  },
  outletCard: {
    backgroundColor: colors.white,
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 12,
    padding: 16,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  outletHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  outletIcon: {
    fontSize: 24,
  },
  outletInfo: {
    flex: 1,
  },
  outletTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  outletName: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.dark,
    flex: 1,
    marginRight: 8,
  },
  ratingBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.white,
  },
  metaRow: {
    marginBottom: 6,
  },
  metaText: {
    fontSize: 12,
    color: colors.gray,
    fontWeight: '500',
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  detailText: {
    fontSize: 12,
    color: colors.gray,
    marginLeft: 6,
    flex: 1,
  },
  chevron: {
    marginLeft: 8,
    marginTop: 12,
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
  fabText: {
    fontSize: 32,
    color: colors.white,
    fontWeight: '300',
  },
});

export default OutletsScreen;