
import { useState } from "react";
import { 
  User, 
  CreditCard, 
  Bell, 
  Shield, 
  HelpCircle,
  LogOut,
  ChevronRight
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth_context";
import { useToast } from "@/hooks/use-toast";

interface MenuItem {
  icon: any;
  title: string;
  description: string;
  action: () => void;
  hasToggle?: boolean;
  toggleValue?: boolean;
  onToggleChange?: (value: boolean) => void;
}

const SettingsMenu = () => {
  const { logout } = useAuth();
  const { toast } = useToast();
  
  // Состояния для переключателей
  const [pushNotifications, setPushNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [publicProfile, setPublicProfile] = useState(false);
  const [showStats, setShowStats] = useState(true);

  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: "Выход выполнен",
        description: "Вы успешно вышли из аккаунта",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: "Не удалось выйти из аккаунта",
      });
    }
  };

  const showComingSoon = (feature: string) => {
    toast({
      title: "Скоро будет доступно",
      description: `Функция "${feature}" будет добавлена в следующем обновлении`,
    });
  };

  const menuSections = [
    {
      title: "Аккаунт",
      items: [
        {
          icon: User,
          title: "Персональные данные",
          description: "Имя, телефон, email",
          action: () => showComingSoon("Персональные данные")
        },
        {
          icon: CreditCard,
          title: "Способы оплаты",
          description: "Карты и платежные методы",
          action: () => showComingSoon("Способы оплаты")
        },
      ]
    },
    {
      title: "Уведомления",
      items: [
        {
          icon: Bell,
          title: "Push-уведомления",
          description: "Уведомления о бронированиях",
          action: () => {},
          hasToggle: true,
          toggleValue: pushNotifications,
          onToggleChange: setPushNotifications
        },
        {
          icon: Bell,
          title: "Email уведомления",
          description: "Новости и акции на email",
          action: () => {},
          hasToggle: true,
          toggleValue: emailNotifications,
          onToggleChange: setEmailNotifications
        },
        {
          icon: Bell,
          title: "SMS уведомления",
          description: "Напоминания о тренировках",
          action: () => {},
          hasToggle: true,
          toggleValue: smsNotifications,
          onToggleChange: setSmsNotifications
        },
      ]
    },
    {
      title: "Приватность",
      items: [
        {
          icon: Shield,
          title: "Публичный профиль",
          description: "Разрешить другим видеть профиль",
          action: () => {},
          hasToggle: true,
          toggleValue: publicProfile,
          onToggleChange: setPublicProfile
        },
        {
          icon: Shield,
          title: "Показывать статистику",
          description: "Делиться достижениями",
          action: () => {},
          hasToggle: true,
          toggleValue: showStats,
          onToggleChange: setShowStats
        },
        {
          icon: Shield,
          title: "Приватность и безопасность",
          description: "Пароль, двухфакторная аутентификация",
          action: () => showComingSoon("Приватность и безопасность")
        },
      ]
    },
    {
      title: "Поддержка",
      items: [
        {
          icon: HelpCircle,
          title: "Помощь и поддержка",
          description: "FAQ, связаться с поддержкой",
          action: () => showComingSoon("Помощь и поддержка")
        }
      ]
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in animation-delay-400">
      {menuSections.map((section, sectionIndex) => (
        <Card key={sectionIndex} className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
          <CardHeader>
            <CardTitle className="text-lg text-white">{section.title}</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {section.items.map((item, itemIndex) => (
              <div key={itemIndex}>
                <div className="w-full p-4 flex items-center space-x-3 hover:bg-slate-700/30 transition-colors">
                  <item.icon className="h-5 w-5 text-slate-400 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-white">{item.title}</div>
                    <div className="text-sm text-slate-400">{item.description}</div>
                  </div>
                  <div className="flex items-center">
                    {item.hasToggle && item.onToggleChange ? (
                      <Switch
                        checked={item.toggleValue}
                        onCheckedChange={item.onToggleChange}
                      />
                    ) : (
                      <button
                        onClick={item.action}
                        className="flex items-center text-slate-400 hover:text-white transition-colors"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
                {itemIndex < section.items.length - 1 && <Separator className="bg-slate-700" />}
              </div>
            ))}
          </CardContent>
        </Card>
      ))}
      
      {/* Выход из аккаунта */}
      <Card className="bg-slate-800/50 backdrop-blur-sm border-red-700/50">
        <CardContent className="p-0">
          <button
            onClick={handleLogout}
            className="w-full p-4 flex items-center space-x-3 text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <LogOut className="h-5 w-5 flex-shrink-0" />
            <div className="flex-1 text-left">
              <div className="font-medium">Выйти из аккаунта</div>
              <div className="text-sm text-red-400/70">Завершить текущую сессию</div>
            </div>
          </button>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsMenu;
