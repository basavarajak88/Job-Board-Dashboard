import React, { useMemo } from 'react';
import {
  Paper,
  Typography,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  OutlinedInput,
  Button,
  Divider,
  Grid,
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material/Select';
import { FilterList, Clear } from '@mui/icons-material';
import { useAppSelector, useAppDispatch } from '../../hooks/useAppDispatch';
import {
  setRemoteFilter,
  setLocationFilter,
  setTagsFilter,
  setJobTypeFilter,
  clearAllFilters,
} from '../../store/slices/filtersSlice';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const FilterPanel: React.FC = () => {
  const dispatch = useAppDispatch();
  const filters = useAppSelector(state => state.filters);
  const jobs = useAppSelector(state => state.jobs.jobs);

  // Extract unique values from jobs data
  const { uniqueLocations, uniqueTags, uniqueJobTypes } = useMemo(() => {
    const locations = new Set<string>();
    const tags = new Set<string>();
    const jobTypes = new Set<string>();

    jobs.forEach(job => {
      if (job.location && job.location.trim()) {
        locations.add(job.location.trim());
      }
      if (job.tags) {
        job.tags.forEach(tag => tags.add(tag));
      }
      if (job.job_types) {
        job.job_types.forEach(type => jobTypes.add(type));
      }
    });

    return {
      uniqueLocations: Array.from(locations).sort(),
      uniqueTags: Array.from(tags).sort(),
      uniqueJobTypes: Array.from(jobTypes).sort(),
    };
  }, [jobs]);

  const handleRemoteFilterChange = (event: SelectChangeEvent) => {
    dispatch(setRemoteFilter(event.target.value as 'all' | 'remote' | 'onsite'));
  };

  const handleLocationFilterChange = (event: SelectChangeEvent) => {
    dispatch(setLocationFilter(event.target.value));
  };

  const handleTagsFilterChange = (event: SelectChangeEvent<string[]>) => {
    const value = event.target.value;
    dispatch(setTagsFilter(typeof value === 'string' ? value.split(',') : value));
  };

  const handleJobTypeFilterChange = (event: SelectChangeEvent<string[]>) => {
    const value = event.target.value;
    dispatch(setJobTypeFilter(typeof value === 'string' ? value.split(',') : value));
  };

  const handleClearAllFilters = () => {
    dispatch(clearAllFilters());
  };

  const hasActiveFilters = 
    filters.remoteFilter !== 'all' ||
    filters.locationFilter !== '' ||
    filters.tagsFilter.length > 0 ||
    filters.jobTypeFilter.length > 0 ||
    filters.searchTerm !== '';

  return (
    <Paper elevation={1} sx={{ p: 2, mb: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <FilterList color="primary" />
          <Typography variant="h6" component="h2">
            Filters
          </Typography>
        </Box>
        {hasActiveFilters && (
          <Button
            variant="outlined"
            size="small"
            startIcon={<Clear />}
            onClick={handleClearAllFilters}
          >
            Clear All
          </Button>
        )}
      </Box>

      <Grid container spacing={2}>
        {/* Remote Filter */}
        <Grid  size={{ xs: 6, md: 3 }}>
          <FormControl fullWidth size="small">
            <InputLabel id="remote-filter-label">Work Type</InputLabel>
            <Select
              labelId="remote-filter-label"
              value={filters.remoteFilter}
              label="Work Type"
              onChange={handleRemoteFilterChange}
            >
              <MenuItem value="all">All Jobs</MenuItem>
              <MenuItem value="remote">Remote Only</MenuItem>
              <MenuItem value="onsite">On-Site Only</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        {/* Location Filter */}
        <Grid  size={{ xs: 6, md: 3 }}>
          <FormControl fullWidth size="small">
            <InputLabel id="location-filter-label">Location</InputLabel>
            <Select
              labelId="location-filter-label"
              value={filters.locationFilter}
              label="Location"
              onChange={handleLocationFilterChange}
            >
              <MenuItem value="">All Locations</MenuItem>
              {uniqueLocations.map((location) => (
                <MenuItem key={location} value={location}>
                  {location}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* Tags Filter */}
        <Grid  size={{ xs: 6, md: 3 }}>
          <FormControl fullWidth size="small">
            <InputLabel id="tags-filter-label">Skills & Tags</InputLabel>
            <Select
              labelId="tags-filter-label"
              multiple
              value={filters.tagsFilter}
              onChange={handleTagsFilterChange}
              input={<OutlinedInput label="Skills & Tags" />}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip key={value} label={value} size="small" />
                  ))}
                </Box>
              )}
              MenuProps={MenuProps}
            >
              {uniqueTags.map((tag) => (
                <MenuItem key={tag} value={tag}>
                  {tag}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* Job Types Filter */}
        <Grid  size={{ xs: 6, md: 3 }}>
          <FormControl fullWidth size="small">
            <InputLabel id="job-types-filter-label">Job Types</InputLabel>
            <Select
              labelId="job-types-filter-label"
              multiple
              value={filters.jobTypeFilter}
              onChange={handleJobTypeFilterChange}
              input={<OutlinedInput label="Job Types" />}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip key={value} label={value} size="small" color="primary" />
                  ))}
                </Box>
              )}
              MenuProps={MenuProps}
            >
              {uniqueJobTypes.map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      {/* Active Filters Summary */}
      {hasActiveFilters && (
        <Box sx={{ mt: 2, pt: 2, borderTop: 1, borderColor: 'divider' }}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Active Filters:
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {filters.searchTerm && (
              <Chip
                label={`Search: "${filters.searchTerm}"`}
                size="small"
                variant="outlined"
              />
            )}
            {filters.remoteFilter !== 'all' && (
              <Chip
                label={`Work: ${filters.remoteFilter === 'remote' ? 'Remote' : 'On-Site'}`}
                size="small"
                variant="outlined"
              />
            )}
            {filters.locationFilter && (
              <Chip
                label={`Location: ${filters.locationFilter}`}
                size="small"
                variant="outlined"
              />
            )}
            {filters.tagsFilter.length > 0 && (
              <Chip
                label={`Tags: ${filters.tagsFilter.length} selected`}
                size="small"
                variant="outlined"
              />
            )}
            {filters.jobTypeFilter.length > 0 && (
              <Chip
                label={`Types: ${filters.jobTypeFilter.length} selected`}
                size="small"
                variant="outlined"
              />
            )}
          </Box>
        </Box>
      )}
    </Paper>
  );
};

export default FilterPanel;
