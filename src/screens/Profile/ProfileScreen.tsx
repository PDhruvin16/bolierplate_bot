import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import AppLayout from '../../components/layouts/AppLayout';
import colors from '../../constants/colors';
import { useAuth } from '../../hooks/useAuth';
import CustomButton from '../../components/common/CustomButton';

const ProfileScreen: React.FC = () => {
  const { user, logout } = useAuth();
  const userData = user as any;

  return (
    <AppLayout
      headerProps={{
        variant: { type: 'basic', title: 'Profile' },
      }}
    >
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <View style={styles.card}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {userData?.name?.charAt(0) || 'U'}
              </Text>
            </View>
          </View>
          <Text style={styles.name}>{userData?.name || 'User'}</Text>
          <Text style={styles.email}>{userData?.email || 'user@example.com'}</Text>
          <Text style={styles.location}>📍 {userData?.location || 'Location'}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Account Information</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Role:</Text>
            <Text style={styles.infoValue}>{userData?.role || 'Field Agent'}</Text>
          </View>
        </View>

        <CustomButton
          title="Logout"
          onPress={logout}
          variant="outline"
          style={{ marginTop: 8 }}
        />
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
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.headerOrange,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.white,
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.dark,
    textAlign: 'center',
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: colors.gray,
    textAlign: 'center',
    marginBottom: 8,
  },
  location: {
    fontSize: 14,
    color: colors.gray,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.dark,
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 14,
    color: colors.gray,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.dark,
  },
});

export default ProfileScreen;

