
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/auth_context";
import { Heart, MapPin, Star } from "lucide-react";
import { Link } from "react-router-dom";

export const FavoriteGyms = () => {
  const { user } = useAuth();

  const { data: favoriteGyms, isLoading } = useQuery({
    queryKey: ['favorite-gyms', user?.id],
    queryFn: async () => {
      if (!user) return [];

      // Получаем залы, которые пользователь чаще всего бронирует
      const { data: bookings } = await supabase
        .from('bookings')
        .select(`
          gym_id,
          gym:gym_id (
            id,
            name,
            location,
            rating,
            review_count,
            main_image
          )
        `)
        .eq('user_id', user.id)
        .not('gym_id', 'is', null);

      if (!bookings) return [];

      // Группируем по залам и считаем количество бронирований
      const gymCounts = bookings.reduce((acc, booking) => {
        if (booking.gym_id && booking.gym) {
          acc[booking.gym_id] = {
            gym: booking.gym,
            count: (acc[booking.gym_id]?.count || 0) + 1
          };
        }
        return acc;
      }, {} as Record<string, { gym: any; count: number }>);

      // Сортируем по количеству бронирований и берем топ-3
      return Object.values(gymCounts)
        .sort((a, b) => b.count - a.count)
        .slice(0, 3)
        .map(item => ({ ...item.gym, bookingCount: item.count }));
    },
    enabled: !!user
  });

  if (isLoading) {
    return (
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Heart className="h-5 w-5 mr-2 text-red-500" />
            Любимые залы
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse bg-gray-700 h-20 rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!favoriteGyms || favoriteGyms.length === 0) {
    return (
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Heart className="h-5 w-5 mr-2 text-red-500" />
            Любимые залы
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-400 text-center py-8">
            У вас пока нет любимых залов. Забронируйте несколько залов, чтобы они появились здесь!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <Heart className="h-5 w-5 mr-2 text-red-500" />
          Любимые залы
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {favoriteGyms.map((gym) => (
            <div key={gym.id} className="p-3 bg-gray-700/50 rounded-lg">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="text-white font-medium">{gym.name}</h4>
                  <div className="flex items-center text-gray-400 text-sm mt-1">
                    <MapPin className="h-3 w-3 mr-1" />
                    {gym.location}
                  </div>
                  <div className="flex items-center mt-2 space-x-4">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-400 mr-1" />
                      <span className="text-white text-sm">{gym.rating}</span>
                      <span className="text-gray-400 text-sm ml-1">
                        ({gym.review_count})
                      </span>
                    </div>
                    <span className="text-purple-400 text-sm">
                      {gym.bookingCount} {gym.bookingCount === 1 ? 'бронирование' : 'бронирований'}
                    </span>
                  </div>
                </div>
                <Link to={`/client/gyms/${gym.id}`}>
                  <Button size="sm" variant="outline" className="border-gray-600 text-gray-300">
                    Подробнее
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
