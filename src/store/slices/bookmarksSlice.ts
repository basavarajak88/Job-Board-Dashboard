import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Job } from './jobsSlice';

interface BookmarksState {
  bookmarkedJobs: Job[];
}

const initialState: BookmarksState = {
  bookmarkedJobs: [],
};

const bookmarksSlice = createSlice({
  name: 'bookmarks',
  initialState,
  reducers: {
    addBookmark: (state, action: PayloadAction<Job>) => {
      const job = action.payload;
      const exists = state.bookmarkedJobs.find(j => j.slug === job.slug);
      if (!exists) {
        state.bookmarkedJobs.push(job);
      }
    },
    removeBookmark: (state, action: PayloadAction<string>) => {
      const jobSlug = action.payload;
      state.bookmarkedJobs = state.bookmarkedJobs.filter(job => job.slug !== jobSlug);
    },
    toggleBookmark: (state, action: PayloadAction<Job>) => {
      const job = action.payload;
      const existingIndex = state.bookmarkedJobs.findIndex(j => j.slug === job.slug);
      
      if (existingIndex >= 0) {
        state.bookmarkedJobs.splice(existingIndex, 1);
      } else {
        state.bookmarkedJobs.push(job);
      }
    },
  },
});

export const { addBookmark, removeBookmark, toggleBookmark } = bookmarksSlice.actions;
export default bookmarksSlice.reducer;
