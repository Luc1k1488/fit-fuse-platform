
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserX, UserCheck } from "lucide-react";

interface UserBlockManagerProps {
  userId: string;
  userEmail: string;
  isBlocked?: boolean;
  onStatusUpdated: () => void;
}

const UserBlockManager = ({ userId, userEmail, isBlocked = false, onStatusUpdated }: UserBlockManagerProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [blockReason, setBlockReason] = useState("");
  const { toast } = useToast();

  const handleBlockUser = async () => {
    if (!blockReason.trim()) {
      toast({
        title: "Ошибка",
        description: "Укажите причину блокировки",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('users')
        .update({ 
          is_blocked: true,
          blocked_at: new Date().toISOString(),
          blocked_reason: blockReason.trim()
        } as any)
        .eq('id', userId);

      if (error) throw error;

      toast({
        title: "Успех",
        description: "Пользователь заблокирован",
      });

      setBlockReason("");
      onStatusUpdated();
    } catch (error: any) {
      toast({
        title: "Ошибка",
        description: error.message || "Не удалось заблокировать пользователя",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnblockUser = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('users')
        .update({ 
          is_blocked: false,
          blocked_at: null,
          blocked_reason: null
        } as any)
        .eq('id', userId);

      if (error) throw error;

      toast({
        title: "Успех",
        description: "Пользователь разблокирован",
      });

      onStatusUpdated();
    } catch (error: any) {
      toast({
        title: "Ошибка",
        description: error.message || "Не удалось разблокировать пользователя",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-3">
      <Badge variant={isBlocked ? "destructive" : "secondary"}>
        {isBlocked ? "Заблокирован" : "Активен"}
      </Badge>

      {isBlocked ? (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button size="sm" variant="outline" disabled={isLoading}>
              {isLoading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-current"></div>
              ) : (
                <>
                  <UserCheck className="w-3 h-3 mr-1" />
                  Разблокировать
                </>
              )}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Разблокировать пользователя</AlertDialogTitle>
              <AlertDialogDescription>
                Вы уверены, что хотите разблокировать пользователя {userEmail}?
                Пользователь снова получит доступ к системе.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Отмена</AlertDialogCancel>
              <AlertDialogAction onClick={handleUnblockUser}>
                Разблокировать
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      ) : (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button size="sm" variant="destructive" disabled={isLoading}>
              {isLoading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
              ) : (
                <>
                  <UserX className="w-3 h-3 mr-1" />
                  Заблокировать
                </>
              )}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Заблокировать пользователя</AlertDialogTitle>
              <AlertDialogDescription>
                Вы уверены, что хотите заблокировать пользователя {userEmail}?
                Пользователь потеряет доступ к системе.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="py-4">
              <Label htmlFor="blockReason">Причина блокировки</Label>
              <Input
                id="blockReason"
                value={blockReason}
                onChange={(e) => setBlockReason(e.target.value)}
                placeholder="Укажите причину блокировки..."
                className="mt-2"
              />
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel>Отмена</AlertDialogCancel>
              <AlertDialogAction onClick={handleBlockUser}>
                Заблокировать
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
};

export default UserBlockManager;
