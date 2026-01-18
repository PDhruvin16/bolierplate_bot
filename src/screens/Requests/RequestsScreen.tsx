import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import AppLayout from '../../components/layouts/AppLayout';
import colors from '../../constants/colors';
import { Calendar, DollarSign, Gift, RotateCcw, Plus } from 'lucide-react-native';
import { CustomHeaderProps } from '../../components/common/CustomHeader';

type RequestType = 'leave' | 'expense' | 'gift' | 'returns';

const RequestsScreen: React.FC = () => {
  const [selectedType, setSelectedType] = useState<RequestType>('leave');
  const [selectedTab, setSelectedTab] = useState<'leaves' | 'expenses' | 'gifts' | 'returns'>('leaves');

  const headerProps: CustomHeaderProps = {
    variant: {
      type: 'basic',
      title: 'My Requests',
      subtitle: '2 pending approvals',
    },
  };

  const requestTypes = [
    { id: 'leave' as RequestType, label: 'Leave', icon: Calendar, color: '#2196F3' },
    { id: 'expense' as RequestType, label: 'Expense', icon: DollarSign, color: '#4CAF50' },
    { id: 'gift' as RequestType, label: 'Gift', icon: Gift, color: colors.headerGradientStart },
    { id: 'returns' as RequestType, label: 'Returns', icon: RotateCcw, color: '#FFA726' },
  ];

  const tabs = [
    { id: 'leaves' as const, label: 'Leaves', count: 0 },
    { id: 'expenses' as const, label: 'Expenses', count: 0 },
    { id: 'gifts' as const, label: 'Gifts', count: 0 },
    { id: 'returns' as const, label: 'Returns', count: 3 },
  ];

  const getEmptyStateContent = () => {
    switch (selectedTab) {
      case 'leaves':
        return {
          icon: Calendar,
          message: 'No leave requests',
          buttonText: 'Apply Leave',
        };
      case 'expenses':
        return {
          icon: DollarSign,
          message: 'No expense requests',
          buttonText: 'Add Expense',
        };
      case 'gifts':
        return {
          icon: Gift,
          message: 'No gift requests',
          buttonText: 'Request Gift',
        };
      case 'returns':
        return {
          icon: RotateCcw,
          message: 'No return requests',
          buttonText: 'Add Return',
        };
    }
  };

  const emptyState = getEmptyStateContent();
  const EmptyIcon = emptyState.icon;

  return (
    <AppLayout headerProps={headerProps}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        {/* Request Type Cards */}
        <View style={styles.typeCardsContainer}>
          {requestTypes.map((type) => {
            const Icon = type.icon;
            const isSelected = selectedType === type.id;
            return (
              <TouchableOpacity
                key={type.id}
                style={[
                  styles.typeCard,
                  isSelected && { borderColor: type.color, borderWidth: 2 },
                ]}
                onPress={() => setSelectedType(type.id)}
              >
                <View
                  style={[
                    styles.typeIconContainer,
                    { backgroundColor: `${type.color}15` },
                  ]}
                >
                  <Icon size={24} color={type.color} />
                </View>
                <Text style={styles.typeLabel}>{type.label}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          {tabs.map((tab) => {
            const isSelected = selectedTab === tab.id;
            return (
              <TouchableOpacity
                key={tab.id}
                style={[styles.tab, isSelected && styles.tabActive]}
                onPress={() => setSelectedTab(tab.id)}
              >
                <Text style={[styles.tabText, isSelected && styles.tabTextActive]}>
                  {tab.label}
                  {tab.count > 0 && ` (${tab.count})`}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Empty State */}
        <View style={styles.emptyStateCard}>
          <View style={styles.emptyStateContent}>
            <View style={styles.emptyIconContainer}>
              <EmptyIcon size={48} color={colors.gray} strokeWidth={1.5} />
            </View>
            <Text style={styles.emptyMessage}>{emptyState.message}</Text>
            <TouchableOpacity style={styles.addButton}>
              <Plus size={18} color={colors.headerGradientStart} />
              <Text style={styles.addButtonText}>{emptyState.buttonText}</Text>
            </TouchableOpacity>
          </View>
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
    paddingBottom: 24,
  },
  typeCardsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingTop: 16,
    gap: 12,
  },
  typeCard: {
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
    borderWidth: 1,
    borderColor: 'transparent',
  },
  typeIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  typeLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.dark,
  },
  tabsContainer: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginTop: 16,
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 4,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 1,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  tabActive: {
    backgroundColor: colors.background,
  },
  tabText: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.gray,
  },
  tabTextActive: {
    color: colors.dark,
    fontWeight: '600',
  },
  emptyStateCard: {
    backgroundColor: colors.white,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    padding: 32,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
    minHeight: 300,
  },
  emptyStateContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyMessage: {
    fontSize: 15,
    color: colors.gray,
    fontWeight: '500',
    marginBottom: 24,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: colors.headerGradientStart,
    backgroundColor: colors.white,
    gap: 8,
  },
  addButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.headerGradientStart,
  },
});

export default RequestsScreen;