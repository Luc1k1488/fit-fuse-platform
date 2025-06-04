
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Plus, Users, TrendingUp, DollarSign } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Subscription {
  id: string;
  user_id: string;
  plan_name: string;
  status: string;
  start_date: string;
  end_date: string;
  price: number;
  created_at: string;
}

const AdminSubscriptions = () => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [users, setUsers] = useState<Record<string, any>>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [subscriptionsResponse, usersResponse] = await Promise.all([
        supabase.from('subscriptions').select('*').order('created_at', { ascending: false }),
        supabase.from('users').select('*')
      ]);

      if (subscriptionsResponse.error) throw subscriptionsResponse.error;
      if (usersResponse.error) throw usersResponse.error;

      setSubscriptions(subscriptionsResponse.data || []);
      
      const usersMap = (usersResponse.data || []).reduce((acc: Record<string, any>, user: any) => {
        acc[user.id] = user;
        return acc;
      }, {});
      
      setUsers(usersMap);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Ошибка загрузки данных');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (subscriptionId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('subscriptions')
        .update({ status: newStatus })
        .eq('id', subscriptionId);

      if (error) throw error;

      setSubscriptions(prev => 
        prev.map(sub => 
          sub.id === subscriptionId ? { ...sub, status: newStatus } : sub
        )
      );
      
      toast.success('Статус подписки обновлен');
    } catch (error) {
      console.error('Error updating subscription:', error);
      toast.error('Ошибка обновления статуса');
    }
  };

  const filteredSubscriptions = subscriptions.filter(subscription => {
    const user = users[subscription.user_id];
    
    const matchesSearch = 
      user?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user?.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      subscription.plan_name?.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesStatus = 
      filterStatus === "all" || subscription.status === filterStatus;
      
    return matchesSearch && matchesStatus;
  });

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('ru-RU', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    }).format(new Date(dateString));
  };

  // Статистика
  const totalRevenue = subscriptions.reduce((sum, sub) => sum + (sub.price || 0), 0);
  const activeSubscriptions = subscriptions.filter(sub => sub.status === 'active').length;
  const avgPrice = subscriptions.length > 0 ? totalRevenue / subscriptions.length : 0;

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
        <div>
          <h1 className="text-2xl font-bold">Управление подписками</h1>
          <p className="text-muted-foreground">Найдено подписок: {filteredSubscriptions.length}</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Создать план
        </Button>
      </div>

      {/* Статистика */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Всего подписок</p>
                <p className="text-2xl font-bold">{subscriptions.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Активные</p>
                <p className="text-2xl font-bold">{activeSubscriptions}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <DollarSign className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Общий доход</p>
                <p className="text-2xl font-bold">{totalRevenue.toLocaleString()} ₽</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <DollarSign className="h-8 w-8 text-amber-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Средний чек</p>
                <p className="text-2xl font-bold">{Math.round(avgPrice).toLocaleString()} ₽</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Фильтры */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input
            type="text"
            placeholder="Поиск по пользователям или планам..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Фильтр по статусу" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Все статусы</SelectItem>
            <SelectItem value="active">Активные</SelectItem>
            <SelectItem value="cancelled">Отмененные</SelectItem>
            <SelectItem value="expired">Истекшие</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Список подписок */}
      <Card>
        <CardHeader>
          <CardTitle>Подписки ({filteredSubscriptions.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredSubscriptions.map((subscription) => {
              const user = users[subscription.user_id];
              
              return (
                <div key={subscription.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <h3 className="font-medium">{user?.name || 'Пользователь'}</h3>
                    <p className="text-sm text-gray-500">{user?.email}</p>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="text-sm font-medium">{subscription.plan_name}</span>
                      <span className="text-sm text-gray-500">
                        {formatDate(subscription.start_date)} - {formatDate(subscription.end_date)}
                      </span>
                      <span className="text-sm font-medium">{subscription.price} ₽</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <Badge variant={subscription.status === 'active' ? 'default' : 'secondary'}>
                      {subscription.status === 'active' ? 'Активна' : 
                       subscription.status === 'cancelled' ? 'Отменена' : 
                       subscription.status === 'expired' ? 'Истекла' : subscription.status}
                    </Badge>
                    
                    <Select 
                      value={subscription.status} 
                      onValueChange={(value) => handleUpdateStatus(subscription.id, value)}
                    >
                      <SelectTrigger className="w-[120px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Активна</SelectItem>
                        <SelectItem value="cancelled">Отменена</SelectItem>
                        <SelectItem value="expired">Истекла</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              );
            })}
          </div>
          
          {filteredSubscriptions.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <p>Подписки не найдены</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSubscriptions;
