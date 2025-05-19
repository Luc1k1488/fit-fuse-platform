
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/auth_context";
import { BarChart, Users, Dumbbell, Calendar, Star, CreditCard } from "lucide-react";

const AdminDashboard = () => {
  const { user } = useAuth();

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Панель управления</h1>
        <span className="text-gray-500">С возвращением, {user?.name || "Администратор"}</span>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Обзор</TabsTrigger>
          <TabsTrigger value="analytics">Аналитика</TabsTrigger>
          <TabsTrigger value="reports">Отчеты</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          {/* Быстрая статистика */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Всего пользователей</p>
                    <h3 className="text-2xl font-bold mt-2">12,345</h3>
                    <p className="text-xs text-green-500 mt-1">+15% с прошлого месяца</p>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-md">
                    <Users className="h-6 w-6 text-blue-500" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Активные залы</p>
                    <h3 className="text-2xl font-bold mt-2">248</h3>
                    <p className="text-xs text-green-500 mt-1">+5 новых на этой неделе</p>
                  </div>
                  <div className="p-3 bg-green-100 rounded-md">
                    <Dumbbell className="h-6 w-6 text-green-500" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Тренировки сегодня</p>
                    <h3 className="text-2xl font-bold mt-2">187</h3>
                    <p className="text-xs text-blue-500 mt-1">23 полностью забронированы</p>
                  </div>
                  <div className="p-3 bg-purple-100 rounded-md">
                    <Calendar className="h-6 w-6 text-purple-500" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Доход (ежемесячно)</p>
                    <h3 className="text-2xl font-bold mt-2">248,920 ₽</h3>
                    <p className="text-xs text-green-500 mt-1">+18% с прошлого месяца</p>
                  </div>
                  <div className="p-3 bg-yellow-100 rounded-md">
                    <CreditCard className="h-6 w-6 text-yellow-500" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Двухколоночный макет */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Недавняя активность */}
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Недавняя активность</CardTitle>
                <CardDescription>Последние действия на платформе</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {[1, 2, 3, 4, 5].map((item) => (
                    <div key={item} className="flex items-start">
                      <div className="p-2 bg-gray-100 rounded-md mr-4">
                        <Users className="h-5 w-5 text-gray-500" />
                      </div>
                      <div>
                        <p className="font-medium">Зарегистрирован новый пользователь</p>
                        <p className="text-sm text-gray-500">Иванова Анна присоединилась к платформе</p>
                        <p className="text-xs text-gray-400">2 часа назад</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Лучшие залы */}
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Лучшие фитнес-залы</CardTitle>
                <CardDescription>По бронированиям и рейтингам</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[1, 2, 3, 4, 5].map((item) => (
                    <div key={item} className="flex items-center justify-between border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded bg-gray-200 flex-shrink-0 mr-3"></div>
                        <div>
                          <p className="font-medium">Фитнес Студия {item}</p>
                          <p className="text-sm text-gray-500">Центр • 96 бронирований</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="ml-1 font-medium">{4.5 + (item * 0.1).toFixed(1)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="analytics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Статистика использования</CardTitle>
              <CardDescription>Показатели использования платформы за период</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px] flex items-center justify-center">
              <div className="text-center flex flex-col items-center space-y-2">
                <BarChart className="h-16 w-16 text-gray-300" />
                <p>Здесь будут отображаться графики аналитики</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="reports" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Сформированные отчеты</CardTitle>
              <CardDescription>Скачайте подробные отчеты</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center py-8">Отчеты пока не сформированы</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
