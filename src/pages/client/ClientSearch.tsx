
import { useState } from "react";
import { Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GymCard } from "@/components/client/gyms/GymCard";
import { CategoryTabs } from "@/components/client/gyms/CategoryTabs";
import { CitySelector } from "@/components/client/gyms/CitySelector";
import { GymFilters } from "@/components/client/gyms/GymFilters";
import { Gym } from "@/types";

const ClientSearch = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedCity, setSelectedCity] = useState<string>("Москва");
  const [showFilters, setShowFilters] = useState(false);
  const [favoriteGyms, setFavoriteGyms] = useState<string[]>([]);

  const cities = ["Москва", "Санкт-Петербург", "Екатеринбург"];
  const categories = ["all", "crossfit", "gym", "pool", "yoga", "boxing", "dance"];

  // Тестовые данные с полными свойствами
  const testGyms: Gym[] = [
    {
      id: "crossfit-1",
      name: "CrossFit Arena",
      city: "Москва",
      location: "ул. Спортивная, 15",
      address: "ул. Спортивная, 15, Москва",
      rating: 4.8,
      review_count: 124,
      main_image: "/placeholder.svg",
      images: ["/placeholder.svg"],
      features: ["Кроссфит", "Функциональные тренировки", "Групповые занятия"],
      category: "crossfit",
      owner_id: null,
      working_hours: "6:00-23:00"
    },
    {
      id: "gym-1", 
      name: "Сергей",
      city: "Москва",
      location: "ул. Фитнес, 10",
      address: "ул. Фитнес, 10, Москва",
      rating: 4.9,
      review_count: 200,
      main_image: "/placeholder.svg",
      images: ["/placeholder.svg"],
      features: ["Тренажеры", "Свободные веса", "Кардиозона"],
      category: "gym",
      owner_id: null,
      working_hours: "24/7"
    },
    {
      id: "pool-1",
      name: "Aqua Center",
      city: "Москва", 
      location: "ул. Водная, 5",
      address: "ул. Водная, 5, Москва",
      rating: 4.7,
      review_count: 89,
      main_image: "/placeholder.svg",
      images: ["/placeholder.svg"],
      features: ["25-метровый бассейн", "Аквааэробика", "Сауна"],
      category: "pool",
      owner_id: null,
      working_hours: "6:00-22:00"
    },
    {
      id: "yoga-1",
      name: "Zen Yoga Studio",
      city: "Москва",
      location: "ул. Гармония, 7",
      address: "ул. Гармония, 7, Москва",
      rating: 4.9,
      review_count: 156,
      main_image: "/placeholder.svg",
      images: ["/placeholder.svg"], 
      features: ["Хатха-йога", "Виньяса", "Медитация"],
      category: "yoga",
      owner_id: null,
      working_hours: "7:00-21:00"
    },
    {
      id: "box-1",
      name: "Fight Club",
      city: "Москва",
      location: "ул. Бойцовская, 12",
      address: "ул. Бойцовская, 12, Москва",
      rating: 4.6,
      review_count: 78,
      main_image: "/placeholder.svg",
      images: ["/placeholder.svg"],
      features: ["Бокс", "Кикбоксинг", "Персональные тренировки"],
      category: "boxing",
      owner_id: null,
      working_hours: "8:00-22:00"
    },
    {
      id: "dance-1", 
      name: "Dance Studio Pro",
      city: "Москва",
      location: "ул. Ритма, 3",
      address: "ул. Ритма, 3, Москва",
      rating: 4.8,
      review_count: 145,
      main_image: "/placeholder.svg",
      images: ["/placeholder.svg"],
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

  const filteredGyms = testGyms.filter(gym => {
    const matchesSearch = gym.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || gym.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Заголовок с поиском */}
      <div className="bg-white border-b px-4 py-4 space-y-4">
        <h1 className="text-xl font-bold text-gray-900">Поиск залов</h1>
        
        {/* Поиск */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input 
            placeholder="Найти зал..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white border-gray-200"
          />
        </div>

        {/* Город и фильтры */}
        <div className="flex gap-2">
          <div className="flex-1">
            <CitySelector 
              cities={cities}
              selectedCity={selectedCity}
              setSelectedCity={setSelectedCity}
            />
          </div>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="bg-white border-gray-200"
          >
            <Filter className="h-4 w-4 mr-2" />
            Фильтры
          </Button>
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
          <div className="bg-white rounded-lg border p-4">
            <GymFilters 
              cities={cities}
              categories={categories}
              selectedCity={selectedCity}
              selectedCategory={selectedCategory}
              setSelectedCity={setSelectedCity}
              setSelectedCategory={setSelectedCategory}
            />
          </div>
        )}

        {/* Результаты */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-gray-900">
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
              <p className="text-gray-500">Залы не найдены</p>
              <p className="text-gray-400 text-sm mt-1">
                Попробуйте изменить параметры поиска
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClientSearch;
