import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import storage from '../../utils/storage';
import log from '../../utils/logger';
import authService from '../../services/authService';

// Async thunks
export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials: { otp: string }, { rejectWithValue }) => {
    try {
      log.debug('🚀 Starting OTP login process');
      const response = await authService.loginWithOTP(credentials.otp);

      await storage.setString('authToken', response.token);
      await AsyncStorage.setItem('userData', JSON.stringify(response.user));

      const result = {
        user: response.user,
        accessToken: response.token,
        refreshToken: null,
      };

      log.debug('🎉 OTP login successful');
      return result;
    } catch (error: unknown) {
      log.error('❌ Login error in auth slice:', error);
      const errorMessage =
        (error as any)?.response?.data?.message || 'Login failed';
      return rejectWithValue(errorMessage);
    }
  },
);

export const checkAuthStatus = createAsyncThunk(
  'auth/checkAuthStatus',
  async (_, { rejectWithValue }) => {
    try {
      const accessToken = await AsyncStorage.getItem('authToken');
      const userData = await AsyncStorage.getItem('userData');

      if (accessToken && userData) {
        const user = JSON.parse(userData);
        return { user, accessToken, refreshToken: null };
      }
      return rejectWithValue('Not authenticated');
    } catch (error: unknown) {
      return rejectWithValue('Failed to check auth status');
    }
  },
);

export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData: any, { rejectWithValue }) => {
    try {
      const response = await authApi.register(userData);
      return response;
    } catch (error: unknown) {
      return rejectWithValue(
        (error as any)?.response?.data?.message || 'Registration failed',
      );
    }
  },
);

export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      // Optional: await authApi.logout();
      await AsyncStorage.removeItem('authToken');
      await AsyncStorage.removeItem('refreshToken');
      await AsyncStorage.removeItem('userData');
      return null;
    } catch (error: unknown) {
      return rejectWithValue(
        (error as any)?.response?.data?.message || 'Logout failed',
      );
    }
  },
);

export const refreshUserProfile = createAsyncThunk(
  'auth/refreshProfile',
  async (_, { rejectWithValue }) => {
    try {
      const userProfile = await authApi.getProfile();
      await AsyncStorage.setItem('userData', JSON.stringify(userProfile));
      return userProfile;
    } catch (error: unknown) {
      return rejectWithValue(
        (error as any)?.response?.data?.message || 'Failed to refresh profile',
      );
    }
  },
);

// Initial state
const initialState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

// Auth slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: state => {
      state.error = null;
    },
    updateUser: (state: any, action) => {
      state.user = { ...state.user, ...action.payload };
    },
    setCredentials: (state, action) => {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.isAuthenticated = true;
    },
  },
  extraReducers: builder => {
    // Login
    builder
      .addCase(loginUser.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state: any, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state: any, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // Check Auth Status
    builder
      .addCase(checkAuthStatus.pending, state => {
        state.isLoading = true;
      })
      .addCase(checkAuthStatus.fulfilled, (state: any, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(checkAuthStatus.rejected, (state: any) => {
        state.isLoading = false;
        state.user = null;
        state.accessToken = null;
        state.refreshToken = null;
        state.isAuthenticated = false;
      });

    // Register
    builder
      .addCase(registerUser.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state: any, action) => {
        state.isLoading = false;
        // Handle register response - you might need to adjust this based on your register API
        if (action.payload.access && action.payload.refresh) {
          state.accessToken = action.payload.access;
          state.refreshToken = action.payload.refresh;
          state.isAuthenticated = true;
        }
        state.error = null;
      })
      .addCase(registerUser.rejected, (state: any, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // Logout
    builder
      .addCase(logoutUser.pending, state => {
        state.isLoading = true;
      })
      .addCase(logoutUser.fulfilled, state => {
        state.isLoading = false;
        state.user = null;
        state.accessToken = null;
        state.refreshToken = null;
        state.isAuthenticated = false;
        state.error = null;
      })
      .addCase(logoutUser.rejected, (state: any, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // Refresh Profile
    builder
      .addCase(refreshUserProfile.pending, state => {
        state.isLoading = true;
      })
      .addCase(refreshUserProfile.fulfilled, (state: any, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(refreshUserProfile.rejected, (state: any, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, updateUser, setCredentials } = authSlice.actions;
export default authSlice.reducer;
