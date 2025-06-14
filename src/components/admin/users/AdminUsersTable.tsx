
import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import AdminUsersHeader from "./AdminUsersHeader";
import AdminUsersSearch from "./AdminUsersSearch";
import AdminUsersFilters from "./AdminUsersFilters";
import AdminUsersStats from "./AdminUsersStats";
import AdminUsersActions from "./AdminUsersActions";
import AdminUsersQuickActions from "./AdminUsersQuickActions";
import AdminUsersLoading from "./AdminUsersLoading";
import AdminUsersTableContent from "./AdminUsersTableContent";
import AdminUsersPagination from "./AdminUsersPagination";

const AdminUsersTable = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  // Получаем общее количество пользователей для статистики
  const { data: allUsers = [] } = useQuery({
    queryKey: ['admin-users-all'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    }
  });

  // Получаем пользователей с пагинацией
  const { data: paginatedData, isLoading, refetch } = useQuery({
    queryKey: ['admin-users-paginated', searchTerm, roleFilter, statusFilter, currentPage, pageSize],
    queryFn: async () => {
      let query = supabase
        .from('users')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false });

      // Применяем фильтры
      if (searchTerm) {
        query = query.or(`email.ilike.%${searchTerm}%,name.ilike.%${searchTerm}%`);
      }

      if (roleFilter) {
        query = query.eq('role', roleFilter);
      }

      if (statusFilter) {
        if (statusFilter === 'active') {
          query = query.eq('is_blocked', false);
        } else if (statusFilter === 'blocked') {
          query = query.eq('is_blocked', true);
        }
      }

      // Применяем пагинацию
      const from = (currentPage - 1) * pageSize;
      const to = from + pageSize - 1;
      query = query.range(from, to);

      const { data, error, count } = await query;
      if (error) throw error;

      return {
        users: data || [],
        totalCount: count || 0
      };
    }
  });

  const users = paginatedData?.users || [];
  const totalCount = paginatedData?.totalCount || 0;
  const totalPages = Math.ceil(totalCount / pageSize);

  // Статистика всех пользователей
  const userStats = useMemo(() => {
    return {
      total: allUsers.length,
      active: allUsers.filter(user => !user.is_blocked).length,
      blocked: allUsers.filter(user => user.is_blocked).length,
      admins: allUsers.filter(user => user.role === 'admin').length,
      partners: allUsers.filter(user => user.role === 'partner').length,
      support: allUsers.filter(user => user.role === 'support').length,
      users: allUsers.filter(user => user.role === 'user').length,
    };
  }, [allUsers]);

  const handleUserUpdated = () => {
    refetch();
  };

  const handleClearFilters = () => {
    setRoleFilter(null);
    setStatusFilter(null);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setSelectedUsers([]); // Сбрасываем выбор при смене страницы
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
    setSelectedUsers([]);
  };

  const handleUserSelection = (userId: string, isSelected: boolean) => {
    if (isSelected) {
      setSelectedUsers(prev => [...prev, userId]);
    } else {
      setSelectedUsers(prev => prev.filter(id => id !== userId));
    }
  };

  const handleSelectAll = (isSelected: boolean) => {
    if (isSelected) {
      setSelectedUsers(users.map(user => user.id));
    } else {
      setSelectedUsers([]);
    }
  };

  if (isLoading && !users.length) {
    return <AdminUsersLoading />;
  }

  return (
    <div className="space-y-6">
      <Card>
        <AdminUsersHeader />
        <CardContent>
          <AdminUsersStats stats={userStats} />
          
          <AdminUsersActions onUserCreated={handleUserUpdated} />
          
          <AdminUsersSearch 
            searchTerm={searchTerm} 
            onSearchChange={setSearchTerm} 
          />
          
          <AdminUsersFilters
            onRoleFilter={setRoleFilter}
            onStatusFilter={setStatusFilter}
            onClearFilters={handleClearFilters}
            totalUsers={allUsers.length}
            filteredUsers={totalCount}
          />

          <AdminUsersQuickActions
            selectedUsers={selectedUsers}
            onActionComplete={handleUserUpdated}
            onClearSelection={() => setSelectedUsers([])}
          />
          
          <AdminUsersTableContent 
            users={users} 
            selectedUsers={selectedUsers}
            onUserUpdated={handleUserUpdated}
            onUserSelection={handleUserSelection}
            onSelectAll={handleSelectAll}
            isLoading={isLoading}
          />
          
          <AdminUsersPagination
            currentPage={currentPage}
            totalPages={totalPages}
            pageSize={pageSize}
            totalUsers={totalCount}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminUsersTable;
