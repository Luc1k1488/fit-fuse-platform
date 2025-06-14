
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { format } from "date-fns";
import { ru } from "date-fns/locale";

interface SupportChat {
  id: string;
  user_id: string;
  support_user_id: string | null;
  subject: string;
  status: string;
  priority: string;
  created_at: string;
  updated_at: string;
}

interface SupportChatListProps {
  currentUserId: string;
  onSelectChat: (chatId: string) => void;
  onCreateChat: () => void;
  selectedChatId?: string;
}

export const SupportChatList: React.FC<SupportChatListProps> = ({
  currentUserId,
  onSelectChat,
  onCreateChat,
  selectedChatId
}) => {
  const [chats, setChats] = useState<SupportChat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchChats();
    subscribeToChats();
  }, []);

  const fetchChats = async () => {
    try {
      const { data, error } = await supabase
        .from('support_chats')
        .select('*')
        .eq('user_id', currentUserId)
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
      .channel('support_chats_list')
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

  const getStatusBadge = (status: string) => {
    switch(status) {
      case "open":
        return <Badge variant="default">Открыт</Badge>;
      case "in_progress":
        return <Badge variant="secondary">В обработке</Badge>;
      case "closed":
        return <Badge variant="outline">Закрыт</Badge>;
      default:
        return <Badge variant="outline">Неизвестно</Badge>;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch(priority) {
      case "urgent":
        return "text-red-600";
      case "high":
        return "text-orange-600";
      case "medium":
        return "text-yellow-600";
      case "low":
        return "text-green-600";
      default:
        return "text-gray-600";
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500 mx-auto"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            Мои обращения
          </CardTitle>
          <Button onClick={onCreateChat} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Создать
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        {chats.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            <MessageCircle className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <p>У вас пока нет обращений в поддержку</p>
            <Button onClick={onCreateChat} className="mt-4" variant="outline">
              Создать первое обращение
            </Button>
          </div>
        ) : (
          <div className="divide-y">
            {chats.map((chat) => (
              <div
                key={chat.id}
                className={`p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${
                  selectedChatId === chat.id ? 'bg-gray-50 dark:bg-gray-800' : ''
                }`}
                onClick={() => onSelectChat(chat.id)}
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium truncate">{chat.subject}</h3>
                  {getStatusBadge(chat.status)}
                </div>
                
                <div className="flex justify-between items-center text-sm">
                  <span className={`font-medium ${getPriorityColor(chat.priority)}`}>
                    Приоритет: {chat.priority}
                  </span>
                  <span className="text-gray-500">
                    {format(new Date(chat.updated_at), "d MMM HH:mm", { locale: ru })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
