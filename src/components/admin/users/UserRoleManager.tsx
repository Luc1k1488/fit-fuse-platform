
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Shield, UserCheck, UserX } from "lucide-react";

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
    { value: "user", label: "Пользователь", color: "bg-gray-500" },
    { value: "admin", label: "Администратор", color: "bg-red-500" },
    { value: "partner", label: "Партнер", color: "bg-blue-500" },
    { value: "support", label: "Поддержка", color: "bg-green-500" },
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
    } finally {
      setIsLoading(false);
    }
  };

  const getRoleColor = (role: string) => {
    return roles.find(r => r.value === role)?.color || "bg-gray-500";
  };

  const getRoleLabel = (role: string) => {
    return roles.find(r => r.value === role)?.label || role;
  };

  return (
    <div className="flex items-center gap-3">
      <Badge className={`${getRoleColor(currentRole)} text-white`}>
        <Shield className="w-3 h-3 mr-1" />
        {getRoleLabel(currentRole)}
      </Badge>

      <Select value={selectedRole} onValueChange={setSelectedRole}>
        <SelectTrigger className="w-32">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {roles.map((role) => (
            <SelectItem key={role.value} value={role.value}>
              {role.label}
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
            <AlertDialogDescription>
              Вы уверены, что хотите изменить роль пользователя {userEmail} 
              с "{getRoleLabel(currentRole)}" на "{getRoleLabel(selectedRole)}"?
              <br /><br />
              Это действие изменит права доступа пользователя в системе.
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
