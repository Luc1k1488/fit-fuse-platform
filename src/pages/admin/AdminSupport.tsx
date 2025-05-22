
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SupportTicket } from "@/types";
import { MessageSquare, Search, User, BookOpen, Check } from "lucide-react";

const AdminSupport = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [activeTicket, setActiveTicket] = useState<SupportTicket | null>(null);
  
  // Mock data for support tickets
  const tickets: SupportTicket[] = [
    {
      id: "ticket-1",
      user_id: "user-1",
      created_at: "2023-07-18T14:32:00Z",
      status: "open",
      subject: "Проблема с отменой бронирования",
      message: "Я не могу отменить бронирование тренировки. Система выдает ошибку при попытке отмены.",
      assigned_support_id: null,
      resolved_at: null
    },
    {
      id: "ticket-2",
      user_id: "user-2",
      created_at: "2023-07-17T09:15:00Z",
      status: "in_progress",
      subject: "Вопрос по абонементу Премиум",
      message: "Здравствуйте! Хотел уточнить, входят ли групповые тренировки в абонемент Премиум?",
      assigned_support_id: "support-1",
      resolved_at: null
    },
    {
      id: "ticket-3",
      user_id: "user-3",
      created_at: "2023-07-16T12:48:00Z",
      status: "resolved",
      subject: "Не могу оплатить абонемент",
      message: "При оплате абонемента возникает ошибка. Пробовал разные карты, но проблема осталась.",
      assigned_support_id: "support-2",
      resolved_at: "2023-07-17T10:22:00Z"
    },
    {
      id: "ticket-4",
      user_id: "user-4",
      created_at: "2023-07-15T16:07:00Z",
      status: "closed",
      subject: "Как заморозить абонемент?",
      message: "Подскажите, как я могу заморозить свой абонемент на время отпуска?",
      assigned_support_id: "support-1",
      resolved_at: "2023-07-16T11:30:00Z"
    },
    {
      id: "ticket-5",
      user_id: "user-5",
      created_at: "2023-07-19T10:22:00Z",
      status: "open",
      subject: "Не работает мобильное приложение",
      message: "После обновления не могу войти в мобильное приложение. Выдает ошибку аутентификации.",
      assigned_support_id: null,
      resolved_at: null
    }
  ];
  
  // Filtered tickets based on search and status filter
  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = 
      ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.message.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesStatus = 
      filterStatus === "all" || ticket.status === filterStatus;
      
    return matchesSearch && matchesStatus;
  });
  
  const handleSelectTicket = (ticket: SupportTicket) => {
    setActiveTicket(ticket);
  };
  
  // User details for the chat view (mock data)
  const userDetails = {
    name: "Алексей Петров",
    email: "alexey.petrov@example.com",
    avatar: null
  };
  
  // Mock chat messages
  const chatMessages = [
    {
      id: "msg-1",
      content: "Я не могу отменить бронирование тренировки. Система выдает ошибку при попытке отмены.",
      sender: "user",
      timestamp: "14:32"
    },
    {
      id: "msg-2",
      content: "Здравствуйте! Спасибо за обращение. Подскажите, пожалуйста, на какую дату у вас забронирована тренировка?",
      sender: "support",
      timestamp: "14:45"
    },
    {
      id: "msg-3",
      content: "Тренировка забронирована на завтра, 15:00, в зале 'ФитнесПлюс'.",
      sender: "user",
      timestamp: "14:50"
    }
  ];
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('ru-RU', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };
  
  const getStatusBadge = (status: string) => {
    switch(status) {
      case "open":
        return <Badge variant="default">Открыт</Badge>;
      case "in_progress":
        return <Badge variant="secondary">В обработке</Badge>;
      case "resolved":
        return <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">Решен</Badge>;
      case "closed":
        return <Badge variant="outline">Закрыт</Badge>;
      default:
        return <Badge variant="outline">Неизвестно</Badge>;
    }
  };
  
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Управление поддержкой</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tickets List */}
        <div className="lg:col-span-1 space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Обращения клиентов</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex gap-2">
                  <div className="flex-1 relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Поиск обращений..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Статус" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Все</SelectItem>
                      <SelectItem value="open">Открытые</SelectItem>
                      <SelectItem value="in_progress">В обработке</SelectItem>
                      <SelectItem value="resolved">Решенные</SelectItem>
                      <SelectItem value="closed">Закрытые</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="border rounded-md overflow-hidden">
                  <div className="divide-y">
                    {filteredTickets.length > 0 ? (
                      filteredTickets.map(ticket => (
                        <div 
                          key={ticket.id} 
                          className={`p-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 ${activeTicket?.id === ticket.id ? 'bg-gray-100 dark:bg-gray-800' : ''}`}
                          onClick={() => handleSelectTicket(ticket)}
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex-1 min-w-0">
                              <p className="font-medium truncate">{ticket.subject}</p>
                              <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{ticket.message}</p>
                            </div>
                            <div className="ml-3">
                              {getStatusBadge(ticket.status)}
                            </div>
                          </div>
                          <div className="flex justify-between items-center mt-2">
                            <span className="text-xs text-gray-500">
                              {formatDate(ticket.created_at)}
                            </span>
                            <span className="text-xs font-medium">
                              ID: {ticket.id.slice(-4)}
                            </span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-4 text-center text-gray-500">
                        Нет обращений, соответствующих фильтрам
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Статистика обращений</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <p className="text-sm text-green-600 dark:text-green-400">Решено сегодня</p>
                  <p className="text-2xl font-bold text-green-700 dark:text-green-300">8</p>
                </div>
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <p className="text-sm text-blue-600 dark:text-blue-400">Новые сегодня</p>
                  <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">12</p>
                </div>
                <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                  <p className="text-sm text-amber-600 dark:text-amber-400">В обработке</p>
                  <p className="text-2xl font-bold text-amber-700 dark:text-amber-300">15</p>
                </div>
                <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <p className="text-sm text-purple-600 dark:text-purple-400">Среднее время</p>
                  <p className="text-2xl font-bold text-purple-700 dark:text-purple-300">3.2ч</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Ticket Details & Chat */}
        <div className="lg:col-span-2">
          {activeTicket ? (
            <Card className="h-[80vh] flex flex-col">
              <CardHeader className="pb-2 border-b">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{activeTicket.subject}</CardTitle>
                    <div className="flex items-center space-x-2 mt-1">
                      {getStatusBadge(activeTicket.status)}
                      <span className="text-sm text-gray-500">
                        Создано: {formatDate(activeTicket.created_at)}
                      </span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline">Назначить</Button>
                    <Button size="sm" variant="outline">Закрыть</Button>
                    <Button size="sm" variant="default">Решено</Button>
                  </div>
                </div>
              </CardHeader>
              
              <Tabs defaultValue="chat" className="flex-1 flex flex-col">
                <TabsList className="px-6 pt-2">
                  <TabsTrigger value="chat">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Чат
                  </TabsTrigger>
                  <TabsTrigger value="user">
                    <User className="h-4 w-4 mr-2" />
                    Пользователь
                  </TabsTrigger>
                  <TabsTrigger value="history">
                    <BookOpen className="h-4 w-4 mr-2" />
                    История
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="chat" className="flex-1 flex flex-col px-6 pb-4 space-y-4 overflow-hidden">
                  <div className="flex-1 overflow-y-auto space-y-4 py-4">
                    {chatMessages.map((message) => (
                      <div key={message.id} className={`flex ${message.sender === "user" ? "justify-start" : "justify-end"}`}>
                        <div className={`max-w-[80%] p-3 rounded-lg ${
                          message.sender === "user" 
                            ? "bg-gray-100 dark:bg-gray-800" 
                            : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100"
                        }`}>
                          <p>{message.content}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 text-right mt-1">
                            {message.timestamp}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Input placeholder="Введите сообщение..." className="flex-1" />
                    <Button>Отправить</Button>
                  </div>
                </TabsContent>
                
                <TabsContent value="user" className="px-6 py-4">
                  <div className="flex items-center space-x-4 mb-6">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={userDetails.avatar || ""} />
                      <AvatarFallback>АП</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-lg font-semibold">{userDetails.name}</h3>
                      <p className="text-gray-500">{userDetails.email}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-1">Информация о пользователе</h4>
                      <Card>
                        <CardContent className="p-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm text-gray-500">Дата регистрации</p>
                              <p>15 марта 2023</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Абонемент</p>
                              <p>Премиум (активен)</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Бронирований</p>
                              <p>27</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Последний вход</p>
                              <p>Сегодня, 12:45</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-1">История обращений</h4>
                      <Card>
                        <CardContent className="p-0">
                          <div className="divide-y">
                            <div className="p-3">
                              <div className="flex justify-between items-start">
                                <div>
                                  <p className="font-medium">Проблема с оплатой</p>
                                  <p className="text-sm text-gray-500">10 июня 2023</p>
                                </div>
                                <Badge variant="outline" className="bg-green-100 text-green-800">Решено</Badge>
                              </div>
                            </div>
                            <div className="p-3">
                              <div className="flex justify-between items-start">
                                <div>
                                  <p className="font-medium">Вопрос по расписанию</p>
                                  <p className="text-sm text-gray-500">23 мая 2023</p>
                                </div>
                                <Badge variant="outline">Закрыт</Badge>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="history" className="px-6 py-4">
                  <div className="space-y-4">
                    <Card>
                      <CardContent className="p-0">
                        <div className="divide-y">
                          {[1, 2, 3].map((i) => (
                            <div key={i} className="p-4">
                              <div className="flex items-start">
                                <div className="mr-3 bg-blue-100 dark:bg-blue-900/30 p-2 rounded-full">
                                  <Check className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                </div>
                                <div>
                                  <p className="font-medium">
                                    Иван Смирнов взял обращение в работу
                                  </p>
                                  <p className="text-sm text-gray-500 mt-1">
                                    18 июля 2023, 14:45
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              </Tabs>
            </Card>
          ) : (
            <Card className="h-[80vh] flex items-center justify-center">
              <div className="text-center p-6">
                <MessageSquare className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium mb-2">Выберите обращение</h3>
                <p className="text-gray-500 max-w-md">
                  Выберите обращение из списка слева, чтобы просмотреть детали и ответить клиенту
                </p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminSupport;
