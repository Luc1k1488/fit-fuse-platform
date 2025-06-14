
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Star } from "lucide-react";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface Gym {
  id: string;
  name: string;
  city: string;
  location: string;
  category: string;
  rating: number;
  review_count: number;
  created_at: string;
  partner: { name: string; company_name: string } | null;
}

interface AdminGymsTableContentProps {
  gyms: Gym[];
  onEdit: (gym: Gym) => void;
  onGymUpdated: () => void;
}

const AdminGymsTableContent = ({ gyms, onEdit, onGymUpdated }: AdminGymsTableContentProps) => {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const { toast } = useToast();

  const handleDelete = async (gymId: string, gymName: string) => {
    setDeletingId(gymId);
    try {
      const { error } = await supabase
        .from('gyms')
        .delete()
        .eq('id', gymId);

      if (error) throw error;

      toast({
        title: "Успех",
        description: `Спортзал "${gymName}" удален`,
      });

      onGymUpdated();
    } catch (error: any) {
      toast({
        title: "Ошибка",
        description: error.message || "Не удалось удалить спортзал",
        variant: "destructive",
      });
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Название</TableHead>
            <TableHead>Местоположение</TableHead>
            <TableHead>Категория</TableHead>
            <TableHead>Партнер</TableHead>
            <TableHead>Рейтинг</TableHead>
            <TableHead>Дата создания</TableHead>
            <TableHead>Действия</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {gyms.map((gym) => (
            <TableRow key={gym.id}>
              <TableCell className="font-medium">{gym.name}</TableCell>
              <TableCell>{gym.city}, {gym.location}</TableCell>
              <TableCell>
                <Badge variant="outline">{gym.category}</Badge>
              </TableCell>
              <TableCell>
                {gym.partner ? (
                  <div>
                    <div className="font-medium">{gym.partner.name}</div>
                    <div className="text-sm text-gray-500">{gym.partner.company_name}</div>
                  </div>
                ) : (
                  <Badge variant="secondary">Не назначен</Badge>
                )}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-yellow-500" />
                  <span>{gym.rating.toFixed(1)}</span>
                  <span className="text-sm text-gray-500">({gym.review_count})</span>
                </div>
              </TableCell>
              <TableCell>
                {format(new Date(gym.created_at), 'dd.MM.yyyy HH:mm')}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onEdit(gym)}
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                  
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        size="sm"
                        variant="destructive"
                        disabled={deletingId === gym.id}
                      >
                        {deletingId === gym.id ? (
                          <div className="animate-spin rounded-full h-3 w-3 border-t-2 border-b-2 border-white"></div>
                        ) : (
                          <Trash2 className="h-3 w-3" />
                        )}
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Удалить спортзал</AlertDialogTitle>
                        <AlertDialogDescription>
                          Вы уверены, что хотите удалить спортзал "{gym.name}"?
                          Это действие нельзя отменить.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Отмена</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(gym.id, gym.name)}
                        >
                          Удалить
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </TableCell>
            </TableRow>
          ))}
          {gyms.length === 0 && (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                Спортзалы не найдены
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default AdminGymsTableContent;
