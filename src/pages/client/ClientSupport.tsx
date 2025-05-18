
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, PhoneCall, Mail, Clock, Check, AlertCircle } from "lucide-react";
import { toast } from "sonner";

// Тестовые данные для обращений
const ticketsData = [
  {
    id: "ticket-1",
    subject: "Проблема с отменой бронирования",
    message: "Не могу отменить бронирование занятия на завтра. При нажатии на кнопку ничего не происходит.",
    status: "open",
    createdAt: "2023-06-10T14:32:00",
    replies: [
      {
        id: "reply-1",
        message: "Здравствуйте! Мы проверили вашу проблему. Попробуйте обновить приложение до последней версии и повторить попытку.",
        isAdmin: true,
        createdAt: "2023-06-10T16:15:00"
      }
    ]
  },
  {
    id: "ticket-2",
    subject: "Вопрос по подписке",
    message: "Хочу узнать, возможно ли приостановить подписку на время отпуска? Планирую уехать на 2 недели и не смогу посещать залы.",
    status: "closed",
    createdAt: "2023-05-25T09:48:00",
    replies: [
      {
        id: "reply-2",
        message: "Здравствуйте! Да, вы можете заморозить подписку на срок до 14 дней. Для этого перейдите в раздел 'Подписка' и нажмите 'Приостановить подписку'.",
        isAdmin: true,
        createdAt: "2023-05-25T11:23:00"
      },
      {
        id: "reply-3",
        message: "Спасибо за информацию! Нашел эту опцию и активировал заморозку.",
        isAdmin: false,
        createdAt: "2023-05-25T12:15:00"
      },
      {
        id: "reply-4",
        message: "Отлично! Рады помочь. Если возникнут ещё вопросы, обращайтесь.",
        isAdmin: true,
        createdAt: "2023-05-25T12:30:00"
      }
    ]
  }
];

// Форматирование даты и времени
const formatDateTime = (dateTimeString: string) => {
  const options: Intl.DateTimeFormatOptions = { 
    day: 'numeric', 
    month: 'short', 
    hour: '2-digit', 
    minute: '2-digit' 
  };
  return new Date(dateTimeString).toLocaleDateString('ru-RU', options);
};

const ClientSupport = () => {
  const [activeTab, setActiveTab] = useState("tickets");
  const [selectedTicket, setSelectedTicket] = useState<string | null>(null);
  const [newTicketForm, setNewTicketForm] = useState({
    subject: "",
    message: ""
  });
  const [replyText, setReplyText] = useState("");
  
  // Обработчик создания нового обращения
  const handleNewTicket = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // В реальном приложении здесь был бы запрос к API
    toast.success("Обращение отправлено! Мы ответим вам в ближайшее время.");
    setNewTicketForm({ subject: "", message: "" });
    setActiveTab("tickets");
  };
  
  // Обработчик отправки ответа на обращение
  const handleReply = (ticketId: string) => {
    if (!replyText.trim()) return;
    
    // В реальном приложении здесь был бы запрос к API
    toast.success("Ответ отправлен!");
    setReplyText("");
  };
  
  // Отображение выбранного обращения
  const selectedTicketData = selectedTicket 
    ? ticketsData.find(ticket => ticket.id === selectedTicket) 
    : null;
  
  return (
    <div className="pb-16">
      <h1 className="text-2xl font-bold mb-4">Поддержка</h1>
      
      <Tabs defaultValue="tickets" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full grid grid-cols-3 mb-6">
          <TabsTrigger value="tickets">Обращения</TabsTrigger>
          <TabsTrigger value="new-ticket">Новое обращение</TabsTrigger>
          <TabsTrigger value="contacts">Контакты</TabsTrigger>
        </TabsList>
        
        {/* Список обращений */}
        <TabsContent value="tickets">
          {selectedTicket ? (
            <div>
              <Button 
                variant="ghost" 
                className="mb-4" 
                onClick={() => setSelectedTicket(null)}
              >
                ← Назад к списку
              </Button>
              
              {selectedTicketData && (
                <div>
                  <Card className="mb-4">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h2 className="font-medium">{selectedTicketData.subject}</h2>
                          <div className="flex items-center text-xs text-gray-500 mt-1">
                            <Clock className="h-3 w-3 mr-1" />
                            {formatDateTime(selectedTicketData.createdAt)}
                          </div>
                        </div>
                        <div>
                          {selectedTicketData.status === "open" ? (
                            <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                              В работе
                            </Badge>
                          ) : (
                            <Badge className="bg-green-100 text-green-800 border-green-200">
                              Решено
                            </Badge>
                          )}
                        </div>
                      </div>
                      <p className="mt-3 text-gray-700">{selectedTicketData.message}</p>
                    </CardContent>
                  </Card>
                  
                  <div className="space-y-4 mb-4">
                    {selectedTicketData.replies.map(reply => (
                      <div 
                        key={reply.id} 
                        className={`flex ${reply.isAdmin ? 'justify-start' : 'justify-end'}`}
                      >
                        <div 
                          className={`max-w-[80%] p-3 rounded-lg ${
                            reply.isAdmin 
                              ? 'bg-gray-100 text-gray-800' 
                              : 'bg-primary text-white'
                          }`}
                        >
                          <p className="text-sm">{reply.message}</p>
                          <div className="flex justify-end mt-1">
                            <span className="text-xs opacity-70">
                              {formatDateTime(reply.createdAt)}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {selectedTicketData.status === "open" && (
                    <div className="flex space-x-2">
                      <Textarea 
                        placeholder="Напишите ответ..." 
                        value={replyText} 
                        onChange={(e) => setReplyText(e.target.value)}
                        className="flex-grow"
                      />
                      <Button 
                        onClick={() => handleReply(selectedTicketData.id)} 
                        disabled={!replyText.trim()}
                      >
                        Отправить
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {ticketsData.length > 0 ? (
                ticketsData.map(ticket => (
                  <Card key={ticket.id} className="cursor-pointer" onClick={() => setSelectedTicket(ticket.id)}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">{ticket.subject}</h3>
                          <div className="flex items-center text-xs text-gray-500 mt-1">
                            <Clock className="h-3 w-3 mr-1" />
                            {formatDateTime(ticket.createdAt)}
                          </div>
                        </div>
                        <div>
                          {ticket.status === "open" ? (
                            <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                              В работе
                            </Badge>
                          ) : (
                            <Badge className="bg-green-100 text-green-800 border-green-200">
                              Решено
                            </Badge>
                          )}
                        </div>
                      </div>
                      <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                        {ticket.message}
                      </p>
                      <div className="flex justify-between items-center mt-3">
                        <span className="text-xs text-gray-500">
                          {ticket.replies.length} {ticket.replies.length === 1 ? "ответ" : "ответа"}
                        </span>
                        <Button size="sm" variant="ghost">
                          Просмотреть
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center py-12 bg-white rounded-lg">
                  <MessageSquare className="h-12 w-12 mx-auto text-gray-300" />
                  <p className="mt-2 text-gray-500">У вас нет обращений в службу поддержки</p>
                  <Button 
                    className="mt-4" 
                    onClick={() => setActiveTab("new-ticket")}
                  >
                    Создать обращение
                  </Button>
                </div>
              )}
            </div>
          )}
        </TabsContent>
        
        {/* Создание нового обращения */}
        <TabsContent value="new-ticket">
          <Card>
            <CardContent className="p-6">
              <form onSubmit={handleNewTicket}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1" htmlFor="subject">
                      Тема обращения
                    </label>
                    <Input 
                      id="subject" 
                      value={newTicketForm.subject} 
                      onChange={(e) => setNewTicketForm(prev => ({ ...prev, subject: e.target.value }))}
                      placeholder="Кратко опишите проблему"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1" htmlFor="message">
                      Описание
                    </label>
                    <Textarea 
                      id="message" 
                      value={newTicketForm.message} 
                      onChange={(e) => setNewTicketForm(prev => ({ ...prev, message: e.target.value }))}
                      placeholder="Опишите вашу проблему подробно..."
                      rows={5}
                      required
                    />
                  </div>
                  
                  <Button type="submit" className="w-full">
                    Отправить обращение
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Контакты поддержки */}
        <TabsContent value="contacts">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-lg font-medium mb-4">Как с нами связаться</h2>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="bg-primary/10 p-3 rounded-full mr-4">
                    <PhoneCall className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Телефон поддержки</h3>
                    <p className="text-gray-600 mt-1">8 (800) 123-45-67</p>
                    <p className="text-sm text-gray-500 mt-1">
                      Пн-Пт: 9:00 - 20:00, Сб-Вс: 10:00 - 18:00
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-primary/10 p-3 rounded-full mr-4">
                    <Mail className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Email</h3>
                    <p className="text-gray-600 mt-1">support@goodfit.ru</p>
                    <p className="text-sm text-gray-500 mt-1">
                      Ответим в течение 24 часов
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-primary/10 p-3 rounded-full mr-4">
                    <MessageSquare className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Чат в приложении</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Самый быстрый способ получить помощь
                    </p>
                    <Button className="mt-3">
                      Начать чат
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex">
                  <AlertCircle className="text-blue-500 h-5 w-5 mr-3 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-blue-800 font-medium">
                      Часто задаваемые вопросы
                    </p>
                    <p className="text-xs text-blue-600 mt-1">
                      Прежде чем обращаться в поддержку, ознакомьтесь с часто задаваемыми вопросами — возможно, там уже есть ответ на ваш вопрос.
                    </p>
                    <Button 
                      variant="link" 
                      className="text-blue-700 p-0 h-auto mt-1" 
                      asChild
                    >
                      <a href="/faq">Перейти к FAQ</a>
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ClientSupport;
