
import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { GymCard } from "@/components/client/gyms/GymCard";
import { CategoryTabs } from "@/components/client/gyms/CategoryTabs";
import { ActiveSubscriptionCard } from "@/components/client/subscriptions/ActiveSubscriptionCard";
import { Gym } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const ClientHome = () => {
  const [favoriteGyms, setFavoriteGyms] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [gyms, setGyms] = useState<Gym[]>([]);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    fetchGyms();
  }, []);

  const fetchGyms = async () => {
    try {
      const { data, error } = await supabase
        .from('gyms')
        .select('*')
        .order('rating', { ascending: false })
        .limit(10);

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

  const filteredGyms = selectedCategory === "all" 
    ? gyms 
    : gyms.filter(gym => gym.category === selectedCategory);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 pb-4">
        <div className="bg-slate-900/50 backdrop-blur-sm border-b border-slate-700 px-4 py-6">
          <h1 className="text-2xl font-bold text-white">GoodFit</h1>
          <p className="text-slate-300 mt-1">Найдите идеальный зал для тренировок в Махачкале</p>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
        </div>
      </div>
    );
  }

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
              <p className="text-slate-400">
                {gyms.length === 0 ? "Нет доступных залов" : "В этой категории нет залов"}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClientHome;
