
import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MessageCircle, Send, User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { format } from "date-fns";
import { ru } from "date-fns/locale";

interface SupportMessage {
  id: string;
  chat_id: string;
  sender_id: string;
  message: string;
  is_from_support: boolean;
  created_at: string;
}

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

interface SupportChatProps {
  chatId: string;
  currentUserId: string;
  onClose?: () => void;
}

export const SupportChat: React.FC<SupportChatProps> = ({
  chatId,
  currentUserId,
  onClose
}) => {
  const [messages, setMessages] = useState<SupportMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [chat, setChat] = useState<SupportChat | null>(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchChatAndMessages();
    subscribeToMessages();
  }, [chatId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchChatAndMessages = async () => {
    try {
      // Получаем информацию о чате
      const { data: chatData, error: chatError } = await supabase
        .from('support_chats')
        .select('*')
        .eq('id', chatId)
        .single();

      if (chatError) throw chatError;
      setChat(chatData);

      // Получаем сообщения
      const { data: messagesData, error: messagesError } = await supabase
        .from('support_messages')
        .select('*')
        .eq('chat_id', chatId)
        .order('created_at', { ascending: true });

      if (messagesError) throw messagesError;
      setMessages(messagesData || []);
    } catch (error) {
      console.error('Error fetching chat:', error);
      toast.error('Ошибка загрузки чата');
    } finally {
      setLoading(false);
    }
  };

  const subscribeToMessages = () => {
    const channel = supabase
      .channel(`support_chat_${chatId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'support_messages',
          filter: `chat_id=eq.${chatId}`
        },
        (payload) => {
          setMessages(prev => [...prev, payload.new as SupportMessage]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || sending) return;

    setSending(true);
    try {
      const { error } = await supabase
        .from('support_messages')
        .insert({
          chat_id: chatId,
          sender_id: currentUserId,
          message: newMessage.trim(),
          is_from_support: false
        });

      if (error) throw error;
      setNewMessage("");

      // Обновляем статус чата на "in_progress" если он был "open"
      if (chat?.status === 'open') {
        await supabase
          .from('support_chats')
          .update({ 
            status: 'in_progress',
            updated_at: new Date().toISOString()
          })
          .eq('id', chatId);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Ошибка отправки сообщения');
    } finally {
      setSending(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
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

  if (loading) {
    return (
      <Card className="h-[600px] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
      </Card>
    );
  }

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader className="pb-3 border-b">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              {chat?.subject}
            </CardTitle>
            <div className="flex items-center gap-2 mt-1">
              {chat && getStatusBadge(chat.status)}
              <span className="text-sm text-gray-500">
                Создан: {chat && format(new Date(chat.created_at), "d MMM yyyy HH:mm", { locale: ru })}
              </span>
            </div>
          </div>
          {onClose && (
            <Button variant="outline" size="sm" onClick={onClose}>
              Закрыть
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0">
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender_id === currentUserId ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[80%] ${
                  message.sender_id === currentUserId ? 'order-2' : 'order-1'
                }`}>
                  <div className={`flex items-start gap-2 ${
                    message.sender_id === currentUserId ? 'flex-row-reverse' : 'flex-row'
                  }`}>
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>
                        {message.is_from_support ? 'S' : <User className="h-4 w-4" />}
                      </AvatarFallback>
                    </Avatar>
                    <div className={`p-3 rounded-lg ${
                      message.sender_id === currentUserId
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-800'
                    }`}>
                      <p className="text-sm">{message.message}</p>
                      <p className={`text-xs mt-1 ${
                        message.sender_id === currentUserId
                          ? 'text-purple-100'
                          : 'text-gray-500 dark:text-gray-400'
                      }`}>
                        {format(new Date(message.created_at), "HH:mm")}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        <div className="p-4 border-t">
          <div className="flex gap-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Введите сообщение..."
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              disabled={chat?.status === 'closed' || sending}
            />
            <Button 
              onClick={sendMessage}
              disabled={!newMessage.trim() || chat?.status === 'closed' || sending}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          {chat?.status === 'closed' && (
            <p className="text-sm text-gray-500 mt-2">
              Этот чат закрыт для новых сообщений
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
