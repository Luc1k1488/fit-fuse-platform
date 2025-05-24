import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Gym } from "@/types";
import { GymCard } from "@/components/client/gyms/GymCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Search, MapPin, Star, Filter, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ClientSearch = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [ratingRange, setRatingRange] = useState([0]);
  const [showFilters, setShowFilters] = useState(false);
  const [favoriteGyms, setFavoriteGyms] = useState<string[]>([]);
  const { toast } = useToast();

  const { data: gyms, isLoading } = useQuery({
    queryKey: ["search-gyms", searchQuery, selectedCity, selectedCategory, selectedFeatures, ratingRange],
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
      
      if (ratingRange[0] > 0) {
        query = query.gte("rating", ratingRange[0]);
      }
      
      const { data, error } = await query.order("rating", { ascending: false });
      
      if (error) throw error;
      
      let filteredData = data as Gym[];
      
      // Фильтр по особенностям
      if (selectedFeatures.length > 0) {
        filteredData = filteredData.filter(gym => 
          gym.features && selectedFeatures.every(feature => 
            gym.features?.includes(feature)
          )
        );
      }
      
      return filteredData;
    },
  });

  const { data: filterOptions } = useQuery({
    queryKey: ["search-filter-options"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("gyms")
        .select("city, category, features");
      
      if (error) throw error;
      
      const cities = [...new Set(data.map(gym => gym.city).filter(Boolean))];
      const categories = [...new Set(data.map(gym => gym.category).filter(Boolean))];
      const allFeatures = data.flatMap(gym => gym.features || []);
      const features = [...new Set(allFeatures)].filter(Boolean);
      
      return { cities, categories, features };
    },
  });

  const toggleFeature = (feature: string) => {
    setSelectedFeatures(prev => 
      prev.includes(feature) 
        ? prev.filter(f => f !== feature)
        : [...prev, feature]
    );
  };

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

  const clearAllFilters = () => {
    setSearchQuery("");
    setSelectedCity("");
    setSelectedCategory("");
    setSelectedFeatures([]);
    setRatingRange([0]);
  };

  const hasActiveFilters = searchQuery || selectedCity || selectedCategory || selectedFeatures.length > 0 || ratingRange[0] > 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6">
        
        {/* Главный поиск */}
        <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Найти зал по названию, району или адресу..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 text-lg"
              />
            </div>
            <Button
              onClick={() => setShowFilters(!showFilters)}
              variant={hasActiveFilters ? "default" : "outline"}
              className="md:w-auto w-full"
            >
              <Filter className="h-4 w-4 mr-2" />
              Фильтры {hasActiveFilters && `(${
                [searchQuery, selectedCity, selectedCategory, ...selectedFeatures].filter(Boolean).length + (ratingRange[0] > 0 ? 1 : 0)
              })`}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          {/* Боковая панель фильтров */}
          {showFilters && (
            <div className="lg:col-span-1">
              <Card className="sticky top-6">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Фильтры</CardTitle>
                  {hasActiveFilters && (
                    <Button variant="ghost" size="sm" onClick={clearAllFilters}>
                      <X className="h-4 w-4 mr-1" />
                      Сбросить
                    </Button>
                  )}
                </CardHeader>
                <CardContent className="space-y-6">
                  
                  {/* Город */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">Город</label>
                    <select
                      value={selectedCity}
                      onChange={(e) => setSelectedCity(e.target.value)}
                      className="w-full px-3 py-2 border rounded-md bg-white"
                    >
                      <option value="">Все города</option>
                      {filterOptions?.cities.map((city) => (
                        <option key={city} value={city}>{city}</option>
                      ))}
                    </select>
                  </div>

                  {/* Категория */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">Тип зала</label>
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-full px-3 py-2 border rounded-md bg-white"
                    >
                      <option value="">Все типы</option>
                      {filterOptions?.categories.map((category) => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>

                  {/* Рейтинг */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Минимальный рейтинг: {ratingRange[0]} <Star className="inline h-3 w-3 text-yellow-500" />
                    </label>
                    <Slider
                      value={ratingRange}
                      onValueChange={setRatingRange}
                      max={5}
                      min={0}
                      step={0.5}
                      className="w-full"
                    />
                  </div>

                  {/* Особенности */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">Особенности</label>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {filterOptions?.features.map((feature) => (
                        <Badge
                          key={feature}
                          variant={selectedFeatures.includes(feature) ? "default" : "outline"}
                          className="cursor-pointer mr-2 mb-2"
                          onClick={() => toggleFeature(feature)}
                        >
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Результаты поиска */}
          <div className={showFilters ? "lg:col-span-3" : "lg:col-span-4"}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">
                Результаты поиска
              </h2>
              <div className="text-sm text-gray-500">
                {gyms?.length || 0} {gyms?.length === 1 ? 'зал' : 'залов'} найдено
              </div>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white rounded-lg p-4 animate-pulse">
                    <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : gyms?.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg">
                <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 mb-4">По вашему запросу ничего не найдено</p>
                <Button onClick={clearAllFilters} variant="outline">
                  Сбросить все фильтры
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {gyms?.map((gym, index) => (
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientSearch;
