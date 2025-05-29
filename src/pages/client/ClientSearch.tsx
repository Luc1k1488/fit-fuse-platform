
import { useState, useEffect } from "react";
import { Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GymCard } from "@/components/client/gyms/GymCard";
import { CategoryTabs } from "@/components/client/gyms/CategoryTabs";
import { CitySelector } from "@/components/client/gyms/CitySelector";
import { GymFilters } from "@/components/client/gyms/GymFilters";
import { YandexMap } from "@/components/client/maps/YandexMap";
import { MapToggleButton } from "@/components/client/maps/MapToggleButton";
import { Gym } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const ClientSearch = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedCity, setSelectedCity] = useState<string>("Махачкала");
  const [showFilters, setShowFilters] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [favoriteGyms, setFavoriteGyms] = useState<string[]>([]);
  const [selectedGym, setSelectedGym] = useState<Gym | null>(null);
  const [gyms, setGyms] = useState<Gym[]>([]);
  const [loading, setLoading] = useState(true);

  const cities = ["Махачкала"];

  useEffect(() => {
    fetchGyms();
  }, []);

  const fetchGyms = async () => {
    try {
      const { data, error } = await supabase
        .from('gyms')
        .select('*')
        .order('name');

      if (error) {
        console.error('Error fetching gyms:', error);
        toast.error('Ошибка загрузки залов');
        return;
      }

      setGyms(data || []);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Ошибка загрузки данных');
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = (gymId: string) => {
    setFavoriteGyms(prev => 
      prev.includes(gymId) 
        ? prev.filter(id => id !== gymId)
        : [...prev, gymId]
    );
  };

  const handleGymSelect = (gym: Gym) => {
    setSelectedGym(gym);
  };

  const filteredGyms = gyms.filter(gym => {
    const matchesSearch = gym.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         gym.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         gym.address?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || gym.category === selectedCategory;
    const matchesCity = gym.city === selectedCity;
    return matchesSearch && matchesCategory && matchesCity;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
      {/* Заголовок с поиском */}
      <div className="bg-slate-900/50 backdrop-blur-sm border-b border-slate-700 px-4 py-4 space-y-4">
        <h1 className="text-xl font-bold text-white">Поиск залов в Махачкале</h1>
        
        {/* Поиск */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input 
            placeholder="Найти зал или адрес..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-slate-800/50 backdrop-blur-sm border-slate-700 text-white placeholder:text-slate-400"
          />
        </div>

        {/* Кнопки управления */}
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="bg-slate-800/50 backdrop-blur-sm border-slate-700 text-slate-300 hover:bg-slate-700/50"
          >
            <Filter className="h-4 w-4 mr-2" />
            Фильтры
          </Button>
          <MapToggleButton 
            showMap={showMap} 
            onToggle={() => setShowMap(!showMap)} 
          />
        </div>
      </div>

      <div className="px-4 space-y-4 py-4">
        {/* Категории */}
        <CategoryTabs 
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />

        {/* Фильтры */}
        {showFilters && (
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg p-4">
            <GymFilters 
              cities={cities}
              selectedCity={selectedCity}
              selectedCategory={selectedCategory}
              setSelectedCity={setSelectedCity}
              setSelectedCategory={setSelectedCategory}
            />
          </div>
        )}

        {/* Загрузка */}
        {loading && (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        )}

        {/* Карта или результаты */}
        {!loading && (
          showMap ? (
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg overflow-hidden">
              <YandexMap 
                gyms={filteredGyms} 
                selectedGym={selectedGym}
                onGymSelect={handleGymSelect}
                height="500px"
              />
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-medium text-white">
                  Найдено {filteredGyms.length} залов
                </h2>
              </div>

              <div className="space-y-4">
                {filteredGyms.map((gym, index) => (
                  <GymCard
                    key={gym.id}
                    gym={gym}
                    index={index}
                    favoriteGyms={favoriteGyms}
                    toggleFavorite={toggleFavorite}
                  />
                ))}
              </div>

              {filteredGyms.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-slate-400">Залы не найдены</p>
                  <p className="text-slate-500 text-sm mt-1">
                    Попробуйте изменить параметры поиска
                  </p>
                </div>
              )}
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default ClientSearch;
