import { createSlice } from '@reduxjs/toolkit';

// Initial state
const initialState = {
  isConnected: true,
  connectionType: null,
  isInternetReachable: true,
  lastUpdated: null,
};

// Network slice
const networkSlice = createSlice({
  name: 'network',
  initialState,
  reducers: {
    setConnectionStatus: (state, action) => {
      state.isConnected = action.payload.isConnected;
      state.connectionType = action.payload.connectionType;
      state.isInternetReachable = action.payload.isInternetReachable;
      state.lastUpdated = new Date().toISOString();
    },
    setConnected: (state, action) => {
      state.isConnected = action.payload;
      state.lastUpdated = new Date().toISOString();
    },
    setConnectionType: (state, action) => {
      state.connectionType = action.payload;
      state.lastUpdated = new Date().toISOString();
    },
    setInternetReachable: (state, action) => {
      state.isInternetReachable = action.payload;
      state.lastUpdated = new Date().toISOString();
    },
    resetNetwork: state => {
      state.isConnected = true;
      state.connectionType = null;
      state.isInternetReachable = true;
      state.lastUpdated = new Date().toISOString();
    },
  },
});

export const {
  setConnectionStatus,
  setConnected,
  setConnectionType,
  setInternetReachable,
  resetNetwork,
} = networkSlice.actions;

export default networkSlice.reducer;
