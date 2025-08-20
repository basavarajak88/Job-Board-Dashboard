import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

import { jobsApi } from '../../services/api';

export interface Job {
  slug: string;
  company_name: string;
  title: string;
  description: string;
  remote: boolean;
  url: string;
  tags: string[];
  job_types: string[];
  location: string;
  created_at: number;
}

interface JobsState {
  jobs: Job[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  currentPage: number;
}

const initialState: JobsState = {
  jobs: [],
  loading: false,
  error: null,
  hasMore: true,
  currentPage: 1,
};

export const fetchJobs = createAsyncThunk(
  'jobs/fetchJobs',
  async (page: number = 1) => {
    const response = await jobsApi.getJobs(page);
    return { jobs: response.data, page };
  }
);

const jobsSlice = createSlice({
  name: 'jobs',
  initialState,
  reducers: {
    clearJobs: (state) => {
      state.jobs = [];
      state.currentPage = 1;
      state.hasMore = true;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchJobs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchJobs.fulfilled, (state, action) => {
        state.loading = false;
        const { jobs, page } = action.payload;
        
        if (page === 1) {
          state.jobs = jobs;
        } else {
          state.jobs = [...state.jobs, ...jobs];
        }
        
        state.currentPage = page;
        state.hasMore = jobs.length > 0;
      })
      .addCase(fetchJobs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch jobs';
      });
  },
});

export const { clearJobs, setError } = jobsSlice.actions;
export default jobsSlice.reducer;
