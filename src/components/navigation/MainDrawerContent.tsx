import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import { COLORS } from '../../context/ThemeContext';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../hooks/useAuth';
import { renderLogo } from '../../utils/renderlogo';
// import images from '@/constants/images';
import icons from '../../constants/icons';
// import { renderLogo } from '../../utils/renderLogo'; // <-- import your function

type Props = {
  navigation: any;
};

const MainDrawerContent = (props: Props) => {
  const { user, logout } = useAuth() as any;
  const { theme } = useTheme();

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', style: 'destructive', onPress: () => logout() },
    ]);
  };

  const menuItems = [
    { label: 'Edit Profile', icon: icons.Frame, screen: 'Profile' },
    { label: 'Change Password', icon: icons.Frame1, screen: 'ChangePassword' },
    { label: 'Role & Module', icon: icons.ic_role, screen: 'RoleModule' },
    { label: 'About', icon: icons.ic_information, screen: 'About' },
    {
      label: 'Privacy & Cookies',
      icon: icons.ic_Security_permission,
      screen: 'Privacy',
    },
    { label: 'Legal Terms', icon: icons.ic_user_group, screen: 'Legal' },
  ];

  const themedContainer = {
    container: {
      ...styles.container,
      ...(theme === 'dark' ? { backgroundColor: '#22223b' } : null),
    },
    menuText: {
      ...styles.menuText,
      color: theme === 'dark' ? '#ffffff' : COLORS.dark,
    },
    profileText: {
      ...styles.profileText,
      color: theme === 'dark' ? '#ffffff' : COLORS.dark,
    },
  };
  return (
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={themedContainer.container}
      bounces={false}
    >
      {/* Profile Section */}
      <View style={styles.profileSection}>
        <Image
          source={
            user?.avatar
              ? { uri: user.avatar }
              : {
                  uri: 'https://ui-avatars.com/api/?name=John+Doe&background=0D8ABC&color=fff&rounded=true',
                }
          }
          style={styles.avatar}
        />
        <Text style={styles.name}>{user?.role || 'Support Admin'}</Text>
        <Text style={styles.email}>
          {user?.email || 'support.admin@gmail.com'}
        </Text>
        <TouchableOpacity>
          <Text style={styles.link}>
            {user?.firstName + user?.lastName || 'John Doe'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Divider */}
      <View style={styles.divider} />
      <Text style={themedContainer.profileText}>Profile</Text>
      {/* Menu Items */}
      <View style={styles.menuContainer}>
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.menuItem}
            onPress={() => props.navigation.navigate(item.screen)}
          >
            {renderLogo(item.icon, { width: 18, height: 18, marginRight: 12 })}
            <Text style={themedContainer.menuText}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Logout */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        {renderLogo(icons.ic_log_out, {
          width: 18,
          height: 18,
          marginRight: 12,
        })}
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>
    </DrawerContentScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 8,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.dark,
  },
  email: {
    fontSize: 13,
    color: COLORS.gray,
    marginBottom: 4,
  },
  profileText: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
  },

  link: {
    fontSize: 13,
    color: COLORS.primary,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 12,
  },
  menuContainer: {
    marginBottom: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  menuText: {
    fontSize: 14,
    color: COLORS.dark,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.error + '15',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginTop: 'auto',
  },
  logoutText: {
    fontSize: 14,
    color: COLORS.error,
    fontWeight: '600',
  },
});

export default MainDrawerContent;
