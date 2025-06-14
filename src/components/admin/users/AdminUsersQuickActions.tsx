
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Users, UserX, Shield, MoreHorizontal } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface AdminUsersQuickActionsProps {
  selectedUsers: string[];
  onActionComplete: () => void;
  onClearSelection: () => void;
}

const AdminUsersQuickActions = ({ selectedUsers, onActionComplete, onClearSelection }: AdminUsersQuickActionsProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleBulkBlock = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('users')
        .update({ 
          is_blocked: true,
          blocked_at: new Date().toISOString(),
          blocked_reason: 'Массовая блокировка администратором'
        })
        .in('id', selectedUsers);

      if (error) throw error;

      toast({
        title: "Успех",
        description: `Заблокировано пользователей: ${selectedUsers.length}`,
      });

      onActionComplete();
      onClearSelection();
    } catch (error: any) {
      toast({
        title: "Ошибка",
        description: "Не удалось заблокировать пользователей",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBulkUnblock = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('users')
        .update({ 
          is_blocked: false,
          blocked_at: null,
          blocked_reason: null
        })
        .in('id', selectedUsers);

      if (error) throw error;

      toast({
        title: "Успех",
        description: `Разблокировано пользователей: ${selectedUsers.length}`,
      });

      onActionComplete();
      onClearSelection();
    } catch (error: any) {
      toast({
        title: "Ошибка",
        description: "Не удалось разблокировать пользователей",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBulkRoleChange = async (newRole: string) => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('users')
        .update({ role: newRole })
        .in('id', selectedUsers);

      if (error) throw error;

      toast({
        title: "Успех",
        description: `Роль изменена для ${selectedUsers.length} пользователей`,
      });

      onActionComplete();
      onClearSelection();
    } catch (error: any) {
      toast({
        title: "Ошибка",
        description: "Не удалось изменить роль пользователей",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (selectedUsers.length === 0) {
    return null;
  }

  return (
    <div className="flex items-center gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg mb-4">
      <div className="flex items-center gap-2">
        <Users className="h-4 w-4 text-blue-600" />
        <span className="text-sm font-medium text-blue-900">
          Выбрано пользователей: <Badge variant="secondary">{selectedUsers.length}</Badge>
        </span>
      </div>

      <div className="flex items-center gap-2 ml-auto">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button size="sm" variant="destructive" disabled={isLoading}>
              <UserX className="h-3 w-3 mr-1" />
              Заблокировать
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Заблокировать пользователей</AlertDialogTitle>
              <AlertDialogDescription>
                Вы уверены, что хотите заблокировать {selectedUsers.length} выбранных пользователей?
                Это действие можно будет отменить позже.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Отмена</AlertDialogCancel>
              <AlertDialogAction onClick={handleBulkBlock}>
                Заблокировать
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <Button size="sm" variant="outline" onClick={handleBulkUnblock} disabled={isLoading}>
          Разблокировать
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="sm" variant="outline" disabled={isLoading}>
              <Shield className="h-3 w-3 mr-1" />
              Изменить роль
              <MoreHorizontal className="h-3 w-3 ml-1" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => handleBulkRoleChange('user')}>
              Пользователь
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleBulkRoleChange('partner')}>
              Партнер
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleBulkRoleChange('support')}>
              Поддержка
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleBulkRoleChange('admin')}>
              Администратор
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button size="sm" variant="ghost" onClick={onClearSelection}>
          Отменить выбор
        </Button>
      </div>
    </div>
  );
};

export default AdminUsersQuickActions;
