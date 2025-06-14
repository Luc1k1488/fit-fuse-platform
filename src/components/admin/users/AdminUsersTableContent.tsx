
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import UserRoleManager from "./UserRoleManager";
import UserBlockManager from "./UserBlockManager";
import UserRoleHistory from "./UserRoleHistory";
import { useEffect, useRef } from "react";

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
  selectedUsers: string[];
  onUserUpdated: () => void;
  onUserSelection: (userId: string, isSelected: boolean) => void;
  onSelectAll: (isSelected: boolean) => void;
  isLoading?: boolean;
}

const AdminUsersTableContent = ({ 
  users, 
  selectedUsers,
  onUserUpdated, 
  onUserSelection,
  onSelectAll,
  isLoading = false
}: AdminUsersTableContentProps) => {
  const selectAllRef = useRef<HTMLButtonElement>(null);
  const isAllSelected = users.length > 0 && selectedUsers.length === users.length;
  const isIndeterminate = selectedUsers.length > 0 && selectedUsers.length < users.length;

  // Handle indeterminate state using a custom approach
  useEffect(() => {
    if (selectAllRef.current) {
      const checkboxElement = selectAllRef.current.querySelector('[role="checkbox"]') as HTMLElement;
      if (checkboxElement) {
        checkboxElement.setAttribute('data-state', isIndeterminate ? 'indeterminate' : isAllSelected ? 'checked' : 'unchecked');
      }
    }
  }, [isAllSelected, isIndeterminate]);

  if (isLoading) {
    return (
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Skeleton className="h-4 w-4" />
              </TableHead>
              <TableHead>Пользователь</TableHead>
              <TableHead>Роль</TableHead>
              <TableHead>Статус</TableHead>
              <TableHead>Дата регистрации</TableHead>
              <TableHead>Действия</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 5 }).map((_, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Skeleton className="h-4 w-4" />
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Skeleton className="w-8 h-8 rounded-full" />
                    <div>
                      <Skeleton className="h-4 w-32 mb-1" />
                      <Skeleton className="h-3 w-48" />
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Skeleton className="h-6 w-20" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-6 w-16" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-24" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-6 w-16" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">
              <Checkbox
                ref={selectAllRef}
                checked={isAllSelected}
                onCheckedChange={(checked) => onSelectAll(!!checked)}
              />
            </TableHead>
            <TableHead>Пользователь</TableHead>
            <TableHead>Роль</TableHead>
            <TableHead>Статус</TableHead>
            <TableHead>Дата регистрации</TableHead>
            <TableHead>Действия</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id} className={selectedUsers.includes(user.id) ? "bg-blue-50" : ""}>
              <TableCell>
                <Checkbox
                  checked={selectedUsers.includes(user.id)}
                  onCheckedChange={(checked) => onUserSelection(user.id, !!checked)}
                />
              </TableCell>
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
                <div className="flex items-center gap-2">
                  <UserRoleManager
                    userId={user.id}
                    userEmail={user.email || ''}
                    currentRole={user.role as "user" | "admin" | "partner" | "support"}
                    onRoleUpdated={onUserUpdated}
                  />
                  <UserRoleHistory 
                    userId={user.id}
                    userEmail={user.email || ''}
                  />
                </div>
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
              <TableCell colSpan={6} className="text-center py-8 text-gray-500">
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
