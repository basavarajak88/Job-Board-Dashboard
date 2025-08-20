import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, CircularProgress, Box } from '@mui/material';
import { store, persistor } from './store/index';
import { theme } from './theme/theme';
import Layout from './components/Layout/Layout';
import JobsPage from './pages/JobsPage';
import BookmarksPage from './pages/BookmarksPage';
import JobDetailsPage from './pages/JobDetailsPage';
import NotFoundPage from './pages/NotFoundPage';

const LoadingComponent = () => (
  <Box 
    display="flex" 
    justifyContent="center" 
    alignItems="center" 
    minHeight="100vh"
  >
    <CircularProgress />
  </Box>
);

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={<LoadingComponent />} persistor={persistor}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Box sx={{ width: '100%', minHeight: '100vh', margin: 0, padding: 0 }}>
            <Router>
              <Routes>
                <Route path="/" element={<Layout />}>
                  <Route index element={<JobsPage />} />
                  <Route path="bookmarks" element={<BookmarksPage />} />
                  <Route path="job/:id" element={<JobDetailsPage />} />
                  <Route path="*" element={<NotFoundPage />} />
                </Route>
              </Routes>
            </Router>
          </Box>
        </ThemeProvider>
      </PersistGate>
    </Provider>
  );
}

export default App;
