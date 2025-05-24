import { useState } from "react";
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

const ClientSearch = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedCity, setSelectedCity] = useState<string>("Махачкала");
  const [showFilters, setShowFilters] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [favoriteGyms, setFavoriteGyms] = useState<string[]>([]);
  const [selectedGym, setSelectedGym] = useState<Gym | null>(null);

  const cities = ["Махачкала"];

  // Обновленные тестовые данные с реальными адресами Махачкалы и координатами
  const testGyms: Gym[] = [
    {
      id: "crossfit-1",
      name: "CrossFit Arena",
      city: "Махачкала",
      location: "пр. Имама Шамиля, 48",
      address: "пр. Имама Шамиля, 48, Махачкала",
      rating: 4.8,
      review_count: 124,
      main_image: "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
      images: ["https://images.unsplash.com/photo-1571902943202-507ec2618e8f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60"],
      features: ["Кроссфит", "Функциональные тренировки", "Групповые занятия"],
      category: "crossfit",
      owner_id: null,
      working_hours: "6:00-23:00"
    },
    {
      id: "gym-1", 
      name: "FitPro",
      city: "Махачкала",
      location: "ул. Ярагского, 65",
      address: "ул. Ярагского, 65, Махачкала",
      rating: 4.9,
      review_count: 200,
      main_image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
      images: ["https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60"],
      features: ["Тренажеры", "Свободные веса", "Кардиозона"],
      category: "gym",
      owner_id: null,
      working_hours: "24/7"
    },
    {
      id: "pool-1",
      name: "Aqua Sport",
      city: "Махачкала", 
      location: "пр. Петра I, 25",
      address: "пр. Петра I, 25, Махачкала",
      rating: 4.7,
      review_count: 89,
      main_image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
      images: ["https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60"],
      features: ["25-метровый бассейн", "Аквааэробика", "Сауна"],
      category: "pool",
      owner_id: null,
      working_hours: "6:00-22:00"
    },
    {
      id: "yoga-1",
      name: "Yoga Space",
      city: "Махачкала",
      location: "ул. Гагарина, 17",
      address: "ул. Гагарина, 17, Махачкала",
      rating: 4.9,
      review_count: 156,
      main_image: "https://images.unsplash.com/photo-1588286840104-8957b019727f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
      images: ["https://images.unsplash.com/photo-1588286840104-8957b019727f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60"], 
      features: ["Хатха-йога", "Виньяса", "Медитация"],
      category: "yoga",
      owner_id: null,
      working_hours: "7:00-21:00"
    },
    {
      id: "box-1",
      name: "Boxing Club",
      city: "Махачкала",
      location: "ул. Коркмасова, 35",
      address: "ул. Коркмасова, 35, Махачкала",
      rating: 4.6,
      review_count: 78,
      main_image: "https://images.unsplash.com/photo-1517637382994-f02da38c6728?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
      images: ["https://images.unsplash.com/photo-1517637382994-f02da38c6728?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60"],
      features: ["Бокс", "Кикбоксинг", "Персональные тренировки"],
      category: "boxing",
      owner_id: null,
      working_hours: "8:00-22:00"
    },
    {
      id: "dance-1", 
      name: "Dance Academy",
      city: "Махачкала",
      location: "ул. Дахадаева, 88",
      address: "ул. Дахадаева, 88, Махачкала",
      rating: 4.8,
      review_count: 145,
      main_image: "https://images.unsplash.com/photo-1562771379-eafdca7a02f8?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
      images: ["https://images.unsplash.com/photo-1562771379-eafdca7a02f8?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60"],
      features: ["Современные танцы", "Хип-хоп", "Латина"],
      category: "dance",
      owner_id: null,
      working_hours: "10:00-22:00"
    }
  ];

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

  const filteredGyms = testGyms.filter(gym => {
    const matchesSearch = gym.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         gym.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || gym.category === selectedCategory;
    return matchesSearch && matchesCategory;
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

        {/* Карта или результаты */}
        {showMap ? (
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
        )}
      </div>
    </div>
  );
};

export default ClientSearch;
