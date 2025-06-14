
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/auth_context";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { Calendar, Star, MapPin } from "lucide-react";

export const RecentActivity = () => {
  const { user } = useAuth();

  const { data: activities, isLoading } = useQuery({
    queryKey: ['recent-activity', user?.id],
    queryFn: async () => {
      if (!user) return [];

      // Получаем последние бронирования с информацией о залах
      const { data: bookings } = await supabase
        .from('bookings')
        .select(`
          *,
          gym:gym_id (name, location),
          class:class_id (title, instructor)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5);

      // Получаем последние отзывы с информацией о залах
      const { data: reviews } = await supabase
        .from('reviews')
        .select(`
          *,
          gym:gym_id (name, location)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5);

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
    },
    enabled: !!user
  });

  if (isLoading) {
    return (
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Последняя активность</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse bg-gray-700 h-16 rounded"></div>
            ))}
          </div>
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
          <p className="text-gray-400 text-center py-8">
            Активности пока нет
          </p>
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
            <div key={`${activity.type}-${activity.id}`} className="flex items-start space-x-3 p-3 bg-gray-700/50 rounded-lg">
              {activity.type === 'booking' ? (
                <Calendar className="h-5 w-5 text-blue-400 mt-0.5" />
              ) : (
                <Star className="h-5 w-5 text-yellow-400 mt-0.5" />
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <div>
                    {activity.type === 'booking' ? (
                      <div>
                        <p className="text-white font-medium">
                          Бронирование {activity.data.class_id ? 'занятия' : 'зала'}
                        </p>
                        <p className="text-gray-300 text-sm">
                          {activity.data.gym?.name || activity.data.class?.title}
                        </p>
                        {activity.data.gym?.location && (
                          <div className="flex items-center text-gray-400 text-xs mt-1">
                            <MapPin className="h-3 w-3 mr-1" />
                            {activity.data.gym.location}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div>
                        <p className="text-white font-medium">
                          Отзыв о {activity.data.gym?.name}
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
                  <div className="text-right">
                    <Badge variant={activity.type === 'booking' ? 'default' : 'secondary'}>
                      {activity.type === 'booking' ? 'Бронирование' : 'Отзыв'}
                    </Badge>
                    <p className="text-gray-400 text-xs mt-1">
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
