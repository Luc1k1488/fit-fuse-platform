
import { useState } from "react";
import { 
  User, 
  Settings, 
  CreditCard, 
  Bell, 
  Shield, 
  HelpCircle, 
  LogOut,
  Edit,
  Camera,
  Phone,
  Mail,
  MapPin,
  Calendar
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const ClientProfile = () => {
  const [user] = useState({
    name: "Анна Петрова",
    email: "anna.petrova@email.com",
    phone: "+7 (999) 123-45-67",
    location: "Москва",
    joinDate: "Январь 2024",
    avatar: "/placeholder.svg"
  });

  const [stats] = useState({
    totalWorkouts: 45,
    currentStreak: 7,
    favoriteGyms: 12,
    monthlyGoal: 20
  });

  const menuItems = [
    {
      icon: User,
      title: "Персональные данные",
      description: "Имя, телефон, email",
      action: () => console.log("Edit profile")
    },
    {
      icon: CreditCard,
      title: "Способы оплаты",
      description: "Карты и платежные методы",
      action: () => console.log("Payment methods")
    },
    {
      icon: Bell,
      title: "Уведомления",
      description: "Настройки push-уведомлений",
      action: () => console.log("Notifications")
    },
    {
      icon: Shield,
      title: "Приватность и безопасность",
      description: "Пароль, двухфакторная аутентификация",
      action: () => console.log("Security")
    },
    {
      icon: HelpCircle,
      title: "Помощь и поддержка",
      description: "FAQ, связаться с поддержкой",
      action: () => console.log("Help")
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Заголовок */}
      <div className="bg-white border-b px-4 py-6">
        <h1 className="text-2xl font-bold text-gray-900">Профиль</h1>
      </div>

      <div className="px-4 py-6 space-y-6">
        {/* Профиль пользователя */}
        <Card className="bg-white border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="text-lg">
                    {user.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <Button
                  size="sm"
                  className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0"
                >
                  <Camera className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-xl font-bold text-gray-900">{user.name}</h2>
                  <Badge className="bg-gradient-to-r from-purple-500 to-blue-600 text-white">
                    Премиум
                  </Badge>
                </div>
                <div className="space-y-1 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Mail className="h-3 w-3" />
                    <span>{user.email}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Phone className="h-3 w-3" />
                    <span>{user.phone}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    <span>{user.location}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    <span>С нами с {user.joinDate}</span>
                  </div>
                </div>
              </div>
              
              <Button variant="outline" size="sm">
                <Edit className="h-4 w-4 mr-2" />
                Редактировать
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Статистика */}
        <Card className="bg-white border-gray-200">
          <CardHeader>
            <CardTitle className="text-lg">Ваша статистика</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-primary">{stats.totalWorkouts}</div>
                <div className="text-sm text-gray-600">Всего тренировок</div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{stats.currentStreak}</div>
                <div className="text-sm text-gray-600">Дней подряд</div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{stats.favoriteGyms}</div>
                <div className="text-sm text-gray-600">Избранные залы</div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">{stats.monthlyGoal}</div>
                <div className="text-sm text-gray-600">Цель на месяц</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Настройки */}
        <Card className="bg-white border-gray-200">
          <CardHeader>
            <CardTitle className="text-lg">Настройки</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {menuItems.map((item, index) => (
              <div key={index}>
                <button
                  onClick={item.action}
                  className="w-full p-4 flex items-center space-x-3 hover:bg-gray-50 transition-colors"
                >
                  <item.icon className="h-5 w-5 text-gray-400" />
                  <div className="flex-1 text-left">
                    <div className="font-medium text-gray-900">{item.title}</div>
                    <div className="text-sm text-gray-500">{item.description}</div>
                  </div>
                  <div className="text-gray-400">→</div>
                </button>
                {index < menuItems.length - 1 && <Separator />}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Выход */}
        <Card className="bg-white border-gray-200">
          <CardContent className="p-0">
            <button className="w-full p-4 flex items-center space-x-3 text-red-600 hover:bg-red-50 transition-colors">
              <LogOut className="h-5 w-5" />
              <span className="font-medium">Выйти из аккаунта</span>
            </button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ClientProfile;
