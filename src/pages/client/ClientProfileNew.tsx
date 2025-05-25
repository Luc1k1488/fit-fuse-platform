
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/auth_context";
import { UserStats } from "@/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import ProfileHeader from "@/components/client/profile/ProfileHeader";
import StatsCard from "@/components/client/profile/StatsCard";
import SettingsMenu from "@/components/client/profile/SettingsMenu";

const ClientProfileNew = () => {
  const { user, logout } = useAuth();
  const { toast } = useToast();

  // Получаем статистику пользователя
  const { data: userStats } = useQuery({
    queryKey: ["user-stats", user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      const { data, error } = await supabase
        .from("user_stats")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data as UserStats | null;
    },
    enabled: !!user?.id,
  });

  // Получаем историю тренировок (последние бронирования)
  const { data: recentWorkouts } = useQuery({
    queryKey: ["recent-workouts", user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from("bookings")
        .select(`
          *,
          class:class_id (
            title,
            gym:gym_id (name)
          )
        `)
        .eq("user_id", user.id)
        .eq("status", "booked")
        .order("date_time", { ascending: false })
        .limit(5);

      if (error) throw error;
      return data || [];
    },
    enabled: !!user?.id,
  });

  // Подготавливаем данные для компонентов
  const profileUser = {
    name: user?.name || "Пользователь",
    email: user?.email || "",
    phone: user?.phone || "+7 (999) 123-45-67",
    location: "Москва, Россия",
    joinDate: user?.created_at ? new Date(user.created_at).getFullYear().toString() : "2024",
    avatar: user?.profile_image || "",
  };

  const stats = {
    totalWorkouts: userStats?.completed_workouts || 0,
    currentStreak: userStats?.current_streak_days || 0,
    favoriteGyms: 3, // Можно будет добавить подсчет из данных
    monthlyGoal: 20,
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex items-center justify-center">
        <div className="text-white">Загрузка...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 pb-16">
      <div className="container mx-auto px-4 py-6 space-y-6">
        <ProfileHeader user={profileUser} />
        
        <Tabs defaultValue="stats" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-slate-800/50 backdrop-blur-sm border-slate-700">
            <TabsTrigger 
              value="stats" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-blue-600 text-white"
            >
              Статистика
            </TabsTrigger>
            <TabsTrigger 
              value="settings" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-blue-600 text-white"
            >
              Настройки
            </TabsTrigger>
          </TabsList>

          <TabsContent value="stats" className="space-y-6">
            <StatsCard stats={stats} />
            
            {/* Последние тренировки */}
            <div className="bg-slate-800/50 backdrop-blur-sm border-slate-700 rounded-lg p-6 animate-fade-in animation-delay-400">
              <h3 className="text-lg font-semibold text-white mb-4">Последние тренировки</h3>
              <div className="space-y-3">
                {recentWorkouts?.slice(0, 5).map((workout, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-slate-700/30 rounded-lg">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <div className="flex-1">
                      <div className="text-white font-medium">
                        {workout.class?.title || "Тренировка"}
                      </div>
                      <div className="text-slate-400 text-sm">
                        {workout.class?.gym?.name || "Спортзал"} • {new Date(workout.date_time).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                )) || (
                  <div className="text-slate-400 text-center py-4">
                    Пока нет тренировок
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="settings">
            <SettingsMenu />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ClientProfileNew;
