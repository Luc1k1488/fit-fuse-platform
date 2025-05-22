
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell
} from 'recharts';
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const AdminAnalytics = () => {
  const [period, setPeriod] = useState("month");
  const [activeTab, setActiveTab] = useState("overview");
  
  // Mock data for charts
  const revenueData = [
    { name: 'Янв', revenue: 20000 },
    { name: 'Фев', revenue: 25000 },
    { name: 'Март', revenue: 30000 },
    { name: 'Апр', revenue: 28000 },
    { name: 'Май', revenue: 32000 },
    { name: 'Июнь', revenue: 35000 },
    { name: 'Июль', revenue: 38000 },
  ];
  
  const membershipData = [
    { name: 'Янв', active: 1200, new: 150, canceled: 80 },
    { name: 'Фев', active: 1270, new: 140, canceled: 70 },
    { name: 'Март', active: 1340, new: 160, canceled: 90 },
    { name: 'Апр', active: 1410, new: 170, canceled: 100 },
    { name: 'Май', active: 1480, new: 150, canceled: 80 },
    { name: 'Июнь', active: 1550, new: 160, canceled: 90 },
    { name: 'Июль', active: 1620, new: 180, canceled: 110 },
  ];
  
  const popularGymsData = [
    { name: 'Фитнес Плюс', bookings: 1200 },
    { name: 'СпортМакс', bookings: 950 },
    { name: 'ЗдоровьеПро', bookings: 850 },
    { name: 'Атлетик Клуб', bookings: 780 },
    { name: 'ФитнесЛайф', bookings: 650 },
  ];
  
  const cityDistributionData = [
    { name: 'Москва', value: 45 },
    { name: 'Санкт-Петербург', value: 30 },
    { name: 'Казань', value: 10 },
    { name: 'Екатеринбург', value: 8 },
    { name: 'Другие', value: 7 },
  ];
  
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];
  
  const handlePeriodChange = (value: string) => {
    setPeriod(value);
    // In a real app, this would fetch data for the selected period
  };
  
  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Аналитическая панель</h1>
        <div className="flex items-center space-x-4">
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
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6 grid grid-cols-4 w-full max-w-2xl">
          <TabsTrigger value="overview">Обзор</TabsTrigger>
          <TabsTrigger value="revenue">Доходы</TabsTrigger>
          <TabsTrigger value="users">Пользователи</TabsTrigger>
          <TabsTrigger value="gyms">Залы</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <MetricCard title="Общий доход" value="₽2.1M" trend="+12%" positive />
            <MetricCard title="Пользователи" value="1,620" trend="+8%" positive />
            <MetricCard title="Активные залы" value="53" trend="+5%" positive />
            <MetricCard title="Отмены" value="110" trend="+22%" positive={false} />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Доход за период</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`₽${value}`, 'Доход']} />
                    <Bar dataKey="revenue" fill="#8884d8" name="Доход" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Активные абонементы</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={membershipData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="active" stroke="#8884d8" name="Активные" />
                    <Line type="monotone" dataKey="new" stroke="#82ca9d" name="Новые" />
                    <Line type="monotone" dataKey="canceled" stroke="#ff7300" name="Отмененные" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Самые популярные залы</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart layout="vertical" data={popularGymsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" width={150} />
                    <Tooltip />
                    <Bar dataKey="bookings" fill="#82ca9d" name="Бронирования" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Распределение по городам</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={cityDistributionData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {cityDistributionData.map((entry, index) => (
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
        
        <TabsContent value="revenue">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Доход по абонементам</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`₽${value}`, 'Доход']} />
                    <Legend />
                    <Bar dataKey="revenue" fill="#8884d8" name="Доход" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <MetricCard title="Месячный доход" value="₽320,000" trend="+8%" positive />
              <MetricCard title="Средний чек" value="₽1,980" trend="+2%" positive />
              <MetricCard title="Прогноз дохода" value="₽2.4M" trend="+15%" positive />
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="users">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Динамика пользователей</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={membershipData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="active" stroke="#8884d8" name="Активные" />
                    <Line type="monotone" dataKey="new" stroke="#82ca9d" name="Новые" />
                    <Line type="monotone" dataKey="canceled" stroke="#ff7300" name="Отмененные" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <MetricCard title="Всего пользователей" value="1,620" trend="+8%" positive />
              <MetricCard title="Новых за месяц" value="180" trend="+12%" positive />
              <MetricCard title="Коэф. удержания" value="78%" trend="+3%" positive />
              <MetricCard title="Отток" value="6.8%" trend="-2%" positive />
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="gyms">
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Популярные залы</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart layout="vertical" data={popularGymsData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="name" type="category" width={150} />
                      <Tooltip />
                      <Bar dataKey="bookings" fill="#82ca9d" name="Бронирования" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Распределение по городам</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={400}>
                    <PieChart>
                      <Pie
                        data={cityDistributionData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {cityDistributionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value}%`, 'Доля']} />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <MetricCard title="Всего залов" value="53" trend="+5%" positive />
              <MetricCard title="Средний рейтинг" value="4.7" trend="+0.2" positive />
              <MetricCard title="Заполняемость" value="68%" trend="+4%" positive />
              <MetricCard title="Новых залов" value="7" trend="+40%" positive />
            </div>
          </div>
        </TabsContent>
      </Tabs>
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

export default AdminAnalytics;
