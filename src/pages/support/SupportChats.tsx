
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MessageCircle, User, Clock, Search } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { SupportChat } from "@/components/support/SupportChat";

interface SupportChatData {
  id: string;
  user_id: string;
  support_user_id: string | null;
  subject: string;
  status: string;
  priority: string;
  created_at: string;
  updated_at: string;
}

interface SupportMessage {
  id: string;
  chat_id: string;
  message: string;
  created_at: string;
  is_from_support: boolean;
}

const SupportChats = () => {
  const [chats, setChats] = useState<SupportChatData[]>([]);
  const [filteredChats, setFilteredChats] = useState<SupportChatData[]>([]);
  const [selectedChat, setSelectedChat] = useState<SupportChatData | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCurrentUser();
    fetchChats();
    subscribeToChats();
  }, []);

  useEffect(() => {
    filterChats();
  }, [chats, searchQuery, statusFilter]);

  const getCurrentUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setCurrentUserId(user.id);
      }
    } catch (error) {
      console.error('Error getting current user:', error);
    }
  };

  const fetchChats = async () => {
    try {
      const { data, error } = await supabase
        .from('support_chats')
        .select('*')
        .order('updated_at', { ascending: false });

      if (error) throw error;
      setChats(data || []);
    } catch (error) {
      console.error('Error fetching chats:', error);
      toast.error('Ошибка загрузки чатов');
    } finally {
      setLoading(false);
    }
  };

  const subscribeToChats = () => {
    const channel = supabase
      .channel('support_chats_updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'support_chats'
        },
        () => {
          fetchChats();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const filterChats = () => {
    let filtered = [...chats];

    if (searchQuery) {
      filtered = filtered.filter(chat =>
        chat.subject.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(chat => chat.status === statusFilter);
    }

    setFilteredChats(filtered);
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case "open":
        return <Badge className="bg-red-600">Открыт</Badge>;
      case "in_progress":
        return <Badge className="bg-yellow-600">В обработке</Badge>;
      case "closed":
        return <Badge variant="outline">Закрыт</Badge>;
      default:
        return <Badge variant="outline">Неизвестно</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch(priority) {
      case "urgent":
        return <Badge variant="destructive">Срочный</Badge>;
      case "high":
        return <Badge className="bg-orange-600">Высокий</Badge>;
      case "medium":
        return <Badge variant="secondary">Средний</Badge>;
      case "low":
        return <Badge variant="outline">Низкий</Badge>;
      default:
        return <Badge variant="outline">Неизвестно</Badge>;
    }
  };

  const assignToMe = async (chatId: string) => {
    if (!currentUserId) return;

    try {
      const { error } = await supabase
        .from('support_chats')
        .update({ 
          support_user_id: currentUserId,
          status: 'in_progress',
          updated_at: new Date().toISOString()
        })
        .eq('id', chatId);

      if (error) throw error;
      toast.success('Чат назначен на вас');
      fetchChats();
    } catch (error) {
      console.error('Error assigning chat:', error);
      toast.error('Ошибка назначения чата');
    }
  };

  const closeChat = async (chatId: string) => {
    try {
      const { error } = await supabase
        .from('support_chats')
        .update({ 
          status: 'closed',
          updated_at: new Date().toISOString()
        })
        .eq('id', chatId);

      if (error) throw error;
      toast.success('Чат закрыт');
      fetchChats();
    } catch (error) {
      console.error('Error closing chat:', error);
      toast.error('Ошибка закрытия чата');
    }
  };

  if (!currentUserId) {
    return (
      <div className="space-y-6">
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-6 text-center">
            <p className="text-white">Необходимо войти в систему</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Чаты поддержки</h1>
        <p className="text-gray-400">Активные чаты с пользователями</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Список чатов */}
        <div className="lg:col-span-1 space-y-4">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-white">Фильтры</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Поиск по теме..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 bg-gray-700 border-gray-600 text-white"
                />
              </div>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue placeholder="Статус" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Все статусы</SelectItem>
                  <SelectItem value="open">Открытые</SelectItem>
                  <SelectItem value="in_progress">В обработке</SelectItem>
                  <SelectItem value="closed">Закрытые</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-white">Чаты ({filteredChats.length})</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {loading ? (
                <div className="p-4 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500 mx-auto"></div>
                </div>
              ) : filteredChats.length === 0 ? (
                <div className="p-4 text-center text-gray-400">
                  Нет чатов для отображения
                </div>
              ) : (
                <div className="divide-y divide-gray-700">
                  {filteredChats.map(chat => (
                    <div 
                      key={chat.id} 
                      className={`p-4 cursor-pointer hover:bg-gray-700 transition-colors ${
                        selectedChat?.id === chat.id ? 'bg-gray-700' : ''
                      }`}
                      onClick={() => setSelectedChat(chat)}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-white font-medium truncate">{chat.subject}</h3>
                        {getStatusBadge(chat.status)}
                      </div>
                      
                      <div className="flex justify-between items-center mb-2">
                        {getPriorityBadge(chat.priority)}
                        <span className="text-gray-400 text-sm">
                          {format(new Date(chat.updated_at), "d MMM HH:mm", { locale: ru })}
                        </span>
                      </div>

                      <div className="flex gap-2">
                        {chat.status === 'open' && (
                          <Button 
                            size="sm" 
                            onClick={(e) => {
                              e.stopPropagation();
                              assignToMe(chat.id);
                            }}
                          >
                            Взять в работу
                          </Button>
                        )}
                        {chat.status !== 'closed' && (
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation();
                              closeChat(chat.id);
                            }}
                          >
                            Закрыть
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Активный чат */}
        <div className="lg:col-span-2">
          {selectedChat ? (
            <SupportChat
              chatId={selectedChat.id}
              currentUserId={currentUserId}
              onClose={() => setSelectedChat(null)}
            />
          ) : (
            <Card className="bg-gray-800 border-gray-700 h-[600px] flex items-center justify-center">
              <div className="text-center p-6">
                <MessageCircle className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-white mb-2">Выберите чат</h3>
                <p className="text-gray-400 max-w-md">
                  Выберите чат из списка слева, чтобы начать общение с пользователем
                </p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default SupportChats;
