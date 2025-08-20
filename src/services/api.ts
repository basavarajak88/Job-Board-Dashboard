import axios from 'axios';
import type { AxiosInstance, AxiosResponse } from 'axios';


const BASE_URL = 'https://www.arbeitnow.com/api';

interface JobsApiResponse {
  data: any[];
  links: {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
  };
  meta: {
    current_page: number;
    from: number;
    last_page: number;
    path: string;
    per_page: number;
    to: number;
    total: number;
  };
}

class JobsAPI {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor
    this.api.interceptors.request.use(
      (config) => {
        console.log(`Making request to: ${config.url}`);
        return config;
      },
      (error) => {
        console.error('Request error:', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.api.interceptors.response.use(
      (response: AxiosResponse) => {
        return response;
      },
      (error) => {
        console.error('Response error:', error);
        
        if (error.response) {
          // Server responded with error status
          const message = error.response.data?.message || 'Server error occurred';
          throw new Error(message);
        } else if (error.request) {
          // Request was made but no response received
          throw new Error('Network error - please check your connection');
        } else {
          // Something else happened
          throw new Error('An unexpected error occurred');
        }
      }
    );
  }

  async getJobs(page: number = 1): Promise<JobsApiResponse> {
    try {
      const response = await this.api.get<JobsApiResponse>('/job-board-api', {
        params: { page },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching jobs:', error);
      throw error;
    }
  }

  async getJobBySlug(slug: string) {
    try {
      const response = await this.api.get<JobsApiResponse>('/job-board-api');
      const job = response.data.data.find((job: any) => job.slug === slug);
      return job;
    } catch (error) {
      console.error('Error fetching job details:', error);
      throw error;
    }
  }
}

export const jobsApi = new JobsAPI();
