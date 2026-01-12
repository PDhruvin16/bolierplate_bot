import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Modal,
  FlatList,
  Image,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { COLORS } from '../../context/ThemeContext';
import icons from '../../constants/icons';
import { renderLogo } from '../../utils/renderlogo';
import log from '../../utils/logger';
import { DrawerActions, useNavigation } from '@react-navigation/native';

interface HeaderVariant {
  type: 'service_hub' | 'home' | 'basic';
  title?: string;
  showProfile?: boolean;
  profileImage?: string;
  dropdownItems?: Array<{
    id: string;
    title: string;
    onPress?: () => void;
  }>;
  selectedDropdownId?: string;
}

interface CustomHeaderProps {
  variant: HeaderVariant;
  onDrawerOpen?: () => void;
  onSearch?: () => void;
  onAdd?: () => void;
  onSettings?: () => void;
  gradientColors?: string[];
  openGrid?: () => void;
}

const CustomHeader: React.FC<CustomHeaderProps> = ({
  variant,
  onDrawerOpen,
  onSearch,
  onAdd,
  onSettings,
  openGrid,
  gradientColors,
}) => {
  const { theme, toggleTheme } = useTheme();
  const [showDropdown, setShowDropdown] = useState(false);
   const navigation = useNavigation();
 const openDrawer = () => {
    navigation.dispatch(DrawerActions.toggleDrawer());
  };

  const defaultDropdownItems = [
    {
      id: '1',
      title: 'Customer Service Interactive Dashboard',
      onPress: () => {
        log.debug('Navigate to Customer Service Interactive Dashboard');
        setShowDropdown(false);
      },
    },
    {
      id: '2',
      title: 'Customer Support Executive Dashboard',
      onPress: () => {
        log.debug('Navigate to Customer Support Executive Dashboard');
        setShowDropdown(false);
      },
    },
    {
      id: '3',
      title: 'Customer Support Manager Dashboard',
      onPress: () => {
        log.debug('Navigate to Customer Support Manager Dashboard');
        setShowDropdown(false);
      },
    },
  ];

  const dropdownItems = variant.dropdownItems || defaultDropdownItems;

  const renderDropdownItem = ({
    item,
  }: {
    item: { id: string; title: string; onPress?: () => void };
  }) => (
    <TouchableOpacity
      style={styles.dropdownItem}
      onPress={() => {
        item.onPress?.();
        setShowDropdown(false);
      }}
    >
      <View style={styles.radioButton}>
        <View
          style={[
            styles.radioButtonInner,
            item.id === variant.selectedDropdownId && { backgroundColor: '#404698' },
          ]}
        />
      </View>
      <Text style={styles.dropdownItemText}>{item.title}</Text>
    </TouchableOpacity>
  );

  const renderServiceHubHeader = () => (
    <View style={styles.leftSection}>
      <View style={styles.gridIcon}>
        <TouchableOpacity style={styles.gridDots} onPress={openDrawer}>
          {[...Array(9)].map((_, index) => (
            <View key={index} style={styles.dot} />
          ))}
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        style={styles.titleContainer}
        onPress={() => setShowDropdown(true)}
      >
        <Text style={styles.title}>Service Hub</Text>
        <Text style={styles.dropdownArrow}>▼</Text>
      </TouchableOpacity>
    </View>
  );

  const renderHomeHeader = () => (
    <View style={styles.leftSection}>
      {variant.showProfile && (
        <TouchableOpacity
          style={styles.profileContainer}
          onPress={openDrawer}
        >
          <Image
            source={
              variant.profileImage
                ? { uri: variant.profileImage }
                : {
                    uri: 'https://ui-avatars.com/api/?name=John+Doe&background=0D8ABC&color=fff&rounded=true',
                  } // Add your default avatar
            }
            style={styles.profileImage}
          />
        </TouchableOpacity>
      )}
      <Text style={styles.title}>{variant.title || 'Home'}</Text>
    </View>
  );

  const renderBasicHeader = () => (
    <View style={styles.leftSection}>
      <View style={styles.gridIcon}>
        <TouchableOpacity style={styles.gridDots} onPress={openDrawer}>
          {[...Array(9)].map((_, index) => (
            <View key={index} style={styles.dot} />
          ))}
        </TouchableOpacity>
      </View>
      {dropdownItems?.length ? (
        <TouchableOpacity
          style={styles.titleContainer}
          onPress={() => setShowDropdown(true)}
        >
          <Text style={styles.title}>{variant.title || 'Title'}</Text>
          <Text style={styles.dropdownArrow}>▼</Text>
        </TouchableOpacity>
      ) : (
        <Text style={styles.title}>{variant.title || 'Title'}</Text>
      )}
    </View>
  );

  const renderLeftContent = () => {
    switch (variant.type) {
      case 'service_hub':
        return renderServiceHubHeader();
      case 'home':
        return renderHomeHeader();
      default:
        return renderBasicHeader();
    }
  };

  // Theme colors
  const themeColors =
    theme === 'dark' ? ['#404698', '#882785'] : ['#404698', '#882785'];

  return (
    <>
      {/* <StatusBar
        barStyle="light-content"
        backgroundColor={gradientColors[0]}
        translucent={false}
      /> */}
      <LinearGradient
        colors={gradientColors || themeColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <View style={[styles.header]}>
          {renderLeftContent()}
          <View style={styles.rightSection}>
            {onSearch && (
              <TouchableOpacity onPress={onSearch} style={styles.iconButton}>
                {renderLogo(icons.ic_search, { width: 18, height: 18 })}
              </TouchableOpacity>
            )}
            {onAdd && (
              <TouchableOpacity onPress={onAdd} style={styles.iconButton}>
                {renderLogo(icons.ic_Newadd, { width: 18, height: 18 })}
              </TouchableOpacity>
            )}
            {onSettings && (
              <TouchableOpacity onPress={onSettings} style={styles.iconButton}>
                {renderLogo(icons.ic_settings, { width: 18, height: 18 })}
              </TouchableOpacity>
            )}
            {/* Theme toggle button */}
            {/* <TouchableOpacity onPress={toggleTheme} style={styles.iconButton}>
              <Text style={{ color: '#fff', fontSize: 16 }}>
                {theme === 'dark' ? '🌙' : '☀️'}
              </Text>
            </TouchableOpacity> */}
          </View>
        </View>
      </LinearGradient>

      {/* Dropdown Modal */}
      <Modal
        visible={showDropdown}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowDropdown(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          onPress={() => setShowDropdown(false)}
        >
          <View style={styles.dropdownContainer}>
            <View style={styles.dropdownHeader}>
              <Text style={styles.dropdownTitle}>Action_menu</Text>
            </View>
            <FlatList
              data={dropdownItems}
              renderItem={renderDropdownItem}
              keyExtractor={item => item.id}
              style={styles.dropdownList}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    minHeight: 60,
    // elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  headerDark: {
    backgroundColor: '#22223b',
  },
  leftSection: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
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
    backgroundColor: '#fff',
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
    color: '#fff',
    marginRight: 8,
  },
  dropdownArrow: {
    fontSize: 12,
    color: '#fff',
    opacity: 0.8,
  },
  profileContainer: {
    marginRight: 12,
  },
  profileImage: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#fff',
  },
  iconButton: {
    padding: 8,
    marginLeft: 8,
  },
  icon: {
    fontSize: 20,
    color: '#fff',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'flex-start',
    paddingTop: 100, // Adjust based on header height
  },
  dropdownContainer: {
    backgroundColor: '#fff',
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
    borderBottomColor: '#E5E5E5',
  },
  dropdownTitle: {
    fontSize: 12,
    color: '#666',
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
    borderBottomColor: '#F0F0F0',
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#DDD',
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
    color: '#333',
    flex: 1,
  },
});
export default CustomHeader;
