import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';

import images from '../../constants/images';
import colors from '../../constants/colors';

interface ChatbotModalProps {
  visible: boolean;
  onClose: () => void;
}

const ChatbotModal: React.FC<ChatbotModalProps> = ({ visible, onClose }) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <Image source={images.loggo} style={styles.logo} />
              <Text style={styles.headerTitle}>Ai Sante</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
          </View>
          {/* Welcome */}
          <Text style={styles.welcome}>Hii Rajesh, Welcome to Ai CRM</Text>
          {/* Suggestions */}
          <View style={styles.suggestions}>
            <TouchableOpacity style={styles.suggestionBtn}>
              <Text style={styles.suggestionText}>
                How many products do you have?
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.suggestionBtn}>
              <Text style={styles.suggestionText}>
                How many MRs are pharmacists?
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.suggestionBtn}>
              <Text style={styles.suggestionText}>
                What is the total sales amount?
              </Text>
            </TouchableOpacity>
          </View>
          {/* Input */}
          <View style={styles.inputRow}>
            <Text style={styles.inputIcon}>🖊️</Text>
            <Text style={styles.inputText}>Ask questions about your data</Text>
            <TouchableOpacity style={styles.sendBtn}>
              <Text style={styles.sendIcon}>↑</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    // backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'flex-end',
    alignItems: 'center',
    position: 'absolute',
    bottom: 90,
    left: 0,
    right: 0,
    // top: 0,
  },
  container: {
    width: 350,
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center' },
  logo: { width: 32, height: 32, marginRight: 8 },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#5B2C83' },
  closeBtn: { padding: 4 },
  closeText: { fontSize: 22, color: '#5B2C83' },
  welcome: { fontSize: 15, color: '#222', marginBottom: 12 },
  suggestions: { marginBottom: 12 },
  suggestionBtn: {
    backgroundColor: '#F5F7FB',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginBottom: 6,
  },
  suggestionText: { color: '#6B6B6B', fontSize: 14 },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F7FB',
    borderRadius: 8,
    padding: 8,
    marginTop: 8,
  },
  inputIcon: { fontSize: 18, marginRight: 8 },
  inputText: { flex: 1, color: '#6B6B6B', fontSize: 14 },
  sendBtn: {
    backgroundColor: '#5B2C83',
    borderRadius: 20,
    padding: 6,
    marginLeft: 8,
  },
  sendIcon: { color: '#fff', fontSize: 16 },
});

export default ChatbotModal;
