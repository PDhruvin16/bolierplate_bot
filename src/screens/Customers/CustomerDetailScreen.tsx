import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { COLORS } from '../../context/ThemeContext';
import CustomButton from '../../components/common/CustomButton';
import log from '../../utils/logger';

const CustomerDetailScreen = ({ route }) => {
  const { customer } = route.params;

  return (
    <ScrollView style={styles.container} bounces={false}>
      <View style={styles.header}>
        <Text style={styles.name}>{customer.name}</Text>
        <Text style={styles.status}>{customer.status}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Contact Information</Text>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Email:</Text>
          <Text style={styles.value}>{customer.email}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Phone:</Text>
          <Text style={styles.value}>{customer.phone}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Company:</Text>
          <Text style={styles.value}>{customer.company}</Text>
        </View>
      </View>

      <View style={styles.actions}>
        <CustomButton
          title="Edit Customer"
          onPress={() => log.debug('Edit Customer')}
          style={styles.actionButton}
        />
        <CustomButton
          title="Delete Customer"
          onPress={() => log.debug('Delete Customer')}
          variant="outline"
          style={styles.actionButton}
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
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.dark,
    marginBottom: 8,
  },
  status: {
    fontSize: 16,
    color: COLORS.gray,
    textTransform: 'capitalize',
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
});

export default CustomerDetailScreen;
