import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import jobsSlice from './slices/jobsSlice';
import filtersSlice from './slices/filtersSlice';
import bookmarksSlice from './slices/bookmarksSlice';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['bookmarks'], // Only persist bookmarks
};

const rootReducer = combineReducers({
  jobs: jobsSlice,
  filters: filtersSlice,
  bookmarks: bookmarksSlice,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
