
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import AdminUsersHeader from "./AdminUsersHeader";
import AdminUsersSearch from "./AdminUsersSearch";
import AdminUsersLoading from "./AdminUsersLoading";
import AdminUsersTableContent from "./AdminUsersTableContent";
import AdminUsersFooter from "./AdminUsersFooter";

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
    return <AdminUsersLoading />;
  }

  return (
    <Card>
      <AdminUsersHeader />
      <CardContent>
        <AdminUsersSearch 
          searchTerm={searchTerm} 
          onSearchChange={setSearchTerm} 
        />
        <AdminUsersTableContent 
          users={users} 
          onUserUpdated={handleUserUpdated} 
        />
        <AdminUsersFooter userCount={users.length} />
      </CardContent>
    </Card>
  );
};

export default AdminUsersTable;
