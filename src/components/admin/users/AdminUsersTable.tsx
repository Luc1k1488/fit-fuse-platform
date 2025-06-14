
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Search } from "lucide-react";
import UserRoleManager from "./UserRoleManager";
import UserBlockManager from "./UserBlockManager";
import { format } from "date-fns";

const AdminUsersTable = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const { data: users = [], isLoading, refetch } = useQuery({
    queryKey: ['admin-users', searchTerm],
    queryFn: async () => {
      let query = supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

      if (searchTerm) {
        query = query.or(`email.ilike.%${searchTerm}%,name.ilike.%${searchTerm}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    }
  });

  const handleUserUpdated = () => {
    refetch();
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Пользователи
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Управление пользователями
        </CardTitle>
        <CardDescription>
          Управляйте ролями и статусом пользователей
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Поиск по email или имени..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Пользователь</TableHead>
                <TableHead>Роль</TableHead>
                <TableHead>Статус</TableHead>
                <TableHead>Дата регистрации</TableHead>
                <TableHead>Действия</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center">
                        <span className="text-white text-sm font-bold">
                          {user.name?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase() || 'U'}
                        </span>
                      </div>
                      <div>
                        <div className="font-medium">{user.name || 'Без имени'}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <UserRoleManager
                      userId={user.id}
                      userEmail={user.email || ''}
                      currentRole={user.role as "user" | "admin" | "partner" | "support"}
                      onRoleUpdated={handleUserUpdated}
                    />
                  </TableCell>
                  <TableCell>
                    <UserBlockManager
                      userId={user.id}
                      userEmail={user.email || ''}
                      isBlocked={user.is_blocked || false}
                      onStatusUpdated={handleUserUpdated}
                    />
                  </TableCell>
                  <TableCell>
                    {user.created_at ? format(new Date(user.created_at), 'dd.MM.yyyy HH:mm') : 'Неизвестно'}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        ID: {user.id.slice(0, 8)}...
                      </Badge>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {users.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                    Пользователи не найдены
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="mt-4 text-sm text-gray-500">
          Всего пользователей: {users.length}
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminUsersTable;
