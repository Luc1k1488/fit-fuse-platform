
import { useState, useEffect } from "react";
import { Send, HelpCircle, LifeBuoy, MessageCircle, CreditCard, Phone, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/auth_context";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const ClientSupport = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [message, setMessage] = useState("");
  const [subject, setSubject] = useState("");
  const [tickets, setTickets] = useState<any[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [chats, setChats] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    if (user) {
      fetchTickets();
    }
  }, [user]);

  const fetchTickets = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('support_tickets')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTickets(data || []);
    } catch (error) {
      console.error('Error fetching tickets:', error);
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: "Не удалось загрузить обращения",
      });
    }
  };

  const fetchChatMessages = async (ticketId: string) => {
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('ticket_id', ticketId)
        .order('sent_at', { ascending: true });

      if (error) throw error;
      setChats(data || []);
    } catch (error) {
      console.error('Error fetching chat messages:', error);
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: "Не удалось загрузить сообщения",
      });
    }
  };

  const handleSelectTicket = async (ticket: any) => {
    setSelectedTicket(ticket);
    await fetchChatMessages(ticket.id);
  };

  const handleCreateTicket = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return;

    if (!subject) {
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: "Укажите тему обращения",
      });
      return;
    }

    if (!message) {
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: "Введите ваше сообщение",
      });
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('support_tickets')
        .insert([
          { 
            user_id: user.id,
            subject,
            message,
            status: 'open'
          }
        ])
        .select();

      if (error) throw error;
      
      toast({
        title: "Обращение создано",
        description: "Мы ответим вам в ближайшее время",
      });
      
      setSubject("");
      setMessage("");
      await fetchTickets();
    } catch (error) {
      console.error('Error creating ticket:', error);
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: "Не удалось создать обращение",
      });
    } finally {
      setLoading(false);
    }
  };

  const sendChatMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedTicket || !newMessage) return;

    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .insert([
          {
            ticket_id: selectedTicket.id,
            sender_id: user?.id,
            message: newMessage
          }
        ]);

      if (error) throw error;
      
      setNewMessage("");
      await fetchChatMessages(selectedTicket.id);
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: "Не удалось отправить сообщение",
      });
    }
  };

  const supportArticles = [
    {
      id: 1,
      title: "Как забронировать тренировку?",
      icon: HelpCircle
    },
    {
      id: 2,
      title: "Как отменить бронирование?",
      icon: HelpCircle
    },
    {
      id: 3,
      title: "Вопросы по подписке",
      icon: CreditCard
    },
    {
      id: 4,
      title: "Проблемы с входом в аккаунт",
      icon: HelpCircle
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 pb-16">
      {/* Header */}
      <div className="bg-slate-900/50 backdrop-blur-sm border-b border-slate-700 px-4 py-6">
        <h1 className="text-2xl font-bold text-white mb-2">Поддержка</h1>
        <p className="text-slate-300">Помощь по работе с приложением</p>
      </div>

      <div className="px-4 py-6 space-y-6">
        <Tabs defaultValue="help" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-slate-800/50 backdrop-blur-sm border-slate-700">
            <TabsTrigger 
              value="help"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-blue-600 text-white"
            >
              Помощь
            </TabsTrigger>
            <TabsTrigger 
              value="contact"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-blue-600 text-white"
            >
              Обращение
            </TabsTrigger>
            <TabsTrigger 
              value="tickets"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-blue-600 text-white"
            >
              Мои обращения
            </TabsTrigger>
          </TabsList>

          <TabsContent value="help" className="space-y-6 mt-6">
            <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Часто задаваемые вопросы</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {supportArticles.map((article) => {
                  const Icon = article.icon;
                  return (
                    <button
                      key={article.id}
                      className="w-full bg-slate-700/30 rounded-lg p-4 text-left hover:bg-slate-700/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="h-5 w-5 text-purple-400" />
                        <span className="text-white">{article.title}</span>
                      </div>
                    </button>
                  );
                })}
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Контактная информация</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-purple-400" />
                  <div>
                    <p className="text-white">Телефон поддержки</p>
                    <p className="text-slate-400">+7 (800) 123-45-67</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-purple-400" />
                  <div>
                    <p className="text-white">Email</p>
                    <p className="text-slate-400">support@goodfit.ru</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <MessageCircle className="h-5 w-5 text-purple-400" />
                  <div>
                    <p className="text-white">Чат в WhatsApp</p>
                    <Button variant="link" className="p-0 h-auto text-purple-400">
                      Начать чат
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="contact" className="space-y-6 mt-6">
            <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Новое обращение</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreateTicket} className="space-y-4">
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-slate-300 mb-1">
                      Тема обращения
                    </label>
                    <Input
                      id="subject"
                      placeholder="Укажите тему обращения"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="bg-slate-700/50 border-slate-600 placeholder:text-slate-400 text-white"
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-slate-300 mb-1">
                      Сообщение
                    </label>
                    <Textarea
                      id="message"
                      placeholder="Опишите вашу проблему или вопрос"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      rows={5}
                      className="bg-slate-700/50 border-slate-600 placeholder:text-slate-400 text-white"
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-purple-600 hover:bg-purple-700"
                    disabled={loading}
                  >
                    <LifeBuoy className="h-4 w-4 mr-2" />
                    {loading ? "Отправка..." : "Отправить обращение"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tickets" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700 md:col-span-1">
                <CardHeader>
                  <CardTitle className="text-white">Мои обращения</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {tickets.length === 0 ? (
                    <p className="text-slate-400 text-center py-4">
                      У вас пока нет обращений
                    </p>
                  ) : (
                    tickets.map((ticket) => (
                      <button
                        key={ticket.id}
                        onClick={() => handleSelectTicket(ticket)}
                        className={`w-full rounded-lg p-3 text-left ${
                          selectedTicket?.id === ticket.id
                            ? 'bg-purple-600/30 border border-purple-600/50'
                            : 'bg-slate-700/30 hover:bg-slate-700/50'
                        } transition-colors`}
                      >
                        <div className="flex justify-between items-start mb-1">
                          <h3 className="text-white font-medium line-clamp-1">
                            {ticket.subject}
                          </h3>
                          <span className={`px-2 py-0.5 rounded text-xs ${
                            ticket.status === 'open' ? 'bg-green-600/30 text-green-300' :
                            ticket.status === 'closed' ? 'bg-red-600/30 text-red-300' :
                            'bg-yellow-600/30 text-yellow-300'
                          }`}>
                            {ticket.status === 'open' ? 'Открыто' :
                             ticket.status === 'closed' ? 'Закрыто' : 'В работе'}
                          </span>
                        </div>
                        <p className="text-slate-400 text-sm line-clamp-1">
                          {ticket.message}
                        </p>
                        <p className="text-slate-500 text-xs mt-1">
                          {new Date(ticket.created_at).toLocaleDateString()}
                        </p>
                      </button>
                    ))
                  )}
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700 md:col-span-2">
                <CardHeader>
                  <CardTitle className="text-white">
                    {selectedTicket ? selectedTicket.subject : 'Переписка'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {!selectedTicket ? (
                    <div className="text-center py-8">
                      <MessageCircle className="h-12 w-12 mx-auto text-slate-400 mb-4" />
                      <p className="text-slate-400 mb-2">
                        Выберите обращение, чтобы просмотреть переписку
                      </p>
                    </div>
                  ) : (
                    <div className="flex flex-col h-[400px]">
                      <div className="flex-1 overflow-y-auto mb-4 space-y-3">
                        <div key="initial" className="bg-slate-700/30 rounded-lg p-3">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-white font-medium">Вы</span>
                            <span className="text-slate-500 text-xs">
                              {new Date(selectedTicket.created_at).toLocaleString()}
                            </span>
                          </div>
                          <p className="text-slate-300">{selectedTicket.message}</p>
                        </div>

                        {chats.map((chat) => (
                          <div
                            key={chat.id}
                            className={`rounded-lg p-3 ${
                              chat.sender_id === user?.id
                                ? 'bg-purple-600/20 ml-8'
                                : 'bg-slate-700/30 mr-8'
                            }`}
                          >
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-white font-medium">
                                {chat.sender_id === user?.id ? 'Вы' : 'Поддержка'}
                              </span>
                              <span className="text-slate-500 text-xs">
                                {new Date(chat.sent_at).toLocaleString()}
                              </span>
                            </div>
                            <p className="text-slate-300">{chat.message}</p>
                          </div>
                        ))}
                      </div>

                      <form onSubmit={sendChatMessage} className="flex gap-2">
                        <Input
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          placeholder="Напишите сообщение..."
                          disabled={selectedTicket?.status === 'closed'}
                          className="bg-slate-700/50 border-slate-600 placeholder:text-slate-400 text-white"
                        />
                        <Button
                          type="submit"
                          disabled={!newMessage || selectedTicket?.status === 'closed'}
                          className="bg-purple-600 hover:bg-purple-700"
                        >
                          <Send className="h-4 w-4" />
                        </Button>
                      </form>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ClientSupport;
