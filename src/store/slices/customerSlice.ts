import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import customerApi from '../../api/customerApi';

// Async thunks
export const fetchCustomers = createAsyncThunk(
  'customers/fetchCustomers',
  async (params, { rejectWithValue }) => {
    try {
      const response = await customerApi.getCustomers(params);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch customers',
      );
    }
  },
);

export const fetchCustomerById = createAsyncThunk(
  'customers/fetchCustomerById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await customerApi.getCustomerById(id);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch customer',
      );
    }
  },
);

export const createCustomer = createAsyncThunk(
  'customers/createCustomer',
  async (customerData, { rejectWithValue }) => {
    try {
      const response = await customerApi.createCustomer(customerData);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to create customer',
      );
    }
  },
);

export const updateCustomer = createAsyncThunk(
  'customers/updateCustomer',
  async ({ id, customerData }, { rejectWithValue }) => {
    try {
      const response = await customerApi.updateCustomer(id, customerData);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update customer',
      );
    }
  },
);

export const deleteCustomer = createAsyncThunk(
  'customers/deleteCustomer',
  async (id, { rejectWithValue }) => {
    try {
      await customerApi.deleteCustomer(id);
      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to delete customer',
      );
    }
  },
);

// Initial state
const initialState = {
  customers: [],
  currentCustomer: null,
  isLoading: false,
  error: null,
  totalCount: 0,
  currentPage: 1,
  hasMore: true,
};

// Customer slice
const customerSlice = createSlice({
  name: 'customers',
  initialState,
  reducers: {
    clearError: state => {
      state.error = null;
    },
    clearCurrentCustomer: state => {
      state.currentCustomer = null;
    },
    setCurrentCustomer: (state, action) => {
      state.currentCustomer = action.payload;
    },
    updateCustomerInList: (state, action) => {
      const index = state.customers.findIndex(c => c.id === action.payload.id);
      if (index !== -1) {
        state.customers[index] = action.payload;
      }
    },
  },
  extraReducers: builder => {
    // Fetch customers
    builder
      .addCase(fetchCustomers.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCustomers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.customers = action.payload.data || action.payload;
        state.totalCount = action.payload.totalCount || action.payload.length;
        state.hasMore = action.payload.hasMore !== false;
        state.error = null;
      })
      .addCase(fetchCustomers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // Fetch customer by ID
    builder
      .addCase(fetchCustomerById.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCustomerById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentCustomer = action.payload;
        state.error = null;
      })
      .addCase(fetchCustomerById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // Create customer
    builder
      .addCase(createCustomer.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createCustomer.fulfilled, (state, action) => {
        state.isLoading = false;
        state.customers.unshift(action.payload);
        state.totalCount += 1;
        state.error = null;
      })
      .addCase(createCustomer.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // Update customer
    builder
      .addCase(updateCustomer.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateCustomer.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.customers.findIndex(
          c => c.id === action.payload.id,
        );
        if (index !== -1) {
          state.customers[index] = action.payload;
        }
        if (state.currentCustomer?.id === action.payload.id) {
          state.currentCustomer = action.payload;
        }
        state.error = null;
      })
      .addCase(updateCustomer.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // Delete customer
    builder
      .addCase(deleteCustomer.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteCustomer.fulfilled, (state, action) => {
        state.isLoading = false;
        state.customers = state.customers.filter(c => c.id !== action.payload);
        state.totalCount -= 1;
        if (state.currentCustomer?.id === action.payload) {
          state.currentCustomer = null;
        }
        state.error = null;
      })
      .addCase(deleteCustomer.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const {
  clearError,
  clearCurrentCustomer,
  setCurrentCustomer,
  updateCustomerInList,
} = customerSlice.actions;
export default customerSlice.reducer;
