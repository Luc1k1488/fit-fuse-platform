
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
      main_image: "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
      images: ["https://images.unsplash.com/photo-1571902943202-507ec2618e8f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60"],
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
      main_image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
      images: ["https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60"],
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
      main_image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
      images: ["https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60"],
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
      main_image: "https://images.unsplash.com/photo-1588286840104-8957b019727f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
      images: ["https://images.unsplash.com/photo-1588286840104-8957b019727f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60"], 
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
      main_image: "https://images.unsplash.com/photo-1517637382994-f02da38c6728?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
      images: ["https://images.unsplash.com/photo-1517637382994-f02da38c6728?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60"],
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

  const filteredGyms = selectedCategory === "all" 
    ? testGyms 
    : testGyms.filter(gym => gym.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 pb-4">
      {/* Заголовок */}
      <div className="bg-slate-900/50 backdrop-blur-sm border-b border-slate-700 px-4 py-6">
        <h1 className="text-2xl font-bold text-white">GoodFit</h1>
        <p className="text-slate-300 mt-1">Найдите идеальный зал для тренировок в Махачкале</p>
      </div>

      <div className="px-4 space-y-6">
        {/* Активный абонемент */}
        <div className="mt-6">
          <h2 className="text-lg font-semibold text-white mb-3">Ваш абонемент</h2>
          <ActiveSubscriptionCard subscription={activeSubscription} />
        </div>

        {/* Поиск */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input 
            placeholder="Поиск залов в Махачкале..." 
            className="pl-10 bg-slate-800/50 backdrop-blur-sm border-slate-700 text-white placeholder:text-slate-400"
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
            <h2 className="text-lg font-semibold text-white">
              {selectedCategory === "all" ? "Все залы" : "Залы в категории"}
            </h2>
            <Button variant="ghost" size="sm" className="text-purple-400 hover:text-purple-300">
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
              <p className="text-slate-400">В этой категории нет залов</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClientHome;
