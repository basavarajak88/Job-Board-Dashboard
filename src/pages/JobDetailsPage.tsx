import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Button,
  Chip,
  Paper,
  IconButton,
  Stack,
  Divider,
  Alert,
  Skeleton,
  Breadcrumbs,
  Link,
} from '@mui/material';
import {
  ArrowBack,
  BookmarkBorder,
  Bookmark,
  OpenInNew,
  LocationOn,
  Business,
  Schedule,
} from '@mui/icons-material';
import { format } from 'date-fns';
import DOMPurify from 'dompurify';
import { useAppSelector, useAppDispatch } from '../hooks/useAppDispatch';
import { toggleBookmark } from '../store/slices/bookmarksSlice';
import ErrorBoundary from '../components/ErrorBoundary';

const JobDetailsPage: React.FC = React.memo(() => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  
  const jobs = useAppSelector(state => state.jobs.jobs);
  const bookmarkedJobs = useAppSelector(state => state.bookmarks.bookmarkedJobs);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Find job by slug
  const job = useMemo(() => {
    return jobs.find(j => j.slug === id);
  }, [jobs, id]);

  const isBookmarked = useMemo(() => {
    return bookmarkedJobs.some(bookmarkedJob => bookmarkedJob.slug === id);
  }, [bookmarkedJobs, id]);

  useEffect(() => {
    if (jobs.length > 0) {
      if (!job) {
        setError('Job not found');
      } else {
        setError(null);
      }
      setLoading(false);
    }
  }, [job, jobs.length]);

  const handleBookmarkToggle = useCallback(() => {
    if (job) {
      dispatch(toggleBookmark(job));
    }
  }, [dispatch, job]);

  const handleApplyClick = useCallback(() => {
    if (job?.url) {
      window.open(job.url, '_blank', 'noopener,noreferrer');
    }
  }, [job?.url]);

  const handleBackClick = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  const formatDate = useCallback((timestamp: number) => {
    try {
      return format(new Date(timestamp * 1000), 'MMMM dd, yyyy');
    } catch {
      return 'Date unavailable';
    }
  }, []);

  const sanitizeHTML = useCallback((html: string) => {
    return DOMPurify.sanitize(html, {
      ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'ul', 'ol', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
      ALLOWED_ATTR: [],
    });
  }, []);

  if (loading) {
    return (
      <Container maxWidth={false} sx={{ width: '100%', px: { xs: 2, md: 3 } }}>
        <Box sx={{ py: 2 }}>
          <Skeleton variant="text" width={200} height={40} sx={{ mb: 1 }} />
          <Skeleton variant="text" width="100%" height={60} sx={{ mb: 2 }} />
          <Skeleton variant="rectangular" width="100%" height={300} />
        </Box>
      </Container>
    );
  }

  if (error || !job) {
    return (
      <ErrorBoundary>
        <Container maxWidth={false} sx={{ width: '100%', px: { xs: 2, md: 3 } }}>
          <Box sx={{ py: 2 }}>
            <Alert severity="error" sx={{ mb: 2 }}>
              {error || 'Job not found'}
            </Alert>
            <Button
              variant="contained"
              startIcon={<ArrowBack />}
              onClick={handleBackClick}
            >
              Go Back
            </Button>
          </Box>
        </Container>
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      <Container maxWidth={false} sx={{ width: '100%', px: { xs: 2, md: 3 } }}>
        <Box sx={{ py: 2 }}>
          {/* Breadcrumbs */}
          <Breadcrumbs sx={{ mb: 2 }}>
            <Link
              component="button"
              variant="body2"
              onClick={() => navigate('/')}
              sx={{ textDecoration: 'none' }}
            >
              Jobs
            </Link>
            <Typography variant="body2" color="text.primary">
              {job.title}
            </Typography>
          </Breadcrumbs>

          {/* Back Button */}
          <Button
            startIcon={<ArrowBack />}
            onClick={handleBackClick}
            sx={{ mb: 2 }}
          >
            Back to Jobs
          </Button>

          {/* Main Content Grid */}
          <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', lg: 'row' } }}>
            {/* Left Column - Main Content */}
            <Box sx={{ flex: 1 }}>
              {/* Job Header */}
              <Paper elevation={1} sx={{ p: 3, mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="h4" component="h1" gutterBottom>
                      {job.title}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Business sx={{ fontSize: 20, mr: 1, color: 'text.secondary' }} />
                      <Typography variant="h6" color="text.secondary">
                        {job.company_name}
                      </Typography>
                    </Box>
                  </Box>
                  <IconButton
                    onClick={handleBookmarkToggle}
                    color={isBookmarked ? 'primary' : 'default'}
                    size="large"
                  >
                    {isBookmarked ? <Bookmark /> : <BookmarkBorder />}
                  </IconButton>
                </Box>

                {/* Job Meta Information */}
                <Stack direction="row" spacing={3} sx={{ mb: 2, flexWrap: 'wrap' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <LocationOn sx={{ fontSize: 18, mr: 0.5, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">
                      {job.location || 'Location not specified'}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Schedule sx={{ fontSize: 18, mr: 0.5, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">
                      Posted {formatDate(job.created_at)}
                    </Typography>
                  </Box>
                  {job.remote && (
                    <Chip 
                      label="Remote" 
                      size="small" 
                      color="success" 
                      variant="filled"
                    />
                  )}
                </Stack>

                {/* Apply Button */}
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<OpenInNew />}
                  onClick={handleApplyClick}
                  fullWidth
                >
                  Apply Now
                </Button>
              </Paper>

              {/* Job Description */}
              <Paper elevation={1} sx={{ p: 3, mb: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Job Description
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Box
                  sx={{
                    '& p': { mb: 1.5 },
                    '& ul, & ol': { pl: 3, mb: 1.5 },
                    '& li': { mb: 0.5 },
                    '& h1, & h2, & h3, & h4, & h5, & h6': { mt: 2, mb: 1.5, fontWeight: 600 },
                    lineHeight: 1.6,
                    maxHeight: { xs: 'none', lg: '400px' },
                    overflowY: { xs: 'visible', lg: 'auto' },
                    pr: { xs: 0, lg: 1 }
                  }}
                  dangerouslySetInnerHTML={{
                    __html: sanitizeHTML(job.description),
                  }}
                />
              </Paper>
            </Box>

            {/* Right Column - Sidebar */}
            <Box sx={{ width: { xs: '100%', lg: '300px' }, flexShrink: 0 }}>
              {/* Job Tags */}
              {job.tags && job.tags.length > 0 && (
                <Paper elevation={1} sx={{ p: 2, mb: 2 }}>
                  <Typography variant="h6" gutterBottom sx={{ fontSize: '1.1rem' }}>
                    Skills & Technologies
                  </Typography>
                  <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap>
                    {job.tags.map((tag, index) => (
                      <Chip 
                        key={index} 
                        label={tag} 
                        variant="outlined"
                        size="small"
                        sx={{ fontSize: '0.75rem' }}
                      />
                    ))}
                  </Stack>
                </Paper>
              )}

              {/* Job Types */}
              {job.job_types && job.job_types.length > 0 && (
                <Paper elevation={1} sx={{ p: 2, mb: 2 }}>
                  <Typography variant="h6" gutterBottom sx={{ fontSize: '1.1rem' }}>
                    Job Types
                  </Typography>
                  <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap>
                    {job.job_types.map((type, index) => (
                      <Chip 
                        key={index} 
                        label={type} 
                        color="primary"
                        variant="filled"
                        size="small"
                        sx={{ fontSize: '0.75rem' }}
                      />
                    ))}
                  </Stack>
                </Paper>
              )}

              {/* Quick Apply Section */}
              <Paper elevation={1} sx={{ p: 2, textAlign: 'center', position: 'sticky', top: 20 }}>
                <Typography variant="h6" gutterBottom sx={{ fontSize: '1.1rem' }}>
                  Interested?
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Join {job.company_name}
                </Typography>
                <Stack spacing={1}>
                  <Button
                    variant="contained"
                    size="medium"
                    startIcon={<OpenInNew />}
                    onClick={handleApplyClick}
                    fullWidth
                  >
                    Apply Now
                  </Button>
                  <Button
                    variant="outlined"
                    size="medium"
                    startIcon={isBookmarked ? <Bookmark /> : <BookmarkBorder />}
                    onClick={handleBookmarkToggle}
                    fullWidth
                  >
                    {isBookmarked ? 'Bookmarked' : 'Bookmark'}
                  </Button>
                </Stack>
              </Paper>
            </Box>
          </Box>
        </Box>
      </Container>
    </ErrorBoundary>
  );
});

JobDetailsPage.displayName = 'JobDetailsPage';

export default JobDetailsPage;
