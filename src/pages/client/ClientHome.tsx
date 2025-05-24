
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

  // Обновленные тестовые данные с реальными адресами Махачкалы
  const testGyms: Gym[] = [
    // Кроссфит
    {
      id: "crossfit-1",
      name: "CrossFit Arena",
      city: "Махачкала",
      location: "пр. Имама Шамиля, 48",
      address: "пр. Имама Шамиля, 48, Махачкала",
      rating: 4.8,
      review_count: 124,
      main_image: "/placeholder.svg",
      images: ["/placeholder.svg"],
      features: ["Кроссфит", "Функциональные тренировки", "Групповые занятия"],
      category: "crossfit",
      owner_id: null,
      working_hours: "6:00-23:00"
    },
    // Тренажерный зал
    {
      id: "gym-1", 
      name: "FitPro",
      city: "Махачкала",
      location: "ул. Ярагского, 65",
      address: "ул. Ярагского, 65, Махачкала",
      rating: 4.9,
      review_count: 200,
      main_image: "/placeholder.svg",
      images: ["/placeholder.svg"],
      features: ["Тренажеры", "Свободные веса", "Кардиозона"],
      category: "gym",
      owner_id: null,
      working_hours: "24/7"
    },
    // Бассейн
    {
      id: "pool-1",
      name: "Aqua Sport",
      city: "Махачкала", 
      location: "пр. Петра I, 25",
      address: "пр. Петра I, 25, Махачкала",
      rating: 4.7,
      review_count: 89,
      main_image: "/placeholder.svg",
      images: ["/placeholder.svg"],
      features: ["25-метровый бассейн", "Аквааэробика", "Сауна"],
      category: "pool",
      owner_id: null,
      working_hours: "6:00-22:00"
    },
    // Йога
    {
      id: "yoga-1",
      name: "Yoga Space",
      city: "Махачкала",
      location: "ул. Гагарина, 17",
      address: "ул. Гагарина, 17, Махачкала",
      rating: 4.9,
      review_count: 156,
      main_image: "/placeholder.svg",
      images: ["/placeholder.svg"], 
      features: ["Хатха-йога", "Виньяса", "Медитация"],
      category: "yoga",
      owner_id: null,
      working_hours: "7:00-21:00"
    },
    // Бокс
    {
      id: "box-1",
      name: "Boxing Club",
      city: "Махачкала",
      location: "ул. Коркмасова, 35",
      address: "ул. Коркмасова, 35, Махачкала",
      rating: 4.6,
      review_count: 78,
      main_image: "/placeholder.svg",
      images: ["/placeholder.svg"],
      features: ["Бокс", "Кикбоксинг", "Персональные тренировки"],
      category: "boxing",
      owner_id: null,
      working_hours: "8:00-22:00"
    },
    // Танцы
    {
      id: "dance-1", 
      name: "Dance Academy",
      city: "Махачкала",
      location: "ул. Дахадаева, 88",
      address: "ул. Дахадаева, 88, Махачкала",
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

  const filteredGyms = selectedCategory === "all" 
    ? testGyms 
    : testGyms.filter(gym => gym.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gray-50 pb-4">
      {/* Заголовок */}
      <div className="bg-white border-b px-4 py-6">
        <h1 className="text-2xl font-bold text-gray-900">GoodFit</h1>
        <p className="text-gray-600 mt-1">Найдите идеальный зал для тренировок в Махачкале</p>
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
            placeholder="Поиск залов в Махачкале..." 
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
