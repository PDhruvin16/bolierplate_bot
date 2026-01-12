// import { configureStore } from '@reduxjs/toolkit';
// import { persistStore, persistReducer } from 'redux-persist';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { combineReducers } from 'redux';

// // Import slices
// import authSlice from './slices/authSlice';
// import customerSlice from './slices/customerSlice';
// import leadSlice from './slices/leadSlice';
// import notificationSlice from './slices/notificationSlice';
// import networkSlice from './slices/networkSlice';

// // Root reducer
// const rootReducer = combineReducers({
//   auth: authSlice,
//   customers: customerSlice,
//   leads: leadSlice,
//   notifications: notificationSlice,
//   network: networkSlice,
// });

// // Persist configuration
// const persistConfig = {
//   key: 'root',
//   storage: AsyncStorage,
//   whitelist: ['auth', 'customers', 'leads'], // Only persist these reducers
//   blacklist: ['network', 'notifications'], // Don't persist these
// };

// // Create persisted reducer
// const persistedReducer = persistReducer(persistConfig, rootReducer);

// // Configure store
// export const store = configureStore({
//   reducer: persistedReducer,
//   middleware: (getDefaultMiddleware) =>
//     getDefaultMiddleware({
//       serializableCheck: {
//         ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
//       },
//     }),
//   devTools: __DEV__, // Enable Redux DevTools in development
// });

// // Create persistor
// export const persistor = persistStore(store);

// // Export store and persistor
// export { store, persistor };
// store.ts
import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer, Persistor } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { combineReducers } from 'redux';

// Slices
import authSlice from './slices/authSlice';
import customerSlice from './slices/customerSlice';
import leadSlice from './slices/leadSlice';
import notificationSlice from './slices/notificationSlice';
import networkSlice from './slices/networkSlice';

// Root Reducer
const rootReducer = combineReducers({
  auth: authSlice,
  customers: customerSlice,
  leads: leadSlice,
  notifications: notificationSlice,
  network: networkSlice,
});

export type RootState = ReturnType<typeof rootReducer>;

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['auth', 'customers', 'leads'],
  blacklist: ['network', 'notifications'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

// Create Store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
  devTools: __DEV__,
});

// Create Persistor
export const persistor: Persistor = persistStore(store);

// Export Types
export type AppDispatch = typeof store.dispatch;
