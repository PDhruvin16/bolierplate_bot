import NetInfo from '@react-native-community/netinfo';
import { store } from '../store';
import { setConnectionStatus } from '../store/slices/networkSlice';
import log from '../utils/logger';

class NetworkService {
  constructor() {
    this.unsubscribe = null;
    this.isInitialized = false;
  }

  // Initialize network monitoring
  initialize() {
    if (this.isInitialized) return;

    // Get initial state
    NetInfo.fetch().then(this.handleNetworkChange);

    // Subscribe to network state updates
    this.unsubscribe = NetInfo.addEventListener(this.handleNetworkChange);
    this.isInitialized = true;
  }

  // Handle network state changes
  handleNetworkChange = state => {
    const networkStatus = {
      isConnected: state.isConnected,
      connectionType: state.type,
      isInternetReachable: state.isInternetReachable,
    };

    // Update Redux store
    store.dispatch(setConnectionStatus(networkStatus));

    // Log network changes in development
    if (__DEV__) {
      log.debug('Network state changed:', networkStatus);
    }
  };

  // Get current network state
  async getCurrentState() {
    return await NetInfo.fetch();
  }

  // Check if connected
  async isConnected() {
    const state = await NetInfo.fetch();
    return state.isConnected;
  }

  // Check if internet is reachable
  async isInternetReachable() {
    const state = await NetInfo.fetch();
    return state.isInternetReachable;
  }

  // Get connection type
  async getConnectionType() {
    const state = await NetInfo.fetch();
    return state.type;
  }

  // Cleanup
  cleanup() {
    if (this.unsubscribe) {
      this.unsubscribe();
      this.unsubscribe = null;
    }
    this.isInitialized = false;
  }
}

// Create singleton instance
const networkService = new NetworkService();

export default networkService;
