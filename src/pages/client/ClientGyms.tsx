
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Gym } from "@/types";
import { GymSearchForm } from "@/components/client/gyms/GymSearchForm";
import { GymFilters } from "@/components/client/gyms/GymFilters";
import { GymResults } from "@/components/client/gyms/GymResults";
import { cities, categories } from "@/components/client/gyms/gymConstants";

const ClientGyms = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState("Москва");
  const [selectedCategory, setSelectedCategory] = useState("Все");
  const [minRating, setMinRating] = useState([4.0]);
  const [favoriteGyms, setFavoriteGyms] = useState<string[]>([]);

  // Функция для получения залов из Supabase
  const fetchGyms = async () => {
    try {
      console.log("Fetching gyms with filters:", {
        city: selectedCity,
        category: selectedCategory,
        minRating: minRating[0],
        searchQuery
      });
      
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
      
      console.log("Gyms loaded:", data?.length || 0);
      return data as Gym[];
    } catch (error) {
      console.error("Ошибка загрузки данных:", error);
      return [];
    }
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

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedCity("Москва");
    setSelectedCategory("Все");
    setMinRating([4.0]);
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
        <GymSearchForm 
          searchQuery={searchQuery} 
          setSearchQuery={setSearchQuery} 
          onSearch={handleSearch} 
        />
        
        <GymFilters 
          cities={cities}
          categories={categories}
          selectedCity={selectedCity}
          selectedCategory={selectedCategory}
          setSelectedCity={setSelectedCity}
          setSelectedCategory={setSelectedCategory}
        />
      </div>

      {/* Результаты */}
      <GymResults
        gyms={gyms}
        isLoading={isLoading}
        isError={isError}
        error={error as Error}
        favoriteGyms={favoriteGyms}
        toggleFavorite={toggleFavorite}
        refetch={refetch}
        resetFilters={resetFilters}
      />
    </div>
  );
};

export default ClientGyms;
