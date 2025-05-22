
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { User, Gym, Booking, Subscription } from "@/types";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { format, parseISO, subDays } from "date-fns";
import { ru } from "date-fns/locale";
import { CheckCircle2, Users, Dumbbell, Calendar, CreditCard } from "lucide-react";

const AdminDashboard = () => {
  // Fetch data for dashboard
  const { data: userData } = useQuery({
    queryKey: ["dashboard-users"],
    queryFn: async () => {
      const { data } = await supabase
        .from("users")
        .select("*")
        .order("created_at", { ascending: false });
      
      return data as User[];
    },
  });

  const { data: bookingsData } = useQuery({
    queryKey: ["dashboard-bookings"],
    queryFn: async () => {
      const { data } = await supabase
        .from("bookings")
        .select("*")
        .order("date_time", { ascending: false });
      
      return data as Booking[];
    },
  });

  const { data: gymsData } = useQuery({
    queryKey: ["dashboard-gyms"],
    queryFn: async () => {
      const { data } = await supabase
        .from("gyms")
        .select("*")
        .order("created_at", { ascending: false });
      
      return data as Gym[];
    },
  });

  const { data: subscriptionsData } = useQuery({
    queryKey: ["dashboard-subscriptions"],
    queryFn: async () => {
      const { data } = await supabase
        .from("subscriptions")
        .select("*")
        .order("start_date", { ascending: false });
      
      return data as Subscription[];
    },
  });

  // Get count of users registered in the last 30 days
  const newUsersCount = userData?.filter(user => {
    if (!user.created_at) return false;
    const creationDate = parseISO(user.created_at);
    const thirtyDaysAgo = subDays(new Date(), 30);
    return creationDate >= thirtyDaysAgo;
  }).length || 0;

  // Get active bookings count
  const activeBookingsCount = bookingsData?.filter(booking => 
    booking.status === "confirmed"
  ).length || 0;

  // Calculate booking completion rate
  const totalBookings = bookingsData?.length || 0;
  const completionRate = totalBookings > 0 
    ? Math.round((activeBookingsCount / totalBookings) * 100) 
    : 0;

  // Recent activity data
  const recentUsers = userData?.slice(0, 5) || [];
  const recentBookings = bookingsData?.slice(0, 5) || [];

  // Prepare chart data
  const bookingsByStatus = [
    { name: 'Подтверждено', value: bookingsData?.filter(b => b.status === 'confirmed').length || 0, color: '#22c55e' },
    { name: 'Ожидание', value: bookingsData?.filter(b => b.status === 'pending').length || 0, color: '#eab308' },
    { name: 'Отменено', value: bookingsData?.filter(b => b.status === 'cancelled').length || 0, color: '#ef4444' },
  ];

  // Fake user activity data (for demonstration)
  const userActivityData = [
    { day: 'Пн', count: 120 },
    { day: 'Вт', count: 145 },
    { day: 'Ср', count: 160 },
    { day: 'Чт', count: 190 },
    { day: 'Пт', count: 210 },
    { day: 'Сб', count: 250 },
    { day: 'Вс', count: 180 },
  ];

  // Calculate revenue (for demonstration)
  const totalRevenue = subscriptionsData?.reduce((sum, subscription) => {
    return sum + (subscription.price || 0);
  }, 0) || 0;

  // Format date
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "";
    try {
      return format(parseISO(dateString), "d MMM yyyy", { locale: ru });
    } catch {
      return dateString;
    }
  };

  // Get daily bookings for the last 7 days
  const getDailyBookingsData = () => {
    if (!bookingsData) return [];
    
    // Get the last 7 days
    const days = Array.from({ length: 7 }, (_, i) => {
      const date = subDays(new Date(), i);
      return {
        day: format(date, "E", { locale: ru }),
        date: format(date, "yyyy-MM-dd"),
        count: 0,
      };
    }).reverse();
    
    // Count bookings for each day
    bookingsData.forEach(booking => {
      if (!booking.date_time) return;
      
      const bookingDate = format(parseISO(booking.date_time), "yyyy-MM-dd");
      const dayIndex = days.findIndex(d => d.date === bookingDate);
      
      if (dayIndex >= 0) {
        days[dayIndex].count++;
      }
    });
    
    // Return just the day and count for the chart
    return days.map(d => ({
      day: d.day,
      count: d.count,
    }));
  };

  const dailyBookingsData = getDailyBookingsData();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Панель управления</h1>
      
      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Пользователей</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userData?.length || 0}</div>
            <p className="text-xs text-muted-foreground">
              +{newUsersCount} за последние 30 дней
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Залы</CardTitle>
            <Dumbbell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{gymsData?.length || 0}</div>
            <p className="text-xs text-muted-foreground">
              В {gymsData && gymsData.length > 0 ? [...new Set(gymsData.map(gym => gym.city).filter(Boolean))].length : 0} городах
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Тренировки</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeBookingsCount}</div>
            <p className="text-xs text-muted-foreground">
              {completionRate}% успешно завершены
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Доход</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalRevenue.toLocaleString()} ₽</div>
            <p className="text-xs text-muted-foreground">
              Активных абонементов: {subscriptionsData?.filter(s => s.status === 'active').length || 0}
            </p>
          </CardContent>
        </Card>
      </div>
      
      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Статус тренировок</CardTitle>
            <CardDescription>Распределение бронирований по статусам</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <div style={{ width: '100%', height: 250 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={bookingsByStatus}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {bookingsByStatus.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} бронирований`, '']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Тренировки по дням</CardTitle>
            <CardDescription>Количество тренировок за последние 7 дней</CardDescription>
          </CardHeader>
          <CardContent>
            <div style={{ width: '100%', height: 250 }}>
              <ResponsiveContainer>
                <BarChart data={dailyBookingsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis allowDecimals={false} />
                  <Tooltip 
                    formatter={(value) => [`${value} тренировок`, '']}
                    labelFormatter={(label) => `День: ${label}`}
                  />
                  <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Recent activity */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Последние пользователи</CardTitle>
            <CardDescription>Недавно зарегистрированные пользователи</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {recentUsers.map(user => (
                <li key={user.id} className="flex items-center gap-3 border-b border-gray-700 pb-2">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-800 flex items-center justify-center">
                    {user.profile_image ? (
                      <img 
                        src={user.profile_image} 
                        alt={user.name || ""} 
                        className="h-full w-full rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-lg font-medium text-gray-400">
                        {user.name?.charAt(0) || "U"}
                      </span>
                    )}
                  </div>
                  
                  <div className="flex-grow">
                    <div className="font-medium">{user.name || "Неизвестный пользователь"}</div>
                    <div className="text-sm text-gray-400">
                      {user.email || user.phone || "Нет контактной информации"}
                    </div>
                  </div>
                  
                  <div className="text-xs text-gray-400">
                    {formatDate(user.created_at)}
                  </div>
                </li>
              ))}
              
              {recentUsers.length === 0 && (
                <li className="text-center py-4 text-gray-400">Нет данных о пользователях</li>
              )}
            </ul>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Последние бронирования</CardTitle>
            <CardDescription>Недавние бронирования в системе</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {recentBookings.map(booking => (
                <li key={booking.id} className="flex items-center gap-3 border-b border-gray-700 pb-2">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-800 flex items-center justify-center">
                    {booking.status === 'confirmed' ? (
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                    ) : booking.status === 'pending' ? (
                      <Calendar className="h-5 w-5 text-yellow-500" />
                    ) : (
                      <Calendar className="h-5 w-5 text-red-500" />
                    )}
                  </div>
                  
                  <div className="flex-grow">
                    <div className="font-medium">
                      Бронирование #{booking.id.substring(0, 8)}
                    </div>
                    <div className="text-sm text-gray-400">
                      {booking.status === 'confirmed' ? 'Подтверждено' : 
                       booking.status === 'pending' ? 'Ожидание' : 'Отменено'}
                    </div>
                  </div>
                  
                  <div className="text-xs text-gray-400">
                    {formatDate(booking.date_time)}
                  </div>
                </li>
              ))}
              
              {recentBookings.length === 0 && (
                <li className="text-center py-4 text-gray-400">Нет данных о бронированиях</li>
              )}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
