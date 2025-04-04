import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  opportunities: [],
  filteredOpportunities: [],
  currentOpportunity: null,
  loading: false,
  error: null,
};

const opportunitiesSlice = createSlice({
  name: 'opportunities',
  initialState,
  reducers: {
    fetchOpportunitiesStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchOpportunitiesSuccess: (state, action) => {
      state.loading = false;
      state.opportunities = action.payload;
      state.filteredOpportunities = action.payload;
      state.error = null;
    },
    fetchOpportunitiesFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    setCurrentOpportunity: (state, action) => {
      state.currentOpportunity = action.payload;
    },
    addOpportunity: (state, action) => {
      state.opportunities.push(action.payload);
      state.filteredOpportunities = state.opportunities;
    },
    updateOpportunity: (state, action) => {
      const index = state.opportunities.findIndex(
        (opp) => opp._id === action.payload._id
      );
      if (index !== -1) {
        state.opportunities[index] = action.payload;
        state.filteredOpportunities = state.opportunities;
        if (state.currentOpportunity && state.currentOpportunity._id === action.payload._id) {
          state.currentOpportunity = action.payload;
        }
      }
    },
    completeOpportunity: (state, action) => {
      const index = state.opportunities.findIndex(
        (opp) => opp._id === action.payload._id
      );
      if (index !== -1) {
        state.opportunities[index] = {
          ...state.opportunities[index],
          ...action.payload,
          status: 'Completed'
        };
        state.filteredOpportunities = state.opportunities;
        if (state.currentOpportunity && state.currentOpportunity._id === action.payload._id) {
          state.currentOpportunity = {
            ...state.currentOpportunity,
            ...action.payload,
            status: 'Completed'
          };
        }
      }
    },
    cancelOpportunity: (state, action) => {
      const index = state.opportunities.findIndex(
        (opp) => opp._id === action.payload._id
      );
      if (index !== -1) {
        state.opportunities[index] = {
          ...state.opportunities[index],
          ...action.payload,
          status: 'Cancelled'
        };
        state.filteredOpportunities = state.opportunities;
        if (state.currentOpportunity && state.currentOpportunity._id === action.payload._id) {
          state.currentOpportunity = {
            ...state.currentOpportunity,
            ...action.payload,
            status: 'Cancelled'
          };
        }
      }
    },
    deleteOpportunity: (state, action) => {
      state.opportunities = state.opportunities.filter(
        (opp) => opp._id !== action.payload
      );
      state.filteredOpportunities = state.opportunities;
      if (state.currentOpportunity && state.currentOpportunity._id === action.payload) {
        state.currentOpportunity = null;
      }
    },
    filterOpportunities: (state, action) => {
      // This can be customized based on your filtering needs
      const { category, location, isPaid } = action.payload;
      
      let filtered = [...state.opportunities];
      
      if (category) {
        filtered = filtered.filter(opp => 
          opp.basicDetails.category.some(cat => cat.name === category)
        );
      }
      
      if (location) {
        filtered = filtered.filter(opp => 
          opp.schedule.location.toLowerCase().includes(location.toLowerCase())
        );
      }
      
      if (isPaid !== undefined) {
        filtered = filtered.filter(opp => opp.basicDetails.isPaid === isPaid);
      }
      
      state.filteredOpportunities = filtered;
    },
    clearFilters: (state) => {
      state.filteredOpportunities = state.opportunities;
    },
  },
});

export const {
  fetchOpportunitiesStart,
  fetchOpportunitiesSuccess,
  fetchOpportunitiesFailure,
  setCurrentOpportunity,
  addOpportunity,
  updateOpportunity,
  completeOpportunity,
  cancelOpportunity,
  deleteOpportunity,
  filterOpportunities,
  clearFilters,
} = opportunitiesSlice.actions;

export default opportunitiesSlice.reducer;