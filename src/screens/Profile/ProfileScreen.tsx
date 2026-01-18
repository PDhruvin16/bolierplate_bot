import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
} from 'react-native';
import AppLayout from '../../components/layouts/AppLayout';
import colors from '../../constants/colors';
import {
  Mail,
  Phone,
  MapPin,
  Sun,
  Languages,
  Bell,
  Shield,
  HelpCircle,
  ChevronRight,
  Target,
  LogOut,
} from 'lucide-react-native';
import { CustomHeaderProps } from '../../components/common/CustomHeader';
import { useAuth } from '../../hooks/useAuth';
import CustomButton from '../../components/common/CustomButton';

const ProfileScreen: React.FC = () => {
  const [darkMode, setDarkMode] = useState(false);
  const { user, logout } = useAuth();
  const userData = user as any;

  const headerProps: CustomHeaderProps = {
    variant: { type: 'basic', title: 'Profile' },
  };

  return (
    <AppLayout headerProps={headerProps}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {userData?.name?.charAt(0)?.toUpperCase() || 'R'}
              </Text>
            </View>
          </View>
          <Text style={styles.name}>{userData?.name || 'Rajesh Kumar'}</Text>
          <Text style={styles.designation}>Executive</Text>
          <View style={styles.locationRow}>
            <MapPin size={14} color={colors.headerGradientStart} />
            <Text style={styles.locationText}>
              {userData?.location || 'Mumbai West'}
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.contactInfo}>
            <View style={styles.contactRow}>
              <Mail size={16} color={colors.gray} />
              <Text style={styles.contactText}>
                {userData?.email || 'rajesh@toagosei.in'}
              </Text>
            </View>
            <View style={styles.contactRow}>
              <Phone size={16} color={colors.gray} />
              <Text style={styles.contactText}>+91 7984252173</Text>
            </View>
          </View>
        </View>

        {/* Monthly Target Card */}
        <View style={styles.targetCard}>
          <View style={styles.targetIconContainer}>
            <Target size={20} color={colors.headerGradientStart} />
          </View>
          <View style={styles.targetInfo}>
            <Text style={styles.targetLabel}>Monthly Target</Text>
            <Text style={styles.targetValue}>₹5.0L</Text>
          </View>
        </View>

        {/* Settings Section */}
        <Text style={styles.sectionTitle}>Settings</Text>

        {/* Dark Mode */}
        <View style={styles.settingCard}>
          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <View style={styles.settingIconContainer}>
                <Sun size={20} color={colors.headerGradientStart} />
              </View>
              <Text style={styles.settingText}>Dark Mode</Text>
            </View>
            <Switch
              value={darkMode}
              onValueChange={setDarkMode}
              trackColor={{
                false: colors.lightGray,
                true: colors.headerGradientStart,
              }}
              thumbColor={colors.white}
            />
          </View>
        </View>

        {/* Language */}
        <TouchableOpacity style={styles.settingCard}>
          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <View style={styles.settingIconContainer}>
                <Languages size={20} color={colors.headerGradientStart} />
              </View>
              <Text style={styles.settingText}>Language</Text>
            </View>
            <View style={styles.settingRight}>
              <Text style={styles.settingValue}>English</Text>
              <ChevronRight size={20} color={colors.gray} />
            </View>
          </View>
        </TouchableOpacity>

        {/* Notifications */}
        <TouchableOpacity style={styles.settingCard}>
          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <View style={styles.settingIconContainer}>
                <Bell size={20} color={colors.headerGradientStart} />
              </View>
              <Text style={styles.settingText}>Notifications</Text>
            </View>
            <ChevronRight size={20} color={colors.gray} />
          </View>
        </TouchableOpacity>

        {/* Privacy & Security */}
        <TouchableOpacity style={styles.settingCard}>
          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <View style={styles.settingIconContainer}>
                <Shield size={20} color={colors.headerGradientStart} />
              </View>
              <Text style={styles.settingText}>Privacy & Security</Text>
            </View>
            <ChevronRight size={20} color={colors.gray} />
          </View>
        </TouchableOpacity>

        {/* Help & Support */}
        <TouchableOpacity style={styles.settingCard}>
          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <View style={styles.settingIconContainer}>
                <HelpCircle size={20} color={colors.headerGradientStart} />
              </View>
              <Text style={styles.settingText}>Help & Support</Text>
            </View>
            <ChevronRight size={20} color={colors.gray} />
          </View>
        </TouchableOpacity>

        {/* Logout Button */}
        <View style={styles.logoutContainer}>
          <CustomButton
            title="Logout"
            onPress={logout}
            variant="outline"
            icon={<LogOut size={18} color={colors.headerGradientStart} />}
          />
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
    paddingTop: 16,
    paddingBottom: 24,
  },
  profileCard: {
    backgroundColor: colors.white,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 16,
    padding: 20,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.headerGradientStart,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  avatarText: {
    fontSize: 36,
    fontWeight: '700',
    color: colors.white,
  },
  name: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.dark,
    textAlign: 'center',
    marginBottom: 4,
  },
  designation: {
    fontSize: 14,
    color: colors.gray,
    textAlign: 'center',
    marginBottom: 8,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    marginBottom: 16,
  },
  locationText: {
    fontSize: 13,
    color: colors.headerGradientStart,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: colors.lightGray,
    marginVertical: 16,
  },
  contactInfo: {
    gap: 12,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  contactText: {
    fontSize: 14,
    color: colors.gray,
  },
  targetCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    padding: 16,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  targetIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: `${colors.headerGradientStart}15`,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  targetInfo: {
    flex: 1,
  },
  targetLabel: {
    fontSize: 13,
    color: colors.gray,
    marginBottom: 4,
  },
  targetValue: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.dark,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.gray,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginHorizontal: 16,
    marginTop: 24,
    marginBottom: 12,
  },
  settingCard: {
    backgroundColor: colors.white,
    marginHorizontal: 16,
    marginBottom: 1,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: `${colors.headerGradientStart}10`,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingText: {
    fontSize: 15,
    color: colors.dark,
    fontWeight: '500',
  },
  settingRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  settingValue: {
    fontSize: 14,
    color: colors.gray,
  },
  logoutContainer: {
    marginHorizontal: 16,
    marginTop: 24,
  },
});

export default ProfileScreen;