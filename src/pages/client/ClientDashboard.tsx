
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { DarkCard } from "@/components/ui/dark-card";
import { Star, MapPin, Calendar, Dumbbell, TrendingUp, Users } from "lucide-react";
import { Gym } from "@/types";

const ClientDashboard = () => {
  // Получаем залы для отображения на главной
  const fetchRecentGyms = async () => {
    console.log("Fetching recent gyms for dashboard");
    const { data, error } = await supabase
      .from("gyms")
      .select("*")
      .eq("city", "Махачкала")
      .order("rating", { ascending: false })
      .limit(3);

    if (error) {
      console.error("Error fetching recent gyms:", error);
      throw error;
    }

    console.log("Recent gyms loaded:", data);
    return data as Gym[];
  };

  const { 
    data: recentGyms, 
    isLoading: gymsLoading, 
    isError: gymsError 
  } = useQuery({
    queryKey: ["recent-gyms"],
    queryFn: fetchRecentGyms,
    refetchOnMount: true,
  });

  return (
    <div className="pb-16 space-y-6">
      {/* Заголовок и приветствие */}
      <div className="animate-fade-in">
        <h1 className="text-2xl font-bold text-white mb-2">Добро пожаловать!</h1>
        <p className="text-gray-400">Готовы к новым тренировкам?</p>
      </div>

      {/* Статистические карточки */}
      <div className="grid grid-cols-2 gap-4 animate-fade-in animation-delay-200">
        <DarkCard className="p-4 text-center" hoverEffect="raise">
          <Calendar className="h-6 w-6 mx-auto mb-2 text-primary" />
          <p className="text-sm text-gray-400">Занятий в месяц</p>
          <p className="text-xl font-bold text-white">12</p>
        </DarkCard>
        
        <DarkCard className="p-4 text-center" hoverEffect="raise">
          <TrendingUp className="h-6 w-6 mx-auto mb-2 text-green-500" />
          <p className="text-sm text-gray-400">Прогресс</p>
          <p className="text-xl font-bold text-white">+15%</p>
        </DarkCard>
      </div>

      {/* Быстрые действия */}
      <div className="animate-fade-in animation-delay-400">
        <h2 className="text-lg font-semibold text-white mb-3">Быстрые действия</h2>
        <div className="grid grid-cols-2 gap-3">
          <Button asChild className="h-12 transition-all hover:scale-105">
            <Link to="/app/gyms" className="flex items-center justify-center gap-2">
              <Dumbbell className="h-4 w-4" />
              Найти зал
            </Link>
          </Button>
          
          <Button asChild variant="outline" className="h-12 bg-gray-800 border-gray-700 hover:bg-gray-700 transition-all hover:scale-105">
            <Link to="/app/classes" className="flex items-center justify-center gap-2">
              <Users className="h-4 w-4" />
              Занятия
            </Link>
          </Button>
        </div>
      </div>

      {/* Популярные залы */}
      <div className="animate-fade-in animation-delay-600">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-white">Популярные залы</h2>
          <Button asChild variant="ghost" size="sm" className="text-primary hover:text-primary/80">
            <Link to="/app/gyms">Смотреть все</Link>
          </Button>
        </div>

        {gymsLoading && (
          <div className="text-center py-8">
            <p className="text-gray-400">Загрузка залов...</p>
          </div>
        )}

        {gymsError && (
          <div className="text-center py-8">
            <p className="text-red-400">Ошибка загрузки залов</p>
          </div>
        )}

        {recentGyms && recentGyms.length > 0 && (
          <div className="space-y-3">
            {recentGyms.map((gym, index) => (
              <DarkCard 
                key={gym.id} 
                className="p-4 animate-fade-in hover:bg-gray-800/50 transition-all"
                style={{ animationDelay: `${700 + index * 100}ms` }}
                hoverEffect="raise"
              >
                <Link to={`/app/gyms/${gym.id}`} className="block">
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      {gym.main_image ? (
                        <img 
                          src={gym.main_image} 
                          alt={gym.name || ""} 
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-gray-700 flex items-center justify-center">
                          <Dumbbell className="h-6 w-6 text-gray-400" />
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-white truncate">{gym.name}</h3>
                      <div className="flex items-center text-sm text-gray-400 mt-1">
                        <MapPin className="h-3 w-3 mr-1" />
                        <span className="truncate">{gym.location}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center text-sm">
                      <Star className="h-3 w-3 text-yellow-500 fill-yellow-500 mr-1" />
                      <span className="text-white font-medium">{gym.rating || 0}</span>
                    </div>
                  </div>
                </Link>
              </DarkCard>
            ))}
          </div>
        )}

        {recentGyms && recentGyms.length === 0 && (
          <DarkCard className="p-6 text-center">
            <p className="text-gray-400">Залы не найдены</p>
          </DarkCard>
        )}
      </div>

      {/* Последние бронирования */}
      <div className="animate-fade-in animation-delay-800">
        <h2 className="text-lg font-semibold text-white mb-3">Мои бронирования</h2>
        <DarkCard className="p-4 text-center">
          <p className="text-gray-400 mb-3">У вас пока нет бронирований</p>
          <Button asChild size="sm" className="transition-all hover:scale-105">
            <Link to="/app/classes">Забронировать занятие</Link>
          </Button>
        </DarkCard>
      </div>
    </div>
  );
};

export default ClientDashboard;
