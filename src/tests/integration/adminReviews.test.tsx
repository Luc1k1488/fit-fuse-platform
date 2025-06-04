
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

    // Mock API responses
    mockSupabase.from.mockImplementation((table) => {
      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        delete: vi.fn().mockReturnThis(),
      };

      if (table === 'reviews') {
        mockQuery.select.mockResolvedValue({ data: mockReviews, error: null });
        mockQuery.delete.mockResolvedValue({ data: null, error: null });
      } else if (table === 'users') {
        mockQuery.select.mockResolvedValue({ data: mockUsers, error: null });
      } else if (table === 'gyms') {
        mockQuery.select.mockResolvedValue({ data: mockGyms, error: null });
      }

      return mockQuery;
    });

    renderWithProviders(<AdminReviews />);

    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByText('Управление отзывами')).toBeInTheDocument();
    });

    // Check if reviews are displayed
    await waitFor(() => {
      expect(screen.getByText('Excellent gym!')).toBeInTheDocument();
      expect(screen.getByText('Average place')).toBeInTheDocument();
    });

    // Check if user and gym names are displayed
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Test Fitness Center')).toBeInTheDocument();
  });

  it('should filter reviews by rating', async () => {
    const mockReviews = [
      createMockReview({ id: '1', rating: 5, comment: 'Excellent!' }),
      createMockReview({ id: '2', rating: 2, comment: 'Poor service' }),
    ];

    mockSupabase.from.mockReturnValue({
      select: vi.fn().mockReturnThis(),
      order: vi.fn().mockResolvedValue({ data: mockReviews, error: null }),
    });

    renderWithProviders(<AdminReviews />);

    await waitFor(() => {
      expect(screen.getByText('Все рейтинги')).toBeInTheDocument();
    });

    // Filter by positive reviews
    const filterSelect = screen.getByDisplayValue('Все рейтинги');
    fireEvent.click(filterSelect);
    
    const positiveOption = screen.getByText('Положительные (4-5)');
    fireEvent.click(positiveOption);

    // Should only show positive reviews
    expect(screen.getByText('Excellent!')).toBeInTheDocument();
    expect(screen.queryByText('Poor service')).not.toBeInTheDocument();
  });

  it('should search reviews by content', async () => {
    const mockReviews = [
      createMockReview({ id: '1', comment: 'Great equipment and staff' }),
      createMockReview({ id: '2', comment: 'Clean facilities' }),
    ];

    mockSupabase.from.mockReturnValue({
      select: vi.fn().mockReturnThis(),
      order: vi.fn().mockResolvedValue({ data: mockReviews, error: null }),
    });

    renderWithProviders(<AdminReviews />);

    await waitFor(() => {
      expect(screen.getByPlaceholderText('Поиск по отзывам...')).toBeInTheDocument();
    });

    // Search for specific content
    const searchInput = screen.getByPlaceholderText('Поиск по отзывам...');
    fireEvent.change(searchInput, { target: { value: 'equipment' } });

    // Should only show matching reviews
    await waitFor(() => {
      expect(screen.getByText('Great equipment and staff')).toBeInTheDocument();
      expect(screen.queryByText('Clean facilities')).not.toBeInTheDocument();
    });
  });

  it('should hide review when hide button is clicked', async () => {
    const mockReviews = [
      createMockReview({ id: '1', comment: 'Review to hide' }),
    ];

    const mockDelete = vi.fn().mockResolvedValue({ data: null, error: null });

    mockSupabase.from.mockImplementation((table) => {
      if (table === 'reviews') {
        return {
          select: vi.fn().mockReturnThis(),
          order: vi.fn().mockResolvedValue({ data: mockReviews, error: null }),
          delete: vi.fn().mockReturnThis(),
          eq: mockDelete,
        };
      }
      return {
        select: vi.fn().mockResolvedValue({ data: [], error: null }),
      };
    });

    renderWithProviders(<AdminReviews />);

    await waitFor(() => {
      expect(screen.getByText('Review to hide')).toBeInTheDocument();
    });

    // Click hide button
    const hideButton = screen.getByText('Скрыть');
    fireEvent.click(hideButton);

    await waitFor(() => {
      expect(mockDelete).toHaveBeenCalledWith('1');
    });
  });
});
