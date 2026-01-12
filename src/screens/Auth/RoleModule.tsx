import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  TouchableOpacity,
} from 'react-native';
import FooterButtonGroup from '../../components/common/FooterHeader';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../../context/ThemeContext';
import { renderLogo } from '../../utils/renderlogo';
import icons from '../../constants/icons';
const RoleModuleScreen = ({ navigation }: any) => {
  const roles = ['Admin', 'Manager', 'Super User', 'User'];
  const modules = [
    'Customer Service',
    'Admin Console',
    'Sales Hub',
    'Marketing Insights',
  ];
  const { theme } = useTheme();
  const onSave = () => {
    Alert.alert('Roles & Modules saved');
  };
  const themedStyles = {
    headerTitle: {
      ...styles.headerTitle,
      color: theme === 'dark' ? '#ffffff' : '#000',
    },
    section: {
      ...styles.section,
      backgroundColor: theme === 'dark' ? '#2F2F2F' : '#FFF',
    },
    sectionTitle: {
      ...styles.sectionTitle,
      color: theme === 'dark' ? '#ffffff' : '#000',
    },
    listItem: {
      ...styles.listItem,
      color: theme === 'dark' ? '#ffffff' : '#333',
    },
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View
        style={{ flex: 1, backgroundColor: theme === 'dark' ? '#000' : '#ECEFF5' }}
      >
        {/* <CustomHeader variant={{type:'basic'}} /> */}
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            {/* <Ionicons name="arrow-back-outline" size={26} color={theme === 'dark' ? '#ffffff' : '#000000'} /> */}
            {renderLogo(theme === 'dark' ? icons.ic_back : icons.ic_backb, {
              width: 19,
              height: 18,
            })}
          </TouchableOpacity>
          <Text style={themedStyles.headerTitle}>Role & Module</Text>
        </View>
        <ScrollView contentContainerStyle={styles.content} bounces={false}>
          <View style={themedStyles.section}>
            <Text style={themedStyles.sectionTitle}>Roles</Text>
            {roles.map(role => (
              <Text key={role} style={themedStyles.listItem}>
                • {role}
              </Text>
            ))}
          </View>

          <View style={themedStyles.section}>
            <Text style={themedStyles.sectionTitle}>Modules</Text>
            {modules.map(module => (
              <Text key={module} style={themedStyles.listItem}>
                • {module}
              </Text>
            ))}
          </View>

          {/* <CustomButton title="Save" onPress={onSave} style={{ marginTop: 30 }} /> */}
        </ScrollView>
        {/* <FooterButtonGroup
          onSave={() => {}}
          onCancel={() => {}}
          isSubmitting={false}
        /> */}
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  content: { padding: 20 },
  section: {
    marginBottom: 30,
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 15,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 15,
  },
  listItem: {
    fontSize: 14,
    marginVertical: 6,
    color: '#333',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 12,
  },
});

export default RoleModuleScreen;
