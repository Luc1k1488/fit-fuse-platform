
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import AdminReviews from '../../pages/admin/AdminReviews';
import { renderWithProviders, mockSupabase, createMockReview, createMockUser, createMockGym } from '../../utils/testUtils';

// Mock dependencies
vi.mock('@/integrations/supabase/client', () => ({
  supabase: mockSupabase,
}));

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe('AdminReviews Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should load and display reviews with user and gym data', async () => {
    const mockReviews = [
      createMockReview({ id: '1', rating: 5, comment: 'Excellent gym!' }),
      createMockReview({ id: '2', rating: 3, comment: 'Average place' }),
    ];

    const mockUsers = [
      createMockUser({ id: 'test-user-id', name: 'John Doe' }),
    ];

    const mockGyms = [
      createMockGym({ id: 'test-gym-id', name: 'Test Fitness Center' }),
    ];

    // Mock the reviews query
    const reviewsChain = mockSupabase.from('reviews');
    reviewsChain.order.mockResolvedValue({ data: mockReviews, error: null });

    // Mock the users query
    const usersChain = mockSupabase.from('users');
    usersChain.select.mockResolvedValue({ data: mockUsers, error: null });

    // Mock the gyms query
    const gymsChain = mockSupabase.from('gyms');
    gymsChain.select.mockResolvedValue({ data: mockGyms, error: null });

    renderWithProviders(<AdminReviews />);

    await waitFor(() => {
      expect(screen.getByText('Управление отзывами')).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByText('Excellent gym!')).toBeInTheDocument();
      expect(screen.getByText('Average place')).toBeInTheDocument();
    });

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Test Fitness Center')).toBeInTheDocument();
  });

  it('should filter reviews by rating', async () => {
    const mockReviews = [
      createMockReview({ id: '1', rating: 5, comment: 'Excellent!' }),
      createMockReview({ id: '2', rating: 2, comment: 'Poor service' }),
    ];

    const reviewsChain = mockSupabase.from('reviews');
    reviewsChain.order.mockResolvedValue({ data: mockReviews, error: null });

    const usersChain = mockSupabase.from('users');
    usersChain.select.mockResolvedValue({ data: [], error: null });

    const gymsChain = mockSupabase.from('gyms');
    gymsChain.select.mockResolvedValue({ data: [], error: null });

    renderWithProviders(<AdminReviews />);

    await waitFor(() => {
      expect(screen.getByText('Все рейтинги')).toBeInTheDocument();
    });

    const filterSelect = screen.getByDisplayValue('Все рейтинги');
    fireEvent.click(filterSelect);
    
    const positiveOption = screen.getByText('Положительные (4-5)');
    fireEvent.click(positiveOption);

    expect(screen.getByText('Excellent!')).toBeInTheDocument();
    expect(screen.queryByText('Poor service')).not.toBeInTheDocument();
  });

  it('should search reviews by content', async () => {
    const mockReviews = [
      createMockReview({ id: '1', comment: 'Great equipment and staff' }),
      createMockReview({ id: '2', comment: 'Clean facilities' }),
    ];

    const reviewsChain = mockSupabase.from('reviews');
    reviewsChain.order.mockResolvedValue({ data: mockReviews, error: null });

    const usersChain = mockSupabase.from('users');
    usersChain.select.mockResolvedValue({ data: [], error: null });

    const gymsChain = mockSupabase.from('gyms');
    gymsChain.select.mockResolvedValue({ data: [], error: null });

    renderWithProviders(<AdminReviews />);

    await waitFor(() => {
      expect(screen.getByPlaceholderText('Поиск по отзывам...')).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText('Поиск по отзывам...');
    fireEvent.change(searchInput, { target: { value: 'equipment' } });

    await waitFor(() => {
      expect(screen.getByText('Great equipment and staff')).toBeInTheDocument();
      expect(screen.queryByText('Clean facilities')).not.toBeInTheDocument();
    });
  });

  it('should hide review when hide button is clicked', async () => {
    const mockReviews = [
      createMockReview({ id: '1', comment: 'Review to hide' }),
    ];

    const reviewsChain = mockSupabase.from('reviews');
    reviewsChain.order.mockResolvedValue({ data: mockReviews, error: null });
    reviewsChain.delete.mockReturnThis();
    reviewsChain.eq.mockResolvedValue({ data: null, error: null });

    const usersChain = mockSupabase.from('users');
    usersChain.select.mockResolvedValue({ data: [], error: null });

    const gymsChain = mockSupabase.from('gyms');
    gymsChain.select.mockResolvedValue({ data: [], error: null });

    renderWithProviders(<AdminReviews />);

    await waitFor(() => {
      expect(screen.getByText('Review to hide')).toBeInTheDocument();
    });

    const hideButton = screen.getByText('Скрыть');
    fireEvent.click(hideButton);

    await waitFor(() => {
      expect(reviewsChain.eq).toHaveBeenCalledWith('id', '1');
    });
  });
});
