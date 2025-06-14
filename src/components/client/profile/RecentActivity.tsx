
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/auth_context";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { Calendar, Star, MapPin } from "lucide-react";
import { LoadingState } from "@/components/ui/loading-state";
import { ErrorFallback } from "@/components/ui/error-fallback";
import { useErrorHandler } from "@/hooks/useErrorHandler";

export const RecentActivity = () => {
  const { user } = useAuth();
  const { handleError } = useErrorHandler();

  const { data: activities, isLoading, error, refetch } = useQuery({
    queryKey: ['recent-activity', user?.id],
    queryFn: async () => {
      if (!user) return [];

      try {
        // Получаем последние бронирования
        const { data: bookings, error: bookingsError } = await supabase
          .from('bookings')
          .select(`
            id,
            created_at,
            gym_id,
            class_id,
            gyms!fk_bookings_gym_id (
              name,
              location
            ),
            classes!fk_bookings_class_id (
              title
            )
          `)
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(5);

        if (bookingsError) throw bookingsError;

        // Получаем последние отзывы
        const { data: reviews, error: reviewsError } = await supabase
          .from('reviews')
          .select(`
            id,
            created_at,
            rating,
            gym_id,
            gyms!fk_reviews_gym_id (
              name,
              location
            )
          `)
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(5);

        if (reviewsError) throw reviewsError;

        // Объединяем и сортируем по дате
        const allActivities = [
          ...(bookings || []).map(booking => ({
            type: 'booking' as const,
            id: booking.id,
            date: booking.created_at,
            data: booking
          })),
          ...(reviews || []).map(review => ({
            type: 'review' as const,
            id: review.id,
            date: review.created_at,
            data: review
          }))
        ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

        return allActivities.slice(0, 10);
      } catch (error) {
        handleError(error as Error);
        throw error;
      }
    },
    enabled: !!user,
    retry: 3,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000)
  });

  if (isLoading) {
    return (
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Последняя активность</CardTitle>
        </CardHeader>
        <CardContent>
          <LoadingState message="Загружаем активность..." />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Последняя активность</CardTitle>
        </CardHeader>
        <CardContent>
          <ErrorFallback 
            error={error as Error} 
            resetError={() => refetch()}
            title="Ошибка загрузки активности"
          />
        </CardContent>
      </Card>
    );
  }

  if (!activities || activities.length === 0) {
    return (
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Последняя активность</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-400">Активности пока нет</p>
            <p className="text-gray-500 text-sm mt-2">
              Забронируйте зал или оставьте отзыв, чтобы увидеть активность здесь
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white">Последняя активность</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={`${activity.type}-${activity.id}`} className="flex items-start space-x-3 p-3 bg-gray-700/50 rounded-lg hover:bg-gray-700/70 transition-colors">
              {activity.type === 'booking' ? (
                <Calendar className="h-5 w-5 text-blue-400 mt-0.5 flex-shrink-0" />
              ) : (
                <Star className="h-5 w-5 text-yellow-400 mt-0.5 flex-shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    {activity.type === 'booking' ? (
                      <div>
                        <p className="text-white font-medium truncate">
                          Бронирование {activity.data.class_id ? 'занятия' : 'зала'}
                        </p>
                        <p className="text-gray-300 text-sm truncate">
                          {activity.data.gyms?.name || activity.data.classes?.title}
                        </p>
                        {activity.data.gyms?.location && (
                          <div className="flex items-center text-gray-400 text-xs mt-1">
                            <MapPin className="h-3 w-3 mr-1 flex-shrink-0" />
                            <span className="truncate">{activity.data.gyms.location}</span>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div>
                        <p className="text-white font-medium truncate">
                          Отзыв о {activity.data.gyms?.name}
                        </p>
                        <div className="flex items-center mt-1">
                          {Array.from({ length: 5 }, (_, i) => (
                            <Star
                              key={i}
                              className={`h-3 w-3 ${
                                i < (activity.data.rating || 0)
                                  ? 'fill-yellow-400 text-yellow-400'
                                  : 'text-gray-400'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="text-right flex-shrink-0">
                    <Badge 
                      variant={activity.type === 'booking' ? 'default' : 'secondary'}
                      className="mb-1"
                    >
                      {activity.type === 'booking' ? 'Бронирование' : 'Отзыв'}
                    </Badge>
                    <p className="text-gray-400 text-xs">
                      {format(new Date(activity.date), "d MMM, HH:mm", { locale: ru })}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
