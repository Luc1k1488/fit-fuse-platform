
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/auth_context";
import { Calendar, ArrowRight, Bell, Star, Map, Dumbbell } from "lucide-react";

const ClientDashboard = () => {
  const { user } = useAuth();

  // Пример данных для демонстрации
  const upcoming_classes = [
    {
      id: "class-1",
      title: "Утренняя йога",
      gym_name: "Йога Студия Зен",
      date: "Сегодня, 8:00",
      image: "https://images.unsplash.com/photo-1599447292180-45fd84092ef4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8eW9nYSUyMGNsYXNzfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60"
    },
    {
      id: "class-2",
      title: "HIIT Тренировка",
      gym_name: "Фитнес Элит",
      date: "Завтра, 18:30",
      image: "https://images.unsplash.com/photo-1549060279-7e168fcee0c2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGhpaXQlMjBmaXRuZXNzfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60"
    }
  ];

  const recommended_gyms = [
    {
      id: "gym-1",
      name: "Фитнес Элит",
      location: "Центр",
      rating: 4.9,
      image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Z3ltfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60"
    },
    {
      id: "gym-2",
      name: "Пауэр Хаус",
      location: "Садовое кольцо",
      rating: 4.8,
      image: "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fGd5bXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60"
    },
    {
      id: "gym-3",
      name: "ФитЗона",
      location: "Юг",
      rating: 4.7,
      image: "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8Z3ltfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60"
    }
  ];

  return (
    <div className="space-y-6 pb-16">
      {/* Приветствие и статистика */}
      <div className="bg-primary text-white p-6 rounded-lg">
        <h1 className="text-xl font-bold mb-2">Добро пожаловать, {user?.name || "Фитнес-энтузиаст"}!</h1>
        <p>Ваш фитнес-прогресс отлично выглядит! Вот что происходит сегодня.</p>
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="bg-white/20 backdrop-blur-sm p-3 rounded-md">
            <p className="text-white/80 text-sm">Активная подписка</p>
            <p className="font-bold mt-1">Премиум</p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm p-3 rounded-md">
            <p className="text-white/80 text-sm">Занятий в этом месяце</p>
            <p className="font-bold mt-1">12 / Безлимит</p>
          </div>
        </div>
      </div>

      {/* Предстоящие занятия */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">Предстоящие занятия</h2>
          <Link to="/app/bookings" className="text-primary flex items-center text-sm">
            Все занятия
            <ArrowRight className="h-4 w-4 ml-1" />
          </Link>
        </div>
        
        {upcoming_classes.length > 0 ? (
          <div className="space-y-4">
            {upcoming_classes.map((class_item) => (
              <Card key={class_item.id} className="overflow-hidden">
                <div className="flex flex-row">
                  <div className="w-1/3 h-24">
                    <img 
                      src={class_item.image} 
                      alt={class_item.title} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-3 w-2/3 flex flex-col justify-between">
                    <div>
                      <h3 className="font-medium text-sm">{class_item.title}</h3>
                      <p className="text-gray-500 text-xs">{class_item.gym_name}</p>
                      <div className="flex items-center mt-1 text-xs">
                        <Calendar className="h-3 w-3 mr-1 text-gray-500" />
                        {class_item.date}
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <Button variant="outline" size="sm" className="text-xs py-0 h-7">Отменить</Button>
                      <Button variant="ghost" size="sm" className="p-0 h-7 w-7">
                        <Bell className="h-4 w-4" />
                        <span className="sr-only">Напоминание</span>
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-6 text-center">
              <Calendar className="h-12 w-12 mx-auto text-gray-300" />
              <p className="mt-2 text-gray-500">Нет предстоящих занятий</p>
              <Link to="/app/classes">
                <Button className="mt-4">Найти занятия</Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Рекомендуемые залы */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">Рекомендуемые залы</h2>
          <Link to="/app/gyms" className="text-primary flex items-center text-sm">
            Все залы
            <ArrowRight className="h-4 w-4 ml-1" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {recommended_gyms.map((gym) => (
            <Card key={gym.id} className="overflow-hidden">
              <div className="relative h-32">
                <img 
                  src={gym.image} 
                  alt={gym.name} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2 bg-white/90 rounded-full px-2 py-1 flex items-center">
                  <Star className="h-3 w-3 text-yellow-500 fill-yellow-500 mr-1" />
                  <span className="text-xs font-medium">{gym.rating}</span>
                </div>
              </div>
              <CardContent className="p-3">
                <h3 className="font-medium">{gym.name}</h3>
                <div className="flex items-center mt-1 text-xs text-gray-500">
                  <Map className="h-3 w-3 mr-1" />
                  {gym.location}
                </div>
              </CardContent>
              <CardFooter className="px-3 pb-3 pt-0">
                <Button variant="outline" className="w-full text-sm" asChild>
                  <Link to={`/app/gyms/${gym.id}`}>Подробнее</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>

      {/* Быстрые действия */}
      <div>
        <h2 className="text-lg font-bold mb-3">Быстрые действия</h2>
        <div className="grid grid-cols-2 gap-3">
          <Card className="shadow-sm">
            <CardContent className="p-4 text-center flex flex-col items-center">
              <Dumbbell className="h-6 w-6 mb-2 text-primary" />
              <p className="font-medium text-sm">Найти зал</p>
            </CardContent>
          </Card>
          <Card className="shadow-sm">
            <CardContent className="p-4 text-center flex flex-col items-center">
              <Calendar className="h-6 w-6 mb-2 text-primary" />
              <p className="font-medium text-sm">Забронировать</p>
            </CardContent>
          </Card>
          <Card className="shadow-sm">
            <CardContent className="p-4 text-center flex flex-col items-center">
              <Star className="h-6 w-6 mb-2 text-primary" />
              <p className="font-medium text-sm">Мои отзывы</p>
            </CardContent>
          </Card>
          <Card className="shadow-sm">
            <CardContent className="p-4 text-center flex flex-col items-center">
              <Bell className="h-6 w-6 mb-2 text-primary" />
              <p className="font-medium text-sm">Напоминания</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ClientDashboard;
