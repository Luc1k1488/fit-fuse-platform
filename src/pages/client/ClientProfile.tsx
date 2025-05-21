import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { useAuth } from "@/contexts/auth_context";
import { 
  User, 
  Mail, 
  Phone, 
  Camera, 
  Bell, 
  Lock, 
  LogOut,
  Calendar
} from "lucide-react";
import { FitnessTrackerConnect } from "@/components/integrations/FitnessTrackerConnect";

const ClientProfile = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("personal");
  
  // Состояния для формы с личными данными
  const [formData, setFormData] = useState({
    name: user?.name || "Иван Петров",
    email: user?.email || "ivan@example.com",
    phone: user?.phone || "+7 (999) 123-45-67",
    birthdate: "1990-01-15",
    gender: "Мужской"
  });
  
  // Состояния для настроек уведомлений
  const [notificationSettings, setNotificationSettings] = useState({
    email: true,
    push: true,
    sms: false,
    marketing: false
  });
  
  // Обработчик изменения полей формы
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Обработчик изменения переключателей уведомлений
  const handleToggleChange = (setting: keyof typeof notificationSettings) => {
    setNotificationSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };
  
  // Обработчик сохранения профиля
  const handleSaveProfile = () => {
    // В реальном приложении здесь был бы запрос к API
    toast.success("Профиль успешно обновлен");
  };
  
  // Обработчик сохранения настроек уведомлений
  const handleSaveNotifications = () => {
    toast.success("Настройки уведомлений обновлены");
  };
  
  // Обработчик выхода из аккаунта
  const handleLogout = () => {
    logout();
  };

  return (
    <div className="pb-16">
      <h1 className="text-2xl font-bold mb-4">Мой профиль</h1>
      
      {/* Аватар и основная информация */}
      <div className="flex items-center mb-6">
        <div className="relative">
          <div className="w-20 h-20 rounded-full bg-gray-200 overflow-hidden">
            {user?.profile_image ? (
              <img 
                src={user.profile_image} 
                alt="Аватар" 
                className="w-full h-full object-cover" 
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <User className="h-8 w-8 text-gray-400" />
              </div>
            )}
          </div>
          <Button 
            size="sm" 
            variant="outline" 
            className="absolute -bottom-2 -right-2 rounded-full p-1 bg-white"
          >
            <Camera className="h-4 w-4" />
            <span className="sr-only">Изменить фото</span>
          </Button>
        </div>
        <div className="ml-4">
          <p className="font-medium text-lg">{formData.name}</p>
          <p className="text-gray-500 text-sm">Активная подписка: Премиум</p>
        </div>
      </div>
      
      {/* Вкладки для настроек профиля */}
      <Tabs defaultValue="personal" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full grid grid-cols-3 mb-6">
          <TabsTrigger value="personal">Профиль</TabsTrigger>
          <TabsTrigger value="notifications">Уведомления</TabsTrigger>
          <TabsTrigger value="security">Безопасность</TabsTrigger>
        </TabsList>
        
        {/* Вкладка с личными данными */}
        <TabsContent value="personal" className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">ФИО</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="pl-10"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                className="pl-10"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="phone">Телефон</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
              <Input
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="pl-10"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="birthdate">Дата рождения</Label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
              <Input
                id="birthdate"
                name="birthdate"
                type="date"
                value={formData.birthdate}
                onChange={handleInputChange}
                className="pl-10"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Пол</Label>
            <div className="grid grid-cols-2 gap-2">
              <Button 
                type="button"
                variant={formData.gender === "Мужской" ? "default" : "outline"}
                onClick={() => setFormData(prev => ({ ...prev, gender: "Мужской" }))}
                className="justify-center"
              >
                Мужской
              </Button>
              <Button 
                type="button"
                variant={formData.gender === "Женский" ? "default" : "outline"}
                onClick={() => setFormData(prev => ({ ...prev, gender: "Женский" }))}
                className="justify-center"
              >
                Женский
              </Button>
            </div>
          </div>
          
          <Button onClick={handleSaveProfile} className="w-full mt-4">
            Сохранить изменения
          </Button>
        </TabsContent>
        
        {/* Вкладка с уведомлениями */}
        <TabsContent value="notifications" className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Email уведомления</p>
                <p className="text-gray-500 text-sm">Получать уведомления на почту</p>
              </div>
              <Switch 
                checked={notificationSettings.email} 
                onCheckedChange={() => handleToggleChange('email')} 
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Push-уведомления</p>
                <p className="text-gray-500 text-sm">Получать уведомления в приложении</p>
              </div>
              <Switch 
                checked={notificationSettings.push} 
                onCheckedChange={() => handleToggleChange('push')} 
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">SMS уведомления</p>
                <p className="text-gray-500 text-sm">Получать уведомления по SMS</p>
              </div>
              <Switch 
                checked={notificationSettings.sms} 
                onCheckedChange={() => handleToggleChange('sms')} 
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Маркетинговые рассылки</p>
                <p className="text-gray-500 text-sm">Получать новости и специальные предложения</p>
              </div>
              <Switch 
                checked={notificationSettings.marketing} 
                onCheckedChange={() => handleToggleChange('marketing')} 
              />
            </div>
          </div>
          
          <Button onClick={handleSaveNotifications} className="w-full mt-4">
            Сохранить настройки
          </Button>
        </TabsContent>
        
        {/* Вкладка с безопасностью */}
        <TabsContent value="security" className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="current-password">Текущий пароль</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                <Input
                  id="current-password"
                  type="password"
                  className="pl-10"
                  placeholder="••••••••"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="new-password">Новый пароль</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                <Input
                  id="new-password"
                  type="password"
                  className="pl-10"
                  placeholder="••••••••"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Подтвердите пароль</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                <Input
                  id="confirm-password"
                  type="password"
                  className="pl-10"
                  placeholder="••••••••"
                />
              </div>
            </div>
            
            <Button className="w-full">
              Обновить пароль
            </Button>
            
            <div className="pt-4 border-t mt-4">
              <Button 
                variant="destructive" 
                className="w-full" 
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Выйти из аккаунта
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
      
      <div>
        <h2 className="text-lg font-bold mb-3">Интеграции с устройствами</h2>
        <FitnessTrackerConnect 
          onConnect={(data) => {
            console.log("Устройство подключено:", data);
            // Здесь можно обработать данные с подключенного устройства
          }} 
        />
      </div>
    </div>
  );
};

export default ClientProfile;
