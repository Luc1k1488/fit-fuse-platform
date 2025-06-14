
import { useState } from "react";
import { useAuth } from "@/contexts/auth_context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { UserStats } from "@/components/client/profile/UserStats";
import { RecentActivity } from "@/components/client/profile/RecentActivity";
import { FavoriteGyms } from "@/components/client/profile/FavoriteGyms";
import { User, Settings, LogOut } from "lucide-react";

const ClientProfile = () => {
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.user_metadata?.name || user?.email?.split('@')[0] || "",
    email: user?.email || "",
    phone: user?.user_metadata?.phone || ""
  });

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('users')
        .update({
          name: profileData.name,
          phone: profileData.phone
        })
        .eq('id', user.id);

      if (error) throw error;

      toast.success("Профиль успешно обновлен");
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error("Ошибка обновления профиля");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Вы успешно вышли из системы");
    } catch (error) {
      toast.error("Ошибка при выходе");
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-white">Пожалуйста, войдите в систему</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 p-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Мой профиль</h1>
              <p className="text-gray-400">Управляйте своими данными и просматривайте активность</p>
            </div>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Выйти
            </Button>
          </div>
        </div>

        {/* User Statistics */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">Статистика</h2>
          <UserStats />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Profile Settings */}
          <div className="space-y-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Личные данные
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleUpdateProfile} className="space-y-4">
                  <div>
                    <Label htmlFor="name" className="text-gray-300">Имя</Label>
                    <Input
                      id="name"
                      value={profileData.name}
                      onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                      className="bg-gray-700 border-gray-600 text-white"
                      placeholder="Введите ваше имя"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="email" className="text-gray-300">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profileData.email}
                      disabled
                      className="bg-gray-600 border-gray-600 text-gray-400"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Email нельзя изменить
                    </p>
                  </div>
                  
                  <div>
                    <Label htmlFor="phone" className="text-gray-300">Телефон</Label>
                    <Input
                      id="phone"
                      value={profileData.phone}
                      onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                      className="bg-gray-700 border-gray-600 text-white"
                      placeholder="+7 (999) 123-45-67"
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    disabled={loading}
                    className="w-full bg-purple-600 hover:bg-purple-700"
                  >
                    {loading ? "Сохранение..." : "Сохранить изменения"}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Favorite Gyms */}
            <FavoriteGyms />
          </div>

          {/* Recent Activity */}
          <div>
            <RecentActivity />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientProfile;
