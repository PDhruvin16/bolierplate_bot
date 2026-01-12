import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { COLORS } from '../context/ThemeContext';
import { Customer } from '../types/api';
import { CustomerCardProps } from '../types/components';

const CustomerCard: React.FC<CustomerCardProps> = ({
  customer,
  onPress,
  style,
}) => {
  const getInitials = (name: string): string => {
    if (!name) return '?';
    return name
      .split(' ')
      .map((word: string) => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getStatusColor = (status: string): string => {
    switch (status?.toLowerCase()) {
      case 'active':
        return COLORS.success;
      case 'inactive':
        return COLORS.error;
      case 'pending':
        return COLORS.warning;
      default:
        return COLORS.gray;
    }
  };

  return (
    <TouchableOpacity
      style={[styles.container, style]}
      onPress={() => onPress(customer)}
      activeOpacity={0.8}
    >
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          {customer.avatar ? (
            <Image source={{ uri: customer.avatar }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarText}>
                {getInitials(`${customer.firstName} ${customer.lastName}`)}
              </Text>
            </View>
          )}
        </View>

        <View style={styles.info}>
          <Text style={styles.name} numberOfLines={1}>
            {`${customer.firstName} ${customer.lastName}`}
          </Text>
          <Text style={styles.email} numberOfLines={1}>
            {customer.email}
          </Text>
          <Text style={styles.phone} numberOfLines={1}>
            {customer.phone}
          </Text>
        </View>

        <View style={styles.statusContainer}>
          <View
            style={[
              styles.statusIndicator,
              { backgroundColor: getStatusColor(customer.status) },
            ]}
          />
          <Text style={styles.statusText}>{customer.status || 'Unknown'}</Text>
        </View>
      </View>

      {customer.company && (
        <View style={styles.companyContainer}>
          <Text style={styles.companyLabel}>Company:</Text>
          <Text style={styles.companyName} numberOfLines={1}>
            {customer.company}
          </Text>
        </View>
      )}

      {customer.lastContact && (
        <View style={styles.lastContactContainer}>
          <Text style={styles.lastContactLabel}>Last Contact:</Text>
          <Text style={styles.lastContactDate}>
            {new Date(customer.lastContact).toLocaleDateString()}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: COLORS.dark,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarContainer: {
    marginRight: 12,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  avatarPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.dark,
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: COLORS.gray,
    marginBottom: 2,
  },
  phone: {
    fontSize: 14,
    color: COLORS.gray,
  },
  statusContainer: {
    alignItems: 'center',
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginBottom: 4,
  },
  statusText: {
    fontSize: 12,
    color: COLORS.gray,
    textTransform: 'capitalize',
  },
  companyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  companyLabel: {
    fontSize: 14,
    color: COLORS.gray,
    marginRight: 8,
  },
  companyName: {
    fontSize: 14,
    color: COLORS.dark,
    fontWeight: '500',
    flex: 1,
  },
  lastContactContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  lastContactLabel: {
    fontSize: 14,
    color: COLORS.gray,
    marginRight: 8,
  },
  lastContactDate: {
    fontSize: 14,
    color: COLORS.dark,
    fontWeight: '500',
  },
});

export default CustomerCard;
