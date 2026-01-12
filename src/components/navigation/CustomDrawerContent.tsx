import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  FlatList,
} from 'react-native';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import { useAuth } from '../../hooks/useAuth';
import { COLORS } from '../../context/ThemeContext';
import { renderLogo } from '../../utils/renderlogo';
import icons from '../../constants/icons';
import { useTheme } from '../../context/ThemeContext';

interface CustomDrawerContentProps {
  navigation: any;
}

interface DrawerItem {
  id: string;
  title: string;
  icon: any;
  onPress: () => void;
  section?: string;
}

const SectionHeader = ({ title }: { title: string }) => (
  <Text style={styles.sectionHeader}>{title}</Text>
);

const CustomDrawerContent: React.FC<CustomDrawerContentProps> = props => {
  const { logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', style: 'destructive', onPress: () => logout() },
    ]);
  };
  //   const themedContainer = [
  //   styles.container,
  //   theme === 'dark' ? { backgroundColor: '#22223b' } : null,
  // ];
  const themedStyles = {
    container: {
      ...styles.container,
      backgroundColor: theme === 'dark' ? '#22223b' : '#ffffff',
    },
    topBarText: {
      ...styles.topBarText,
      color: theme === 'dark' ? '#ffffff' : COLORS.dark,
    },
    menuText: {
      ...styles.menuText,
      color: theme === 'dark' ? '#ffffff' : COLORS.dark,
    },
  };
  const comingSoon = () =>
    Alert.alert('Coming soon', 'This feature will be available shortly.');

  // ✅ Drawer Items
  const drawerItems: DrawerItem[] = [
    {
      id: 'dashboard',
      title: 'Dashboard',
      icon: icons.ic_dashboard,
      onPress: () =>
        props.navigation.navigate('CustomerList', { screen: 'Dashboard' }),

      section: 'Top',
    },
    // My Work
    {
      id: 'activities',
      title: 'Activities',
      icon: icons.ic_Activities,
      onPress: () =>
        props.navigation.navigate('CustomerConsole', {
          screen: 'CustomerList',
          params: { screen: 'ActivitesScreen' },
        }),
      section: 'My Work',
    },
    {
      id: 'email',
      title: 'Email',
      icon: icons.ic_Email,
      onPress: () =>
        props.navigation.navigate('CustomerConsole', {
          screen: 'CustomerList',
          params: { screen: 'EmailScreen' },
        }),
      section: 'My Work',
    },
    {
      id: 'tasks',
      title: 'Tasks',
      icon: icons.ic_task,
      onPress: () =>
        props.navigation.navigate('CustomerConsole', {
          screen: 'CustomerList',
          params: { screen: 'TaskScreen' },
        }),
      section: 'My Work',
    },
    {
      id: 'phonecalls',
      title: 'Phones Calls',
      icon: icons.ic_PhoneCalls,
      onPress: () =>
        props.navigation.navigate('CustomerConsole', {
          screen: 'CustomerList',
          params: { screen: 'PhoneCallScreen' },
        }),
      section: 'My Work',
    },
    {
      id: 'chat',
      title: 'Chat',
      icon: icons.ic_chat,
      onPress: () =>
        props.navigation.navigate('CustomerConsole', {
          screen: 'CustomerList',
          params: { screen: 'ChatScreen' },
        }),
      section: 'My Work',
    },
    // Customer
    {
      id: 'account',
      title: 'Account',
      icon: icons.ic_account,
      onPress: () =>
        props.navigation.navigate('CustomerConsole', {
          screen: 'CustomerList',
          params: { screen: 'AccountScreen' },
        }),
      section: 'Customer',
    },
    {
      id: 'contacts',
      title: 'Contacts',
      icon: icons.ic_contacts,
      onPress: () =>
        props.navigation.navigate('CustomerConsole', {
          screen: 'CustomerList',
          params: { screen: 'ContactScreen' },
        }),
      section: 'Customer',
    },
    // Service
    {
      id: 'cases',
      title: 'Cases',
      icon: icons.ic_cases,
      onPress: () =>
        props.navigation.navigate('CustomerConsole', {
          screen: 'CustomerList',
          params: { screen: 'CaseScreen' },
        }),
      section: 'Service',
    },
    {
      id: 'queues',
      title: 'Queues',
      icon: icons.ic_queues,
      onPress: () =>
        props.navigation.navigate('CustomerConsole', {
          screen: 'CustomerList',
          params: { screen: 'QueuesScreen' },
        }),
      section: 'Service',
    },
    {
      id: 'knowledge',
      title: 'Knowledge Articles',
      icon: icons.ic_Knowlegearticle,
      onPress: () =>
        props.navigation.navigate('CustomerConsole', {
          screen: 'CustomerList',
          params: { screen: 'knowledgeArticleScreen' },
        }),
      section: 'Service',
    },
    {
      id: 'product',
      title: 'Product',
      icon: icons.ic_product,
      onPress: () =>
        props.navigation.navigate('CustomerConsole', {
          screen: 'CustomerList',
          params: { screen: 'ProductScreen' },
        }),
      section: 'Service',
    },
    {
      id: 'pricelist',
      title: 'Price List',
      icon: icons.ic_pricelist,
      onPress: () =>
        props.navigation.navigate('CustomerConsole', {
          screen: 'CustomerList',
          params: { screen: 'PriceScreen' },
        }),
      section: 'Service',
    },
  ];

  // ✅ Group items by section
  const groupedItems = drawerItems.reduce<Record<string, DrawerItem[]>>(
    (acc, item) => {
      if (!acc[item.section!]) acc[item.section!] = [];
      acc[item.section!].push(item);
      return acc;
    },
    {},
  );

  const renderItem = ({ item }: { item: DrawerItem }) => (
    <TouchableOpacity style={styles.menuItem} onPress={item.onPress}>
      {renderLogo(item.icon, { width: 18, height: 18, marginRight: 12 })}
      <Text style={themedStyles.menuText}>{item.title}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={themedStyles.container}>
      <DrawerContentScrollView
        {...props}
        contentContainerStyle={styles.scrollView}
        bounces={false}
      >
        {/* 🔥 New Top Bar (Home + Apps) */}
        <View style={styles.topBar}>
          <TouchableOpacity style={styles.topBarItem}>
            {renderLogo(icons.ic_home, {
              width: 18,
              height: 18,
              marginRight: 6,
            })}
            <Text style={themedStyles.topBarText}>Home</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.topBarItem}>
            <Text style={themedStyles.topBarText}>Apps</Text>
            {renderLogo(icons.ic_back_arrow, {
              width: 18,
              height: 18,
              marginRight: 6,
            })}
          </TouchableOpacity>
          <TouchableOpacity onPress={toggleTheme} style={styles.iconButton}>
            <Text style={{ color: 'black', fontSize: 16 }}>
              {theme === 'dark' ? '🌙' : '☀️'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.divider} />

        {Object.keys(groupedItems).map((section, index, arr) => (
          <View key={section}>
            {section !== 'Top' && <SectionHeader title={section} />}
            <FlatList
              data={groupedItems[section]}
              keyExtractor={item => item.id}
              renderItem={renderItem}
              scrollEnabled={false}
            />
            {/* 🔥 Divider after Dashboard, My Work, Customer */}
            {['Top', 'My Work', 'Customer'].includes(section) && (
              <View style={styles.divider} />
            )}
          </View>
        ))}
      </DrawerContentScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutIcon}>🚪</Text>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
        <View style={styles.versionInfo}>
          <Text style={styles.versionText}>Version 1.0.0</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
  scrollView: { flexGrow: 1 },

  // 🔥 New Top Bar
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    alignItems: 'center',
  },
  iconButton: {
    padding: 8,
    marginLeft: 8,
  },
  topBarItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  topBarText: { fontSize: 14, fontWeight: '600', color: COLORS.dark },
  topBarText1: { fontSize: 14, fontWeight: '600', color: '#0F6CBD' },

  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 10,
    width: '120%',
    right: 20,
  },
  sectionHeader: {
    fontSize: 12,
    color: COLORS.gray,
    textTransform: 'uppercase',
    marginTop: 8,
    marginBottom: 4,
    paddingHorizontal: 16,
  },
  menuItem: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  menuText: { fontSize: 14, color: COLORS.dark },
  footer: { borderTopWidth: 1, borderTopColor: COLORS.border, padding: 20 },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: COLORS.error + '10',
    borderRadius: 8,
    marginBottom: 15,
  },
  logoutIcon: { fontSize: 20, marginRight: 12 },
  logoutText: { fontSize: 16, color: COLORS.error, fontWeight: '500' },
  versionInfo: { alignItems: 'center' },
  versionText: { fontSize: 12, color: COLORS.gray },
});

export default CustomDrawerContent;
