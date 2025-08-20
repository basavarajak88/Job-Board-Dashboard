import React, { useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Grid,
  Button,
  Fade,
  Paper,
} from '@mui/material';
import { BookmarkBorder, Delete, Work } from '@mui/icons-material';
import { useAppSelector, useAppDispatch } from '../hooks/useAppDispatch';
import { removeBookmark } from '../store/slices/bookmarksSlice';
import JobCard from '../components/JobCard';
import ViewToggle from '../components/ViewToggle';
import ErrorBoundary from '../components/ErrorBoundary';
import type { ViewMode } from '../components/ViewToggle';
import type { Job } from '../store/slices/jobsSlice';

const BookmarksPage: React.FC = React.memo(() => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const bookmarkedJobs = useAppSelector(state => state.bookmarks.bookmarkedJobs);
  
  const [viewMode, setViewMode] = useState<ViewMode>('grid');

  // Handle job card click
  const handleJobClick = useCallback((jobSlug: string) => {
    navigate(`/job/${jobSlug}`);
  }, [navigate]);

 

  // Handle clear all bookmarks
  const handleClearAllBookmarks = useCallback(() => {
    bookmarkedJobs.forEach(job => {
      dispatch(removeBookmark(job.slug));
    });
  }, [dispatch, bookmarkedJobs]);

  // Memoized job cards rendering
  const renderBookmarkedJobs = useMemo(() => {
    return bookmarkedJobs.map((job: Job) => (
      <Grid 
        size={{ xs: 12, sm: viewMode === 'grid' ? 6 : 12, md: viewMode === 'grid' ? 4 : 12 }}
        key={job.slug}
      >
        <Fade in timeout={300}>
          <div>
            <JobCard 
              job={job} 
              onClick={() => handleJobClick(job.slug)}
              viewMode={viewMode}
            />
          </div>
        </Fade>
      </Grid>
    ));
  }, [bookmarkedJobs, viewMode, handleJobClick]);

  return (
    <ErrorBoundary>
      <Container maxWidth={false} sx={{ width: '100%', px: { xs: 2, md: 3 } }}>
        <Box sx={{ py: 2 }}>
          {/* Header */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Box>
              <Typography variant="h4" component="h1" gutterBottom>
                Bookmarked Jobs
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Your saved job opportunities
              </Typography>
            </Box>
            {bookmarkedJobs.length > 0 && (
              <Button
                variant="outlined"
                color="error"
                startIcon={<Delete />}
                onClick={handleClearAllBookmarks}
              >
                Clear All
              </Button>
            )}
          </Box>

          {/* Empty State */}
          {bookmarkedJobs.length === 0 && (
            <Paper 
              elevation={1} 
              sx={{ 
                p: 8, 
                textAlign: 'center',
                backgroundColor: 'background.default',
              }}
            >
              <BookmarkBorder sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                No bookmarked jobs yet
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Start browsing jobs and bookmark the ones you're interested in.
              </Typography>
              <Button
                variant="contained"
                startIcon={<Work />}
                onClick={() => navigate('/')}
              >
                Browse Jobs
              </Button>
            </Paper>
          )}

          {/* View Toggle and Jobs */}
          {bookmarkedJobs.length > 0 && (
            <>
              <ViewToggle
                viewMode={viewMode}
                onViewModeChange={setViewMode}
                jobCount={bookmarkedJobs.length}
              />

              <Grid container spacing={3}>
                {renderBookmarkedJobs}
              </Grid>
            </>
          )}
        </Box>
      </Container>
    </ErrorBoundary>
  );
});

BookmarksPage.displayName = 'BookmarksPage';

export default BookmarksPage;
