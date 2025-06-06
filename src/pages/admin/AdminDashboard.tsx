
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Building, Calendar, TrendingUp, Star, DollarSign } from "lucide-react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar, PieChart, Pie, Cell } from "recharts";
import { User, Gym, Booking, Review, Partner } from "@/types";

const AdminDashboard = () => {
  const { data: users, isLoading: isLoadingUsers } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const { data, error } = await supabase.from("users").select("*");
      if (error) {
        throw new Error(error.message);
      }
      return data as User[];
    }
  });

  const { data: gyms, isLoading: isLoadingGyms } = useQuery({
    queryKey: ["gyms"],
    queryFn: async () => {
      const { data, error } = await supabase.from("gyms").select("*");
      if (error) {
        throw new Error(error.message);
      }
      return data as Gym[];
    }
  });

  const { data: bookings, isLoading: isLoadingBookings } = useQuery({
    queryKey: ["bookings"],
    queryFn: async () => {
      const { data, error } = await supabase.from("bookings").select("*");
      if (error) {
        throw new Error(error.message);
      }
      return data as Booking[];
    }
  });

  const { data: reviews, isLoading: isLoadingReviews } = useQuery({
    queryKey: ["reviews"],
    queryFn: async () => {
      const { data, error } = await supabase.from("reviews").select("*");
      if (error) {
        throw new Error(error.message);
      }
      return data as Review[];
    }
  });

  const { data: partners, isLoading: isLoadingPartners } = useQuery({
    queryKey: ["partners"],
    queryFn: async () => {
      const { data, error } = await supabase.from("partners").select("*");
      if (error) {
        throw new Error(error.message);
      }
      return data as Partner[];
    }
  });

  const totalUsers = users?.length || 0;
  const totalGyms = gyms?.length || 0;

  // Заменяем "confirmed" на "booked"
  const completedBookings = bookings?.filter(booking => booking.status === "booked")?.length || 0;

  const averageRating =
    reviews?.reduce((sum, review) => sum + review.rating, 0) /
      (reviews?.length || 1) || 0;

  const activePartners = partners?.filter(
    (partner) => partner.status === "approved"
  ).length;

  // В расчете статистики заменяем статусы
  const bookingStats = [
    { name: "Активные", value: bookings?.filter(b => b.status === "booked").length || 0, color: "#10b981" },
    { name: "Завершенные", value: bookings?.filter(b => b.status === "completed").length || 0, color: "#3b82f6" },
    { name: "Отмененные", value: bookings?.filter(b => b.status === "cancelled").length || 0, color: "#ef4444" }
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "booked":
        return <Badge className="bg-green-100 text-green-800">Забронировано</Badge>;
      case "completed":
        return <Badge className="bg-blue-100 text-blue-800">Завершено</Badge>;
      case "cancelled":
        return <Badge className="bg-red-100 text-red-800">Отменено</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="grid gap-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Всего пользователей</CardTitle>
            <CardDescription>Зарегистрированные пользователи</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center space-x-4">
            <Users className="h-10 w-10 text-gray-500" />
            <div className="text-3xl font-bold">{totalUsers}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Всего залов</CardTitle>
            <CardDescription>Активные спортивные залы</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center space-x-4">
            <Building className="h-10 w-10 text-gray-500" />
            <div className="text-3xl font-bold">{totalGyms}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Активные бронирования</CardTitle>
            <CardDescription>Подтвержденные бронирования</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center space-x-4">
            <Calendar className="h-10 w-10 text-gray-500" />
            <div className="text-3xl font-bold">{completedBookings}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Средний рейтинг</CardTitle>
            <CardDescription>Общий рейтинг залов</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center space-x-4">
            <Star className="h-10 w-10 text-gray-500" />
            <div className="text-3xl font-bold">{averageRating.toFixed(1)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Активные партнеры</CardTitle>
            <CardDescription>Количество активных партнеров</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center space-x-4">
            <TrendingUp className="h-10 w-10 text-gray-500" />
            <div className="text-3xl font-bold">{activePartners}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Общий доход</CardTitle>
            <CardDescription>Приблизительный доход от подписок</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center space-x-4">
            <DollarSign className="h-10 w-10 text-gray-500" />
            <div className="text-3xl font-bold">Недоступно</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Статистика бронирований</CardTitle>
            <CardDescription>Распределение бронирований по статусам</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={bookingStats}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderCustomizedLabel}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {bookingStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center mt-4">
              {bookingStats.map((stat, index) => (
                <div key={index} className="flex items-center space-x-2 mr-4">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: stat.color }}></div>
                  <div>{stat.name}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Активность пользователей</CardTitle>
            <CardDescription>Последние действия пользователей</CardDescription>
          </CardHeader>
          <CardContent>
            {bookings && bookings.length > 0 ? (
              <div className="divide-y divide-gray-200">
                {bookings.slice(0, 5).map((booking) => (
                  <div key={booking.id} className="py-2 flex items-center justify-between">
                    <div>
                      Бронирование №{booking.id}
                    </div>
                    <div>
                      {getStatusBadge(booking.status || "unknown")}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div>Нет данных об активности</div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
