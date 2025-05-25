
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Search, Ban, Unlock, UserX, Calendar } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@/types";
import { toast } from "sonner";

const AdminUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [actionType, setActionType] = useState<"block" | "freeze" | null>(null);
  const [reason, setReason] = useState("");
  const [freezeDuration, setFreezeDuration] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Ошибка загрузки пользователей');
    } finally {
      setLoading(false);
    }
  };

  const handleBlockUser = async () => {
    if (!selectedUser || !reason) return;

    try {
      const { error } = await supabase
        .from('users')
        .update({
          is_blocked: true,
          blocked_at: new Date().toISOString(),
          blocked_reason: reason
        })
        .eq('id', selectedUser.id);

      if (error) throw error;

      await fetchUsers();
      setSelectedUser(null);
      setActionType(null);
      setReason("");
      toast.success('Пользователь заблокирован');
    } catch (error) {
      console.error('Error blocking user:', error);
      toast.error('Ошибка блокировки пользователя');
    }
  };

  const handleUnblockUser = async (user: User) => {
    try {
      const { error } = await supabase
        .from('users')
        .update({
          is_blocked: false,
          blocked_at: null,
          blocked_reason: null
        })
        .eq('id', user.id);

      if (error) throw error;

      await fetchUsers();
      toast.success('Пользователь разблокирован');
    } catch (error) {
      console.error('Error unblocking user:', error);
      toast.error('Ошибка разблокировки пользователя');
    }
  };

  const handleFreezeSubscription = async () => {
    if (!selectedUser || !reason || !freezeDuration) return;

    try {
      // Находим активную подписку пользователя
      const { data: subscription, error: subError } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', selectedUser.id)
        .eq('status', 'active')
        .single();

      if (subError || !subscription) {
        toast.error('У пользователя нет активной подписки');
        return;
      }

      const freezeUntil = new Date();
      freezeUntil.setDate(freezeUntil.getDate() + parseInt(freezeDuration));

      const { error } = await supabase
        .from('subscriptions')
        .update({
          is_frozen: true,
          frozen_at: new Date().toISOString(),
          frozen_until: freezeUntil.toISOString(),
          freeze_reason: reason
        })
        .eq('id', subscription.id);

      if (error) throw error;

      setSelectedUser(null);
      setActionType(null);
      setReason("");
      setFreezeDuration("");
      toast.success('Подписка заморожена');
    } catch (error) {
      console.error('Error freezing subscription:', error);
      toast.error('Ошибка заморозки подписки');
    }
  };

  const filteredUsers = users.filter(user =>
    user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('ru-RU');
  };

  const getRoleBadge = (role: string) => {
    const roleMap = {
      admin: { label: 'Админ', color: 'bg-red-100 text-red-800' },
      partner: { label: 'Партнер', color: 'bg-blue-100 text-blue-800' },
      support: { label: 'Поддержка', color: 'bg-green-100 text-green-800' },
      user: { label: 'Пользователь', color: 'bg-gray-100 text-gray-800' }
    };
    
    const roleInfo = roleMap[role as keyof typeof roleMap] || roleMap.user;
    return (
      <Badge className={roleInfo.color}>
        {roleInfo.label}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="p-4">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Управление пользователями</h1>
        <div className="relative w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Поиск пользователей..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Список пользователей ({filteredUsers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Пользователь</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Роль</TableHead>
                <TableHead>Статус</TableHead>
                <TableHead>Дата регистрации</TableHead>
                <TableHead>Действия</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.profile_image || ""} />
                        <AvatarFallback>
                          {user.name ? user.name.substring(0, 2).toUpperCase() : 'ПО'}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{user.name || 'Без имени'}</span>
                    </div>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{getRoleBadge(user.role)}</TableCell>
                  <TableCell>
                    {user.is_blocked ? (
                      <Badge className="bg-red-100 text-red-800">Заблокирован</Badge>
                    ) : (
                      <Badge className="bg-green-100 text-green-800">Активен</Badge>
                    )}
                  </TableCell>
                  <TableCell>{formatDate(user.created_at)}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      {user.is_blocked ? (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleUnblockUser(user)}
                        >
                          <Unlock className="h-4 w-4 mr-1" />
                          Разблокировать
                        </Button>
                      ) : (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedUser(user);
                              setActionType("block");
                            }}
                          >
                            <Ban className="h-4 w-4 mr-1" />
                            Заблокировать
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedUser(user);
                              setActionType("freeze");
                            }}
                          >
                            <Calendar className="h-4 w-4 mr-1" />
                            Заморозить
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={!!actionType} onOpenChange={() => setActionType(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionType === "block" ? "Заблокировать пользователя" : "Заморозить подписку"}
            </DialogTitle>
            <DialogDescription>
              {actionType === "block" 
                ? "Пользователь не сможет войти в систему до разблокировки"
                : "Подписка будет приостановлена на указанный период"
              }
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {actionType === "freeze" && (
              <div>
                <label className="text-sm font-medium">Период заморозки (дней)</label>
                <Select value={freezeDuration} onValueChange={setFreezeDuration}>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите период" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7">7 дней</SelectItem>
                    <SelectItem value="14">14 дней</SelectItem>
                    <SelectItem value="30">30 дней</SelectItem>
                    <SelectItem value="90">90 дней</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
            
            <div>
              <label className="text-sm font-medium">Причина</label>
              <Textarea
                placeholder="Укажите причину..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setActionType(null)}>
              Отмена
            </Button>
            <Button
              onClick={actionType === "block" ? handleBlockUser : handleFreezeSubscription}
              disabled={!reason || (actionType === "freeze" && !freezeDuration)}
            >
              {actionType === "block" ? "Заблокировать" : "Заморозить"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminUsers;
