import React, { ReactNode } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import colors from '../../constants/colors';
import { Bell } from 'lucide-react-native';

interface HeaderVariant {
  type: 'home' | 'basic';
  title?: string;
  subtitle?: string;
  location?: string;
  showProfile?: boolean;
  profileImage?: string;
}

export interface CustomHeaderProps {
  variant: HeaderVariant;
  onSearch?: () => void;
  onAdd?: () => void;
  onSettings?: () => void;
  onNotificationPress?: () => void;
  notificationCount?: number;
  bottomContent?: ReactNode;
}

const CustomHeader: React.FC<CustomHeaderProps> = ({
  variant,
  onSearch,
  onAdd,
  onSettings,
  onNotificationPress,
  notificationCount,
  bottomContent,
}) => {
  const renderHomeHeader = () => (
    <View style={styles.homeContainer}>
      <View style={styles.homeTextWrapper}>
        <Text style={styles.homeSubtitle}>
          {variant.subtitle || 'Welcome Back'}
        </Text>
        <Text style={styles.homeTitle}>{variant.title || 'User'}</Text>
        {variant.location && (
          <View style={styles.locationPill}>
            <Text style={styles.locationIcon}>📍</Text>
            <Text style={styles.locationText}>{variant.location}</Text>
          </View>
        )}
      </View>
      {variant.showProfile && (
        <TouchableOpacity style={styles.profileContainer}>
          <Image
            source={
              variant.profileImage
                ? { uri: variant.profileImage }
                : {
                    uri: 'https://ui-avatars.com/api/?name=Field+Force&background=F7931E&color=fff&rounded=true',
                  }
            }
            style={styles.profileImage}
          />
        </TouchableOpacity>
      )}
    </View>
  );

  const renderBasicHeader = () => (
    <View style={styles.leftSection}>
      <View>
        <Text style={styles.title}>{variant.title || 'Title'}</Text>
        {variant.subtitle && (
          <Text style={styles.basicSubtitle}>{variant.subtitle}</Text>
        )}
      </View>
    </View>
  );

  const renderLeftContent = () => {
    switch (variant.type) {
      case 'home':
        return renderHomeHeader();
      default:
        return renderBasicHeader();
    }
  };

  const headerGradient = [colors.headerGradientStart, colors.headerGradientEnd];

  return (
    <>
      {/* <StatusBar
        barStyle="light-content"
        backgroundColor={gradientColors[0]}
        translucent={false}
      /> */}
      <LinearGradient
        colors={headerGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <View style={styles.header}>
          <View style={styles.topRow}>
            {renderLeftContent()}
            <View style={styles.rightSection}>
              {onSearch && (
                <TouchableOpacity onPress={onSearch} style={styles.iconButton}>
                  {/* hook up search icon if needed */}
                </TouchableOpacity>
              )}
              {onAdd && (
                <TouchableOpacity onPress={onAdd} style={styles.iconButton} />
              )}
              {onSettings && (
                <TouchableOpacity
                  onPress={onSettings}
                  style={styles.iconButton}
                />
              )}
              {onNotificationPress && (
                <TouchableOpacity
                  onPress={onNotificationPress}
                  style={styles.notificationButton}
                >
                  <Bell size={20} color={colors.white} />
                  {notificationCount && notificationCount > 0 && (
                    <View style={styles.badge}>
                      <Text style={styles.badgeText}>
                        {notificationCount > 9 ? '9+' : notificationCount}
                      </Text>
                    </View>
                  )}
                </TouchableOpacity>
              )}
            </View>
          </View>
          {bottomContent && (
            <View style={styles.bottomContent}>{bottomContent}</View>
          )}
        </View>
      </LinearGradient>

      {/* Dropdown Modal */}
  
    </>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 3.84,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 70,
  },
  bottomContent: {
    marginTop: 12,
  },
  leftSection: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  homeContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  homeTextWrapper: {
    flex: 1,
  },
  homeSubtitle: {
    color: colors.white,
    fontSize: 14,
    opacity: 0.9,
    marginBottom: 4,
  },
  homeTitle: {
    color: colors.white,
    fontSize: 24,
    fontWeight: '700',
  },
  locationPill: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  locationIcon: {
    fontSize: 14,
    marginRight: 6,
  },
  locationText: {
    color: colors.white,
    fontWeight: '600',
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  notificationButton: {
    marginLeft: 8,
    padding: 8,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.25)',
  },
  badge: {
    position: 'absolute',
    top: 4,
    right: 4,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#FF3B30',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  badgeText: {
    fontSize: 10,
    color: colors.white,
    fontWeight: '700',
  },
  gridIcon: {
    marginRight: 12,
  },
  gridDots: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: 21,
    height: 21,
  },
  dot: {
    width: 5,
    height: 5,
    backgroundColor: colors.white,
    margin: 1,
    borderRadius: 1,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.white,
    marginRight: 8,
  },
  basicSubtitle: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.9)',
    marginTop: 2,
  },
  dropdownArrow: {
    fontSize: 12,
    color: colors.white,
    opacity: 0.8,
  },
  profileContainer: {
    marginLeft: 12,
  },
  profileImage: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.white,
  },
  iconButton: {
    padding: 8,
    marginLeft: 8,
  },
  icon: {
    fontSize: 20,
    color: colors.white,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'flex-start',
    paddingTop: 100, // Adjust based on header height
  },
  dropdownContainer: {
    backgroundColor: colors.white,
    marginHorizontal: 20,
    borderRadius: 8,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
  },
  dropdownHeader: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  dropdownTitle: {
    fontSize: 12,
    color: colors.gray,
    fontWeight: '500',
  },
  dropdownList: {
    maxHeight: 200,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  radioButtonInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'transparent',
  },
  dropdownItemText: {
    fontSize: 16,
    color: colors.dark,
    flex: 1,
  },
});
export default CustomHeader;
