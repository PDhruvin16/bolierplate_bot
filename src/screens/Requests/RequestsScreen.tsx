import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import AppLayout from '../../components/layouts/AppLayout';
import colors from '../../constants/colors';

const RequestsScreen: React.FC = () => {
  const headerProps = {
    variant: {
      type: 'basic',
      title: 'My Requests',
      subtitle: '3 pending approvals',
    },
  } as const;

  return (
    <AppLayout headerProps={headerProps}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <View style={styles.card}>
          <Text style={styles.title}>Requests</Text>
          <Text style={styles.subtitle}>View and manage your requests</Text>
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
    padding: 16,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.dark,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: colors.gray,
  },
});

export default RequestsScreen;

