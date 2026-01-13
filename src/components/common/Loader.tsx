import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet, Modal } from 'react-native';

import { LoadingProps } from '../../types/components';
import colors from '../../constants/colors';

const Loader: React.FC<LoadingProps> = ({
  visible = false,
  text = 'Loading...',
  size = 'large',
  color = colors.primary,
  overlay = true,
  style,
}) => {
  if (!visible) return null;

  if (overlay) {
    return (
      <Modal transparent visible={visible} animationType="fade">
        <View style={[styles.overlay, style]}>
          <View style={styles.container}>
            <ActivityIndicator size={size} color={color} />
            {text && <Text style={styles.text}>{text}</Text>}
          </View>
        </View>
      </Modal>
    );
  }

  return (
    <View style={[styles.inlineContainer, style]}>
      <ActivityIndicator size={size} color={color} />
      {text && <Text style={styles.text}>{text}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    shadowColor: colors.dark,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  inlineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  text: {
    marginTop: 12,
    fontSize: 16,
    color: colors.dark,
    textAlign: 'center',
  },
});

export default Loader;
