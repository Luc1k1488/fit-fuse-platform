
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Trophy, Target, Flame } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/auth_context";

export const UserStats = () => {
  const { user } = useAuth();

  const { data: stats, isLoading } = useQuery({
    queryKey: ['user-stats', user?.id],
    queryFn: async () => {
      if (!user) return null;

      // Получаем статистику бронирований
      const { data: bookings } = await supabase
        .from('bookings')
        .select('*')
        .eq('user_id', user.id);

      // Получаем отзывы пользователя
      const { data: reviews } = await supabase
        .from('reviews')
        .select('*')
        .eq('user_id', user.id);

      const totalBookings = bookings?.length || 0;
      const completedBookings = bookings?.filter(b => b.status === 'completed').length || 0;
      const totalReviews = reviews?.length || 0;
      
      // Вычисляем среднюю оценку, которую ставит пользователь
      const avgRating = reviews && reviews.length > 0 
        ? reviews.reduce((sum, review) => sum + (review.rating || 0), 0) / reviews.length 
        : 0;

      return {
        totalBookings,
        completedBookings,
        totalReviews,
        avgRating: Math.round(avgRating * 10) / 10
      };
    },
    enabled: !!user
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="bg-gray-800 border-gray-700">
            <CardContent className="p-4">
              <div className="animate-pulse bg-gray-700 h-16 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!stats) return null;

  const statCards = [
    {
      title: "Всего бронирований",
      value: stats.totalBookings,
      icon: Calendar,
      color: "bg-blue-500"
    },
    {
      title: "Завершенных",
      value: stats.completedBookings,
      icon: Trophy,
      color: "bg-green-500"
    },
    {
      title: "Отзывов написано",
      value: stats.totalReviews,
      icon: Target,
      color: "bg-purple-500"
    },
    {
      title: "Средняя оценка",
      value: stats.avgRating || "—",
      icon: Flame,
      color: "bg-orange-500"
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {statCards.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index} className="bg-gray-800 border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${stat.color}`}>
                  <Icon className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                  <p className="text-sm text-gray-400">{stat.title}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
