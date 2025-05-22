
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/auth_context";
import { BarChart, Users, Dumbbell, Calendar, Star, CreditCard } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format, parseISO, subDays } from "date-fns";
import { ru } from "date-fns/locale";
import { Activity as ActivityIcon } from "lucide-react";

// Type for platform stats
interface PlatformStats {
  userCount: number;
  userGrowth: number;
  gymCount: number;
  newGyms: number;
  classesToday: number;
  fullyBooked: number;
  monthlyRevenue: number;
  revenueGrowth: number;
}

// Type for recent activity
interface ActivityItem {
  id: string;
  type: "user_joined" | "booking_created" | "class_created" | "review_added";
  title: string;
  description: string;
  time: string;
  icon: JSX.Element;
}

// Type for top gym
interface TopGym {
  id: string;
  name: string;
  location: string;
  bookings: number;
  rating: number;
  image?: string;
}

const AdminDashboard = () => {
  const { user } = useAuth();

  // Fetch platform stats
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["admin-dashboard-stats"],
    queryFn: async (): Promise<PlatformStats> => {
      // Get total users
      const { count: userCount, error: userError } = await supabase
        .from("users")
        .select("*", { count: 'exact', head: true });
      
      if (userError) throw userError;
      
      // Get new users in last 30 days
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const { count: newUserCount, error: newUserError } = await supabase
        .from("users")
        .select("*", { count: 'exact', head: true })
        .gte("created_at", thirtyDaysAgo.toISOString());
      
      if (newUserError) throw newUserError;
      
      // Get gyms count
      const { count: gymCount, error: gymError } = await supabase
        .from("gyms")
        .select("*", { count: 'exact', head: true });
      
      if (gymError) throw gymError;
      
      // Get classes for today
      const today = new Date();
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      const { count: classTodayCount, error: classError } = await supabase
        .from("classes")
        .select("*", { count: 'exact', head: true })
        .gte("start_time", today.toISOString())
        .lt("start_time", tomorrow.toISOString());
      
      if (classError) throw classError;
      
      // Get fully booked classes
      const { count: fullyBookedCount, error: fullyBookedError } = await supabase
        .from("classes")
        .select("*", { count: 'exact', head: true })
        .eq("booked_count", "capacity");
      
      if (fullyBookedError) throw fullyBookedError;
      
      // Mock revenue data for now - would be replaced with actual subscription data
      const monthlyRevenue = 248920;
      const revenueGrowth = 18;
      
      return {
        userCount: userCount || 0,
        userGrowth: newUserCount ? Math.round((newUserCount / userCount) * 100) : 0,
        gymCount: gymCount || 0,
        newGyms: 5, // Mock data
        classesToday: classTodayCount || 0,
        fullyBooked: fullyBookedCount || 0,
        monthlyRevenue,
        revenueGrowth
      };
    }
  });
  
  // Fetch recent activity
  const { data: recentActivity, isLoading: activityLoading } = useQuery({
    queryKey: ["admin-dashboard-activity"],
    queryFn: async (): Promise<ActivityItem[]> => {
      // Get recent users
      const { data: recentUsers, error: userError } = await supabase
        .from("users")
        .select("id, name, created_at")
        .order("created_at", { ascending: false })
        .limit(2);
      
      if (userError) throw userError;
      
      // Get recent bookings
      const { data: recentBookings, error: bookingError } = await supabase
        .from("bookings")
        .select(`
          id, 
          created_at,
          user:user_id (name),
          class:class_id (title)
        `)
        .order("created_at", { ascending: false })
        .limit(2);
      
      if (bookingError) throw bookingError;
      
      // Get recent reviews
      const { data: recentReviews, error: reviewError } = await supabase
        .from("reviews")
        .select(`
          id,
          created_at,
          user:user_id (name),
          gym:gym_id (name),
          rating
        `)
        .order("created_at", { ascending: false })
        .limit(1);
      
      if (reviewError) throw reviewError;
      
      const activities: ActivityItem[] = [];
      
      // Add user registrations to activity
      recentUsers?.forEach(user => {
        activities.push({
          id: `user-${user.id}`,
          type: "user_joined",
          title: "Зарегистрирован новый пользователь",
          description: `${user.name || 'Пользователь'} присоединился к платформе`,
          time: user.created_at || new Date().toISOString(),
          icon: <Users className="h-5 w-5 text-blue-500" />
        });
      });
      
      // Add bookings to activity
      recentBookings?.forEach(booking => {
        activities.push({
          id: `booking-${booking.id}`,
          type: "booking_created",
          title: "Новое бронирование",
          description: `${booking.user?.name || 'Пользователь'} забронировал ${booking.class?.title || 'тренировку'}`,
          time: booking.created_at || new Date().toISOString(),
          icon: <Calendar className="h-5 w-5 text-green-500" />
        });
      });
      
      // Add reviews to activity
      recentReviews?.forEach(review => {
        activities.push({
          id: `review-${review.id}`,
          type: "review_added",
          title: "Новый отзыв",
          description: `${review.user?.name || 'Пользователь'} оставил отзыв на ${review.gym?.name || 'зал'} с оценкой ${review.rating}/5`,
          time: review.created_at || new Date().toISOString(),
          icon: <Star className="h-5 w-5 text-yellow-500" />
        });
      });
      
      // Sort by time (newest first)
      return activities.sort((a, b) => 
        new Date(b.time).getTime() - new Date(a.time).getTime()
      );
    }
  });
  
  // Fetch top gyms
  const { data: topGyms, isLoading: gymsLoading } = useQuery({
    queryKey: ["admin-dashboard-top-gyms"],
    queryFn: async (): Promise<TopGym[]> => {
      const { data: gyms, error } = await supabase
        .from("gyms")
        .select("id, name, location, rating, review_count, main_image")
        .order("rating", { ascending: false })
        .limit(5);
      
      if (error) throw error;
      
      // Get booking counts for these gyms
      const gymIds = gyms?.map(gym => gym.id) || [];
      
      const { data: bookingCounts, error: bookingError } = await supabase
        .from("bookings")
        .select("gym_id, count")
        .in("gym_id", gymIds)
        .group("gym_id");
      
      if (bookingError) throw bookingError;
      
      // Map booking counts to gyms
      return gyms?.map(gym => ({
        id: gym.id,
        name: gym.name || "Неизвестный зал",
        location: gym.location || "",
        bookings: bookingCounts?.find(b => b.gym_id === gym.id)?.count || 0,
        rating: gym.rating || 0,
        image: gym.main_image || undefined
      })) || [];
    }
  });

  // Format date
  const formatDate = (dateString: string) => {
    try {
      const date = parseISO(dateString);
      const now = new Date();
      const diffHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
      
      if (diffHours < 1) {
        return "Несколько минут назад";
      } else if (diffHours < 24) {
        return `${Math.floor(diffHours)} ч назад`;
      } else {
        return format(date, "d MMMM, HH:mm", { locale: ru });
      }
    } catch {
      return dateString;
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Панель управления</h1>
        <span className="text-gray-400">С возвращением, {user?.name || "Администратор"}</span>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Обзор</TabsTrigger>
          <TabsTrigger value="analytics">Аналитика</TabsTrigger>
          <TabsTrigger value="reports">Отчеты</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          {/* Быстрая статистика */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">Всего пользователей</p>
                    <h3 className="text-2xl font-bold mt-2">
                      {statsLoading ? "..." : stats?.userCount.toLocaleString()}
                    </h3>
                    <p className="text-xs text-green-500 mt-1">
                      +{statsLoading ? "..." : stats?.userGrowth}% с прошлого месяца
                    </p>
                  </div>
                  <div className="p-3 bg-blue-900/20 rounded-md">
                    <Users className="h-6 w-6 text-blue-500" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">Активные залы</p>
                    <h3 className="text-2xl font-bold mt-2">
                      {statsLoading ? "..." : stats?.gymCount.toLocaleString()}
                    </h3>
                    <p className="text-xs text-green-500 mt-1">
                      +{statsLoading ? "..." : stats?.newGyms} новых на этой неделе
                    </p>
                  </div>
                  <div className="p-3 bg-green-900/20 rounded-md">
                    <Dumbbell className="h-6 w-6 text-green-500" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">Тренировки сегодня</p>
                    <h3 className="text-2xl font-bold mt-2">
                      {statsLoading ? "..." : stats?.classesToday.toLocaleString()}
                    </h3>
                    <p className="text-xs text-blue-500 mt-1">
                      {statsLoading ? "..." : stats?.fullyBooked} полностью забронированы
                    </p>
                  </div>
                  <div className="p-3 bg-purple-900/20 rounded-md">
                    <Calendar className="h-6 w-6 text-purple-500" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">Доход (ежемесячно)</p>
                    <h3 className="text-2xl font-bold mt-2">
                      {statsLoading ? "..." : stats?.monthlyRevenue.toLocaleString()} ₽
                    </h3>
                    <p className="text-xs text-green-500 mt-1">
                      +{statsLoading ? "..." : stats?.revenueGrowth}% с прошлого месяца
                    </p>
                  </div>
                  <div className="p-3 bg-yellow-900/20 rounded-md">
                    <CreditCard className="h-6 w-6 text-yellow-500" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Двухколоночный макет */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Недавняя активность */}
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Недавняя активность</CardTitle>
                <CardDescription>Последние действия на платформе</CardDescription>
              </CardHeader>
              <CardContent>
                {activityLoading ? (
                  <div className="flex justify-center items-center h-[300px]">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                  </div>
                ) : recentActivity?.length === 0 ? (
                  <div className="text-center py-8">
                    <ActivityIcon className="h-12 w-12 mx-auto text-gray-500 mb-4" />
                    <p className="text-gray-400">Нет недавней активности</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {recentActivity?.map((item) => (
                      <div key={item.id} className="flex items-start">
                        <div className="p-2 bg-gray-800 rounded-md mr-4">
                          {item.icon}
                        </div>
                        <div>
                          <p className="font-medium">{item.title}</p>
                          <p className="text-sm text-gray-400">{item.description}</p>
                          <p className="text-xs text-gray-500">{formatDate(item.time)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Лучшие залы */}
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Лучшие фитнес-залы</CardTitle>
                <CardDescription>По бронированиям и рейтингам</CardDescription>
              </CardHeader>
              <CardContent>
                {gymsLoading ? (
                  <div className="flex justify-center items-center h-[300px]">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                  </div>
                ) : topGyms?.length === 0 ? (
                  <div className="text-center py-8">
                    <Dumbbell className="h-12 w-12 mx-auto text-gray-500 mb-4" />
                    <p className="text-gray-400">Нет данных о залах</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {topGyms?.map((gym, index) => (
                      <div key={gym.id} className="flex items-center justify-between border-b border-gray-800 pb-4 last:border-0 last:pb-0">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded bg-gray-800 flex-shrink-0 mr-3 overflow-hidden">
                            {gym.image ? (
                              <img src={gym.image} alt={gym.name} className="w-full h-full object-cover" />
                            ) : null}
                          </div>
                          <div>
                            <p className="font-medium">{gym.name}</p>
                            <p className="text-sm text-gray-400">{gym.location} • {gym.bookings} бронирований</p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          <span className="ml-1 font-medium">{gym.rating.toFixed(1)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="analytics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Статистика использования</CardTitle>
              <CardDescription>Показатели использования платформы за период</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px] flex items-center justify-center">
              <div className="text-center flex flex-col items-center space-y-2">
                <BarChart className="h-16 w-16 text-gray-500" />
                <p className="text-gray-400">Здесь будут отображаться графики аналитики</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="reports" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Сформированные отчеты</CardTitle>
              <CardDescription>Скачайте подробные отчеты</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center py-8 text-gray-400">Отчеты пока не сформированы</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
