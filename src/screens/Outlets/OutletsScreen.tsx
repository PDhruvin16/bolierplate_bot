import React from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput } from 'react-native';
import AppLayout from '../../components/layouts/AppLayout';
import colors from '../../constants/colors';
import { Search, SlidersHorizontal } from 'lucide-react-native';
import { CustomHeaderProps } from '../../components/common/CustomHeader';

const OutletsScreen: React.FC = () => {
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
          />
        </View>
        <View style={styles.filterButton}>
          <SlidersHorizontal size={18} color={colors.white} />
        </View>
      </View>
    ),
  };

  return (
    <AppLayout headerProps={headerProps}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <View style={styles.card}>
          <Text style={styles.title}>Outlets</Text>
          <Text style={styles.subtitle}>View and manage outlets</Text>
        </View>
      </ScrollView>
    </AppLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchInput: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  searchText: {
    marginLeft: 8,
    fontSize: 13,
    color: colors.dark,
    flex: 1,
  },
  filterButton: {
    marginLeft: 8,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.dark,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: colors.gray,
  },
});

export default OutletsScreen;

