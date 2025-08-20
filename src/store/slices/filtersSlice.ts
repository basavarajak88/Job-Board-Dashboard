import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
export interface FiltersState {
  searchTerm: string;
  remoteFilter: 'all' | 'remote' | 'onsite';
  locationFilter: string;
  tagsFilter: string[];
  jobTypeFilter: string[];
}

const initialState: FiltersState = {
  searchTerm: '',
  remoteFilter: 'all',
  locationFilter: '',
  tagsFilter: [],
  jobTypeFilter: [],
};

const filtersSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
    },
    setRemoteFilter: (state, action: PayloadAction<'all' | 'remote' | 'onsite'>) => {
      state.remoteFilter = action.payload;
    },
    setLocationFilter: (state, action: PayloadAction<string>) => {
      state.locationFilter = action.payload;
    },
    setTagsFilter: (state, action: PayloadAction<string[]>) => {
      state.tagsFilter = action.payload;
    },
    setJobTypeFilter: (state, action: PayloadAction<string[]>) => {
      state.jobTypeFilter = action.payload;
    },
    clearAllFilters: (state) => {
      state.searchTerm = '';
      state.remoteFilter = 'all';
      state.locationFilter = '';
      state.tagsFilter = [];
      state.jobTypeFilter = [];
    },
  },
});

export const {
  setSearchTerm,
  setRemoteFilter,
  setLocationFilter,
  setTagsFilter,
  setJobTypeFilter,
  clearAllFilters,
} = filtersSlice.actions;

export default filtersSlice.reducer;
