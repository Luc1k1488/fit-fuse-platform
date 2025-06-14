
import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import AdminUsersHeader from "./AdminUsersHeader";
import AdminUsersSearch from "./AdminUsersSearch";
import AdminUsersFilters from "./AdminUsersFilters";
import AdminUsersStats from "./AdminUsersStats";
import AdminUsersActions from "./AdminUsersActions";
import AdminUsersLoading from "./AdminUsersLoading";
import AdminUsersTableContent from "./AdminUsersTableContent";
import AdminUsersFooter from "./AdminUsersFooter";

const AdminUsersTable = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

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

  // Фильтрация пользователей
  const filteredUsers = useMemo(() => {
    let filtered = users;

    if (roleFilter) {
      filtered = filtered.filter(user => user.role === roleFilter);
    }

    if (statusFilter) {
      if (statusFilter === 'active') {
        filtered = filtered.filter(user => !user.is_blocked);
      } else if (statusFilter === 'blocked') {
        filtered = filtered.filter(user => user.is_blocked);
      }
    }

    return filtered;
  }, [users, roleFilter, statusFilter]);

  // Статистика пользователей
  const userStats = useMemo(() => {
    return {
      total: users.length,
      active: users.filter(user => !user.is_blocked).length,
      blocked: users.filter(user => user.is_blocked).length,
      admins: users.filter(user => user.role === 'admin').length,
      partners: users.filter(user => user.role === 'partner').length,
      support: users.filter(user => user.role === 'support').length,
      users: users.filter(user => user.role === 'user').length,
    };
  }, [users]);

  const handleUserUpdated = () => {
    refetch();
  };

  const handleClearFilters = () => {
    setRoleFilter(null);
    setStatusFilter(null);
  };

  if (isLoading) {
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
            totalUsers={users.length}
            filteredUsers={filteredUsers.length}
          />
          
          <AdminUsersTableContent 
            users={filteredUsers} 
            onUserUpdated={handleUserUpdated} 
          />
          
          <AdminUsersFooter userCount={filteredUsers.length} />
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminUsersTable;
