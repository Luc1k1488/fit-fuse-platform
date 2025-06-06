
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AdminReviewsHeader } from "@/components/admin/reviews/AdminReviewsHeader";
import { AdminReviewsFilters, Rating } from "@/components/admin/reviews/AdminReviewsFilters";
import { AdminReviewsList } from "@/components/admin/reviews/AdminReviewsList";
import { toast } from "sonner";
import { Star } from "lucide-react";

interface AdminReview {
  id: string;
  user_id: string | null;
  gym_id: string | null;
  rating: number | null;
  comment: string | null;
  created_at: string | null;
  user_name?: string;
  user_avatar?: string;
  gym_name?: string;
}

const AdminReviews = () => {
  const [reviews, setReviews] = useState<AdminReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [filteredReviews, setFilteredReviews] = useState<AdminReview[]>([]);
  const [ratingFilter, setRatingFilter] = useState<Rating>("all");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Загрузка всех отзывов
  const fetchReviews = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from("reviews")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (error) {
        console.error("Error fetching reviews:", error);
        toast.error("Не удалось загрузить отзывы");
        return;
      }
      
      // Загружаем данные о пользователях
      const users = await fetchUsers();
      
      // Загружаем данные о залах
      const gyms = await fetchGyms();
      
      // Объединяем данные
      const enrichedReviews = data.map(review => ({
        ...review,
        user_name: users.find(u => u.id === review.user_id)?.name || "Неизвестный пользователь",
        user_avatar: users.find(u => u.id === review.user_id)?.profile_image || null,
        gym_name: gyms.find(g => g.id === review.gym_id)?.name || "Неизвестный зал"
      }));
      
      setReviews(enrichedReviews);
      setFilteredReviews(enrichedReviews);
    } catch (error) {
      console.error("Exception fetching reviews:", error);
      toast.error("Произошла ошибка при загрузке отзывов");
    } finally {
      setLoading(false);
    }
  };
  
  // Загрузка пользователей
  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase.from("users").select("id, name, profile_image");
      
      if (error) {
        console.error("Error fetching users:", error);
        return [];
      }
      
      return data || [];
    } catch (error) {
      console.error("Exception fetching users:", error);
      return [];
    }
  };
  
  // Загрузка залов
  const fetchGyms = async () => {
    try {
      const { data, error } = await supabase.from("gyms").select("id, name");
      
      if (error) {
        console.error("Error fetching gyms:", error);
        return [];
      }
      
      return data || [];
    } catch (error) {
      console.error("Exception fetching gyms:", error);
      return [];
    }
  };
  
  // Фильтрация отзывов по рейтингу
  const filterReviewsByRating = (reviews: AdminReview[]) => {
    if (ratingFilter === "all") return reviews;
    
    return reviews.filter(review => {
      const rating = review.rating || 0;
      
      switch (ratingFilter) {
        case "positive":
          return rating >= 4;
        case "neutral":
          return rating === 3;
        case "negative":
          return rating < 3;
        default:
          return true;
      }
    });
  };
  
  // Фильтрация отзывов по поисковому запросу
  const filterReviewsBySearch = (reviews: AdminReview[]) => {
    if (!searchQuery.trim()) return reviews;
    
    const query = searchQuery.toLowerCase().trim();
    
    return reviews.filter(review => 
      review.comment?.toLowerCase().includes(query) || 
      review.user_name?.toLowerCase().includes(query) || 
      review.gym_name?.toLowerCase().includes(query)
    );
  };
  
  // Применение всех фильтров
  const applyFilters = () => {
    let result = [...reviews];
    
    result = filterReviewsByRating(result);
    result = filterReviewsBySearch(result);
    
    setFilteredReviews(result);
  };
  
  // Скрытие (удаление) отзыва
  const handleHideReview = async (id: string) => {
    try {
      const { error } = await supabase
        .from("reviews")
        .delete()
        .eq("id", id);
      
      if (error) {
        console.error("Error hiding review:", error);
        toast.error("Не удалось скрыть отзыв");
        return;
      }
      
      // Обновляем списки отзывов
      setReviews(prev => prev.filter(r => r.id !== id));
      setFilteredReviews(prev => prev.filter(r => r.id !== id));
      
      toast.success("Отзыв успешно скрыт");
    } catch (error) {
      console.error("Exception hiding review:", error);
      toast.error("Произошла ошибка при скрытии отзыва");
    }
  };
  
  useEffect(() => {
    fetchReviews();
  }, []);
  
  useEffect(() => {
    applyFilters();
  }, [reviews, ratingFilter, searchQuery]);

  // Calculate statistics for AdminReviewsHeader
  const calculateStatistics = () => {
    const totalReviews = reviews.length;
    if (totalReviews === 0) {
      return {
        avgRating: 0,
        totalReviews: 0,
        positivePercentage: 0,
        negativePercentage: 0
      };
    }

    // Calculate average rating
    const totalRating = reviews.reduce((sum, review) => sum + (review.rating || 0), 0);
    const avgRating = totalRating / totalReviews;

    // Calculate positive and negative percentages
    const positiveReviews = reviews.filter(review => (review.rating || 0) >= 4).length;
    const negativeReviews = reviews.filter(review => (review.rating || 0) <= 2).length;

    const positivePercentage = Math.round((positiveReviews / totalReviews) * 100);
    const negativePercentage = Math.round((negativeReviews / totalReviews) * 100);

    return {
      avgRating,
      totalReviews,
      positivePercentage,
      negativePercentage
    };
  };

  const stats = calculateStatistics();

  // Render stars based on rating for header
  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star
          key={i}
          className={`h-4 w-4 ${
            i <= Math.round(rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
          }`}
        />
      );
    }
    return stars;
  };
  
  return (
    <div className="space-y-6">
      <AdminReviewsHeader 
        avgRating={stats.avgRating}
        totalReviews={stats.totalReviews}
        positivePercentage={stats.positivePercentage}
        negativePercentage={stats.negativePercentage}
        renderStars={renderStars}
      />
      
      <AdminReviewsFilters
        ratingFilter={ratingFilter}
        setRatingFilter={setRatingFilter}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
      
      <AdminReviewsList
        reviews={filteredReviews}
        loading={loading}
        onHideReview={handleHideReview}
        onRefresh={fetchReviews}
      />
    </div>
  );
};

export default AdminReviews;
