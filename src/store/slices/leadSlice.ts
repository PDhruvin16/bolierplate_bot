import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Mock API calls - replace with actual API
const mockLeadApi = {
  getLeads: async params => {
    // Simulate API call
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({
          data: [
            {
              id: '1',
              name: 'Alice Johnson',
              email: 'alice@example.com',
              phone: '+1 234 567 8902',
              company: 'Startup Inc',
              status: 'new',
              source: 'Website',
              createdAt: '2024-01-15',
            },
            {
              id: '2',
              name: 'Bob Wilson',
              email: 'bob@example.com',
              phone: '+1 234 567 8903',
              company: 'Enterprise Corp',
              status: 'contacted',
              source: 'Referral',
              createdAt: '2024-01-10',
            },
          ],
          totalCount: 2,
        });
      }, 1000);
    });
  },
};

// Async thunks
export const fetchLeads = createAsyncThunk(
  'leads/fetchLeads',
  async (params, { rejectWithValue }) => {
    try {
      const response = await mockLeadApi.getLeads(params);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch leads');
    }
  },
);

export const createLead = createAsyncThunk(
  'leads/createLead',
  async (leadData, { rejectWithValue }) => {
    try {
      // Simulate API call
      const newLead = {
        id: Date.now().toString(),
        ...leadData,
        createdAt: new Date().toISOString(),
      };
      return newLead;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to create lead');
    }
  },
);

export const updateLead = createAsyncThunk(
  'leads/updateLead',
  async ({ id, leadData }, { rejectWithValue }) => {
    try {
      // Simulate API call
      return { id, ...leadData };
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to update lead');
    }
  },
);

export const deleteLead = createAsyncThunk(
  'leads/deleteLead',
  async (id, { rejectWithValue }) => {
    try {
      // Simulate API call
      return id;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to delete lead');
    }
  },
);

// Initial state
const initialState = {
  leads: [],
  currentLead: null,
  isLoading: false,
  error: null,
  totalCount: 0,
  currentPage: 1,
  hasMore: true,
};

// Lead slice
const leadSlice = createSlice({
  name: 'leads',
  initialState,
  reducers: {
    clearError: state => {
      state.error = null;
    },
    clearCurrentLead: state => {
      state.currentLead = null;
    },
    setCurrentLead: (state, action) => {
      state.currentLead = action.payload;
    },
    updateLeadInList: (state, action) => {
      const index = state.leads.findIndex(l => l.id === action.payload.id);
      if (index !== -1) {
        state.leads[index] = action.payload;
      }
    },
  },
  extraReducers: builder => {
    // Fetch leads
    builder
      .addCase(fetchLeads.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchLeads.fulfilled, (state, action) => {
        state.isLoading = false;
        state.leads = action.payload.data || action.payload;
        state.totalCount = action.payload.totalCount || action.payload.length;
        state.hasMore = action.payload.hasMore !== false;
        state.error = null;
      })
      .addCase(fetchLeads.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // Create lead
    builder
      .addCase(createLead.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createLead.fulfilled, (state, action) => {
        state.isLoading = false;
        state.leads.unshift(action.payload);
        state.totalCount += 1;
        state.error = null;
      })
      .addCase(createLead.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // Update lead
    builder
      .addCase(updateLead.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateLead.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.leads.findIndex(l => l.id === action.payload.id);
        if (index !== -1) {
          state.leads[index] = action.payload;
        }
        if (state.currentLead?.id === action.payload.id) {
          state.currentLead = action.payload;
        }
        state.error = null;
      })
      .addCase(updateLead.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // Delete lead
    builder
      .addCase(deleteLead.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteLead.fulfilled, (state, action) => {
        state.isLoading = false;
        state.leads = state.leads.filter(l => l.id !== action.payload);
        state.totalCount -= 1;
        if (state.currentLead?.id === action.payload) {
          state.currentLead = null;
        }
        state.error = null;
      })
      .addCase(deleteLead.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const {
  clearError,
  clearCurrentLead,
  setCurrentLead,
  updateLeadInList,
} = leadSlice.actions;
export default leadSlice.reducer;
