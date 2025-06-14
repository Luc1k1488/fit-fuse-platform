
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import UserRoleManager from "./UserRoleManager";
import UserBlockManager from "./UserBlockManager";

interface User {
  id: string;
  name?: string;
  email?: string;
  role?: string;
  is_blocked?: boolean;
  created_at?: string;
}

interface AdminUsersTableContentProps {
  users: User[];
  onUserUpdated: () => void;
}

const AdminUsersTableContent = ({ users, onUserUpdated }: AdminUsersTableContentProps) => {
  return (
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
                  onRoleUpdated={onUserUpdated}
                />
              </TableCell>
              <TableCell>
                <UserBlockManager
                  userId={user.id}
                  userEmail={user.email || ''}
                  isBlocked={user.is_blocked || false}
                  onStatusUpdated={onUserUpdated}
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
  );
};

export default AdminUsersTableContent;
