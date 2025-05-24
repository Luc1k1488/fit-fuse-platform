
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Gym } from "@/types";
import { GymSearchForm } from "@/components/client/gyms/GymSearchForm";
import { GymFilters } from "@/components/client/gyms/GymFilters";
import { GymResults } from "@/components/client/gyms/GymResults";
import { MapToggleButton } from "@/components/client/maps/MapToggleButton";

const ClientGyms = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState("Махачкала");
  const [selectedCategory, setSelectedCategory] = useState("Все");
  const [minRating, setMinRating] = useState([0]);
  const [favoriteGyms, setFavoriteGyms] = useState<string[]>([]);
  const [showMap, setShowMap] = useState(false);
  const [selectedGym, setSelectedGym] = useState<Gym | null>(null);

  const cities = ["Махачкала"];

  // Функция получения залов
  const fetchGyms = async () => {
    try {
      console.log("Fetching gyms with filters:", {
        city: selectedCity,
        category: selectedCategory,
        minRating: minRating[0],
        searchQuery
      });
      
      let query = supabase
        .from("gyms")
        .select("*")
        .eq("city", "Махачкала");
      
      if (selectedCategory && selectedCategory !== "Все") {
        query = query.eq("category", selectedCategory);
      }
      
      if (minRating[0] > 0) {
        query = query.gte("rating", minRating[0]);
      }
      
      if (searchQuery) {
        query = query.or(`name.ilike.%${searchQuery}%,location.ilike.%${searchQuery}%`);
      }
      
      const { data, error } = await query.order("rating", { ascending: false });
      
      if (error) {
        console.error("Error fetching gyms:", error);
        toast({
          variant: "destructive",
          title: "Ошибка",
          description: "Не удалось загрузить список залов",
        });
        throw error;
      }
      
      console.log("Gyms loaded successfully:", data?.length, data);
      return data as Gym[] || [];
    } catch (error) {
      console.error("Error in fetchGyms:", error);
      throw error;
    }
  };

  const { 
    data: gyms, 
    isLoading, 
    isError, 
    error, 
    refetch 
  } = useQuery({
    queryKey: ["client-gyms", searchQuery, selectedCategory, minRating[0]],
    queryFn: fetchGyms,
    retry: 2,
    refetchOnMount: true,
  });

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Search submitted, triggering refetch");
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
    setSelectedCategory("Все");
    setMinRating([0]);
    console.log("Filters reset, triggering refetch");
    setTimeout(() => refetch(), 100);
  };

  const handleGymSelect = (gym: Gym) => {
    setSelectedGym(gym);
  };

  console.log("Current state:", { gyms, isLoading, isError, gymsCount: gyms?.length, showMap });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 pb-16">
      {/* Page header */}
      <div className="mb-4 bg-slate-900/50 backdrop-blur-sm border-b border-slate-700 px-4 py-6">
        <h1 className="text-2xl font-bold text-white animate-fade-in">Найти залы в Махачкале</h1>
        <p className="text-slate-300 animate-fade-in animation-delay-200">
          Выберите спортзал или студию для тренировки
        </p>
      </div>

      <div className="px-4">
        {/* Search and filters */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 p-4 rounded-xl shadow-lg mb-6 animate-fade-in animation-delay-400">
          <GymSearchForm 
            searchQuery={searchQuery} 
            setSearchQuery={setSearchQuery} 
            onSearch={handleSearch} 
          />
          
          <GymFilters 
            cities={cities}
            selectedCity={selectedCity}
            selectedCategory={selectedCategory}
            setSelectedCity={setSelectedCity}
            setSelectedCategory={setSelectedCategory}
          />

          <div className="mt-4 flex justify-end">
            <MapToggleButton 
              showMap={showMap} 
              onToggle={() => setShowMap(!showMap)} 
            />
          </div>
        </div>

        {/* Results */}
        <GymResults
          gyms={gyms}
          isLoading={isLoading}
          isError={isError}
          error={error as Error}
          favoriteGyms={favoriteGyms}
          toggleFavorite={toggleFavorite}
          refetch={refetch}
          resetFilters={resetFilters}
          showMap={showMap}
          selectedGym={selectedGym}
          onGymSelect={handleGymSelect}
        />
      </div>
    </div>
  );
};

export default ClientGyms;
