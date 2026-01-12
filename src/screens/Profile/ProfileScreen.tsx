import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useAuth } from '../../hooks/useAuth';
import { COLORS } from '../../context/ThemeContext';
import { STRINGS } from '../../constants/strings';
import CustomButton from '../../components/common/CustomButton';
import log from '../../utils/logger';

const ProfileScreen = () => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <ScrollView style={styles.container} bounces={false}>
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarText}>{user?.name?.charAt(0) || 'U'}</Text>
        </View>
        <Text style={styles.name}>{user?.name || 'User'}</Text>
        <Text style={styles.email}>{user?.email || 'user@example.com'}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account Information</Text>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Name:</Text>
          <Text style={styles.value}>{user?.name || 'Not set'}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Email:</Text>
          <Text style={styles.value}>{user?.email || 'Not set'}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Member since:</Text>
          <Text style={styles.value}>January 2024</Text>
        </View>
      </View>

      <View style={styles.actions}>
        <CustomButton
          title="Edit Profile"
          onPress={() => log.debug('Edit Profile')}
          style={styles.actionButton}
        />
        <CustomButton
          title="Change Password"
          onPress={() => log.debug('Change Password')}
          variant="outline"
          style={styles.actionButton}
        />
        <CustomButton
          title="Settings"
          onPress={() => log.debug('Settings')}
          variant="outline"
          style={styles.actionButton}
        />
        <CustomButton
          title={STRINGS.LOGOUT}
          onPress={handleLogout}
          variant="outline"
          style={styles.logoutButton}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    backgroundColor: COLORS.white,
    padding: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.dark,
    marginBottom: 4,
  },
  email: {
    fontSize: 16,
    color: COLORS.gray,
  },
  section: {
    backgroundColor: COLORS.white,
    margin: 16,
    padding: 16,
    borderRadius: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.dark,
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  label: {
    fontSize: 16,
    color: COLORS.gray,
    fontWeight: '500',
  },
  value: {
    fontSize: 16,
    color: COLORS.dark,
    flex: 1,
    textAlign: 'right',
  },
  actions: {
    padding: 16,
  },
  actionButton: {
    marginBottom: 12,
  },
  logoutButton: {
    marginTop: 20,
  },
});

export default ProfileScreen;
