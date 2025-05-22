
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell
} from 'recharts';
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/contexts/auth_context";

const PartnerAnalytics = () => {
  const { user } = useAuth();
  const [period, setPeriod] = useState("month");
  const [gymId, setGymId] = useState("all");
  
  // Mock data for charts
  const bookingsData = [
    { name: 'Пн', value: 45 },
    { name: 'Вт', value: 52 },
    { name: 'Ср', value: 49 },
    { name: 'Чт', value: 60 },
    { name: 'Пт', value: 70 },
    { name: 'Сб', value: 75 },
    { name: 'Вс', value: 58 },
  ];
  
  const revenueData = [
    { name: 'Янв', revenue: 125000 },
    { name: 'Фев', revenue: 130000 },
    { name: 'Март', revenue: 142000 },
    { name: 'Апр', revenue: 135000 },
    { name: 'Май', revenue: 148000 },
    { name: 'Июнь', revenue: 160000 },
    { name: 'Июль', revenue: 170000 },
  ];
  
  const classPopularityData = [
    { name: 'Йога', value: 30 },
    { name: 'Кроссфит', value: 25 },
    { name: 'Силовая', value: 20 },
    { name: 'Пилатес', value: 15 },
    { name: 'Растяжка', value: 10 },
  ];
  
  const clientDemographicsData = [
    { name: '18-24', value: 15 },
    { name: '25-34', value: 35 },
    { name: '35-44', value: 25 },
    { name: '45-54', value: 15 },
    { name: '55+', value: 10 },
  ];
  
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];
  
  // Mock gym data
  const partnerGyms = [
    { id: 'gym1', name: 'Фитнес Плюс' },
    { id: 'gym2', name: 'СпортМакс' },
    { id: 'gym3', name: 'ЗдоровьеПро' },
  ];
  
  const handlePeriodChange = (value: string) => {
    setPeriod(value);
    // In a real app, this would fetch data for the selected period
  };
  
  const handleGymChange = (value: string) => {
    setGymId(value);
    // In a real app, this would fetch data for the selected gym
  };
  
  return (
    <div className="p-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-2xl font-bold">Аналитика</h1>
        <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-3 mt-4 md:mt-0">
          <Select value={gymId} onValueChange={handleGymChange}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Выберите зал" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все залы</SelectItem>
              {partnerGyms.map(gym => (
                <SelectItem key={gym.id} value={gym.id}>{gym.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={period} onValueChange={handlePeriodChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Выберите период" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Неделя</SelectItem>
              <SelectItem value="month">Месяц</SelectItem>
              <SelectItem value="quarter">Квартал</SelectItem>
              <SelectItem value="year">Год</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <MetricCard title="Посещений в месяц" value="427" trend="+8%" positive />
        <MetricCard title="Средняя заполняемость" value="76%" trend="+5%" positive />
        <MetricCard title="Новых клиентов" value="48" trend="+12%" positive />
        <MetricCard title="Выручка" value="₽170,000" trend="+6%" positive />
      </div>
      
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Обзор</TabsTrigger>
          <TabsTrigger value="bookings">Посещения</TabsTrigger>
          <TabsTrigger value="classes">Тренировки</TabsTrigger>
          <TabsTrigger value="clients">Клиенты</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Посещения по дням недели</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={bookingsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`${value} посещений`, 'Количество']} />
                    <Bar dataKey="value" fill="#8884d8" name="Посещения" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Выручка по месяцам</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`₽${value}`, 'Выручка']} />
                    <Line type="monotone" dataKey="revenue" stroke="#82ca9d" name="Выручка" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Популярность тренировок</CardTitle>
              </CardHeader>
              <CardContent className="flex justify-center">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={classPopularityData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {classPopularityData.map((entry, index) => (
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
                <CardTitle>Демография клиентов</CardTitle>
              </CardHeader>
              <CardContent className="flex justify-center">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={clientDemographicsData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {clientDemographicsData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value}%`, 'Доля']} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="bookings">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Динамика посещений</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={[
                    { date: '1 Июля', value: 42 },
                    { date: '2 Июля', value: 53 },
                    { date: '3 Июля', value: 58 },
                    { date: '4 Июля', value: 69 },
                    { date: '5 Июля', value: 75 },
                    { date: '6 Июля', value: 80 },
                    { date: '7 Июля', value: 65 },
                    { date: '8 Июля', value: 55 },
                    { date: '9 Июля', value: 60 },
                    { date: '10 Июля', value: 63 },
                    { date: '11 Июля', value: 70 },
                    { date: '12 Июля', value: 78 },
                    { date: '13 Июля', value: 82 },
                    { date: '14 Июля', value: 71 },
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="value" stroke="#8884d8" name="Посещения" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Загруженность по часам</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={[
                      { time: '6:00', value: 15 },
                      { time: '8:00', value: 35 },
                      { time: '10:00', value: 25 },
                      { time: '12:00', value: 20 },
                      { time: '14:00', value: 15 },
                      { time: '16:00', value: 30 },
                      { time: '18:00', value: 80 },
                      { time: '20:00', value: 65 },
                      { time: '22:00', value: 30 },
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="time" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`${value}%`, 'Загруженность']} />
                      <Bar dataKey="value" fill="#82ca9d" name="Загруженность" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Типы бронирований</CardTitle>
                </CardHeader>
                <CardContent className="flex justify-center">
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={[
                          { name: 'Отдельные тренировки', value: 60 },
                          { name: 'Групповые занятия', value: 30 },
                          { name: 'Персональные тренировки', value: 10 },
                        ]}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {COLORS.map((color, index) => (
                          <Cell key={`cell-${index}`} fill={color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value}%`, 'Доля']} />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="classes">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Популярность тренировок</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart layout="vertical" data={[
                    { name: 'Йога', value: 95 },
                    { name: 'Кроссфит', value: 83 },
                    { name: 'Силовая', value: 76 },
                    { name: 'Пилатес', value: 68 },
                    { name: 'Растяжка', value: 55 },
                    { name: 'Танцевальная', value: 46 },
                    { name: 'Аэробика', value: 42 },
                    { name: 'Бокс', value: 38 },
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" width={120} />
                    <Tooltip formatter={(value) => [`${value} бронирований`, 'Количество']} />
                    <Bar dataKey="value" fill="#8884d8" name="Бронирования" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Заполняемость по тренировкам</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={[
                      { name: 'Йога', capacity: 90 },
                      { name: 'Кроссфит', capacity: 85 },
                      { name: 'Силовая', capacity: 70 },
                      { name: 'Пилатес', capacity: 80 },
                      { name: 'Растяжка', capacity: 60 },
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`${value}%`, 'Заполняемость']} />
                      <Bar dataKey="capacity" fill="#82ca9d" name="Заполняемость" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Отмены по типу тренировок</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={[
                      { name: 'Йога', cancellations: 5 },
                      { name: 'Кроссфит', cancellations: 12 },
                      { name: 'Силовая', cancellations: 8 },
                      { name: 'Пилатес', cancellations: 4 },
                      { name: 'Растяжка', cancellations: 6 },
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`${value}`, 'Отмены']} />
                      <Bar dataKey="cancellations" fill="#ff7300" name="Отмены" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="clients">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Новые клиенты по месяцам</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={[
                    { name: 'Янв', value: 28 },
                    { name: 'Фев', value: 32 },
                    { name: 'Март', value: 36 },
                    { name: 'Апр', value: 30 },
                    { name: 'Май', value: 40 },
                    { name: 'Июнь', value: 45 },
                    { name: 'Июль', value: 48 },
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`${value} клиентов`, 'Количество']} />
                    <Line type="monotone" dataKey="value" stroke="#8884d8" name="Новые клиенты" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Возрастная демография</CardTitle>
                </CardHeader>
                <CardContent className="flex justify-center">
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={clientDemographicsData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {clientDemographicsData.map((entry, index) => (
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
                  <CardTitle>Удержание клиентов</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={[
                      { month: '1', retention: 100 },
                      { month: '2', retention: 86 },
                      { month: '3', retention: 78 },
                      { month: '4', retention: 72 },
                      { month: '5', retention: 68 },
                      { month: '6', retention: 65 },
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" label={{ value: 'Месяц', position: 'insideBottomRight', offset: -10 }} />
                      <YAxis label={{ value: '% удержания', angle: -90, position: 'insideLeft' }} />
                      <Tooltip formatter={(value) => [`${value}%`, 'Удержание']} />
                      <Line type="monotone" dataKey="retention" stroke="#82ca9d" name="Удержание клиентов" />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
      
      <div className="mt-6">
        <Button variant="outline" className="mr-2">
          Экспорт данных
        </Button>
        <Button variant="outline">
          Печать отчета
        </Button>
      </div>
    </div>
  );
};

// Metric Card Component
interface MetricCardProps {
  title: string;
  value: string;
  trend: string;
  positive: boolean;
}

const MetricCard = ({ title, value, trend, positive }: MetricCardProps) => {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm text-gray-400">{title}</p>
            <p className="text-2xl font-bold mt-1">{value}</p>
          </div>
          <div className={`px-2 py-1 rounded text-xs ${positive ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
            {trend}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PartnerAnalytics;
