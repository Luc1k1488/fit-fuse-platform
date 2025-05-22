
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell
} from 'recharts';
import { useAuth } from "@/contexts/auth_context";
import { MessageSquare, CheckCircle, AlertCircle, Clock } from "lucide-react";

const SupportDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  
  // Mock data for statistics
  const ticketsData = {
    total: 45,
    active: 12,
    pending: 8,
    resolved: 25,
    responseTime: "1h 28m",
    resolutionTime: "4h 12m",
    satisfactionRate: "92%"
  };
  
  // Mock data for chart
  const weeklyTicketsData = [
    { day: "Пн", tickets: 8, resolved: 7 },
    { day: "Вт", tickets: 10, resolved: 8 },
    { day: "Ср", tickets: 6, resolved: 5 },
    { day: "Чт", tickets: 11, resolved: 9 },
    { day: "Пт", tickets: 15, resolved: 13 },
    { day: "Сб", tickets: 4, resolved: 4 },
    { day: "Вс", tickets: 2, resolved: 2 }
  ];
  
  // Categories data for pie chart
  const categoriesData = [
    { name: 'Абонементы', value: 35 },
    { name: 'Бронирование', value: 25 },
    { name: 'Приложение', value: 20 },
    { name: 'Оплата', value: 15 },
    { name: 'Другое', value: 5 }
  ];
  
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];
  
  // Dummy active tickets
  const activeTickets = [
    {
      id: "ticket-1",
      user: "Анна К.",
      subject: "Проблема с отменой бронирования",
      status: "open",
      priority: "high",
      timeAgo: "2 часа назад"
    },
    {
      id: "ticket-2",
      user: "Иван С.",
      subject: "Вопрос по абонементу Премиум",
      status: "in_progress",
      priority: "medium",
      timeAgo: "4 часа назад"
    },
    {
      id: "ticket-3",
      user: "Мария Д.",
      subject: "Не могу оплатить абонемент",
      status: "open",
      priority: "high",
      timeAgo: "5 часов назад"
    },
    {
      id: "ticket-4",
      user: "Алексей П.",
      subject: "Как заморозить абонемент?",
      status: "in_progress",
      priority: "low",
      timeAgo: "1 день назад"
    },
    {
      id: "ticket-5",
      user: "Екатерина В.",
      subject: "Не работает мобильное приложение",
      status: "open",
      priority: "medium",
      timeAgo: "1 час назад"
    }
  ];
  
  // Get status badge color
  const getStatusBadge = (status: string) => {
    switch(status) {
      case "open":
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">Открыт</Badge>;
      case "in_progress":
        return <Badge variant="outline" className="bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300">В работе</Badge>;
      case "resolved":
        return <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">Решен</Badge>;
      default:
        return <Badge variant="outline">Неизвестно</Badge>;
    }
  };
  
  // Get priority badge
  const getPriorityBadge = (priority: string) => {
    switch(priority) {
      case "high":
        return <Badge className="bg-red-500">Высокий</Badge>;
      case "medium":
        return <Badge className="bg-amber-500">Средний</Badge>;
      case "low":
        return <Badge className="bg-green-500">Низкий</Badge>;
      default:
        return <Badge>Неизвестно</Badge>;
    }
  };
  
  return (
    <div className="p-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-2xl font-bold">Панель поддержки</h1>
        <div className="mt-4 md:mt-0">
          <Button>
            <MessageSquare className="h-4 w-4 mr-2" />
            Новый тикет
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
          <CardContent className="p-4">
            <div className="flex items-center space-x-4">
              <div className="bg-blue-100 dark:bg-blue-800 p-3 rounded-full">
                <MessageSquare className="h-6 w-6 text-blue-600 dark:text-blue-300" />
              </div>
              <div>
                <p className="text-sm text-blue-600 dark:text-blue-300">Активные тикеты</p>
                <p className="text-2xl font-bold text-blue-700 dark:text-blue-200">{ticketsData.active}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800">
          <CardContent className="p-4">
            <div className="flex items-center space-x-4">
              <div className="bg-amber-100 dark:bg-amber-800 p-3 rounded-full">
                <Clock className="h-6 w-6 text-amber-600 dark:text-amber-300" />
              </div>
              <div>
                <p className="text-sm text-amber-600 dark:text-amber-300">Ожидающие</p>
                <p className="text-2xl font-bold text-amber-700 dark:text-amber-200">{ticketsData.pending}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
          <CardContent className="p-4">
            <div className="flex items-center space-x-4">
              <div className="bg-green-100 dark:bg-green-800 p-3 rounded-full">
                <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-300" />
              </div>
              <div>
                <p className="text-sm text-green-600 dark:text-green-300">Решенные</p>
                <p className="text-2xl font-bold text-green-700 dark:text-green-200">{ticketsData.resolved}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800">
          <CardContent className="p-4">
            <div className="flex items-center space-x-4">
              <div className="bg-purple-100 dark:bg-purple-800 p-3 rounded-full">
                <AlertCircle className="h-6 w-6 text-purple-600 dark:text-purple-300" />
              </div>
              <div>
                <p className="text-sm text-purple-600 dark:text-purple-300">Удовлетворенность</p>
                <p className="text-2xl font-bold text-purple-700 dark:text-purple-200">{ticketsData.satisfactionRate}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Недавняя активность</CardTitle>
          </CardHeader>
          <CardContent className="p-0 overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Клиент
                  </th>
                  <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Тема
                  </th>
                  <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Статус
                  </th>
                  <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Приоритет
                  </th>
                  <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Время
                  </th>
                  <th className="py-3 px-6 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Действия
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {activeTickets.map((ticket) => (
                  <tr key={ticket.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                    <td className="py-4 px-6 whitespace-nowrap">
                      <div className="flex items-center">
                        <Avatar className="h-8 w-8 mr-2">
                          <AvatarFallback>{ticket.user.substring(0, 2)}</AvatarFallback>
                        </Avatar>
                        <span>{ticket.user}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{ticket.subject}</div>
                    </td>
                    <td className="py-4 px-6 whitespace-nowrap">
                      {getStatusBadge(ticket.status)}
                    </td>
                    <td className="py-4 px-6 whitespace-nowrap">
                      {getPriorityBadge(ticket.priority)}
                    </td>
                    <td className="py-4 px-6 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {ticket.timeAgo}
                    </td>
                    <td className="py-4 px-6 text-right whitespace-nowrap">
                      <Button size="sm">Ответить</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Обзор</TabsTrigger>
          <TabsTrigger value="performance">Производительность</TabsTrigger>
          <TabsTrigger value="categories">Категории</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <CardTitle>Тикеты за неделю</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={weeklyTicketsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="tickets" name="Новые тикеты" fill="#8884d8" />
                  <Bar dataKey="resolved" name="Решенные" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="performance">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Время ответа</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={[
                    { day: "Пн", time: 95 },
                    { day: "Вт", time: 85 },
                    { day: "Ср", time: 78 },
                    { day: "Чт", time: 90 },
                    { day: "Пт", time: 102 },
                    { day: "Сб", time: 68 },
                    { day: "Вс", time: 65 },
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis label={{ value: 'Минуты', angle: -90, position: 'insideLeft' }} />
                    <Tooltip formatter={(value) => [`${value} мин`, 'Время']} />
                    <Legend />
                    <Line type="monotone" dataKey="time" stroke="#8884d8" name="Среднее время ответа" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Удовлетворенность клиентов</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={[
                    { day: "Пн", rate: 92 },
                    { day: "Вт", rate: 94 },
                    { day: "Ср", rate: 91 },
                    { day: "Чт", rate: 89 },
                    { day: "Пт", rate: 93 },
                    { day: "Сб", rate: 95 },
                    { day: "Вс", rate: 96 },
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis domain={[80, 100]} label={{ value: '%', position: 'insideLeft' }} />
                    <Tooltip formatter={(value) => [`${value}%`, 'Удовлетворенность']} />
                    <Legend />
                    <Line type="monotone" dataKey="rate" stroke="#82ca9d" name="Удовлетворенность клиентов" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="categories">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Распределение по категориям</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={categoriesData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {categoriesData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value}%`, 'Доля']} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Статистика по категориям</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {categoriesData.map((category, index) => (
                    <div key={index}>
                      <div className="flex justify-between items-center mb-1">
                        <span>{category.name}</span>
                        <span>{category.value}%</span>
                      </div>
                      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full" 
                          style={{ 
                            width: `${category.value}%`, 
                            backgroundColor: COLORS[index % COLORS.length]
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
      
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Статистика агента</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-500">Решено сегодня:</span>
                <span className="font-medium">7</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Среднее время ответа:</span>
                <span className="font-medium">24 мин</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Среднее время решения:</span>
                <span className="font-medium">3ч 45мин</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Рейтинг удовлетворенности:</span>
                <span className="font-medium text-green-600">94%</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Часто используемые ответы</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start text-left" size="sm">
                Как заморозить абонемент
              </Button>
              <Button variant="outline" className="w-full justify-start text-left" size="sm">
                Отмена бронирования
              </Button>
              <Button variant="outline" className="w-full justify-start text-left" size="sm">
                Смена пароля
              </Button>
              <Button variant="outline" className="w-full justify-start text-left" size="sm">
                + Добавить новый шаблон
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Обучающие материалы</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start text-left" size="sm">
                Руководство по работе с тикетами
              </Button>
              <Button variant="outline" className="w-full justify-start text-left" size="sm">
                База знаний по абонементам
              </Button>
              <Button variant="outline" className="w-full justify-start text-left" size="sm">
                Инструкция по бронированию
              </Button>
              <Button variant="outline" className="w-full justify-start text-left" size="sm">
                Справка по мобильному приложению
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SupportDashboard;
