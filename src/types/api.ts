
// API Response types with strict typing
export interface ApiResponse<T = unknown> {
  data: T;
  error: string | null;
  success: boolean;
  message?: string;
}

export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// Query and Mutation types
export interface QueryOptions {
  enabled?: boolean;
  refetchInterval?: number;
  cacheTime?: number;
  staleTime?: number;
  retry?: boolean | number;
}

export interface MutationOptions<TData = unknown, TError = Error, TVariables = unknown> {
  onSuccess?: (data: TData, variables: TVariables) => void;
  onError?: (error: TError, variables: TVariables) => void;
  onSettled?: (data: TData | undefined, error: TError | null, variables: TVariables) => void;
}

// Form validation types
export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export interface FormFieldConfig {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  validator?: (value: unknown) => string | null;
}

// Performance optimization types
export interface CacheConfig {
  ttl: number; // Time to live in seconds
  maxSize: number; // Maximum number of cached items
  strategy: 'lru' | 'fifo' | 'lfu'; // Cache eviction strategy
}

export interface PerformanceMetrics {
  loadTime: number;
  renderTime: number;
  memoryUsage: number;
  apiCalls: number;
}
