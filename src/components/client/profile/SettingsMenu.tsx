
import { 
  User, 
  CreditCard, 
  Bell, 
  Shield, 
  HelpCircle
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface MenuItem {
  icon: any;
  title: string;
  description: string;
  action: () => void;
}

const SettingsMenu = () => {
  const menuItems: MenuItem[] = [
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
              <item.icon className="h-5 w-5 text-slate-400 flex-shrink-0" />
              <div className="flex-1 min-w-0">
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
  );
};

export default SettingsMenu;
