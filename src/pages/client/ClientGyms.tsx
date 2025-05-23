
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DarkCard } from "@/components/ui/dark-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check, Search, Star, Map, MapPin, ChevronDown, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Gym } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const cities = ["Москва", "Санкт-Петербург", "Казань", "Новосибирск", "Екатеринбург"];
const categories = ["Все", "Премиум", "Фитнес", "Йога", "КроссФит", "Бокс", "Велоспорт"];

const ClientGyms = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState("Москва");
  const [selectedCategory, setSelectedCategory] = useState("Все");
  const [minRating, setMinRating] = useState([4.0]);
  const [viewMode, setViewMode] = useState("grid");
  const [favoriteGyms, setFavoriteGyms] = useState<string[]>([]);

  // Функция для получения залов из Supabase
  const fetchGyms = async () => {
    let query = supabase.from("gyms").select("*");
    
    // Применение фильтров
    if (selectedCity && selectedCity !== "Все") {
      query = query.eq("city", selectedCity);
    }
    
    if (selectedCategory && selectedCategory !== "Все") {
      query = query.eq("category", selectedCategory);
    }
    
    if (minRating[0] > 0) {
      query = query.gte("rating", minRating[0]);
    }
    
    if (searchQuery) {
      query = query.or(`name.ilike.%${searchQuery}%,location.ilike.%${searchQuery}%,city.ilike.%${searchQuery}%`);
    }
    
    const { data, error } = await query.order("name");
    
    if (error) {
      console.error("Ошибка при загрузке залов:", error);
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: "Не удалось загрузить список залов",
      });
      return [];
    }
    
    return data as Gym[];
  };

  const { 
    data: gyms, 
    isLoading, 
    isError, 
    error, 
    refetch 
  } = useQuery({
    queryKey: ["client-gyms", searchQuery, selectedCity, selectedCategory, minRating],
    queryFn: fetchGyms,
  });

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    refetch();
  };

  const toggleFavorite = (gymId: string) => {
    setFavoriteGyms(prev => 
      prev.includes(gymId) 
        ? prev.filter(id => id !== gymId) 
        : [...prev, gymId]
    );
  };

  return (
    <div className="pb-16">
      {/* Заголовок страницы */}
      <div className="mb-4">
        <h1 className="text-2xl font-bold animate-fade-in">Найти залы и студии</h1>
        <p className="text-gray-600 animate-fade-in animation-delay-200">
          Выберите спортзал или студию для тренировки
        </p>
      </div>

      {/* Поиск и фильтры */}
      <div className="bg-gray-900 p-4 rounded-xl shadow-lg border border-gray-800 mb-6 animate-fade-in animation-delay-400">
        <form onSubmit={handleSearch} className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <Input
              type="text"
              placeholder="Поиск залов, студий, локаций..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 rounded-lg border-gray-700 bg-gray-800 text-white"
            />
            <Button type="submit" className="absolute right-2 top-1/2 transform -translate-y-1/2 transition-all hover:scale-105">
              Поиск
            </Button>
          </div>
        </form>
        
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap gap-2">
            {/* Выбор города */}
            <div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full bg-gray-800 border-gray-700 text-white hover:bg-gray-700 transition-colors">
                    <MapPin className="mr-2 h-4 w-4" />
                    {selectedCity || "Выберите город"}
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-gray-800 border-gray-700 text-white">
                  {cities.map((city) => (
                    <DropdownMenuItem
                      key={city}
                      onClick={() => setSelectedCity(city)}
                      className="flex items-center justify-between hover:bg-gray-700 transition-colors"
                    >
                      {city}
                      {city === selectedCity && <Check className="h-4 w-4 ml-2 text-primary" />}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          
          {/* Категории */}
          <Tabs defaultValue="Все" value={selectedCategory} className="w-full">
            <TabsList className="w-full overflow-x-auto flex pb-1 mb-2 bg-gray-800">
              {categories.map((category) => (
                <TabsTrigger
                  key={category}
                  value={category}
                  onClick={() => setSelectedCategory(category)}
                  className="whitespace-nowrap transition-all hover:scale-105"
                >
                  {category}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Состояние загрузки */}
      {isLoading ? (
        <div className="text-center py-12 bg-gray-900 rounded-xl border border-gray-800 animate-fade-in">
          <p className="text-gray-400">Загрузка списка залов...</p>
        </div>
      ) : isError ? (
        <div className="text-center py-12 bg-gray-900 rounded-xl border border-gray-800 animate-fade-in">
          <p className="text-red-400">Ошибка при загрузке данных</p>
          <p className="text-sm text-gray-500 mt-2">{(error as Error).message}</p>
          <Button onClick={() => refetch()} className="mt-4 transition-all hover:scale-105">
            Попробовать снова
          </Button>
        </div>
      ) : (
        <>
          {/* Результаты */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {gyms && gyms.length > 0 ? (
              gyms.map((gym, idx) => (
                <DarkCard 
                  key={gym.id} 
                  className="overflow-hidden animate-fade-in" 
                  style={{ animationDelay: `${idx * 100}ms` }}
                  hoverEffect="raise"
                >
                  <div className="relative h-40 overflow-hidden group">
                    {gym.main_image ? (
                      <img 
                        src={gym.main_image} 
                        alt={gym.name || ""} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                        <p className="text-gray-400">Нет изображения</p>
                      </div>
                    )}
                    <div className="absolute top-2 right-2 bg-white/90 rounded-full px-2 py-1 flex items-center">
                      <Star className="h-3 w-3 text-yellow-500 fill-yellow-500 mr-1" />
                      <span className="text-xs font-medium">{gym.rating || 0}</span>
                    </div>
                    <button 
                      onClick={() => toggleFavorite(gym.id)} 
                      className="absolute top-2 left-2 bg-black/30 backdrop-blur-sm p-2 rounded-full transition-all hover:bg-black/50"
                    >
                      <Heart 
                        className={`h-4 w-4 ${favoriteGyms.includes(gym.id) ? 'text-red-500 fill-red-500' : 'text-white'} transition-colors`} 
                      />
                    </button>
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium text-lg text-white">{gym.name}</h3>
                    <div className="flex items-center mt-1 text-sm text-gray-400">
                      <MapPin className="h-3 w-3 mr-1" />
                      {gym.location ? `${gym.location}, ${gym.city}` : gym.city} 
                    </div>
                    <div className="mt-2 text-sm text-gray-400">
                      <p>{gym.review_count} отзывов</p>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {gym.features && gym.features.map((feature, index) => (
                        <span 
                          key={index} 
                          className="px-2 py-1 bg-gray-800 text-gray-300 rounded-full text-xs transition-all hover:bg-gray-700"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="p-4 pt-0 flex justify-between items-center">
                    <Button asChild variant="default" className="transition-all hover:scale-105">
                      <Link to={`/app/gyms/${gym.id}`}>Подробнее</Link>
                    </Button>
                    <Button variant="outline" size="sm" className="bg-transparent border-gray-700 text-gray-300 hover:bg-gray-800 transition-all">
                      Расписание
                    </Button>
                  </div>
                </DarkCard>
              ))
            ) : (
              <div className="text-center py-12 bg-gray-900 rounded-xl border border-gray-800 animate-fade-in col-span-2">
                <p className="text-gray-400 mb-4">Не найдено залов по вашим критериям.</p>
                <Button onClick={() => {
                  setSearchQuery("");
                  setSelectedCity("Москва");
                  setSelectedCategory("Все");
                  setMinRating([4.0]);
                }} className="transition-all hover:scale-105">Сбросить фильтры</Button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ClientGyms;
