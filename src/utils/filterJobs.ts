import type { Job } from '../store/slices/jobsSlice';
import type { FiltersState } from '../store/slices/filtersSlice';

export const filterJobs = (jobs: Job[], filters: FiltersState): Job[] => {
  return jobs.filter(job => {
    // Search term filter
    if (filters.searchTerm.trim()) {
      const searchTerm = filters.searchTerm.toLowerCase();
      const matchesSearch = 
        job.title.toLowerCase().includes(searchTerm) ||
        job.company_name.toLowerCase().includes(searchTerm) ||
        job.description.toLowerCase().includes(searchTerm) ||
        job.location.toLowerCase().includes(searchTerm);
      
      if (!matchesSearch) return false;
    }

    // Remote filter
    if (filters.remoteFilter !== 'all') {
      if (filters.remoteFilter === 'remote' && !job.remote) return false;
      if (filters.remoteFilter === 'onsite' && job.remote) return false;
    }

    // Location filter
    if (filters.locationFilter && job.location !== filters.locationFilter) {
      return false;
    }

    // Tags filter
    if (filters.tagsFilter.length > 0) {
      const hasMatchingTag = filters.tagsFilter.some(filterTag =>
        job.tags?.some(jobTag => 
          jobTag.toLowerCase().includes(filterTag.toLowerCase())
        )
      );
      if (!hasMatchingTag) return false;
    }

    // Job type filter
    if (filters.jobTypeFilter.length > 0) {
      const hasMatchingJobType = filters.jobTypeFilter.some(filterType =>
        job.job_types?.some(jobType => 
          jobType.toLowerCase().includes(filterType.toLowerCase())
        )
      );
      if (!hasMatchingJobType) return false;
    }

    return true;
  });
};

export const getFilteredJobsCount = (jobs: Job[], filters: FiltersState): number => {
  return filterJobs(jobs, filters).length;
};
