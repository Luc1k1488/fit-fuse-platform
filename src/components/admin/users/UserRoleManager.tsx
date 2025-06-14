
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Shield, UserCheck, Crown, Headphones, User } from "lucide-react";

interface UserRoleManagerProps {
  userId: string;
  userEmail: string;
  currentRole: "user" | "admin" | "partner" | "support";
  onRoleUpdated: () => void;
}

const UserRoleManager = ({ userId, userEmail, currentRole, onRoleUpdated }: UserRoleManagerProps) => {
  const [selectedRole, setSelectedRole] = useState<string>(currentRole);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const roles = [
    { 
      value: "user", 
      label: "Пользователь", 
      icon: User,
      color: "bg-gray-500",
      description: "Базовые права пользователя"
    },
    { 
      value: "admin", 
      label: "Администратор", 
      icon: Crown,
      color: "bg-red-500",
      description: "Полный доступ к системе"
    },
    { 
      value: "partner", 
      label: "Партнер", 
      icon: Shield,
      color: "bg-blue-500",
      description: "Управление спортзалами"
    },
    { 
      value: "support", 
      label: "Поддержка", 
      icon: Headphones,
      color: "bg-green-500",
      description: "Техническая поддержка"
    },
  ];

  const handleUpdateRole = async () => {
    if (selectedRole === currentRole) {
      toast({
        title: "Информация",
        description: "Роль пользователя не изменилась",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Обновляем роль в таблице users
      const { error: updateError } = await supabase
        .from('users')
        .update({ role: selectedRole })
        .eq('id', userId);

      if (updateError) throw updateError;

      // Обновляем метаданные пользователя в auth
      const { error: authError } = await supabase.auth.admin.updateUserById(userId, {
        user_metadata: { role: selectedRole }
      });

      if (authError) {
        console.log("Warning: Could not update auth metadata:", authError.message);
      }

      toast({
        title: "Успех",
        description: `Роль пользователя изменена на "${roles.find(r => r.value === selectedRole)?.label}"`,
      });

      onRoleUpdated();
    } catch (error: any) {
      toast({
        title: "Ошибка",
        description: error.message || "Не удалось изменить роль пользователя",
        variant: "destructive",
      });
      setSelectedRole(currentRole); // Возвращаем исходную роль при ошибке
    } finally {
      setIsLoading(false);
    }
  };

  const getCurrentRole = () => {
    return roles.find(r => r.value === currentRole);
  };

  const getSelectedRole = () => {
    return roles.find(r => r.value === selectedRole);
  };

  const currentRoleData = getCurrentRole();
  const selectedRoleData = getSelectedRole();

  return (
    <div className="flex items-center gap-3">
      <Badge className={`${currentRoleData?.color} text-white flex items-center gap-1`}>
        {currentRoleData?.icon && <currentRoleData.icon className="w-3 h-3" />}
        {currentRoleData?.label}
      </Badge>

      <Select value={selectedRole} onValueChange={setSelectedRole}>
        <SelectTrigger className="w-40">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {roles.map((role) => (
            <SelectItem key={role.value} value={role.value}>
              <div className="flex items-center gap-2">
                <role.icon className="w-4 h-4" />
                <div>
                  <div className="font-medium">{role.label}</div>
                  <div className="text-xs text-gray-500">{role.description}</div>
                </div>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button 
            size="sm" 
            disabled={selectedRole === currentRole || isLoading}
            className="text-xs"
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
            ) : (
              <>
                <UserCheck className="w-3 h-3 mr-1" />
                Изменить
              </>
            )}
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Изменить роль пользователя</AlertDialogTitle>
            <AlertDialogDescription className="space-y-3">
              <div>
                Вы уверены, что хотите изменить роль пользователя <strong>{userEmail}</strong>?
              </div>
              <div className="bg-gray-50 p-3 rounded-md">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-medium">Текущая роль:</span>
                  <Badge className={`${currentRoleData?.color} text-white`}>
                    {currentRoleData?.label}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Новая роль:</span>
                  <Badge className={`${selectedRoleData?.color} text-white`}>
                    {selectedRoleData?.label}
                  </Badge>
                </div>
                <div className="mt-2 text-xs text-gray-600">
                  {selectedRoleData?.description}
                </div>
              </div>
              <div className="text-sm text-orange-600">
                ⚠️ Это действие изменит права доступа пользователя в системе.
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Отмена</AlertDialogCancel>
            <AlertDialogAction onClick={handleUpdateRole}>
              Изменить роль
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default UserRoleManager;
