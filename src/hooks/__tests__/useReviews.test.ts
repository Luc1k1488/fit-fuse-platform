
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useReviews } from '../useReviews';
import { mockSupabase, createMockReview } from '../../utils/testUtils';

// Mock the supabase client
vi.mock('@/integrations/supabase/client', () => ({
  supabase: mockSupabase,
}));

// Mock toast
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe('useReviews', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch reviews for a gym', async () => {
    const mockReviews = [
      createMockReview({ id: '1', rating: 5 }),
      createMockReview({ id: '2', rating: 4 }),
    ];

    mockSupabase.from('reviews').select().eq().order.mockResolvedValue({ data: mockReviews, error: null });

    const { result } = renderHook(() => useReviews('test-gym-id'));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.reviews).toEqual(mockReviews);
    expect(result.current.getAverageRating()).toBe(4.5);
    expect(result.current.reviewCount).toBe(2);
  });

  it('should handle fetch error', async () => {
    mockSupabase.from('reviews').select().eq().order.mockResolvedValue({ 
      data: null, 
      error: new Error('Database error') 
    });

    const { result } = renderHook(() => useReviews('test-gym-id'));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.reviews).toEqual([]);
  });

  it('should submit review successfully', async () => {
    const mockReview = createMockReview();
    
    mockSupabase.from('reviews').insert.mockResolvedValue({ data: mockReview, error: null });
    mockSupabase.from('reviews').select().eq().order.mockResolvedValue({ data: [mockReview], error: null });

    const { result } = renderHook(() => useReviews('test-gym-id'));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    const success = await result.current.submitReview(
      { rating: 5, comment: 'Great!' },
      'test-user-id'
    );

    expect(success).toBe(true);
    expect(mockSupabase.from('reviews').insert).toHaveBeenCalledWith({
      gym_id: 'test-gym-id',
      user_id: 'test-user-id',
      rating: 5,
      comment: 'Great!',
    });
  });

  it('should calculate average rating correctly', () => {
    const { result } = renderHook(() => useReviews());
    
    // Manually set reviews for testing
    result.current.reviews = [
      createMockReview({ rating: 5 }),
      createMockReview({ rating: 3 }),
      createMockReview({ rating: 4 }),
    ];

    expect(result.current.getAverageRating()).toBe(4);
  });
});
