
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { screen, fireEvent } from '@testing-library/dom';
import { waitFor } from '@testing-library/react';
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

    // Mock API responses with proper structure
    mockSupabase.from.mockImplementation((table: string) => {
      const mockChain = {
        select: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        delete: vi.fn().mockReturnThis(),
        insert: vi.fn().mockReturnThis(),
        update: vi.fn().mockReturnThis(),
        limit: vi.fn().mockReturnThis(),
        single: vi.fn(),
        maybeSingle: vi.fn(),
      };

      if (table === 'reviews') {
        mockChain.order.mockResolvedValue({ data: mockReviews, error: null });
        mockChain.delete.mockResolvedValue({ data: null, error: null });
      } else if (table === 'users') {
        mockChain.select.mockResolvedValue({ data: mockUsers, error: null });
      } else if (table === 'gyms') {
        mockChain.select.mockResolvedValue({ data: mockGyms, error: null });
      }

      return mockChain;
    });

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

    mockSupabase.from.mockReturnValue({
      select: vi.fn().mockReturnThis(),
      order: vi.fn().mockResolvedValue({ data: mockReviews, error: null }),
      eq: vi.fn().mockReturnThis(),
      delete: vi.fn().mockReturnThis(),
      insert: vi.fn().mockReturnThis(),
      update: vi.fn().mockReturnThis(),
      limit: vi.fn().mockReturnThis(),
      single: vi.fn(),
      maybeSingle: vi.fn(),
    });

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

    mockSupabase.from.mockReturnValue({
      select: vi.fn().mockReturnThis(),
      order: vi.fn().mockResolvedValue({ data: mockReviews, error: null }),
      eq: vi.fn().mockReturnThis(),
      delete: vi.fn().mockReturnThis(),
      insert: vi.fn().mockReturnThis(),
      update: vi.fn().mockReturnThis(),
      limit: vi.fn().mockReturnThis(),
      single: vi.fn(),
      maybeSingle: vi.fn(),
    });

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

    const mockDelete = vi.fn().mockResolvedValue({ data: null, error: null });

    mockSupabase.from.mockImplementation((table: string) => {
      if (table === 'reviews') {
        return {
          select: vi.fn().mockReturnThis(),
          order: vi.fn().mockResolvedValue({ data: mockReviews, error: null }),
          delete: vi.fn().mockReturnThis(),
          eq: mockDelete,
          insert: vi.fn().mockReturnThis(),
          update: vi.fn().mockReturnThis(),
          limit: vi.fn().mockReturnThis(),
          single: vi.fn(),
          maybeSingle: vi.fn(),
        };
      }
      return {
        select: vi.fn().mockResolvedValue({ data: [], error: null }),
        order: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        delete: vi.fn().mockReturnThis(),
        insert: vi.fn().mockReturnThis(),
        update: vi.fn().mockReturnThis(),
        limit: vi.fn().mockReturnThis(),
        single: vi.fn(),
        maybeSingle: vi.fn(),
      };
    });

    renderWithProviders(<AdminReviews />);

    await waitFor(() => {
      expect(screen.getByText('Review to hide')).toBeInTheDocument();
    });

    const hideButton = screen.getByText('Скрыть');
    fireEvent.click(hideButton);

    await waitFor(() => {
      expect(mockDelete).toHaveBeenCalledWith('1');
    });
  });
});
