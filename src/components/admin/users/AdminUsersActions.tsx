
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { UserPlus, Mail, FileDown } from "lucide-react";

interface AdminUsersActionsProps {
  onUserCreated: () => void;
}

const AdminUsersActions = ({ onUserCreated }: AdminUsersActionsProps) => {
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteMessage, setInviteMessage] = useState("");
  const [isInviting, setIsInviting] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const { toast } = useToast();

  const handleInviteUser = async () => {
    if (!inviteEmail) {
      toast({
        title: "Ошибка",
        description: "Введите email для приглашения",
        variant: "destructive",
      });
      return;
    }

    setIsInviting(true);
    try {
      // В реальном приложении здесь был бы вызов API для отправки приглашения
      await new Promise(resolve => setTimeout(resolve, 1000)); // Имитация API вызова
      
      toast({
        title: "Приглашение отправлено",
        description: `Приглашение отправлено на ${inviteEmail}`,
      });

      setInviteEmail("");
      setInviteMessage("");
      onUserCreated();
    } catch (error: any) {
      toast({
        title: "Ошибка",
        description: "Не удалось отправить приглашение",
        variant: "destructive",
      });
    } finally {
      setIsInviting(false);
    }
  };

  const handleExportUsers = async () => {
    setIsExporting(true);
    try {
      const { data: users, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Создаем CSV контент
      const csvContent = [
        ['ID', 'Email', 'Name', 'Role', 'Status', 'Created At'].join(','),
        ...users.map(user => [
          user.id,
          user.email || '',
          user.name || '',
          user.role || '',
          user.is_blocked ? 'Blocked' : 'Active',
          user.created_at || ''
        ].join(','))
      ].join('\n');

      // Создаем и скачиваем файл
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `users_export_${new Date().toISOString().split('T')[0]}.csv`;
      link.click();

      toast({
        title: "Успех",
        description: "Данные пользователей экспортированы",
      });
    } catch (error: any) {
      toast({
        title: "Ошибка",
        description: "Не удалось экспортировать данные",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="flex flex-wrap gap-3 mb-4">
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button className="flex items-center gap-2">
            <UserPlus className="h-4 w-4" />
            Пригласить пользователя
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Пригласить нового пользователя</AlertDialogTitle>
            <AlertDialogDescription>
              Отправьте приглашение новому пользователю для регистрации в системе
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="inviteEmail">Email для приглашения</Label>
              <Input
                id="inviteEmail"
                type="email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                placeholder="user@example.com"
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="inviteMessage">Сообщение (необязательно)</Label>
              <Textarea
                id="inviteMessage"
                value={inviteMessage}
                onChange={(e) => setInviteMessage(e.target.value)}
                placeholder="Добро пожаловать в нашу систему..."
                className="mt-2"
                rows={3}
              />
            </div>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Отмена</AlertDialogCancel>
            <AlertDialogAction onClick={handleInviteUser} disabled={isInviting}>
              {isInviting ? (
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
              ) : (
                <>
                  <Mail className="h-4 w-4 mr-1" />
                  Отправить приглашение
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Button 
        variant="outline" 
        onClick={handleExportUsers}
        disabled={isExporting}
        className="flex items-center gap-2"
      >
        {isExporting ? (
          <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-current"></div>
        ) : (
          <FileDown className="h-4 w-4" />
        )}
        Экспорт пользователей
      </Button>
    </div>
  );
};

export default AdminUsersActions;
