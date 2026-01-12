import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { COLORS } from '../../context/ThemeContext';
import { STRINGS } from '../../constants/strings';

const LeadListScreen = () => {
  // Mock data - replace with actual API call
  const leads = [
    {
      id: '1',
      name: 'Alice Johnson',
      email: 'alice@example.com',
      phone: '+1 234 567 8902',
      company: 'Startup Inc',
      status: 'new',
      source: 'Website',
    },
    {
      id: '2',
      name: 'Bob Wilson',
      email: 'bob@example.com',
      phone: '+1 234 567 8903',
      company: 'Enterprise Corp',
      status: 'contacted',
      source: 'Referral',
    },
  ];

  const renderLead = ({ item }) => (
    <View style={styles.leadCard}>
      <View style={styles.leadHeader}>
        <Text style={styles.leadName}>{item.name}</Text>
        <Text style={styles.leadStatus}>{item.status}</Text>
      </View>
      <Text style={styles.leadEmail}>{item.email}</Text>
      <Text style={styles.leadPhone}>{item.phone}</Text>
      <Text style={styles.leadCompany}>{item.company}</Text>
      <Text style={styles.leadSource}>Source: {item.source}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={leads}
        renderItem={renderLead}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  listContainer: {
    padding: 16,
  },
  leadCard: {
    backgroundColor: COLORS.white,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: COLORS.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
  },
  leadHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  leadName: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.dark,
  },
  leadStatus: {
    fontSize: 14,
    color: COLORS.primary,
    textTransform: 'capitalize',
  },
  leadEmail: {
    fontSize: 14,
    color: COLORS.gray,
    marginBottom: 4,
  },
  leadPhone: {
    fontSize: 14,
    color: COLORS.gray,
    marginBottom: 4,
  },
  leadCompany: {
    fontSize: 14,
    color: COLORS.gray,
    marginBottom: 4,
  },
  leadSource: {
    fontSize: 12,
    color: COLORS.lightGray,
  },
});

export default LeadListScreen;
