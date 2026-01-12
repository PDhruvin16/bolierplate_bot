import React, { useEffect, useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useAuth } from '../../hooks/useAuth';
import { COLORS } from '../../context/ThemeContext';
import { STRINGS } from '../../constants/strings';
import CustomHeader from '../../components/common/CustomHeader';
import DashboardCard from '../../components/common/DashboardCard';
import DateSelector from '../../components/common/DateSelector';
import DashboardTabs from '../../components/common/DashboardTabs';
import {
  PeopleIcon,
  BriefcaseIcon,
  DocumentIcon,
  CancelledIcon,
  CheckmarkIcon,
  StarIcon,
} from '../../components/common/DashboardIcons';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import DashboardCharts from '../../components/common/DashboardCharts';
import ServicesCharts from '../../components/common/ServicesCharts';
import FeedbackCharts from '../../components/common/FeedbackCharts';
import TeamPerformanceCharts from '../../components/common/TeamPerformanceCharts';
import TrendsCharts from '../../components/common/TrendsCharts';
import useDashboardQueries from '../../hooks/useDashboardQueries';
import { customerApi } from '../../api/customerApi';

// Types for Dashboard KPI API response
interface DashboardKpiResponse {
  total_customer?: {
    total_customers?: number;
    last_year_percentage?: number;
    is_permission?: boolean;
  };
  cases_counts?: {
    open_case?: { count?: number; change?: number };
    escalated_cases?: { count?: number; change?: number };
    cancelled_cases?: { count?: number; change?: number };
    resolved_case?: { count?: number; change?: number };
    is_permission?: boolean;
  };
  star_feedback?: {
    total_feedback?: number;
    five_star_feedback?: number;
    percentage_change?: number;
    is_permission?: boolean;
  };
}

interface DashboardScreenProps {
  onNavigateToCustomerConsole?: () => void;
  navigation?: any; // Optional navigation prop for direct navigation
}

const DashboardScreen: React.FC<DashboardScreenProps> = ({
  onNavigateToCustomerConsole,
}) => {
  const { user, logout } = useAuth();
  const { theme } = useTheme();
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState('case_management');
  const [startDate, setStartDate] = useState<string | undefined>(undefined);
  const [endDate, setEndDate] = useState<string | undefined>(undefined);
  const { useDashboardKpiCards } = useDashboardQueries();

  // Use the query hook for data fetching
  const { data, isLoading: loading, error, refetch } = useDashboardKpiCards();

  console.log('🚀 ~ DashboardScreen ~ data:', data);
// const openDrawer = () => {
//   // Use navigation from Drawer context
//   navigation.dispatch(DrawerActions.toggleDrawer());
// };

  useEffect(() => {
    const unsub = navigation.addListener('focus', () => {
      // Reset to default tab when screen is focused
    });
    return () => {
      unsub();
    };
  }, [navigation]);

  const handleDateSelectorPress = (data: string | string[]) => {
    if (Array.isArray(data)) {
      const start = data[0];
      const end = data[data.length - 1];
      setStartDate(
        new Date(start).toLocaleDateString('en-US', {
          month: 'short',
          day: '2-digit',
          year: 'numeric',
        }),
      );
      setEndDate(
        new Date(end).toLocaleDateString('en-US', {
          month: 'short',
          day: '2-digit',
          year: 'numeric',
        }),
      );
    }
  };

  const handleTabPress = (tabId: string) => {
    setActiveTab(tabId);
  };

  const tabs = [
    { id: 'case_management', label: STRINGS.CASE_MANAGEMENT },
    { id: 'services', label: STRINGS.SERVICES },
    { id: 'team_performance', label: STRINGS.TEAM_PERFORMANCE },
    { id: 'feedback', label: STRINGS.FEEDBACK },
    { id: 'trends', label: STRINGS.TRENDS },
  ];

  // Theme-based styles
  const themedStyles = {
    container: {
      ...styles.container,
      backgroundColor: theme === 'dark' ? '#000000' : '#ECEFF5',
    },
    navigationBox: {
      ...styles.navigationBox,
      backgroundColor: theme === 'dark' ? '#1E1E1E' : COLORS.white,
    },
    contentBox: {
      ...styles.contentBox,
      backgroundColor: theme === 'dark' ? '#000000' : '#ECEFF5',
    },
    cardRow: styles.cardRow,
    cardsContainer: styles.cardsContainer,
    contentContainer: {
      ...styles.contentContainer,
      backgroundColor: theme === 'dark' ? '#000000' : '#ECEFF5',
    },
  };

  return (
    <ScrollView
      scrollEnabled
      style={themedStyles.container}
      bounces={false}
      stickyHeaderIndices={[0]}
      showsVerticalScrollIndicator={false}
    >
      <CustomHeader
        variant={{ type: 'service_hub' }}
        onSearch={() => {}}
        onAdd={() => {}}
        onSettings={() => {}}
       
      />

      <DateSelector
        startDate={startDate}
        endDate={endDate}
        onPress={handleDateSelectorPress}
      />

      <View style={styles.cardsContainer}>
        <View style={styles.cardRow}>
          <DashboardCard
            icon={<PeopleIcon size={15} />}
            number={
              (data as DashboardKpiResponse | null)?.total_customer
                ?.total_customers ?? '—'
            }
            label={STRINGS.TOTAL_CUSTOMERS}
            percentageChange={`${
              (data as DashboardKpiResponse | null)?.total_customer
                ?.last_year_percentage ?? 0
            }%`}
            isPositive={
              (((data as DashboardKpiResponse | null)?.total_customer
                ?.last_year_percentage ?? 0) as number) >= 0
            }
          />
          <DashboardCard
            icon={<BriefcaseIcon size={15} />}
            number={
              (data as DashboardKpiResponse | null)?.cases_counts?.open_case
                ?.count ?? '—'
            }
            label={STRINGS.OPEN_CASES}
            percentageChange={`${
              (data as DashboardKpiResponse | null)?.cases_counts?.open_case
                ?.change ?? 0
            }%`}
            isPositive={
              (((data as DashboardKpiResponse | null)?.cases_counts?.open_case
                ?.change ?? 0) as number) >= 0
            }
          />
        </View>

        <View style={styles.cardRow}>
          <DashboardCard
            icon={<DocumentIcon size={15} />}
            number={
              (data as DashboardKpiResponse | null)?.cases_counts
                ?.escalated_cases?.count ?? '—'
            }
            label={STRINGS.ESCALATED_CASES}
            percentageChange={`${
              (data as DashboardKpiResponse | null)?.cases_counts
                ?.escalated_cases?.change ?? 0
            }%`}
            isPositive={
              (((data as DashboardKpiResponse | null)?.cases_counts
                ?.escalated_cases?.change ?? 0) as number) >= 0
            }
          />
          <DashboardCard
            icon={<CancelledIcon size={15} />}
            number={
              (data as DashboardKpiResponse | null)?.cases_counts
                ?.cancelled_cases?.count ?? '—'
            }
            label={STRINGS.CANCELLED_CASES}
            percentageChange={`${
              (data as DashboardKpiResponse | null)?.cases_counts
                ?.cancelled_cases?.change ?? 0
            }%`}
            isPositive={
              (((data as DashboardKpiResponse | null)?.cases_counts
                ?.cancelled_cases?.change ?? 0) as number) >= 0
            }
          />
        </View>

        <View style={styles.cardRow}>
          <DashboardCard
            icon={<CheckmarkIcon size={15} />}
            number={
              (data as DashboardKpiResponse | null)?.cases_counts?.resolved_case
                ?.count ?? '—'
            }
            label={STRINGS.RESOLVED_CASES}
            percentageChange={`${
              (data as DashboardKpiResponse | null)?.cases_counts?.resolved_case
                ?.change ?? 0
            }%`}
            isPositive={
              (((data as DashboardKpiResponse | null)?.cases_counts
                ?.resolved_case?.change ?? 0) as number) >= 0
            }
          />
          <DashboardCard
            icon={<StarIcon size={15} />}
            number={
              (data as DashboardKpiResponse | null)?.star_feedback
                ?.total_feedback ?? '—'
            }
            label={STRINGS.FIVE_STAR_FEEDBACK}
            percentageChange={`${
              (data as DashboardKpiResponse | null)?.star_feedback
                ?.percentage_change ?? 0
            }%`}
            isPositive={
              (((data as DashboardKpiResponse | null)?.star_feedback
                ?.percentage_change ?? 0) as number) >= 0
            }
          />
        </View>
      </View>

      <View style={themedStyles.navigationBox}>
        <DashboardTabs
          tabs={tabs}
          activeTab={activeTab}
          onTabPress={handleTabPress}
        />
      </View>

      <View style={themedStyles.contentBox}>
        <View style={themedStyles.contentContainer}>
          {/* TODO: responsive width for charts modal */}
          {activeTab === 'case_management' && (
            <>
              <DashboardCharts />
            </>
          )}
          {activeTab === 'services' && (
            <>
              <ServicesCharts />
            </>
          )}
          {activeTab === 'team_performance' && <TeamPerformanceCharts />}
          {activeTab === 'feedback' && (
            <>
              <FeedbackCharts />
            </>
          )}
          {activeTab === 'trends' && (
            <>
              <TrendsCharts />
            </>
          )}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: COLORS.background1,
  },
  header: {
    padding: 20,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.dark,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.gray,
  },
  cardsContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    // backgroundColor: COLORS.background1,
  },
  cardRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 20,
  },
  navigationBox: {
    backgroundColor: COLORS.background1,
    borderRadius: 12,
    marginHorizontal: 20,
    marginVertical: 8,
    shadowColor: COLORS.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
  },
  contentBox: {
    backgroundColor: COLORS.background1,
    borderRadius: 12,
    marginHorizontal: 20,
    marginVertical: 8,
    flex: 1,
  },
  contentContainer: {
    paddingVertical: 16,
    // backgroundColor: '#ECEFF5',
    borderRadius: 12,
    backgroundColor: COLORS.background1,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.dark,
    marginBottom: 16,
    textAlign: 'center',
  },

  barChart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
    height: 120,
    marginBottom: 16,
  },
  bar: {
    width: 30,
    borderRadius: 4,
  },
  donutChart: {
    alignItems: 'center',
    marginBottom: 16,
  },
  donutOuter: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.dashboard.blue,
    justifyContent: 'center',
    alignItems: 'center',
  },
  donutInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.white,
  },
  legend: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  legendText: {
    fontSize: 12,
    color: COLORS.gray,
  },
  statsContainer: {
    flexDirection: 'row',
    padding: 20,
    gap: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.white,
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: COLORS.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
  },
  statNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 14,
    color: COLORS.gray,
    textAlign: 'center',
  },
  actionsContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.dark,
    marginBottom: 16,
  },
  actionButton: {
    marginBottom: 12,
  },
  logoutContainer: {
    padding: 20,
    marginTop: 20,
  },
});

export default DashboardScreen;
