
import React from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { vi } from 'vitest';

// Mock Supabase client for testing
export const mockSupabase = {
  from: vi.fn(() => ({
    select: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    delete: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    order: vi.fn().mockReturnThis(),
    limit: vi.fn().mockReturnThis(),
    single: vi.fn(),
    maybeSingle: vi.fn(),
  })),
  auth: {
    getUser: vi.fn(),
    signIn: vi.fn(),
    signOut: vi.fn(),
    onAuthStateChange: vi.fn(),
  },
  storage: {
    from: vi.fn(() => ({
      upload: vi.fn(),
      download: vi.fn(),
      remove: vi.fn(),
      getPublicUrl: vi.fn(),
    })),
  },
};

// Test wrapper component
interface TestWrapperProps {
  children: React.ReactNode;
}

const TestWrapper: React.FC<TestWrapperProps> = ({ children }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        {children}
      </BrowserRouter>
    </QueryClientProvider>
  );
};

// Custom render function with providers
export const renderWithProviders = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => {
  return render(ui, { wrapper: TestWrapper, ...options });
};

// Test data factories
export const createMockUser = (overrides = {}) => ({
  id: 'test-user-id',
  email: 'test@example.com',
  name: 'Test User',
  role: 'user' as const,
  created_at: '2024-01-01T00:00:00Z',
  profile_image: null,
  phone: null,
  subscription_id: null,
  ...overrides,
});

export const createMockGym = (overrides = {}) => ({
  id: 'test-gym-id',
  name: 'Test Gym',
  location: 'Test Location',
  owner_id: 'test-owner-id',
  partner_id: null,
  main_image: null,
  working_hours: '6:00-22:00',
  review_count: 0,
  rating: 0,
  category: 'fitness',
  features: ['parking', 'wifi'],
  city: 'Moscow',
  address: 'Test Address',
  images: [],
  created_at: '2024-01-01T00:00:00Z',
  ...overrides,
});

export const createMockReview = (overrides = {}) => ({
  id: 'test-review-id',
  user_id: 'test-user-id',
  gym_id: 'test-gym-id',
  rating: 5,
  comment: 'Great gym!',
  created_at: '2024-01-01T00:00:00Z',
  ...overrides,
});

export const createMockBooking = (overrides = {}) => ({
  id: 'test-booking-id',
  user_id: 'test-user-id',
  class_id: 'test-class-id',
  gym_id: 'test-gym-id',
  status: 'confirmed' as const,
  date_time: '2024-01-01T10:00:00Z',
  created_at: '2024-01-01T00:00:00Z',
  ...overrides,
});

// Performance testing utilities
export const measurePerformance = async <T,>(
  fn: () => Promise<T>,
  name: string
): Promise<{ result: T; duration: number }> => {
  const start = performance.now();
  const result = await fn();
  const end = performance.now();
  const duration = end - start;
  
  console.log(`Performance: ${name} took ${duration.toFixed(2)}ms`);
  
  return { result, duration };
};

// Memory usage testing
export const measureMemoryUsage = (): number => {
  if ('memory' in performance) {
    return (performance as any).memory.usedJSHeapSize;
  }
  return 0;
};

// Async testing utilities
export const waitForCondition = async (
  condition: () => boolean,
  timeout = 5000,
  interval = 100
): Promise<void> => {
  const start = Date.now();
  
  return new Promise((resolve, reject) => {
    const check = () => {
      if (condition()) {
        resolve();
      } else if (Date.now() - start > timeout) {
        reject(new Error(`Condition not met within ${timeout}ms`));
      } else {
        setTimeout(check, interval);
      }
    };
    check();
  });
};
