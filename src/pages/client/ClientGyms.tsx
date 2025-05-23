
import { useState, useEffect } from "react";
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
  const [selectedCity, setSelectedCity] = useState("Махачкала");
  const [selectedCategory, setSelectedCategory] = useState("Все");
  const [minRating, setMinRating] = useState([4.0]);
  const [favoriteGyms, setFavoriteGyms] = useState<string[]>([]);

  // Enhanced function for getting gyms from Supabase with better error handling and logging
  const fetchGyms = async () => {
    try {
      console.log("Fetching gyms with filters:", {
        city: selectedCity,
        category: selectedCategory,
        minRating: minRating[0],
        searchQuery
      });
      
      let query = supabase.from("gyms").select("*");
      
      // Always filter by city since we only have one city now
      query = query.eq("city", selectedCity);
      
      if (selectedCategory && selectedCategory !== "Все") {
        query = query.eq("category", selectedCategory);
      }
      
      if (minRating && minRating[0] > 0) {
        query = query.gte("rating", minRating[0]);
      }
      
      if (searchQuery) {
        query = query.or(`name.ilike.%${searchQuery}%,location.ilike.%${searchQuery}%`);
      }
      
      // Log the SQL query being executed
      console.log("Executing query for gyms");
      
      const { data, error } = await query.order("name");
      
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
      toast({
        variant: "destructive",
        title: "Ошибка загрузки",
        description: "Произошла ошибка при получении данных о залах",
      });
      throw error; // Rethrow to let React Query handle it
    }
  };

  // Use React Query for data fetching with more aggressive options
  const { 
    data: gyms, 
    isLoading, 
    isError, 
    error, 
    refetch 
  } = useQuery({
    queryKey: ["client-gyms", searchQuery, selectedCity, selectedCategory, minRating],
    queryFn: fetchGyms,
    refetchOnMount: "always",
    refetchOnWindowFocus: true,
    retry: 2,
    staleTime: 1000 * 60, // Consider data stale after 1 minute
  });

  // Force fetch on component mount
  useEffect(() => {
    console.log("Component mounted, triggering refetch");
    refetch();
  }, []);

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
    setSelectedCity("Махачкала"); // Keep only Махачкала
    setSelectedCategory("Все");
    setMinRating([4.0]);
    console.log("Filters reset, triggering refetch");
    setTimeout(() => refetch(), 100); // Slight delay to ensure state updates
  };

  // Log current state
  console.log("Current state:", { gyms, isLoading, isError });

  return (
    <div className="pb-16">
      {/* Page header */}
      <div className="mb-4">
        <h1 className="text-2xl font-bold animate-fade-in">Найти залы и студии</h1>
        <p className="text-gray-600 dark:text-gray-400 animate-fade-in animation-delay-200">
          Выберите спортзал или студию для тренировки
        </p>
      </div>

      {/* Search and filters */}
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
      />
    </div>
  );
};

export default ClientGyms;
