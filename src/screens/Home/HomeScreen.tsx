import React, { FC, useState } from 'react';
import ChatbotModal from '../../components/common/ChatbotModal';
import { useAuth } from '../../hooks/useAuth';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import CustomHeader from '../../components/common/CustomHeader';
import { COLORS } from '../../context/ThemeContext';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import images from '../../constants/images';
import DashboardCharts from '../../components/common/DashboardCharts';
import { useTheme } from '../../context/ThemeContext';
import log from '../../utils/logger';
const hubs = [
  { id: 1, title: 'Marketing Hub', modified: '1 weeks ago' },
  { id: 2, title: 'Sales Hub', modified: '3 Days ago' },
  { id: 3, title: 'Customer Service Hub', modified: '1 weeks ago' },
];

interface HomeScreenProps {
  navigation: any;
}

export interface ChartData {
  title: string;
  type: 'pie' | 'donut' | 'bar' | 'radar' | 'funnel' | 'gauge';
  data: { x: string; y: number; color?: string }[];
}

const HomeScreen: FC<HomeScreenProps> = ({ navigation }) => {
  const charts: ChartData[] = [
    {
      title: 'Resolution Within SLA (%)',
      type: 'donut',
      data: [
        { x: 'Progress', y: 85, color: '#8e44ad' },
        { x: 'Remaining', y: 15, color: '#ecf0f1' },
      ],
    },
    {
      title: 'Top 5 Product vs Case',
      type: 'pie',
      data: [
        { x: 'Software', y: 30, color: '#9b59b6' },
        { x: 'Hardware', y: 20, color: '#f39c12' },
        { x: 'Network', y: 25, color: '#e74c3c' },
        { x: 'Security', y: 15, color: '#1abc9c' },
        { x: 'Inquiry', y: 10, color: '#3498db' },
      ],
    },
    {
      title: 'Average Resolution Time by Priority',
      type: 'bar',
      data: [
        { x: 'High', y: 50, color: '#9b59b6' },
        { x: 'Medium', y: 80, color: '#9b59b6' },
        { x: 'Low', y: 95, color: '#9b59b6' },
      ],
    },
    {
      title: 'Product vs Cases',
      type: 'radar',
      data: [
        { x: 'Product A', y: 100 },
        { x: 'Product B', y: 80 },
        { x: 'Product C', y: 60 },
      ],
    },
    {
      title: 'Case Status',
      type: 'funnel',
      data: [
        { x: 'Open', y: 100, color: 'green' },
        { x: 'Resolved', y: 80, color: 'lightgreen' },
        { x: 'On Hold', y: 60, color: 'blue' },
        { x: 'Cancelled', y: 40, color: 'red' },
        { x: 'Waiting', y: 20, color: 'orange' },
      ],
    },
    {
      title: 'Total Accounts',
      type: 'gauge',
      data: [
        { x: 'Active', y: 60, color: '#8e44ad' },
        { x: 'Inactive', y: 40, color: '#ecf0f1' },
      ],
    },
  ];
  const { theme } = useTheme();
  const drawerNavigation = useNavigation();
  const { user, logout } = useAuth();
  const themedStyles = {
    container: {
      ...styles.container,
      backgroundColor: theme === 'dark' ? '#000000' : COLORS.background1,
    },
    welcomeSection: {
      ...styles.welcomeSection,
      backgroundColor: theme === 'dark' ? '#000000' : '#F5F7FB',
    },
    hubCard: {
      ...styles.hubCard,
      backgroundColor: theme === 'dark' ? '#2F2F2F' : COLORS.white,
    },
    // navigationBox: {
    //   ...styles.navigationBox,
    //   backgroundColor: theme === 'dark' ? '#2c2c3e' : COLORS.white,
    // },
    // contentBox: {
    //   ...styles.contentBox,
    //   backgroundColor: theme === 'dark' ? '#23233a' : '#ECEFF5',
    // },
    // cardRow: styles.cardRow,
    // cardsContainer: styles.cardsContainer,
    // contentContainer: styles.contentContainer,
  };
  const [chatbotVisible, setChatbotVisible] = useState(false);

//  const openDrawer = () => {
//   // Use navigation from Drawer context
//   navigation.dispatch(DrawerActions.toggleDrawer());
// };
  const handleHubPress = (title: string) => {
    if (title === 'Customer Service Hub') {
      navigation.navigate('CustomerConsole');
    }
  };

  return (
    <View style={themedStyles.container}>
      <CustomHeader
        variant={{
          type: 'home',
          title: 'Home',
          showProfile: true,
          profileImage: 'https://i.pravatar.cc/300',
        }}
        onSearch={() => log.debug('Search pressed')}
        onAdd={() => log.debug('Add pressed')}
        onSettings={() => log.debug('Settings pressed')}
     
      />

      <ScrollView style={styles.content} bounces={false}>
        {/* Welcome Section */}
        <View style={themedStyles.welcomeSection}>
          <Text style={styles.welcomeTitle}>
            Welcome to the future of work!
          </Text>
          <Text style={styles.welcomeSubtitle}>Powered by Ai sante</Text>
        </View>
        {/* Hub List */}
        {hubs.map(hub => (
          <TouchableOpacity
            key={hub.id}
            style={themedStyles.hubCard}
            onPress={() => handleHubPress(hub.title)}
          >
            <View style={styles.hubLeft}>
              <View style={styles.hubIcon} />
              <View>
                <Text style={styles.hubTitle}>{hub.title}</Text>
                <Text style={styles.hubSub}>System</Text>
              </View>
            </View>
            <Text style={styles.hubModified}>Modified: {hub.modified}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Floating Button */}

      <TouchableOpacity
        style={styles.fab}
        onPress={() => setChatbotVisible(true)}
      >
        <Image
          source={images.loggo}
          style={{ width: 50, height: 50, resizeMode: 'contain' }}
        />
      </TouchableOpacity>

      <ChatbotModal
        visible={chatbotVisible}
        onClose={() => setChatbotVisible(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7FB' },
  content: { flex: 1 },
  welcomeSection: {
    padding: 16,
    alignItems: 'center',
    backgroundColor: '#F5F7FB',
  },
  welcomeTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#5B2C83',
    textAlign: 'center',
  },
  welcomeSubtitle: {
    fontSize: 14,
    color: '#6B6B6B',
    marginTop: 4,
    textAlign: 'center',
  },
  hubCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 12,
    borderRadius: 10,
  },
  hubLeft: { flexDirection: 'row', alignItems: 'center' },
  hubIcon: {
    width: 32,
    height: 32,
    backgroundColor: '#E0E0E0',
    borderRadius: 6,
    marginRight: 12,
  },
  hubTitle: { fontSize: 16, fontWeight: '600', color: COLORS.dark },
  hubSub: { fontSize: 12, color: COLORS.gray },
  hubModified: { fontSize: 12, color: COLORS.gray },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    // backgroundColor: COLORS.white,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    // shadowColor: '#000',
    // shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    // elevation: 4,
  },
});

export default HomeScreen;
