
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";
import { History, User, Crown, Shield, Headphones } from "lucide-react";

interface UserRoleHistoryProps {
  userId: string;
  userEmail: string;
}

interface RoleHistoryRecord {
  id: string;
  old_role: string | null;
  new_role: string;
  changed_at: string;
  reason: string | null;
  changed_by: string;
}

const UserRoleHistory = ({ userId, userEmail }: UserRoleHistoryProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const { data: roleHistory, isLoading } = useQuery({
    queryKey: ['user-role-history', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_role_history')
        .select('*')
        .eq('user_id', userId)
        .order('changed_at', { ascending: false });

      if (error) throw error;
      return data as RoleHistoryRecord[];
    },
    enabled: isOpen
  });

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "admin": return Crown;
      case "partner": return Shield;
      case "support": return Headphones;
      default: return User;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin": return "bg-red-500";
      case "partner": return "bg-blue-500";
      case "support": return "bg-green-500";
      default: return "bg-gray-500";
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case "admin": return "Администратор";
      case "partner": return "Партнер";
      case "support": return "Поддержка";
      default: return "Пользователь";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="h-6 px-2">
          <History className="h-3 w-3" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            История изменений ролей - {userEmail}
          </DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="max-h-96">
          {isLoading ? (
            <div className="text-center py-8">Загрузка...</div>
          ) : !roleHistory || roleHistory.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              История изменений ролей отсутствует
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Дата изменения</TableHead>
                  <TableHead>Предыдущая роль</TableHead>
                  <TableHead>Новая роль</TableHead>
                  <TableHead>Причина</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {roleHistory.map((record) => {
                  const OldRoleIcon = record.old_role ? getRoleIcon(record.old_role) : null;
                  const NewRoleIcon = getRoleIcon(record.new_role);
                  
                  return (
                    <TableRow key={record.id}>
                      <TableCell>
                        {format(new Date(record.changed_at), 'dd.MM.yyyy HH:mm')}
                      </TableCell>
                      <TableCell>
                        {record.old_role ? (
                          <Badge className={`${getRoleColor(record.old_role)} text-white flex items-center gap-1 w-fit`}>
                            {OldRoleIcon && <OldRoleIcon className="w-3 h-3" />}
                            {getRoleLabel(record.old_role)}
                          </Badge>
                        ) : (
                          <span className="text-gray-400">Не задана</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge className={`${getRoleColor(record.new_role)} text-white flex items-center gap-1 w-fit`}>
                          <NewRoleIcon className="w-3 h-3" />
                          {getRoleLabel(record.new_role)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-gray-600">
                          {record.reason || 'Не указана'}
                        </span>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default UserRoleHistory;
