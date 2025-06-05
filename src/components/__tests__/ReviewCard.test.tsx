
import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/dom';
import { ReviewCard } from '../reviews/ReviewCard';
import { renderWithProviders, createMockReview } from '../../utils/testUtils';

describe('ReviewCard', () => {
  it('should render review information correctly', () => {
    const mockReview = {
      id: '1',
      rating: 4,
      comment: 'Great gym with excellent equipment!',
      user_name: 'John Doe',
      user_avatar: 'avatar.jpg',
      created_at: '2024-01-15T10:00:00Z',
    };

    renderWithProviders(<ReviewCard review={mockReview} />);

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Great gym with excellent equipment!')).toBeInTheDocument();
    expect(screen.getByText('15 янв 2024')).toBeInTheDocument();
  });

  it('should render fallback for missing user name', () => {
    const mockReview = {
      id: '1',
      rating: 5,
      comment: 'Amazing place!',
      created_at: '2024-01-15T10:00:00Z',
    };

    renderWithProviders(<ReviewCard review={mockReview} />);

    expect(screen.getByText('Пользователь')).toBeInTheDocument();
  });

  it('should render correct number of stars', () => {
    const mockReview = {
      id: '1',
      rating: 3,
      comment: 'Average gym',
      created_at: '2024-01-15T10:00:00Z',
    };

    renderWithProviders(<ReviewCard review={mockReview} />);

    const stars = screen.getAllByTestId(/star/);
    const filledStars = stars.filter(star => star.classList.contains('fill-amber-500'));
    
    expect(filledStars).toHaveLength(3);
  });

  it('should format date correctly', () => {
    const mockReview = {
      id: '1',
      rating: 5,
      comment: 'Excellent!',
      created_at: '2024-12-25T15:30:00Z',
    };

    renderWithProviders(<ReviewCard review={mockReview} />);

    expect(screen.getByText('25 дек 2024')).toBeInTheDocument();
  });
});
