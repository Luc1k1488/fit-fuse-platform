
import { useState } from "react";
import { 
  Edit,
  Camera,
  Phone,
  Mail,
  MapPin,
  Calendar
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/auth_context";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface User {
  name: string;
  email: string;
  phone: string;
  location: string;
  joinDate: string;
  avatar: string;
}

interface ProfileHeaderProps {
  user: User;
}

const ProfileHeader = ({ user }: ProfileHeaderProps) => {
  const { user: authUser } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(user.name);
  const [editedPhone, setEditedPhone] = useState(user.phone);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!authUser?.id) return;

    setIsSaving(true);
    try {
      const { error } = await supabase
        .from("users")
        .update({
          name: editedName,
          phone: editedPhone,
        })
        .eq("id", authUser.id);

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
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setEditedName(user.name);
    setEditedPhone(user.phone);
    setIsEditing(false);
  };

  return (
    <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700 animate-fade-in">
      <CardContent className="p-6">
        <div className="flex flex-col sm:flex-row items-start space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="relative flex-shrink-0 self-center sm:self-start">
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
          
          <div className="flex-1 min-w-0 text-center sm:text-left">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-2 mb-2">
              {isEditing ? (
                <Input
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                  className="text-xl font-bold bg-slate-700/50 border-slate-600 text-white max-w-64"
                />
              ) : (
                <h2 className="text-xl font-bold text-white">{user.name}</h2>
              )}
              <Badge className="bg-gradient-to-r from-purple-500 to-blue-600 text-white">
                Премиум
              </Badge>
            </div>
            <div className="space-y-1 text-sm text-slate-300">
              <div className="flex items-center gap-1 justify-center sm:justify-start">
                <Mail className="h-3 w-3 text-blue-400 flex-shrink-0" />
                <span className="break-all">{user.email}</span>
              </div>
              <div className="flex items-center gap-1 justify-center sm:justify-start">
                <Phone className="h-3 w-3 text-green-400 flex-shrink-0" />
                {isEditing ? (
                  <Input
                    value={editedPhone}
                    onChange={(e) => setEditedPhone(e.target.value)}
                    className="text-sm bg-slate-700/50 border-slate-600 text-white h-6 max-w-40"
                  />
                ) : (
                  <span>{user.phone}</span>
                )}
              </div>
              <div className="flex items-center gap-1 justify-center sm:justify-start">
                <MapPin className="h-3 w-3 text-purple-400 flex-shrink-0" />
                <span>{user.location}</span>
              </div>
              <div className="flex items-center gap-1 justify-center sm:justify-start">
                <Calendar className="h-3 w-3 text-orange-400 flex-shrink-0" />
                <span>С нами с {user.joinDate}</span>
              </div>
            </div>
          </div>
          
          <div className="flex-shrink-0 w-full sm:w-auto">
            {isEditing ? (
              <div className="flex gap-2 w-full sm:w-auto">
                <Button 
                  onClick={handleSave} 
                  disabled={isSaving}
                  size="sm" 
                  className="flex-1 sm:flex-none bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700"
                >
                  {isSaving ? "Сохранение..." : "Сохранить"}
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleCancel}
                  className="flex-1 sm:flex-none bg-slate-700/50 border-slate-600 text-slate-300 hover:bg-slate-600/50"
                >
                  Отмена
                </Button>
              </div>
            ) : (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setIsEditing(true)}
                className="w-full sm:w-auto bg-slate-700/50 border-slate-600 text-slate-300 hover:bg-slate-600/50"
              >
                <Edit className="h-4 w-4 mr-2" />
                Редактировать
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileHeader;
