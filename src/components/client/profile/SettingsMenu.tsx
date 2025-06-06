
import { useState } from "react";
import { Bell, Shield, CreditCard, HelpCircle, LogOut, User, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/contexts/auth_context";
import { useToast } from "@/hooks/use-toast";

const SettingsMenu = () => {
  const { logout } = useAuth();
  const { toast } = useToast();
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(true);

  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: "Вы вышли из системы",
        description: "До свидания!",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: "Не удалось выйти из системы",
      });
    }
  };

  const settingsItems = [
    {
      icon: User,
      title: "Персональные данные",
      description: "Управление профилем и контактной информацией",
      action: () => toast({ title: "Скоро", description: "Функция в разработке" }),
    },
    {
      icon: CreditCard,
      title: "Подписка и платежи",
      description: "Управление подпиской и способами оплаты",
      action: () => toast({ title: "Скоро", description: "Функция в разработке" }),
    },
    {
      icon: Shield,
      title: "Приватность и безопасность",
      description: "Настройки безопасности аккаунта",
      action: () => toast({ title: "Скоро", description: "Функция в разработке" }),
    },
    {
      icon: HelpCircle,
      title: "Помощь и поддержка",
      description: "Центр помощи и связь с поддержкой",
      action: () => toast({ title: "Скоро", description: "Функция в разработке" }),
    },
  ];

  return (
    <div className="space-y-4 animate-fade-in animation-delay-200">
      {/* Toggle Settings */}
      <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-white mb-4">Быстрые настройки</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bell className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-white font-medium">Уведомления</p>
                <p className="text-sm text-gray-400">Push-уведомления о занятиях</p>
              </div>
            </div>
            <Switch 
              checked={notifications} 
              onCheckedChange={setNotifications}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {darkMode ? <Moon className="h-5 w-5 text-gray-400" /> : <Sun className="h-5 w-5 text-gray-400" />}
              <div>
                <p className="text-white font-medium">Темная тема</p>
                <p className="text-sm text-gray-400">Внешний вид приложения</p>
              </div>
            </div>
            <Switch 
              checked={darkMode} 
              onCheckedChange={setDarkMode}
            />
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg overflow-hidden">
        {settingsItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <button
              key={index}
              onClick={item.action}
              className="w-full flex items-center gap-4 p-4 text-left hover:bg-slate-700/30 transition-colors border-b border-slate-700 last:border-b-0"
            >
              <Icon className="h-5 w-5 text-gray-400" />
              <div className="flex-1">
                <p className="text-white font-medium">{item.title}</p>
                <p className="text-sm text-gray-400">{item.description}</p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Logout Button */}
      <Button 
        onClick={handleLogout}
        variant="destructive" 
        className="w-full"
      >
        <LogOut className="h-4 w-4 mr-2" />
        Выйти из аккаунта
      </Button>
    </div>
  );
};

export default SettingsMenu;
