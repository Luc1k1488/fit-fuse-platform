
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Gym } from "@/types";
import { GymCard } from "@/components/client/gyms/GymCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Star, MapPin, Filter } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ClientHome = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [favoriteGyms, setFavoriteGyms] = useState<string[]>([]);
  const { toast } = useToast();

  // Запрос популярных залов (топ-6 по рейтингу)
  const { data: popularGyms, isLoading: popularLoading } = useQuery({
    queryKey: ["popular-gyms"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("gyms")
        .select("*")
        .order("rating", { ascending: false })
        .order("review_count", { ascending: false })
        .limit(6);
      
      if (error) throw error;
      return data as Gym[];
    },
  });

  // Запрос всех залов с фильтрами
  const { data: allGyms, isLoading: allLoading } = useQuery({
    queryKey: ["all-gyms", searchQuery, selectedCity, selectedCategory],
    queryFn: async () => {
      let query = supabase.from("gyms").select("*");
      
      if (searchQuery) {
        query = query.or(`name.ilike.%${searchQuery}%,location.ilike.%${searchQuery}%,address.ilike.%${searchQuery}%`);
      }
      
      if (selectedCity) {
        query = query.eq("city", selectedCity);
      }
      
      if (selectedCategory) {
        query = query.eq("category", selectedCategory);
      }
      
      const { data, error } = await query.order("rating", { ascending: false });
      
      if (error) throw error;
      return data as Gym[];
    },
  });

  // Получаем уникальные города и категории для фильтров
  const { data: filterOptions } = useQuery({
    queryKey: ["filter-options"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("gyms")
        .select("city, category");
      
      if (error) throw error;
      
      const cities = [...new Set(data.map(gym => gym.city).filter(Boolean))];
      const categories = [...new Set(data.map(gym => gym.category).filter(Boolean))];
      
      return { cities, categories };
    },
  });

  const categories = [
    "Фитнес-клуб",
    "Тренажерный зал", 
    "Йога-студия",
    "Бокс",
    "Танцы",
    "Пилатес",
    "Кроссфит"
  ];

  const toggleFavorite = (gymId: string) => {
    setFavoriteGyms(prev => 
      prev.includes(gymId) 
        ? prev.filter(id => id !== gymId)
        : [...prev, gymId]
    );
    toast({
      title: favoriteGyms.includes(gymId) ? "Удалено из избранного" : "Добавлено в избранное",
      description: "Изменения сохранены",
    });
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCity("");
    setSelectedCategory("");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6 space-y-8">
        
        {/* Поиск и быстрые фильтры */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Поиск по названию, району или адресу..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="px-3 py-2 border rounded-md bg-white"
              >
                <option value="">Все города</option>
                {filterOptions?.cities.map((city) => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
              
              <Button
                variant={selectedCity || selectedCategory || searchQuery ? "default" : "outline"}
                onClick={clearFilters}
                size="icon"
              >
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Быстрые фильтры по категориям */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Badge
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => setSelectedCategory(selectedCategory === category ? "" : category)}
              >
                {category}
              </Badge>
            ))}
          </div>
        </div>

        {/* Популярные залы */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
            <h2 className="text-2xl font-bold">Популярные залы</h2>
          </div>
          
          {popularLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg p-4 animate-pulse">
                  <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {popularGyms?.map((gym, index) => (
                <GymCard 
                  key={gym.id} 
                  gym={gym} 
                  index={index}
                  favoriteGyms={favoriteGyms}
                  toggleFavorite={toggleFavorite}
                />
              ))}
            </div>
          )}
        </section>

        {/* Все залы */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Все фитнес-залы</h2>
            <div className="text-sm text-gray-500">
              {allGyms?.length || 0} {allGyms?.length === 1 ? 'зал' : 'залов'} найдено
            </div>
          </div>
          
          {allLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(9)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg p-4 animate-pulse">
                  <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : allGyms?.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg">
              <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">Залы не найдены</p>
              <Button onClick={clearFilters} variant="outline">
                Сбросить фильтры
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {allGyms?.map((gym, index) => (
                <GymCard 
                  key={gym.id} 
                  gym={gym} 
                  index={index}
                  favoriteGyms={favoriteGyms}
                  toggleFavorite={toggleFavorite}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default ClientHome;
