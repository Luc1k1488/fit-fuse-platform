
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/auth_context";
import { UserStats } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { 
  User, 
  BarChart3, 
  TrendingUp, 
  Settings, 
  Camera,
  Trophy,
  Calendar,
  Target,
  Clock,
  Flame,
  Bell,
  Globe,
  Shield,
  Smartphone
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ClientProfileNew = () => {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");

  // Получаем статистику пользователя
  const { data: userStats } = useQuery({
    queryKey: ["user-stats", user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      const { data, error } = await supabase
        .from("user_stats")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data as UserStats | null;
    },
    enabled: !!user?.id,
  });

  // Получаем историю тренировок (последние бронирования)
  const { data: recentWorkouts } = useQuery({
    queryKey: ["recent-workouts", user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from("bookings")
        .select(`
          *,
          class:class_id (
            title,
            gym:gym_id (name)
          )
        `)
        .eq("user_id", user.id)
        .eq("status", "confirmed")
        .order("date_time", { ascending: false })
        .limit(5);

      if (error) throw error;
      return data || [];
    },
    enabled: !!user?.id,
  });

  const handleSaveProfile = async () => {
    if (!user?.id) return;

    try {
      const { error } = await supabase
        .from("users")
        .update({
          name: name,
          email: email,
        })
        .eq("id", user.id);

      if (error) throw error;

      toast({
        title: "Профиль обновлен",
        description: "Изменения успешно сохранены",
      });
      
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: "Не удалось обновить профиль",
      });
    }
  };

  const progressData = [
    {
      label: "Посещений в месяц",
      value: userStats?.total_bookings || 0,
      target: 20,
      icon: Calendar,
      color: "bg-blue-500"
    },
    {
      label: "Часов тренировок",
      value: userStats?.total_hours_trained || 0,
      target: 40,
      icon: Clock,
      color: "bg-green-500"
    },
    {
      label: "Текущая серия",
      value: userStats?.current_streak_days || 0,
      target: 30,
      icon: Flame,
      color: "bg-orange-500"
    },
    {
      label: "Лучшая серия",
      value: userStats?.best_streak_days || 0,
      target: 30,
      icon: Trophy,
      color: "bg-purple-500"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Профиль</h1>
          <p className="text-gray-600">Управляйте своим профилем и отслеживайте прогресс</p>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="profile" className="gap-2">
              <User className="h-4 w-4" />
              Профиль
            </TabsTrigger>
            <TabsTrigger value="stats" className="gap-2">
              <BarChart3 className="h-4 w-4" />
              Статистика
            </TabsTrigger>
            <TabsTrigger value="progress" className="gap-2">
              <TrendingUp className="h-4 w-4" />
              Прогресс
            </TabsTrigger>
            <TabsTrigger value="settings" className="gap-2">
              <Settings className="h-4 w-4" />
              Настройки
            </TabsTrigger>
          </TabsList>

          {/* Профиль */}
          <TabsContent value="profile">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Основная информация */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Личная информация</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-20 w-20">
                        <AvatarImage src={user?.profile_image || ""} />
                        <AvatarFallback className="text-lg">
                          {user?.name?.charAt(0)?.toUpperCase() || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <Button variant="outline" size="sm" className="gap-2">
                        <Camera className="h-4 w-4" />
                        Изменить фото
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium">Имя</label>
                        <Input
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          disabled={!isEditing}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Email</label>
                        <Input
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          disabled={!isEditing}
                        />
                      </div>
                    </div>

                    <div className="flex gap-2">
                      {isEditing ? (
                        <>
                          <Button onClick={handleSaveProfile}>
                            Сохранить
                          </Button>
                          <Button 
                            variant="outline" 
                            onClick={() => {
                              setIsEditing(false);
                              setName(user?.name || "");
                              setEmail(user?.email || "");
                            }}
                          >
                            Отмена
                          </Button>
                        </>
                      ) : (
                        <Button onClick={() => setIsEditing(true)}>
                          Редактировать
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Статус и достижения */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Статус</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center space-y-2">
                      <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                        Активный пользователь
                      </Badge>
                      <p className="text-sm text-gray-600">
                        Участник с {user?.created_at && new Date(user.created_at).getFullYear()}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Последние тренировки</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {recentWorkouts?.slice(0, 3).map((workout, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="truncate">
                            {workout.class?.title} в {workout.class?.gym?.name}
                          </span>
                        </div>
                      )) || (
                        <p className="text-sm text-gray-500">Пока нет тренировок</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Статистика */}
          <TabsContent value="stats">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6 text-center">
                  <Calendar className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold">{userStats?.total_bookings || 0}</div>
                  <div className="text-sm text-gray-600">Всего бронирований</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6 text-center">
                  <Trophy className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold">{userStats?.completed_workouts || 0}</div>
                  <div className="text-sm text-gray-600">Завершенных тренировок</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6 text-center">
                  <Clock className="h-8 w-8 text-green-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold">{userStats?.total_hours_trained || 0}</div>
                  <div className="text-sm text-gray-600">Часов тренировок</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6 text-center">
                  <Flame className="h-8 w-8 text-orange-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold">{userStats?.current_streak_days || 0}</div>
                  <div className="text-sm text-gray-600">Дней подряд</div>
                </CardContent>
              </Card>
            </div>

            {/* График статистики можно добавить позже */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>История активности</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-gray-500">
                  График активности будет добавлен в следующем обновлении
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Прогресс */}
          <TabsContent value="progress">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {progressData.map((item, index) => {
                const Icon = item.icon;
                const percentage = Math.min((item.value / item.target) * 100, 100);
                
                return (
                  <Card key={index}>
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className={`p-2 rounded-lg ${item.color}`}>
                          <Icon className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{item.label}</h3>
                          <p className="text-sm text-gray-600">
                            {item.value} из {item.target}
                          </p>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Прогресс</span>
                          <span>{percentage.toFixed(0)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${item.color}`}
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Цели */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Мои цели
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-500">
                  Функция постановки целей будет добавлена в следующем обновлении
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Настройки */}
          <TabsContent value="settings">
            <div className="space-y-6">
              
              {/* Уведомления */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5" />
                    Уведомления
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Push-уведомления</p>
                      <p className="text-sm text-gray-600">Получать уведомления о бронированиях</p>
                    </div>
                    <Switch />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Email уведомления</p>
                      <p className="text-sm text-gray-600">Получать новости и акции на email</p>
                    </div>
                    <Switch />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">SMS уведомления</p>
                      <p className="text-sm text-gray-600">Напоминания о тренировках</p>
                    </div>
                    <Switch />
                  </div>
                </CardContent>
              </Card>

              {/* Приватность */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Приватность
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Публичный профиль</p>
                      <p className="text-sm text-gray-600">Разрешить другим видеть ваш профиль</p>
                    </div>
                    <Switch />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Показывать статистику</p>
                      <p className="text-sm text-gray-600">Делиться достижениями с другими</p>
                    </div>
                    <Switch />
                  </div>
                </CardContent>
              </Card>

              {/* Приложение */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Smartphone className="h-5 w-5" />
                    Приложение
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Темная тема</p>
                      <p className="text-sm text-gray-600">Использовать темное оформление</p>
                    </div>
                    <Switch />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Язык</p>
                      <p className="text-sm text-gray-600">Русский</p>
                    </div>
                    <Button variant="outline" size="sm">
                      Изменить
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Аккаунт */}
              <Card className="border-red-200">
                <CardHeader>
                  <CardTitle className="text-red-600">Опасная зона</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Выйти из аккаунта</p>
                      <p className="text-sm text-gray-600">Завершить текущую сессию</p>
                    </div>
                    <Button variant="outline" onClick={logout}>
                      Выйти
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-red-600">Удалить аккаунт</p>
                      <p className="text-sm text-gray-600">Безвозвратно удалить все данные</p>
                    </div>
                    <Button variant="destructive" size="sm">
                      Удалить
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ClientProfileNew;
