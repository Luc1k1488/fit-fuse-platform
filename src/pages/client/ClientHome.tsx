
import { useState } from "react";
import { Search, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GymCard } from "@/components/client/gyms/GymCard";
import { CategoryTabs } from "@/components/client/gyms/CategoryTabs";
import { ActiveSubscriptionCard } from "@/components/client/subscriptions/ActiveSubscriptionCard";
import { Gym } from "@/types";

const ClientHome = () => {
  const [favoriteGyms, setFavoriteGyms] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // Тестовый активный абонемент
  const activeSubscription = {
    id: "1",
    name: "Премиум",
    type: "Безлимитный доступ",
    image: "/placeholder.svg",
    status: "Активен",
    expiryDate: "15.03.2025",
    remainingVisits: undefined
  };

  // Тестовые данные залов по категориям
  const testGyms: Gym[] = [
    // Кроссфит
    {
      id: "crossfit-1",
      name: "CrossFit Arena",
      city: "Москва",
      location: "ул. Спортивная, 15",
      rating: 4.8,
      review_count: 124,
      main_image: "/placeholder.svg",
      features: ["Кроссфит", "Функциональные тренировки", "Групповые занятия"],
      category: "crossfit"
    },
    // Тренажерный зал
    {
      id: "gym-1", 
      name: "Сергей",
      city: "Москва",
      location: "ул. Фитнес, 10",
      rating: 4.9,
      review_count: 200,
      main_image: "/placeholder.svg",
      features: ["Тренажеры", "Свободные веса", "Кардиозона"],
      category: "gym"
    },
    // Бассейн
    {
      id: "pool-1",
      name: "Aqua Center",
      city: "Москва", 
      location: "ул. Водная, 5",
      rating: 4.7,
      review_count: 89,
      main_image: "/placeholder.svg",
      features: ["25-метровый бассейн", "Аквааэробика", "Сауна"],
      category: "pool"
    },
    // Йога
    {
      id: "yoga-1",
      name: "Zen Yoga Studio",
      city: "Москва",
      location: "ул. Гармония, 7",
      rating: 4.9,
      review_count: 156,
      main_image: "/placeholder.svg", 
      features: ["Хатха-йога", "Виньяса", "Медитация"],
      category: "yoga"
    },
    // Бокс
    {
      id: "box-1",
      name: "Fight Club",
      city: "Москва",
      location: "ул. Бойцовская, 12",
      rating: 4.6,
      review_count: 78,
      main_image: "/placeholder.svg",
      features: ["Бокс", "Кикбоксинг", "Персональные тренировки"],
      category: "boxing"
    },
    // Танцы
    {
      id: "dance-1", 
      name: "Dance Studio Pro",
      city: "Москва",
      location: "ул. Ритма, 3",
      rating: 4.8,
      review_count: 145,
      main_image: "/placeholder.svg",
      features: ["Современные танцы", "Хип-хоп", "Латина"],
      category: "dance"
    }
  ];

  const toggleFavorite = (gymId: string) => {
    setFavoriteGyms(prev => 
      prev.includes(gymId) 
        ? prev.filter(id => id !== gymId)
        : [...prev, gymId]
    );
  };

  const filteredGyms = selectedCategory === "all" 
    ? testGyms 
    : testGyms.filter(gym => gym.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gray-50 pb-4">
      {/* Заголовок */}
      <div className="bg-white border-b px-4 py-6">
        <h1 className="text-2xl font-bold text-gray-900">GoodFit</h1>
        <p className="text-gray-600 mt-1">Найдите идеальный зал для тренировок</p>
      </div>

      <div className="px-4 space-y-6">
        {/* Активный абонемент */}
        <div className="mt-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Ваш абонемент</h2>
          <ActiveSubscriptionCard subscription={activeSubscription} />
        </div>

        {/* Поиск */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input 
            placeholder="Поиск залов..." 
            className="pl-10 bg-white border-gray-200"
          />
        </div>

        {/* Категории */}
        <div>
          <CategoryTabs 
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />
        </div>

        {/* Список залов */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              {selectedCategory === "all" ? "Все залы" : "Залы в категории"}
            </h2>
            <Button variant="ghost" size="sm" className="text-primary">
              Все
            </Button>
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
              <p className="text-gray-500">В этой категории нет залов</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClientHome;
