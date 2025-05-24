
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
    location: "Махачкала",
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
      {/* Заголовок */}
      <div className="bg-slate-900/50 backdrop-blur-sm border-b border-slate-700 px-4 py-6">
        <h1 className="text-2xl font-bold text-white animate-fade-in">Профиль</h1>
      </div>

      <div className="px-4 py-6 space-y-6">
        {/* Профиль пользователя */}
        <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700 animate-fade-in">
          <CardContent className="p-6">
            <div className="flex items-start space-x-4">
              <div className="relative flex-shrink-0">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="text-lg bg-slate-700 text-white">
                    {user.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <Button
                  size="sm"
                  className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0 bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700"
                >
                  <Camera className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <h2 className="text-xl font-bold text-white">{user.name}</h2>
                  <Badge className="bg-gradient-to-r from-purple-500 to-blue-600 text-white">
                    Премиум
                  </Badge>
                </div>
                <div className="space-y-1 text-sm text-slate-300">
                  <div className="flex items-center gap-1">
                    <Mail className="h-3 w-3 text-blue-400" />
                    <span className="break-all">{user.email}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Phone className="h-3 w-3 text-green-400" />
                    <span>{user.phone}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="h-3 w-3 text-purple-400" />
                    <span>{user.location}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3 text-orange-400" />
                    <span>С нами с {user.joinDate}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex-shrink-0">
                <Button variant="outline" size="sm" className="bg-slate-700/50 border-slate-600 text-slate-300 hover:bg-slate-600/50">
                  <Edit className="h-4 w-4 mr-2" />
                  Редактировать
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Статистика */}
        <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700 animate-fade-in animation-delay-200">
          <CardHeader>
            <CardTitle className="text-lg text-white">Ваша статистика</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-slate-700/30 backdrop-blur-sm rounded-lg border border-slate-600">
                <div className="text-2xl font-bold text-purple-400">{stats.totalWorkouts}</div>
                <div className="text-sm text-slate-300">Всего тренировок</div>
              </div>
              <div className="text-center p-3 bg-slate-700/30 backdrop-blur-sm rounded-lg border border-slate-600">
                <div className="text-2xl font-bold text-green-400">{stats.currentStreak}</div>
                <div className="text-sm text-slate-300">Дней подряд</div>
              </div>
              <div className="text-center p-3 bg-slate-700/30 backdrop-blur-sm rounded-lg border border-slate-600">
                <div className="text-2xl font-bold text-blue-400">{stats.favoriteGyms}</div>
                <div className="text-sm text-slate-300">Избранные залы</div>
              </div>
              <div className="text-center p-3 bg-slate-700/30 backdrop-blur-sm rounded-lg border border-slate-600">
                <div className="text-2xl font-bold text-orange-400">{stats.monthlyGoal}</div>
                <div className="text-sm text-slate-300">Цель на месяц</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Настройки */}
        <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700 animate-fade-in animation-delay-400">
          <CardHeader>
            <CardTitle className="text-lg text-white">Настройки</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {menuItems.map((item, index) => (
              <div key={index}>
                <button
                  onClick={item.action}
                  className="w-full p-4 flex items-center space-x-3 hover:bg-slate-700/30 transition-colors text-left"
                >
                  <item.icon className="h-5 w-5 text-slate-400" />
                  <div className="flex-1">
                    <div className="font-medium text-white">{item.title}</div>
                    <div className="text-sm text-slate-400">{item.description}</div>
                  </div>
                  <div className="text-slate-400">→</div>
                </button>
                {index < menuItems.length - 1 && <Separator className="bg-slate-700" />}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Выход */}
        <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700 animate-fade-in animation-delay-600">
          <CardContent className="p-0">
            <button className="w-full p-4 flex items-center space-x-3 text-red-400 hover:bg-red-500/10 transition-colors">
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
