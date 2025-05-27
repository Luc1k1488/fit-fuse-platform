
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth_context";
import { BarChart, Users, Dumbbell, Calendar, Star, CreditCard } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Gym } from "@/types";

const PartnerDashboard = () => {
  const { user } = useAuth();
  const [partnerGyms, setPartnerGyms] = useState<Gym[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPartnerGyms();
  }, [user?.id]);

  const fetchPartnerGyms = async () => {
    if (!user?.id) return;

    try {
      // Получаем ID партнера
      const { data: partnerData, error: partnerError } = await supabase
        .from('partners')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (partnerError) {
        console.error('Error fetching partner:', partnerError);
        return;
      }

      // Получаем залы партнера
      const { data: gymsData, error: gymsError } = await supabase
        .from('gyms')
        .select('*')
        .eq('partner_id', partnerData.id);

      if (gymsError) {
        console.error('Error fetching gyms:', gymsError);
        return;
      }

      setPartnerGyms(gymsData || []);
    } catch (error) {
      console.error('Error in fetchPartnerGyms:', error);
    } finally {
      setLoading(false);
    }
  };

  // Вычисляем статистику
  const totalBookings = partnerGyms.reduce((sum, gym) => sum + (gym.review_count || 0), 0);
  const averageRating = partnerGyms.length > 0 
    ? partnerGyms.reduce((sum, gym) => sum + (gym.rating || 0), 0) / partnerGyms.length 
    : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Панель партнера</h1>
        <span className="text-gray-500">Добро пожаловать, {user?.name || "Партнер"}</span>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Всего залов</p>
                <h3 className="text-2xl font-bold mt-2">{partnerGyms.length}</h3>
              </div>
              <div className="p-3 bg-blue-100 rounded-md">
                <Dumbbell className="h-6 w-6 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Всего отзывов</p>
                <h3 className="text-2xl font-bold mt-2">{totalBookings}</h3>
              </div>
              <div className="p-3 bg-green-100 rounded-md">
                <Calendar className="h-6 w-6 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Средний рейтинг</p>
                <h3 className="text-2xl font-bold mt-2">{averageRating.toFixed(1)}</h3>
                <div className="flex mt-1 text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`h-4 w-4 ${i < averageRating ? 'fill-current' : ''}`} />
                  ))}
                </div>
              </div>
              <div className="p-3 bg-yellow-100 rounded-md">
                <Star className="h-6 w-6 text-yellow-500" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Доход (месячный)</p>
                <h3 className="text-2xl font-bold mt-2">₽0</h3>
                <p className="text-xs text-gray-500 mt-1">Скоро будет доступно</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-md">
                <CreditCard className="h-6 w-6 text-purple-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* My Gyms Section */}
      <h2 className="text-xl font-bold mb-4">Мои залы</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {partnerGyms.map((gym) => (
          <Card key={gym.id} className="overflow-hidden">
            <div className="flex flex-col md:flex-row">
              <div className="md:w-1/3 h-48 md:h-auto">
                <img 
                  src={gym.main_image || "https://placehold.co/400x300?text=No+Image"} 
                  alt={gym.name || "Зал"} 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "https://placehold.co/400x300?text=No+Image";
                  }}
                />
              </div>
              <div className="p-6 md:w-2/3">
                <h3 className="text-lg font-medium mb-1">{gym.name || "Без названия"}</h3>
                <p className="text-gray-500 mb-3">{gym.address || "Адрес не указан"}</p>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-500">Категория</p>
                    <p className="font-medium">{gym.category || "Не указана"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Отзывы</p>
                    <p className="font-medium">{gym.review_count || 0}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Рейтинг</p>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                      <span>{gym.rating?.toFixed(1) || '0.0'}</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Город</p>
                    <p className="font-medium">{gym.city || "Не указан"}</p>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <Button asChild variant="outline">
                    <Link to="/admin/partner/gyms">Управление залами</Link>
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
        
        <Card className="border-dashed border-2 flex items-center justify-center">
          <CardContent className="p-6 text-center">
            <Dumbbell className="h-12 w-12 mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium mb-2">Добавить новый зал</h3>
            <p className="text-gray-500 mb-4">Расширьте свой бизнес, добавив новое место</p>
            <Button asChild>
              <Link to="/admin/partner/gyms">Добавить зал</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Preview */}
      <h2 className="text-xl font-bold mt-8 mb-4">Обзор аналитики</h2>
      <Card>
        <CardHeader>
          <CardTitle>Ежемесячная производительность</CardTitle>
          <CardDescription>Бронирования и доходы за последние 30 дней</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px] flex items-center justify-center">
          <div className="text-center flex flex-col items-center space-y-2">
            <BarChart className="h-16 w-16 text-gray-300" />
            <p className="text-gray-500">Графики аналитики будут отображаться здесь</p>
            <Button asChild>
              <Link to="/admin/partner/analytics">Просмотреть подробную аналитику</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PartnerDashboard;
