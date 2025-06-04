
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, MapPin, Clock, Users, Edit, MoreHorizontal } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Gym } from "@/types";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const PartnerGyms = () => {
  const [gyms, setGyms] = useState<Gym[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPartnerGyms();
  }, []);

  const fetchPartnerGyms = async () => {
    try {
      // Для демонстрации загружаем все залы
      // В реальном приложении здесь должна быть фильтрация по partner_id текущего пользователя
      const { data, error } = await supabase
        .from('gyms')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setGyms(data || []);
    } catch (error) {
      console.error('Error fetching partner gyms:', error);
      toast.error('Ошибка загрузки залов');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (gym: Gym) => {
    // Простая логика определения статуса
    const isActive = gym.name && gym.address;
    return isActive ? (
      <span className="px-2 py-1 bg-green-600 text-white text-xs rounded">Активен</span>
    ) : (
      <span className="px-2 py-1 bg-red-600 text-white text-xs rounded">Неактивен</span>
    );
  };

  const handleEditGym = (gymId: string) => {
    toast.info(`Редактирование зала ${gymId} (функция в разработке)`);
  };

  const handleViewAnalytics = (gymId: string) => {
    toast.info(`Аналитика зала ${gymId} (функция в разработке)`);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white">Мои залы</h1>
            <p className="text-gray-400">Управляйте своими фитнес-залами</p>
          </div>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Мои залы</h1>
          <p className="text-gray-400">Управляйте своими фитнес-залами ({gyms.length})</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90">
          <Plus className="h-4 w-4 mr-2" />
          Добавить зал
        </Button>
      </div>

      {gyms.length === 0 ? (
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-8 text-center">
            <h3 className="text-lg font-medium text-white mb-2">У вас пока нет залов</h3>
            <p className="text-gray-400 mb-4">Создайте свой первый зал, чтобы начать работу</p>
            <Button className="bg-primary hover:bg-primary/90">
              <Plus className="h-4 w-4 mr-2" />
              Создать первый зал
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {gyms.map((gym) => (
            <Card key={gym.id} className="bg-gray-800 border-gray-700">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-white">{gym.name || 'Без названия'}</CardTitle>
                    <CardDescription className="text-gray-400">{gym.category || 'Фитнес-центр'}</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(gym)}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEditGym(gym.id)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Редактировать
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleViewAnalytics(gym.id)}>
                          <Users className="h-4 w-4 mr-2" />
                          Аналитика
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center text-gray-300">
                  <MapPin className="h-4 w-4 mr-2" />
                  <span className="text-sm">{gym.address || 'Адрес не указан'}</span>
                </div>
                <div className="flex items-center text-gray-300">
                  <Clock className="h-4 w-4 mr-2" />
                  <span className="text-sm">{gym.working_hours || 'Часы не указаны'}</span>
                </div>
                <div className="flex items-center text-gray-300">
                  <Users className="h-4 w-4 mr-2" />
                  <span className="text-sm">0 участников</span>
                </div>
                
                {gym.features && gym.features.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {gym.features.slice(0, 3).map((feature, index) => (
                      <span 
                        key={index} 
                        className="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded"
                      >
                        {feature}
                      </span>
                    ))}
                    {gym.features.length > 3 && (
                      <span className="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded">
                        +{gym.features.length - 3}
                      </span>
                    )}
                  </div>
                )}
                
                <Button variant="outline" className="w-full" onClick={() => handleEditGym(gym.id)}>
                  Управление
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default PartnerGyms;
