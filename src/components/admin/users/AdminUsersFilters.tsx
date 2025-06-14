
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Users, Filter, X } from "lucide-react";

interface AdminUsersFiltersProps {
  onRoleFilter: (role: string | null) => void;
  onStatusFilter: (status: string | null) => void;
  onClearFilters: () => void;
  totalUsers: number;
  filteredUsers: number;
}

const AdminUsersFilters = ({ 
  onRoleFilter, 
  onStatusFilter, 
  onClearFilters, 
  totalUsers, 
  filteredUsers 
}: AdminUsersFiltersProps) => {
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);

  const handleRoleChange = (value: string) => {
    const role = value === "all" ? null : value;
    setSelectedRole(role);
    onRoleFilter(role);
  };

  const handleStatusChange = (value: string) => {
    const status = value === "all" ? null : value;
    setSelectedStatus(status);
    onStatusFilter(status);
  };

  const handleClearAll = () => {
    setSelectedRole(null);
    setSelectedStatus(null);
    onClearFilters();
  };

  const hasActiveFilters = selectedRole || selectedStatus;

  return (
    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-6 p-4 bg-gray-50 rounded-lg">
      <div className="flex flex-wrap gap-3 items-center">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-700">Фильтры:</span>
        </div>
        
        <Select value={selectedRole || "all"} onValueChange={handleRoleChange}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Роль" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Все роли</SelectItem>
            <SelectItem value="user">Пользователь</SelectItem>
            <SelectItem value="admin">Администратор</SelectItem>
            <SelectItem value="partner">Партнер</SelectItem>
            <SelectItem value="support">Поддержка</SelectItem>
          </SelectContent>
        </Select>

        <Select value={selectedStatus || "all"} onValueChange={handleStatusChange}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Статус" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Все статусы</SelectItem>
            <SelectItem value="active">Активные</SelectItem>
            <SelectItem value="blocked">Заблокированные</SelectItem>
          </SelectContent>
        </Select>

        {hasActiveFilters && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleClearAll}
            className="text-gray-600"
          >
            <X className="h-3 w-3 mr-1" />
            Очистить
          </Button>
        )}
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Users className="h-4 w-4" />
          <span>
            Показано: <Badge variant="secondary">{filteredUsers}</Badge> из <Badge variant="outline">{totalUsers}</Badge>
          </span>
        </div>
      </div>
    </div>
  );
};

export default AdminUsersFilters;
