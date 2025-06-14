
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import AdminGymsHeader from "./AdminGymsHeader";
import AdminGymCreateDialog from "./AdminGymCreateDialog";
import AdminGymEditDialog from "./AdminGymEditDialog";
import AdminGymsTableContent from "./AdminGymsTableContent";

const AdminGymsTable = () => {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedGym, setSelectedGym] = useState<any>(null);

  const { data: gyms = [], isLoading, refetch } = useQuery({
    queryKey: ['admin-gyms'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('gyms')
        .select(`
          *,
          partner:partners(name, company_name)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  const { data: partners = [] } = useQuery({
    queryKey: ['partners'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('partners')
        .select('*')
        .eq('status', 'approved')
        .order('name');
      
      if (error) throw error;
      return data;
    }
  });

  const handleEdit = (gym: any) => {
    setSelectedGym(gym);
    setEditDialogOpen(true);
  };

  const handleGymUpdated = () => {
    refetch();
    setCreateDialogOpen(false);
    setEditDialogOpen(false);
    setSelectedGym(null);
  };

  if (isLoading) {
    return (
      <Card>
        <AdminGymsHeader />
        <CardContent>
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <AdminGymsHeader />
        <CardContent>
          <div className="flex justify-between items-center mb-4">
            <div className="text-sm text-gray-500">
              Всего спортзалов: {gyms.length}
            </div>
            <Button 
              onClick={() => setCreateDialogOpen(true)}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Добавить спортзал
            </Button>
          </div>
          
          <AdminGymsTableContent 
            gyms={gyms} 
            onEdit={handleEdit}
            onGymUpdated={handleGymUpdated}
          />
        </CardContent>
      </Card>

      <AdminGymCreateDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        partners={partners}
        onGymCreated={handleGymUpdated}
      />

      <AdminGymEditDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        gym={selectedGym}
        partners={partners}
        onGymUpdated={handleGymUpdated}
      />
    </>
  );
};

export default AdminGymsTable;
