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
import { useAuth } from '../../hooks/useAuth';
import { CustomHeaderProps } from '../../components/common/CustomHeader';
import {
  Camera,
  ShoppingBag,
  Store,
  Users,
  Clock,
  Navigation,
  Calendar,
  FileText,
  Phone,
  Briefcase,
  TrendingUp,
  BarChart3,
} from 'lucide-react-native';

const HomeScreen: React.FC = () => {
  const { user } = useAuth();
  const [punchInTime, setPunchInTime] = useState<string | null>(null);
  const [punchOutTime, setPunchOutTime] = useState<string | null>(null);

  const handlePunchIn = () => {
    const now = new Date();
    const timeString = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    setPunchInTime(timeString);
  };

  const headerConfig: CustomHeaderProps = {
    variant: {
      type: 'home',
      title: (user as any)?.name || 'Rajesh Kumar',
      subtitle: 'Welcome',
      location: (user as any)?.location || 'Mumbai West',
      showProfile: true,
      profileImage: (user as any)?.avatar,
    },
    onNotificationPress: () => {},
    notificationCount: 3,
  };

  return (
    <AppLayout headerProps={headerConfig}>
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Punch In/Out Card - Overlapping header */}
          <View style={styles.punchCard}>
            <View style={styles.punchCardGradient}>
              <View style={styles.punchTimeSection}>
                <View style={styles.timeBlock}>
                  <View style={[styles.timeIconCircle, { backgroundColor: 'rgba(49, 162, 76, 0.15)' }]}>
                    <Clock size={20} color="#31A24C" />
                  </View>
                  <View style={styles.timeInfo}>
                    <Text style={styles.timeLabel}>First Punch In</Text>
                    <Text style={styles.timeValue}>{punchInTime || '--:--'}</Text>
                  </View>
                </View>
                
                <View style={styles.timeDivider} />
                
                <View style={styles.timeBlock}>
                  <View style={[styles.timeIconCircle, { backgroundColor: 'rgba(217, 83, 79, 0.15)' }]}>
                    <Clock size={20} color="#D9534F" />
                  </View>
                  <View style={styles.timeInfo}>
                    <Text style={styles.timeLabel}>Last Punch Out</Text>
                    <Text style={styles.timeValue}>{punchOutTime || '--:--'}</Text>
                  </View>
                </View>
              </View>
              
              <TouchableOpacity style={styles.punchButton} onPress={handlePunchIn}>
                <View style={styles.punchButtonContent}>
                  <View style={styles.cameraIconWrapper}>
                    <Camera size={22} color={colors.white} strokeWidth={2.5} />
                  </View>
                  <Text style={styles.punchButtonText}>Punch In</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
          {/* Quick Actions */}
          <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.quickActionsContainer}>
          <TouchableOpacity style={[styles.quickActionButton, { backgroundColor: colors.quickActionGreen }]}>
            <Camera size={28} color="#2F8F46" />
            <Text style={styles.quickActionText}>Punch In</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={[styles.quickActionButton, { backgroundColor: colors.quickActionOrange }]}>
            <ShoppingBag size={28} color="#D97A00" />
            <Text style={styles.quickActionText}>New Order</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={[styles.quickActionButton, { backgroundColor: colors.quickActionBlue }]}>
            <Store size={28} color="#1F6FB6" />
            <Text style={styles.quickActionText}>Add Outlet</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={[styles.quickActionButton, { backgroundColor: colors.quickActionYellow }]}>
            <Users size={28} color="#C28A00" />
            <Text style={styles.quickActionText}>Add Lead</Text>
          </TouchableOpacity>
        </View>

        {/* Today's Summary */}
        <Text style={styles.sectionTitle}>Today's Summary</Text>
        <View style={styles.summaryRow}>
          <View style={styles.summaryCard}>
            <View style={[styles.summaryIconWrapper, { backgroundColor: colors.quickActionBlue }]}>
              <Clock size={22} color="#1F6FB6" />
            </View>
            <Text style={styles.summaryLabel}>Working Hours</Text>
            <Text style={styles.summaryValue}>0h 0m</Text>
          </View>
          
          <View style={styles.summaryCard}>
            <View style={[styles.summaryIconWrapper, { backgroundColor: colors.quickActionGreen }]}>
              <Navigation size={22} color="#2F8F46" />
            </View>
            <Text style={styles.summaryLabel}>Distance</Text>
            <Text style={styles.summaryValue}>14 km</Text>
          </View>
        </View>

        <View style={styles.summaryRow}>
          <View style={styles.summaryCard}>
            <View style={[styles.summaryIconWrapper, { backgroundColor: colors.quickActionOrange }]}>
              <Store size={22} color="#D97A00" />
            </View>
            <Text style={styles.summaryLabel}>Visits</Text>
            <Text style={styles.summaryValue}>0</Text>
          </View>
          
          <View style={styles.summaryCard}>
            <View style={[styles.summaryIconWrapper, { backgroundColor: colors.quickActionYellow }]}>
              <ShoppingBag size={22} color="#C28A00" />
            </View>
            <Text style={styles.summaryLabel}>Orders</Text>
            <Text style={styles.summaryValue}>4</Text>
          </View>
        </View>

        {/* Key Metrics */}
        <Text style={styles.sectionTitle}>Key Metrics</Text>
        <View style={styles.metricsGrid}>
          <View style={styles.metricCard}>
            <View style={[styles.metricIconWrapper, { backgroundColor: colors.quickActionBlue }]}>
              <Calendar size={22} color="#1F6FB6" />
            </View>
            <Text style={styles.metricLabel}>Attendance</Text>
            <Text style={[styles.metricValue, { color: colors.info }]}>Absent</Text>
          </View>
          
          <View style={styles.metricCard}>
            <View style={[styles.metricIconWrapper, { backgroundColor: colors.dashboard.lightRed }]}>
              <FileText size={22} color="#D9534F" />
            </View>
            <Text style={styles.metricLabel}>Zero Orders</Text>
            <Text style={styles.metricValue}>0</Text>
          </View>
          
          <View style={styles.metricCard}>
            <View style={[styles.metricIconWrapper, { backgroundColor: colors.quickActionGreen }]}>
              <Phone size={22} color="#2F8F46" />
            </View>
            <Text style={styles.metricLabel}>Productive Calls</Text>
            <Text style={styles.metricValue}>0/0</Text>
          </View>
        </View>

        {/* Leave Balance */}
        <View style={styles.leaveBalanceCard}>
          <View style={styles.leaveHeader}>
            <View style={styles.leaveHeaderLeft}>
              <Briefcase size={20} color={colors.headerGradientStart} />
              <Text style={styles.leaveTitle}>Leave Balance</Text>
            </View>
            <TouchableOpacity>
              <Text style={styles.applyLeaveText}>Apply Leave</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.leaveStats}>
            <View style={styles.leaveStatItem}>
              <Text style={[styles.leaveStatValue, { color: colors.headerOrange }]}>12</Text>
              <Text style={styles.leaveStatLabel}>Casual</Text>
            </View>
            <View style={styles.leaveStatItem}>
              <Text style={[styles.leaveStatValue, { color: colors.info }]}>6</Text>
              <Text style={styles.leaveStatLabel}>Sick</Text>
            </View>
            <View style={styles.leaveStatItem}>
              <Text style={[styles.leaveStatValue, { color: colors.success }]}>15</Text>
              <Text style={styles.leaveStatLabel}>Earned</Text>
            </View>
            <View style={styles.leaveStatItem}>
              <Text style={[styles.leaveStatValue, { color: colors.warning }]}>2</Text>
              <Text style={styles.leaveStatLabel}>Comp Off</Text>
            </View>
          </View>
        </View>

        {/* Target vs Achievement */}
        <View style={styles.targetCard}>
          <View style={styles.targetHeader}>
            <View style={styles.targetHeaderLeft}>
              <TrendingUp size={20} color={colors.headerGradientStart} />
              <Text style={styles.targetTitle}>Target vs Achievement</Text>
            </View>
            <Text style={styles.targetPercentage}>71%</Text>
          </View>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: '71%' }]} />
          </View>
          <View style={styles.targetStats}>
            <View style={styles.targetStatItem}>
              <Text style={styles.targetStatLabel}>Achievement</Text>
              <Text style={styles.targetStatValue}>₹3.5L</Text>
            </View>
            <View style={styles.targetStatItem}>
              <Text style={[styles.targetStatLabel, { textAlign: 'right' }]}>Target</Text>
              <Text style={[styles.targetStatValue, { textAlign: 'right' }]}>₹5.0L</Text>
            </View>
          </View>
        </View>

        {/* Performance */}
        <View style={styles.performanceCard}>
          <View style={styles.performanceHeader}>
            <View style={styles.performanceHeaderLeft}>
              <BarChart3 size={20} color={colors.headerGradientStart} />
              <Text style={styles.performanceTitle}>Performance</Text>
            </View>
            <View style={styles.performanceToggle}>
              <TouchableOpacity style={styles.toggleButtonActive}>
                <Text style={styles.toggleTextActive}>Weekly</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.toggleButton}>
                <Text style={styles.toggleText}>Monthly</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.chartContainer}>
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => {
              const heights = [60, 85, 55, 90, 70, 75, 0];
              return (
                <View key={day} style={styles.barWrapper}>
                  <View style={styles.barContainer}>
                    <View style={[styles.bar, { height: heights[index] }]} />
                  </View>
                  <Text style={styles.barLabel}>{day}</Text>
                </View>
              );
            })}
          </View>
          <View style={styles.performanceFooter}>
            <View style={styles.performanceFooterItem}>
              <Text style={styles.performanceFooterLabel}>Total Sales</Text>
              <Text style={styles.performanceFooterValue}>₹3.2L</Text>
            </View>
            <View style={[styles.performanceFooterItem, { alignItems: 'flex-end' }]}>
              <Text style={styles.performanceFooterLabel}>Total Visits</Text>
              <Text style={styles.performanceFooterValue}>59</Text>
            </View>
          </View>
        </View>

        {/* Product Mix */}
        <View style={styles.productMixCard}>
          <Text style={styles.cardTitle}>Product Mix</Text>
          <View style={styles.productMixContent}>
            <View style={styles.donutChartContainer}>
              <View style={styles.donutChart}>
                <View style={[styles.donutSegment, { backgroundColor: '#FF6B35', width: 70, height: 70, borderRadius: 35 }]} />
                <View style={[styles.donutSegment, { backgroundColor: '#4ECDC4', width: 70, height: 70, borderRadius: 35, position: 'absolute', top: 0, left: 35 }]} />
                <View style={[styles.donutSegment, { backgroundColor: '#45B7D1', width: 70, height: 70, borderRadius: 35, position: 'absolute', top: 35, left: 0 }]} />
                <View style={[styles.donutSegment, { backgroundColor: '#F7931E', width: 70, height: 70, borderRadius: 35, position: 'absolute', top: 35, left: 35 }]} />
                <View style={styles.donutCenter} />
              </View>
            </View>
            <View style={styles.productMixLegend}>
              <View style={styles.legendRow}>
                <View style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: '#FF6B35' }]} />
                  <View style={styles.legendText}>
                    <Text style={styles.legendLabel}>Adhesives</Text>
                    <Text style={styles.legendValue}>35%</Text>
                  </View>
                </View>
                <View style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: '#4ECDC4' }]} />
                  <View style={styles.legendText}>
                    <Text style={styles.legendLabel}>Sealants</Text>
                    <Text style={styles.legendValue}>25%</Text>
                  </View>
                </View>
              </View>
              <View style={styles.legendRow}>
                <View style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: '#45B7D1' }]} />
                  <View style={styles.legendText}>
                    <Text style={styles.legendLabel}>Coatings</Text>
                    <Text style={styles.legendValue}>20%</Text>
                  </View>
                </View>
                <View style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: '#F7931E' }]} />
                  <View style={styles.legendText}>
                    <Text style={styles.legendLabel}>Others</Text>
                    <Text style={styles.legendValue}>20%</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Top Outlets */}
        <View style={styles.topOutletsCard}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Top Outlets</Text>
            <TouchableOpacity>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.outletsList}>
            {[
              { rank: 1, name: 'Sharma Hardware', amount: '₹125K', change: '+12%', positive: true },
              { rank: 2, name: 'Gupta Traders', amount: '₹98K', change: '↓5%', positive: false },
              { rank: 3, name: 'Kumar Supplies', amount: '₹87K', change: '+8%', positive: true },
              { rank: 4, name: 'Singh & Sons', amount: '₹76K', change: '+15%', positive: true },
            ].map((outlet) => (
              <View key={outlet.rank} style={styles.outletItem}>
                <View style={styles.outletLeft}>
                  <View style={styles.rankBadge}>
                    <Text style={styles.rankText}>{outlet.rank}</Text>
                  </View>
                  <Text style={styles.outletName}>{outlet.name}</Text>
                </View>
                <View style={styles.outletRight}>
                  <Text style={styles.outletAmount}>{outlet.amount}</Text>
                  <Text style={[styles.outletChange, { color: outlet.positive ? colors.success : colors.error }]}>
                    {outlet.change}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Recent Activity */}
        <View style={styles.recentActivityCard}>
          <Text style={styles.cardTitle}>Recent Activity</Text>
          <View style={styles.activityList}>
            {[
              { icon: '🛒', iconBg: colors.quickActionGreen, title: 'New order from Sharma Hardware', time: '10 mins ago', amount: '+₹15,000' },
              { icon: '📍', iconBg: colors.quickActionBlue, title: 'Completed visit at Gupta Traders', time: '45 mins ago', amount: null },
              { icon: '👤', iconBg: colors.quickActionYellow, title: 'New lead added: Metro Paints', time: '2 hours ago', amount: null },
              { icon: '📦', iconBg: colors.quickActionOrange, title: 'Pre-order confirmed: Kumar Supplies', time: '3 hours ago', amount: '+₹25,000' },
            ].map((activity, index) => (
              <View key={index} style={styles.activityItem}>
                <View style={[styles.activityIcon, { backgroundColor: activity.iconBg }]}>
                  <Text style={styles.activityEmoji}>{activity.icon}</Text>
                </View>
                <View style={styles.activityContent}>
                  <Text style={styles.activityTitle}>{activity.title}</Text>
                  <Text style={styles.activityTime}>{activity.time}</Text>
                </View>
                {activity.amount && (
                  <Text style={styles.activityAmount}>{activity.amount}</Text>
                )}
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
      </View>
    </AppLayout>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 100,
  },
  punchCard: {
    marginBottom: 24,
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 12,
  },
  punchCardGradient: {
    backgroundColor: colors.white,
    padding: 24,
  },
  punchTimeSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    backgroundColor: colors.background,
    borderRadius: 16,
    padding: 16,
  },
  timeBlock: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  timeIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeInfo: {
    flex: 1,
  },
  timeLabel: {
    fontSize: 11,
    color: colors.gray,
    marginBottom: 4,
    fontWeight: '500',
  },
  timeValue: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.dark,
    letterSpacing: 0.5,
  },
  timeDivider: {
    width: 2,
    height: 50,
    backgroundColor: colors.border,
    marginHorizontal: 12,
    borderRadius: 1,
  },
  punchButton: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: colors.headerGradientStart,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 6,
  },
  punchButtonContent: {
    backgroundColor: colors.headerGradientStart,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    gap: 12,
  },
  cameraIconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  punchButtonText: {
    color: colors.white,
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.dark,
    marginBottom: 16,
    marginTop: 4,
  },
  quickActionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  quickActionButton: {
    width: '48%',
    height: 110,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  quickActionText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.dark,
    marginTop: 10,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    gap: 12,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: 14,
    padding: 18,
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  summaryIconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 13,
    color: colors.gray,
    marginBottom: 6,
    fontWeight: '500',
  },
  summaryValue: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.dark,
  },
  metricsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    marginBottom: 20,
  },
  metricCard: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  metricIconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  metricLabel: {
    fontSize: 11,
    color: colors.gray,
    marginBottom: 6,
    textAlign: 'center',
    fontWeight: '500',
  },
  metricValue: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.dark,
    textAlign: 'center',
  },
  leaveBalanceCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  leaveHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  leaveHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  leaveTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.dark,
  },
  applyLeaveText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.headerGradientStart,
  },
  leaveStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 16,
  },
  leaveStatItem: {
    alignItems: 'center',
  },
  leaveStatValue: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  leaveStatLabel: {
    fontSize: 12,
    color: colors.gray,
    fontWeight: '500',
  },
  targetCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  targetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  targetHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  targetTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.dark,
  },
  targetPercentage: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.headerGradientStart,
  },
  progressBar: {
    height: 8,
    backgroundColor: colors.background,
    borderRadius: 4,
    marginBottom: 16,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.headerGradientStart,
    borderRadius: 4,
  },
  targetStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  targetStatItem: {
    flex: 1,
  },
  targetStatLabel: {
    fontSize: 12,
    color: colors.gray,
    marginBottom: 4,
    fontWeight: '500',
  },
  targetStatValue: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.dark,
  },
  performanceCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  performanceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  performanceHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  performanceTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.dark,
  },
  performanceToggle: {
    flexDirection: 'row',
    backgroundColor: colors.background,
    borderRadius: 8,
    padding: 2,
  },
  toggleButtonActive: {
    backgroundColor: colors.white,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 6,
  },
  toggleButton: {
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  toggleTextActive: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.dark,
  },
  toggleText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.gray,
  },
  chartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 120,
    marginBottom: 20,
  },
  barWrapper: {
    flex: 1,
    alignItems: 'center',
  },
  barContainer: {
    height: 100,
    justifyContent: 'flex-end',
    marginBottom: 8,
  },
  bar: {
    width: 28,
    backgroundColor: colors.headerGradientStart,
    borderRadius: 4,
  },
  barLabel: {
    fontSize: 11,
    color: colors.gray,
    fontWeight: '500',
  },
  performanceFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  performanceFooterItem: {
    flex: 1,
  },
  performanceFooterLabel: {
    fontSize: 12,
    color: colors.gray,
    marginBottom: 4,
    fontWeight: '500',
  },
  performanceFooterValue: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.dark,
  },
  productMixCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  productMixContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 24,
    marginTop: 16,
  },
  donutChartContainer: {
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  donutChart: {
    width: 90,
    height: 90,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  donutSegment: {
    position: 'absolute',
  },
  donutCenter: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.white,
    position: 'absolute',
    zIndex: 10,
  },
  productMixLegend: {
    flex: 1,
    gap: 12,
  },
  legendRow: {
    flexDirection: 'row',
    gap: 16,
  },
  legendItem: {
    flex: 1,
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
    flex: 1,
  },
  legendLabel: {
    fontSize: 12,
    color: colors.gray,
    marginBottom: 2,
  },
  legendValue: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.dark,
  },
  topOutletsCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.dark,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.gradientStart,
  },
  outletsList: {
    gap: 12,
  },
  outletItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.background,
  },
  outletLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  rankBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rankText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.dark,
  },
  outletName: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.dark,
    flex: 1,
  },
  outletRight: {
    alignItems: 'flex-end',
    gap: 4,
  },
  outletAmount: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.dark,
  },
  outletChange: {
    fontSize: 12,
    fontWeight: '600',
  },
  recentActivityCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  activityList: {
    marginTop: 16,
    gap: 16,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  activityIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activityEmoji: {
    fontSize: 20,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.dark,
    marginBottom: 4,
  },
  activityTime: {
    fontSize: 12,
    color: colors.gray,
  },
  activityAmount: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.success,
  },
});

export default HomeScreen;