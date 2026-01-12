// components/ChartOverlayModal.tsx
import React from 'react';
import {
  Modal,
  View,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';

const { width, height } = Dimensions.get('window');
const LANDSCAPE_WIDTH = width * 0.9;
const LANDSCAPE_HEIGHT = height * 0.65;

type ChartOverlayModalProps = {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

const ChartOverlayModal: React.FC<ChartOverlayModalProps> = ({
  visible,
  onClose,
  children,
}) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          <View style={styles.chartWrapper}>
            {/* ✅ rotate chart to landscape */}
            <View style={styles.chartRotated}>{children}</View>
          </View>

          {/* ✅ Close button bottom right */}
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Icon name="close" size={24} color="#333" />
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    width: LANDSCAPE_WIDTH,
    height: LANDSCAPE_HEIGHT,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chartWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chartRotated: {
    transform: [{ rotate: '90deg' }], // ✅ Rotate chart
  },
  closeButton: {
    position: 'absolute',
    bottom: 10,
    right: 10,
  },
});

export default ChartOverlayModal;
