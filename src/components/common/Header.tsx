import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';

interface HeaderProps {
  title?: string;
  onProfilePress?: () => void;
  onSettingsPress?: () => void;
}

const Header: React.FC<HeaderProps> = ({
  title = '',
  onProfilePress,
  onSettingsPress,
}) => {
  const navigation = useNavigation();

  const openDrawer = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };

  return (
    <LinearGradient colors={['#4c669f', '#3b5998', '#192f6a']}>
      <View style={styles.headerContainer}>
        {/* Left Side - Drawer + Profile */}
        <View style={styles.leftSection}>
          <TouchableOpacity onPress={openDrawer} style={styles.iconButton}>
            <Ionicons name="menu" size={24} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity onPress={onProfilePress} style={styles.iconButton}>
            <Ionicons name="person-circle-outline" size={26} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Center Title */}
        <View style={styles.centerSection}>
          {title ? <Text style={styles.title}>{title}</Text> : null}
        </View>

        {/* Right Side - Settings */}
        <View style={styles.rightSection}>
          <TouchableOpacity onPress={onSettingsPress} style={styles.iconButton}>
            <Ionicons name="settings-outline" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'space-between',
    height: Platform.OS === 'ios' ? 100 : 70,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  centerSection: {
    flex: 1,
    alignItems: 'center',
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    marginHorizontal: 6,
  },
  title: {
    fontSize: 18,
    color: '#fff',
    fontWeight: '600',
  },
});

export default Header;
