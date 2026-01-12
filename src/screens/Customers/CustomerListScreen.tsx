import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { COLORS } from '../../context/ThemeContext';
import { STRINGS } from '../../constants/strings';
import CustomerCard from '../../components/CustomerCard';

const CustomerListScreen = ({ navigation }) => {
  // Mock data - replace with actual API call
  const customers = [
    {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+1 234 567 8900',
      company: 'Tech Corp',
      status: 'active',
      lastContact: '2024-01-15',
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      phone: '+1 234 567 8901',
      company: 'Design Studio',
      status: 'active',
      lastContact: '2024-01-10',
    },
  ];

  const handleCustomerPress = customer => {
    navigation.navigate('CustomerDetail', { customer });
  };

  const renderCustomer = ({ item }) => (
    <CustomerCard customer={item} onPress={handleCustomerPress} />
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={customers}
        renderItem={renderCustomer}
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
});

export default CustomerListScreen;
