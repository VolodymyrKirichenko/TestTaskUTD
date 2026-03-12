export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

export interface Event {
  id: string;
  title: string;
  date: string;
  location: string;
  shortDescription: string;
  description: string;
  isRegistered?: boolean;
}

export interface EventListItem {
  id: string;
  title: string;
  date: string;
  location: string;
  shortDescription: string;
  isRegistered?: boolean;
}

export interface EventRegistration {
  fullName: string;
  email: string;
  phone: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}
