
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Star, StarHalf, Search, AlertTriangle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Review, User, Gym } from "@/types";
import { toast } from "sonner";

const AdminReviews = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [users, setUsers] = useState<Record<string, User>>({});
  const [gyms, setGyms] = useState<Record<string, Gym>>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRating, setFilterRating] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [reviewsResponse, usersResponse, gymsResponse] = await Promise.all([
        supabase.from('reviews').select('*').order('created_at', { ascending: false }),
        supabase.from('users').select('*'),
        supabase.from('gyms').select('*')
      ]);

      if (reviewsResponse.error) throw reviewsResponse.error;
      if (usersResponse.error) throw usersResponse.error;
      if (gymsResponse.error) throw gymsResponse.error;

      setReviews(reviewsResponse.data || []);
      
      // Create lookup objects
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
    try {
      const { error } = await supabase
        .from('reviews')
        .delete()
        .eq('id', reviewId);

      if (error) throw error;

      setReviews(reviews.filter(r => r.id !== reviewId));
      toast.success('Отзыв скрыт');
    } catch (error) {
      console.error('Error hiding review:', error);
      toast.error('Ошибка скрытия отзыва');
    }
  };

  // Filtered reviews based on search, rating, and tab
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

  // Calculate statistics
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
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Управление отзывами</h1>
      
      <div className="mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Обзор отзывов</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg text-center">
                <div className="text-2xl font-bold text-green-700 dark:text-green-300">
                  {avgRating.toFixed(1)}
                </div>
                <div className="flex justify-center mt-1">{renderStars(avgRating)}</div>
                <p className="text-sm text-green-600 dark:text-green-400 mt-1">Средний рейтинг</p>
              </div>
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-center">
                <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">{reviews.length}</div>
                <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">Всего отзывов</p>
              </div>
              <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg text-center">
                <div className="text-2xl font-bold text-amber-700 dark:text-amber-300">
                  {positivePercentage.toFixed(0)}%
                </div>
                <p className="text-sm text-amber-600 dark:text-amber-400 mt-1">Положительные</p>
              </div>
              <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg text-center">
                <div className="text-2xl font-bold text-red-700 dark:text-red-300">
                  {negativePercentage.toFixed(0)}%
                </div>
                <p className="text-sm text-red-600 dark:text-red-400 mt-1">Негативные</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Поиск по отзывам..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 w-full"
            />
          </div>
          <Select value={filterRating} onValueChange={setFilterRating}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Фильтр по рейтингу" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все рейтинги</SelectItem>
              <SelectItem value="positive">Положительные (4-5)</SelectItem>
              <SelectItem value="neutral">Нейтральные (3)</SelectItem>
              <SelectItem value="negative">Негативные (1-2)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
        
      <Card>
        <CardContent className="p-0">
          {filteredReviews.length > 0 ? (
            <div className="divide-y">
              {filteredReviews.map(review => {
                const user = users[review.user_id || ''];
                const gym = gyms[review.gym_id || ''];
                
                return (
                  <div key={review.id} className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center">
                        <Avatar className="h-10 w-10 mr-3">
                          <AvatarImage src={user?.profile_image || ""} />
                          <AvatarFallback>
                            {user?.name ? user.name.substring(0, 2) : 'ПО'}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center">
                            <h3 className="font-medium">{user?.name || 'Пользователь'}</h3>
                          </div>
                          <div className="flex items-center text-sm text-gray-500">
                            <span>{formatDate(review.created_at)}</span>
                            <span className="mx-2">•</span>
                            <span>{gym?.name || 'Неизвестный зал'}</span>
                            {gym?.location && (
                              <>
                                <span className="mx-2">•</span>
                                <span>{gym.location}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center">
                        {renderStars(review.rating)}
                      </div>
                    </div>
                    
                    <div className="mt-3">
                      <p>{review.comment}</p>
                    </div>
                    
                    <div className="mt-4 flex justify-end space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleHideReview(review.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                      >
                        Скрыть
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-8 text-center text-gray-500">
              <AlertTriangle className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium mb-2">Ничего не найдено</h3>
              <p>По вашему запросу не найдено отзывов. Попробуйте изменить параметры поиска.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminReviews;
