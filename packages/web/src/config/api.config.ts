import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export const axiosInstance = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const queries = {
  events: {
    queryKeys: {
      list: 'events',
      detail: 'event-detail',
    },
    endpoints: {
      list: '/events',
      detail: (id: string) => `/events/${id}`,
      register: (id: string) => `/events/${id}/register`,
    },
  },
};
