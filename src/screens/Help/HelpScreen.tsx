import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { COLORS } from '../../context/ThemeContext';
import CustomHeader from '../../components/common/CustomHeader';
import { DrawerActions } from '@react-navigation/native';

interface HelpScreenProps {
  navigation: any;
}

const HelpScreen: React.FC<HelpScreenProps> = ({ navigation }) => {
  const openDrawer = () => {
    navigation.dispatch(DrawerActions.toggleDrawer());
  };

  return (
    <View style={styles.container}>
      <CustomHeader
        title="Help & Support"
        onDrawerOpen={openDrawer}
        showDrawerIcon={true}
      />
      <ScrollView style={styles.content}  bounces={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
          
          <TouchableOpacity style={styles.helpItem}>
            <Text style={styles.question}>How do I add a new customer?</Text>
            <Text style={styles.answer}>
              Navigate to Customer Console and tap the "Add Customer" button.
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.helpItem}>
            <Text style={styles.question}>How do I manage leads?</Text>
            <Text style={styles.answer}>
              Go to the Leads section from the main menu to view and manage all leads.
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.helpItem}>
            <Text style={styles.question}>How do I generate reports?</Text>
            <Text style={styles.answer}>
              Access reports through the Customer Console > Reports section.
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Support</Text>
          
          <TouchableOpacity style={styles.contactItem}>
            <Text style={styles.contactLabel}>Email Support</Text>
            <Text style={styles.contactValue}>support@crm.com</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.contactItem}>
            <Text style={styles.contactLabel}>Phone Support</Text>
            <Text style={styles.contactValue}>+1 (555) 123-4567</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.contactItem}>
            <Text style={styles.contactLabel}>Live Chat</Text>
            <Text style={styles.contactValue}>Available 24/7</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
  },
  section: {
    backgroundColor: COLORS.white,
    marginVertical: 8,
    paddingVertical: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.dark,
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  helpItem: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  question: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.dark,
    marginBottom: 4,
  },
  answer: {
    fontSize: 14,
    color: COLORS.gray,
    lineHeight: 20,
  },
  contactItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  contactLabel: {
    fontSize: 16,
    color: COLORS.dark,
  },
  contactValue: {
    fontSize: 16,
    color: COLORS.primary,
  },
});

export default HelpScreen;
