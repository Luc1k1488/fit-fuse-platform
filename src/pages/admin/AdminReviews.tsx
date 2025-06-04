import { useState, useEffect } from "react";
import { Star, StarHalf } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Review, User, Gym } from "@/types";
import { toast } from "sonner";
import { AdminReviewsHeader } from "@/components/admin/reviews/AdminReviewsHeader";
import { AdminReviewsFilters } from "@/components/admin/reviews/AdminReviewsFilters";
import { AdminReviewsList } from "@/components/admin/reviews/AdminReviewsList";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { useAsyncOperation } from "@/hooks/useAsyncOperation";

const AdminReviews = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [users, setUsers] = useState<Record<string, User>>({});
  const [gyms, setGyms] = useState<Record<string, Gym>>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRating, setFilterRating] = useState("all");
  const [loading, setLoading] = useState(true);

  const { loading: hideLoading, execute: executeHide } = useAsyncOperation<void>();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      const [reviewsResponse, usersResponse, gymsResponse] = await Promise.all([
        supabase.from('reviews').select('*').order('created_at', { ascending: false }),
        supabase.from('users').select('*'),
        supabase.from('gyms').select('*')
      ]);

      if (reviewsResponse.error) throw reviewsResponse.error;
      if (usersResponse.error) throw usersResponse.error;
      if (gymsResponse.error) throw gymsResponse.error;

      setReviews(reviewsResponse.data || []);
      
      const usersMap = (usersResponse.data || []).reduce((acc: Record<string, User>, user: any) => {
        acc[user.id] = {
          ...user,
          role: user.role as "user" | "admin" | "partner" | "support"
        };
        return acc;
      }, {});
      
      const gymsMap = (gymsResponse.data || []).reduce((acc: Record<string, Gym>, gym: Gym) => {
        acc[gym.id] = gym;
        return acc;
      }, {});

      setUsers(usersMap);
      setGyms(gymsMap);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Ошибка загрузки данных');
    } finally {
      setLoading(false);
    }
  };

  const handleHideReview = async (reviewId: string) => {
    await executeHide({
      operation: async () => {
        const { error } = await supabase
          .from('reviews')
          .delete()
          .eq('id', reviewId);

        if (error) throw error;
        
        setReviews(reviews.filter(r => r.id !== reviewId));
      },
      successMessage: 'Отзыв скрыт',
      errorMessage: 'Ошибка скрытия отзыва'
    });
  };

  const filteredReviews = reviews.filter(review => {
    const user = users[review.user_id || ''];
    const gym = gyms[review.gym_id || ''];
    
    const matchesSearch = 
      user?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      gym?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      review.comment?.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesRating = 
      filterRating === "all" || 
      (filterRating === "positive" && (review.rating || 0) >= 4) ||
      (filterRating === "neutral" && (review.rating || 0) === 3) ||
      (filterRating === "negative" && (review.rating || 0) <= 2);
      
    return matchesSearch && matchesRating;
  });

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('ru-RU', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    }).format(date);
  };
  
  const renderStars = (rating: number | null) => {
    if (!rating) return null;
    
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`star-${i}`} className="h-4 w-4 fill-amber-500 text-amber-500" />);
    }
    
    if (hasHalfStar) {
      stars.push(<StarHalf key="half-star" className="h-4 w-4 fill-amber-500 text-amber-500" />);
    }
    
    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="h-4 w-4 text-gray-300" />);
    }
    
    return <div className="flex">{stars}</div>;
  };

  const avgRating = reviews.length > 0 ? 
    reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length : 0;
  
  const positivePercentage = reviews.length > 0 ? 
    (reviews.filter(r => (r.rating || 0) >= 4).length / reviews.length) * 100 : 0;
  
  const negativePercentage = reviews.length > 0 ? 
    (reviews.filter(r => (r.rating || 0) <= 2).length / reviews.length) * 100 : 0;

  if (loading) {
    return (
      <div className="p-4">
        <div className="flex items-center justify-center h-64">
          <LoadingSpinner size="lg" />
        </div>
      </div>
    );
  }
  
  return (
    <ErrorBoundary>
      <div className="p-4 animate-fade-in">
        <h1 className="text-2xl font-bold mb-4">Управление отзывами</h1>
        
        <AdminReviewsHeader
          avgRating={avgRating}
          totalReviews={reviews.length}
          positivePercentage={positivePercentage}
          negativePercentage={negativePercentage}
          renderStars={renderStars}
        />
        
        <AdminReviewsFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          filterRating={filterRating}
          onFilterRatingChange={setFilterRating}
        />
          
        <AdminReviewsList
          reviews={filteredReviews}
          users={users}
          gyms={gyms}
          onHideReview={handleHideReview}
          formatDate={formatDate}
          renderStars={renderStars}
        />
      </div>
    </ErrorBoundary>
  );
};

export default AdminReviews;
