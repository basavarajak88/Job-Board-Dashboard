import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Box,
  Grid,
  Button,
  Alert,
  Fade,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { useAppSelector, useAppDispatch } from "../hooks/useAppDispatch";
import { fetchJobs } from "../store/slices/jobsSlice";
import JobCard from "../components/JobCard";
import JobSkeleton from "../components/JobSkeleton";
import ViewToggle from "../components/ViewToggle";
import SearchBar from "../components/SearchBar";
import FilterPanel from "../components/FilterPanel";
import ErrorBoundary from "../components/ErrorBoundary";
import { filterJobs } from "../utils/filterJobs";
import type { ViewMode } from "../components/ViewToggle";

const JobsPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { jobs, loading, error, hasMore, currentPage } = useAppSelector(
    (state) => state.jobs
  );
  const filters = useAppSelector((state) => state.filters);

  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [loadingMore, setLoadingMore] = useState(false);

  // Filter jobs based on current filters
  const filteredJobs = useMemo(() => {
    return filterJobs(jobs, filters);
  }, [jobs, filters]);

  // Initial load
  useEffect(() => {
    if (jobs.length === 0) {
      dispatch(fetchJobs(1));
    }
  }, [dispatch, jobs.length]);

  // Handle load more
  const handleLoadMore = useCallback(async () => {
    if (!hasMore || loading || loadingMore) return;

    setLoadingMore(true);
    try {
      await dispatch(fetchJobs(currentPage + 1)).unwrap();
    } catch (error) {
      console.error("Error loading more jobs:", error);
    } finally {
      setLoadingMore(false);
    }
  }, [dispatch, currentPage, hasMore, loading, loadingMore]);

  // Handle job card click
  const handleJobClick = useCallback(
    (jobSlug: string) => {
      navigate(`/job/${jobSlug}`);
    },
    [navigate]
  );

  // Handle retry
  const handleRetry = useCallback(() => {
    dispatch(fetchJobs(1));
  }, [dispatch]);

  // Render loading skeletons
  const renderSkeletons = () => {
    const skeletonCount = 6;
    return Array.from({ length: skeletonCount }, (_, index) => (
      <Grid
        size={{
          xs: 12,
          sm: viewMode === "grid" ? 6 : 12,
          md: viewMode === "grid" ? 4 : 12,
        }}
        key={`skeleton-${index}`}
        sx={{ display: "flex" }}
      >
        <JobSkeleton />
      </Grid>
    ));
  };

  // Render job cards
  const renderJobs = () => {
    return filteredJobs.map((job) => (
      <Grid
        size={{
          xs: 12,
          sm: viewMode === "grid" ? 6 : 12,
          md: viewMode === "grid" ? 4 : 12,
        }}
        key={job.slug}
        sx={{ display: "flex" }}
      >
        <Fade in timeout={300}>
          <Box sx={{ width: "100%", display: "flex" }}>
            <JobCard
              job={job}
              onClick={() => handleJobClick(job.slug)}
              viewMode={viewMode}
            />
          </Box>
        </Fade>
      </Grid>
    ));
  };

  return (
    <ErrorBoundary>
      <Container maxWidth={false} sx={{ width: "100%", px: { xs: 0, md: 3 } }}>
        <Box sx={{ py: 2 }}>
          {/* Header */}
          <Typography variant="h4" component="h1" gutterBottom>
            Job Listings
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
            Discover your next career opportunity
          </Typography>

          {/* Search Bar */}
          <Box sx={{ mb: 2 }}>
            <SearchBar />
          </Box>

          {/* Filter Panel */}
          <FilterPanel />

          {/* Error State */}
          {error && !loading && (
            <Alert
              severity="error"
              sx={{ mb: 2 }}
              action={
                <Button color="inherit" size="small" onClick={handleRetry}>
                  Retry
                </Button>
              }
            >
              {error}
            </Alert>
          )}

          {/* View Toggle */}
          {!error && jobs.length > 0 && (
            <ViewToggle
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              jobCount={filteredJobs.length}
            />
          )}

          {/* Jobs Grid */}
          <Grid container spacing={2} sx={{ alignItems: "stretch" }}>
            {/* Loading state - show skeletons */}
            {loading && jobs.length === 0 && renderSkeletons()}

            {/* Jobs */}
            {filteredJobs.length > 0 && renderJobs()}

            {/* Loading more skeletons */}
            {loadingMore &&
              Array.from({ length: 3 }, (_, index) => (
                <Grid
                  size={{
                    xs: 12,
                    sm: viewMode === "grid" ? 6 : 12,
                    md: viewMode === "grid" ? 4 : 12,
                  }}
                  key={`loading-skeleton-${index}`}
                  sx={{ display: "flex" }}
                >
                  <JobSkeleton />
                </Grid>
              ))}
          </Grid>

          {/* No Results State */}
          {!loading &&
            !error &&
            jobs.length > 0 &&
            filteredJobs.length === 0 && (
              <Box sx={{ textAlign: "center", py: 4 }}>
                <Typography variant="h6" gutterBottom>
                  No jobs match your filters
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 2 }}
                >
                  Try adjusting your search criteria or clearing some filters.
                </Typography>
              </Box>
            )}

          {/* Empty State */}
          {!loading && !error && jobs.length === 0 && (
            <Box sx={{ textAlign: "center", py: 4 }}>
              <Typography variant="h6" gutterBottom>
                No jobs found
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                We couldn't find any job listings at the moment.
              </Typography>
              <Button variant="contained" onClick={handleRetry}>
                Refresh
              </Button>
            </Box>
          )}

          {/* Load More Button */}
          {!error && jobs.length > 0 && hasMore && filteredJobs.length > 0 && (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
              <LoadingButton
                variant="outlined"
                size="large"
                onClick={handleLoadMore}
                loading={loadingMore}
                disabled={loading}
              >
                Load More Jobs
              </LoadingButton>
            </Box>
          )}

          {/* End of results */}
          {!error && jobs.length > 0 && !hasMore && filteredJobs.length > 0 && (
            <Box sx={{ textAlign: "center", mt: 3 }}>
              <Typography variant="body2" color="text.secondary">
                You've reached the end of the job listings
              </Typography>
            </Box>
          )}
        </Box>
      </Container>
    </ErrorBoundary>
  );
};

export default JobsPage;
