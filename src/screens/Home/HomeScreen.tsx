import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
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
  ChevronRight,
  Sparkles,
  Award,
  Target,
} from 'lucide-react-native';
import { LinearGradient } from 'react-native-linear-gradient';

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
          {/* Enhanced Punch In/Out Card */}
          <View style={styles.punchCard}>
            <View style={styles.punchCardInner}>
              <View style={styles.punchTimeSection}>
                <View style={styles.timeBlock}>
                  <View style={[styles.timeIconCircle, { backgroundColor: '#E8F5E9' }]}>
                    <Clock size={24} color="#31A24C" strokeWidth={2.5} />
                  </View>
                  <View style={styles.timeInfo}>
                    <Text style={styles.timeLabel}>First Punch In</Text>
                    <Text style={styles.timeValue}>{punchInTime || '--:--'}</Text>
                  </View>
                </View>
                
                <View style={styles.timeDivider} />
                
                <View style={styles.timeBlock}>
                  <View style={[styles.timeIconCircle, { backgroundColor: '#FFEBEE' }]}>
                    <Clock size={24} color="#D9534F" strokeWidth={2.5} />
                  </View>
                  <View style={styles.timeInfo}>
                    <Text style={styles.timeLabel}>Last Punch Out</Text>
                    <Text style={styles.timeValue}>{punchOutTime || '--:--'}</Text>
                  </View>
                </View>
              </View>
              
              <TouchableOpacity 
                style={styles.punchButton} 
                onPress={handlePunchIn}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={[colors.headerGradientStart, colors.headerGradientEnd]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  // style={styles.punchButtonGradient}
                >
                    <View style={styles.punchButtonGradient}>
                  <View style={styles.cameraIconWrapper}>
                    <Camera size={24} color={colors.white} strokeWidth={2.5} />
                  </View>
                  <Text style={styles.punchButtonText}>Punch In Now</Text>
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>

          {/* Enhanced Quick Actions */}
          <View style={styles.sectionHeader}>
            <Sparkles size={22} color={colors.headerGradientStart} strokeWidth={2.5} />
            <Text style={styles.sectionTitle}>Quick Actions</Text>
          </View>
          
          <View style={styles.quickActionsContainer}>
            {[
              { Icon: Camera, label: 'Punch In', bg: colors.quickActionGreen, iconColor: '#2F8F46' },
              { Icon: ShoppingBag, label: 'New Order', bg: colors.quickActionOrange, iconColor: '#D97A00' },
              { Icon: Store, label: 'Add Outlet', bg: colors.quickActionBlue, iconColor: '#1F6FB6' },
              { Icon: Users, label: 'Add Lead', bg: colors.quickActionYellow, iconColor: '#C28A00' },
            ].map((action, idx) => (
              <TouchableOpacity 
                key={idx} 
                style={[styles.quickActionButton, { backgroundColor: action.bg }]}
                activeOpacity={0.7}
              >
                <View style={styles.quickActionIconWrapper}>
                  <action.Icon size={32} color={action.iconColor} strokeWidth={2.5} />
                </View>
                <Text style={styles.quickActionText}>{action.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Enhanced Today's Summary */}
          <View style={styles.sectionHeader}>
            <Award size={22} color={colors.headerGradientStart} strokeWidth={2.5} />
            <Text style={styles.sectionTitle}>Today's Summary</Text>
          </View>
          
          <View style={styles.summaryRow}>
            <View style={styles.summaryCard}>
              <LinearGradient
                colors={['#1F6FB6', '#2980B9']}
                style={styles.summaryIconGradient}
              >
                <Clock size={24} color={colors.white} strokeWidth={2.5} />
              </LinearGradient>
              <Text style={styles.summaryLabel}>Working Hours</Text>
              <Text style={styles.summaryValue}>0h 0m</Text>
            </View>
            
            <View style={styles.summaryCard}>
              <LinearGradient
                colors={['#2F8F46', '#31A24C']}
                style={styles.summaryIconGradient}
              >
                <Navigation size={24} color={colors.white} strokeWidth={2.5} />
              </LinearGradient>
              <Text style={styles.summaryLabel}>Distance</Text>
              <Text style={styles.summaryValue}>14 km</Text>
            </View>
          </View>

          <View style={styles.summaryRow}>
            <View style={styles.summaryCard}>
              <LinearGradient
                colors={['#D97A00', '#E68A00']}
                style={styles.summaryIconGradient}
              >
                <Store size={24} color={colors.white} strokeWidth={2.5} />
              </LinearGradient>
              <Text style={styles.summaryLabel}>Visits</Text>
              <Text style={styles.summaryValue}>0</Text>
            </View>
            
            <View style={styles.summaryCard}>
              <LinearGradient
                colors={['#C28A00', '#D4A017']}
                style={styles.summaryIconGradient}
              >
                <ShoppingBag size={24} color={colors.white} strokeWidth={2.5} />
              </LinearGradient>
              <Text style={styles.summaryLabel}>Orders</Text>
              <Text style={styles.summaryValue}>4</Text>
            </View>
          </View>

          {/* Enhanced Key Metrics */}
          <View style={styles.sectionHeader}>
            <Target size={22} color={colors.headerGradientStart} strokeWidth={2.5} />
            <Text style={styles.sectionTitle}>Key Metrics</Text>
          </View>
          
          <View style={styles.metricsGrid}>
            {[
              { Icon: Calendar, label: 'Attendance', value: 'Absent', color: '#1F6FB6', bg: '#E3F2FD' },
              { Icon: FileText, label: 'Zero Orders', value: '0', color: '#D9534F', bg: '#FFEBEE' },
              { Icon: Phone, label: 'Calls', value: '0/0', color: '#2F8F46', bg: '#E8F5E9' },
            ].map((item, idx) => (
              <View key={idx} style={styles.metricCard}>
                <View style={[styles.metricIconWrapper, { backgroundColor: item.bg }]}>
                  <item.Icon size={24} color={item.color} strokeWidth={2.5} />
                </View>
                <Text style={styles.metricLabel}>{item.label}</Text>
                <Text style={styles.metricValue}>{item.value}</Text>
              </View>
            ))}
          </View>

          {/* Enhanced Leave Balance */}
          <View style={styles.leaveBalanceCard}>
            <View style={styles.cardHeader}>
              <View style={styles.cardHeaderLeft}>
                <Briefcase size={22} color={colors.headerGradientStart} strokeWidth={2.5} />
                <Text style={styles.cardTitle}>Leave Balance</Text>
              </View>
              <TouchableOpacity activeOpacity={0.7}>
                <Text style={styles.applyLeaveText}>Apply Leave →</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.leaveStats}>
              {[
                { value: '12', label: 'Casual', color: colors.headerOrange },
                { value: '6', label: 'Sick', color: colors.info },
                { value: '15', label: 'Earned', color: colors.success },
                { value: '2', label: 'Comp Off', color: colors.warning },
              ].map((item, idx) => (
                <View key={idx} style={styles.leaveStatItem}>
                  <Text style={[styles.leaveStatValue, { color: item.color }]}>{item.value}</Text>
                  <Text style={styles.leaveStatLabel}>{item.label}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Enhanced Target vs Achievement */}
          <View style={styles.targetCard}>
            <View style={styles.cardHeader}>
              <View style={styles.cardHeaderLeft}>
                <TrendingUp size={22} color={colors.headerGradientStart} strokeWidth={2.5} />
                <Text style={styles.cardTitle}>Target vs Achievement</Text>
              </View>
              <Text style={styles.targetPercentage}>71%</Text>
            </View>
            <View style={styles.progressBarContainer}>
              <View style={styles.progressBar}>
                <LinearGradient
                  colors={[colors.headerGradientStart, colors.headerGradientEnd]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={[styles.progressFill, { width: '71%' }]}
                />
              </View>
            </View>
            <View style={styles.targetStats}>
              <View style={styles.targetStatItem}>
                <Text style={styles.targetStatLabel}>Achievement</Text>
                <Text style={styles.targetStatValue}>₹3.5L</Text>
              </View>
              <View style={[styles.targetStatItem, { alignItems: 'flex-end' }]}>
                <Text style={styles.targetStatLabel}>Target</Text>
                <Text style={styles.targetStatValue}>₹5.0L</Text>
              </View>
            </View>
          </View>

          {/* Enhanced Performance */}
          <View style={styles.performanceCard}>
            <View style={styles.cardHeader}>
              <View style={styles.cardHeaderLeft}>
                <BarChart3 size={22} color={colors.headerGradientStart} strokeWidth={2.5} />
                <Text style={styles.cardTitle}>Performance</Text>
              </View>
              <View style={styles.performanceToggle}>
                <TouchableOpacity style={styles.toggleButtonActive} activeOpacity={0.7}>
                  <Text style={styles.toggleTextActive}>Weekly</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.toggleButton} activeOpacity={0.7}>
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
                      <LinearGradient
                        colors={[colors.headerGradientEnd, colors.headerGradientStart]}
                        style={[styles.bar, { height: heights[index] }]}
                      />
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

          {/* Enhanced Top Outlets */}
          <View style={styles.topOutletsCard}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Top Outlets</Text>
              <TouchableOpacity style={styles.viewAllButton} activeOpacity={0.7}>
                <Text style={styles.viewAllText}>View All</Text>
                <ChevronRight size={16} color={colors.headerGradientStart} strokeWidth={2.5} />
              </TouchableOpacity>
            </View>
            <View style={styles.outletsList}>
              {[
                { rank: 1, name: 'Sharma Hardware', amount: '₹125K', change: '+12%', positive: true },
                { rank: 2, name: 'Gupta Traders', amount: '₹98K', change: '↓5%', positive: false },
                { rank: 3, name: 'Kumar Supplies', amount: '₹87K', change: '+8%', positive: true },
                { rank: 4, name: 'Singh & Sons', amount: '₹76K', change: '+15%', positive: true },
              ].map((outlet) => (
                <TouchableOpacity 
                  key={outlet.rank} 
                  style={styles.outletItem}
                  activeOpacity={0.7}
                >
                  <View style={styles.outletLeft}>
                    <LinearGradient
                      colors={['#E3F2FD', '#BBDEFB']}
                      style={styles.rankBadge}
                    >
                      <Text style={styles.rankText}>{outlet.rank}</Text>
                    </LinearGradient>
                    <Text style={styles.outletName}>{outlet.name}</Text>
                  </View>
                  <View style={styles.outletRight}>
                    <Text style={styles.outletAmount}>{outlet.amount}</Text>
                    <Text style={[styles.outletChange, { color: outlet.positive ? colors.success : colors.error }]}>
                      {outlet.change}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Enhanced Recent Activity */}
          <View style={styles.recentActivityCard}>
            <Text style={styles.cardTitle}>Recent Activity</Text>
            <View style={styles.activityList}>
              {[
                { icon: '🛒', bg: '#E8F5E9', title: 'New order from Sharma Hardware', time: '10 mins ago', amount: '+₹15,000' },
                { icon: '📍', bg: '#E3F2FD', title: 'Completed visit at Gupta Traders', time: '45 mins ago', amount: null },
                { icon: '👤', bg: '#FFF9E6', title: 'New lead added: Metro Paints', time: '2 hours ago', amount: null },
                { icon: '📦', bg: '#FFF3E0', title: 'Pre-order confirmed: Kumar Supplies', time: '3 hours ago', amount: '+₹25,000' },
              ].map((activity, index) => (
                <TouchableOpacity 
                  key={index} 
                  style={styles.activityItem}
                  activeOpacity={0.7}
                >
                  <View style={[styles.activityIcon, { backgroundColor: activity.bg }]}>
                    <Text style={styles.activityEmoji}>{activity.icon}</Text>
                  </View>
                  <View style={styles.activityContent}>
                    <Text style={styles.activityTitle}>{activity.title}</Text>
                    <Text style={styles.activityTime}>{activity.time}</Text>
                  </View>
                  {activity.amount && (
                    <Text style={styles.activityAmount}>{activity.amount}</Text>
                  )}
                </TouchableOpacity>
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
  
  // Enhanced Punch Card
  punchCard: {
    marginBottom: 24,
    borderRadius: 28,
    overflow: 'hidden',
    shadowColor: colors.headerGradientStart,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 10,
  },
  punchCardInner: {
    backgroundColor: colors.white,
    padding: 20,
  },
  punchTimeSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    backgroundColor: '#F8F9FA',
    borderRadius: 20,
    padding: 18,
  },
  timeBlock: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  timeIconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeInfo: {
    flex: 1,
  },
  timeLabel: {
    fontSize: 11,
    color: colors.gray,
    marginBottom: 6,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  timeValue: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.dark,
    letterSpacing: 1,
  },
  timeDivider: {
    width: 3,
    height: 56,
    backgroundColor: '#E0E0E0',
    marginHorizontal: 8,
    borderRadius: 2,
  },
  punchButton: {
    borderRadius: 18,
    overflow: 'hidden',
    shadowColor: colors.headerGradientStart,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
   
  },
  punchButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 14,
    padding:10
  },

  cameraIconWrapper: {
    width: 50,
    height: 50,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  },
  punchButtonText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 0.6,
  },
  
  // Section Headers
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 16,
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.dark,
  },
  
  // Enhanced Quick Actions
  quickActionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  quickActionButton: {
    width: '48%',
    height: 120,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 5,
  },
  quickActionIconWrapper: {
    marginBottom: 10,
  },
  quickActionText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.dark,
  },
  
  // Enhanced Summary Cards
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 14,
    gap: 14,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: 18,
    padding: 20,
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  summaryIconGradient: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  summaryLabel: {
    fontSize: 13,
    color: colors.gray,
    marginBottom: 8,
    fontWeight: '600',
  },
  summaryValue: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.dark,
  },
  
  // Enhanced Metrics
  metricsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 24,
  },
  metricCard: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: 18,
    padding: 18,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  metricIconWrapper: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  metricLabel: {
    fontSize: 11,
    color: colors.gray,
    marginBottom: 6,
    textAlign: 'center',
    fontWeight: '600',
  },
  metricValue: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.dark,
    textAlign: 'center',
  },
  
  // Enhanced Cards
  leaveBalanceCard: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 22,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  targetCard: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 22,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  performanceCard: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 22,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  topOutletsCard: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 22,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  recentActivityCard: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 22,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  cardHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  cardTitle: {
    fontSize: 19,
    fontWeight: '800',
    color: colors.dark,
  },
  
  // Leave Balance
  applyLeaveText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.headerGradientStart,
  },
  leaveStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#F8F9FA',
    borderRadius: 16,
    padding: 18,
  },
  leaveStatItem: {
    alignItems: 'center',
  },
  leaveStatValue: {
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 6,
  },
  leaveStatLabel: {
    fontSize: 12,
    color: colors.gray,
    fontWeight: '600',
  },
  
  // Target
  targetPercentage: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.headerGradientStart,
  },
  progressBarContainer: {
    marginBottom: 18,
  },
  progressBar: {
    height: 10,
    backgroundColor: '#F0F0F0',
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 5,
  },
  targetStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  targetStatItem: {
    flex: 1,
  },
  targetStatLabel: {
    fontSize: 13,
    color: colors.gray,
    marginBottom: 6,
    fontWeight: '600',
  },
  targetStatValue: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.dark,
  },
  
  // Performance
  performanceToggle: {
    flexDirection: 'row',
    backgroundColor: '#F0F0F0',
    borderRadius: 10,
    padding: 3,
  },
  toggleButtonActive: {
    backgroundColor: colors.white,
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  toggleButton: {
    paddingHorizontal: 18,
    paddingVertical: 8,
  },
  toggleTextActive: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.dark,
  },
  toggleText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.gray,
  },
  chartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 140,
    marginBottom: 20,
    paddingHorizontal: 4,
  },
  barWrapper: {
    flex: 1,
    alignItems: 'center',
  },
  barContainer: {
    height: 110,
    justifyContent: 'flex-end',
    marginBottom: 10,
  },
  bar: {
    width: 32,
    borderRadius: 6,
    shadowColor: colors.headerGradientStart,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  barLabel: {
    fontSize: 12,
    color: colors.gray,
    fontWeight: '600',
  },
  performanceFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 18,
    borderTopWidth: 2,
    borderTopColor: '#F0F0F0',
  },
  performanceFooterItem: {
    flex: 1,
  },
  performanceFooterLabel: {
    fontSize: 13,
    color: colors.gray,
    marginBottom: 6,
    fontWeight: '600',
  },
  performanceFooterValue: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.dark,
  },
  
  // Top Outlets
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  viewAllText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.headerGradientStart,
  },
  outletsList: {
    gap: 4,
  },
  outletItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 14,
    marginBottom: 4,
    backgroundColor: '#FAFBFC',
  },
  outletLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    flex: 1,
  },
  rankBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rankText: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.headerGradientStart,
  },
  outletName: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.dark,
    flex: 1,
  },
  outletRight: {
    alignItems: 'flex-end',
    gap: 6,
  },
  outletAmount: {
    fontSize: 17,
    fontWeight: '800',
    color: colors.dark,
  },
  outletChange: {
    fontSize: 13,
    fontWeight: '700',
  },
  
  // Recent Activity
  activityList: {
    marginTop: 16,
    gap: 12,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 14,
    borderRadius: 16,
    backgroundColor: '#FAFBFC',
  },
  activityIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activityEmoji: {
    fontSize: 24,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.dark,
    marginBottom: 6,
  },
  activityTime: {
    fontSize: 12,
    color: colors.gray,
    fontWeight: '600',
  },
  activityAmount: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.success,
  },
});
export default HomeScreen;