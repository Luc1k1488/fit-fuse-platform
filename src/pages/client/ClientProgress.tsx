
import React, { useState } from "react";
import { DarkCard } from "@/components/ui/dark-card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar 
} from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Activity, Calendar, Clock, TrendingUp, Award, Dumbbell } from "lucide-react";

// Mockup данных для визуализации
const visitData = [
  { name: "Янв", visits: 8 },
  { name: "Фев", visits: 12 },
  { name: "Мар", visits: 10 },
  { name: "Апр", visits: 15 },
  { name: "Май", visits: 18 },
];

const activityData = [
  { day: "Пн", calories: 320, duration: 45 },
  { day: "Вт", calories: 450, duration: 60 },
  { day: "Ср", calories: 0, duration: 0 },
  { day: "Чт", calories: 380, duration: 50 },
  { day: "Пт", calories: 400, duration: 55 },
  { day: "Сб", calories: 500, duration: 70 },
  { day: "Вс", calories: 200, duration: 30 },
];

const classTypeData = [
  { name: "Йога", value: 35 },
  { name: "Силовые", value: 25 },
  { name: "Кардио", value: 20 },
  { name: "HIIT", value: 15 },
  { name: "Другие", value: 5 },
];

const COLORS = ["#8b5cf6", "#6366f1", "#a78bfa", "#c4b5fd", "#ddd6fe"];

const skillsData = [
  {
    subject: "Выносливость",
    A: 80,
    fullMark: 100,
  },
  {
    subject: "Сила",
    A: 65,
    fullMark: 100,
  },
  {
    subject: "Гибкость",
    A: 75,
    fullMark: 100,
  },
  {
    subject: "Баланс",
    A: 60,
    fullMark: 100,
  },
  {
    subject: "Скорость",
    A: 70,
    fullMark: 100,
  },
];

const progressMetrics = [
  { name: "Занятий посещено", value: 42, icon: Calendar },
  { name: "Сожжено калорий", value: "12,540", icon: Activity },
  { name: "Часов тренировок", value: 36, icon: Clock },
  { name: "Лучшая серия", value: "14 дней", icon: TrendingUp },
];

const ClientProgress = () => {
  const [period, setPeriod] = useState("month");
  
  return (
    <div className="pb-16 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold">Мой прогресс</h1>
          <p className="text-gray-400">
            Отслеживайте свою активность и фитнес-достижения
          </p>
        </div>
        
        <div className="flex gap-2">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-[180px] bg-gray-900 border-gray-800">
              <SelectValue placeholder="Выберите период" />
            </SelectTrigger>
            <SelectContent className="bg-gray-900 border-gray-800">
              <SelectItem value="week">За неделю</SelectItem>
              <SelectItem value="month">За месяц</SelectItem>
              <SelectItem value="quarter">За квартал</SelectItem>
              <SelectItem value="year">За год</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline">
            Экспорт
          </Button>
        </div>
      </div>
      
      {/* Основные статистические карточки */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {progressMetrics.map((metric) => (
          <DarkCard 
            key={metric.name} 
            className="p-4"
            hoverEffect="raise"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">{metric.name}</p>
                <p className="text-2xl font-bold mt-1">{metric.value}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                <metric.icon className="h-5 w-5 text-primary" />
              </div>
            </div>
          </DarkCard>
        ))}
      </div>
      
      {/* Графики активности */}
      <Tabs defaultValue="activity" className="w-full">
        <TabsList className="w-full grid grid-cols-4 mb-4">
          <TabsTrigger value="activity">Активность</TabsTrigger>
          <TabsTrigger value="visits">Посещения</TabsTrigger>
          <TabsTrigger value="classes">Типы тренировок</TabsTrigger>
          <TabsTrigger value="skills">Навыки</TabsTrigger>
        </TabsList>
        
        {/* График активности по дням */}
        <TabsContent value="activity">
          <DarkCard className="p-4">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="font-medium text-white">Активность за неделю</h2>
                <p className="text-sm text-gray-400">Калории и время тренировок</p>
              </div>
              <Badge>+12% к прошлой неделе</Badge>
            </div>
            
            <div className="h-80">
              <ChartContainer
                config={{
                  calories: { color: "#6366f1" },
                  duration: { color: "#a78bfa" }
                }}
              >
                <BarChart data={activityData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" />
                  <XAxis 
                    dataKey="day" 
                    stroke="#6b7280" 
                    tick={{ fill: '#6b7280' }}
                  />
                  <YAxis 
                    yAxisId="left" 
                    orientation="left" 
                    stroke="#6b7280"
                    tick={{ fill: '#6b7280' }}
                    label={{ 
                      value: 'Калории', 
                      angle: -90, 
                      position: 'insideLeft', 
                      fill: '#6b7280',
                      style: { textAnchor: 'middle' }
                    }}
                  />
                  <YAxis 
                    yAxisId="right" 
                    orientation="right" 
                    stroke="#6b7280"
                    tick={{ fill: '#6b7280' }}
                    label={{ 
                      value: 'Минуты', 
                      angle: 90, 
                      position: 'insideRight', 
                      fill: '#6b7280',
                      style: { textAnchor: 'middle' } 
                    }}
                  />
                  <ChartTooltip 
                    content={<ChartTooltipContent />} 
                  />
                  <Legend />
                  <Bar 
                    name="Калории" 
                    dataKey="calories" 
                    yAxisId="left" 
                    fill="#6366f1" 
                    radius={[4, 4, 0, 0]} 
                    barSize={20}
                  />
                  <Bar 
                    name="Минуты" 
                    dataKey="duration" 
                    yAxisId="right" 
                    fill="#a78bfa" 
                    radius={[4, 4, 0, 0]} 
                    barSize={20}
                  />
                </BarChart>
              </ChartContainer>
            </div>
            
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div className="p-3 bg-gray-800 rounded-lg">
                <p className="text-sm text-gray-400">Средний расход калорий</p>
                <div className="flex items-end gap-1 mt-1">
                  <p className="text-xl font-bold">368</p>
                  <p className="text-xs text-green-400 pb-1">+5%</p>
                </div>
              </div>
              <div className="p-3 bg-gray-800 rounded-lg">
                <p className="text-sm text-gray-400">Среднее время тренировки</p>
                <div className="flex items-end gap-1 mt-1">
                  <p className="text-xl font-bold">52 мин</p>
                  <p className="text-xs text-green-400 pb-1">+8%</p>
                </div>
              </div>
            </div>
          </DarkCard>
        </TabsContent>
        
        {/* График посещений */}
        <TabsContent value="visits">
          <DarkCard className="p-4">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="font-medium text-white">Посещения за {period === "month" ? "месяц" : period === "week" ? "неделю" : period === "quarter" ? "квартал" : "год"}</h2>
                <p className="text-sm text-gray-400">Количество посещений</p>
              </div>
            </div>
            
            <div className="h-80">
              <ChartContainer
                config={{
                  visits: { color: "#8b5cf6" }
                }}
              >
                <LineChart data={visitData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" />
                  <XAxis 
                    dataKey="name" 
                    stroke="#6b7280" 
                    tick={{ fill: '#6b7280' }}
                  />
                  <YAxis 
                    stroke="#6b7280"
                    tick={{ fill: '#6b7280' }}
                  />
                  <ChartTooltip 
                    content={<ChartTooltipContent />} 
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    name="Посещения"
                    dataKey="visits" 
                    stroke="#8b5cf6" 
                    strokeWidth={2}
                    dot={{ r: 4, fill: "#8b5cf6" }}
                    activeDot={{ r: 6, fill: "#8b5cf6" }}
                  />
                </LineChart>
              </ChartContainer>
            </div>
            
            <div className="mt-4 flex flex-wrap gap-2">
              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">
                В среднем: 12.6 посещений в месяц
              </Badge>
              <Badge variant="outline" className="bg-green-500/10 text-green-400 border-green-500/30">
                Рост на 20% с начала года
              </Badge>
            </div>
          </DarkCard>
        </TabsContent>
        
        {/* Распределение типов занятий */}
        <TabsContent value="classes">
          <DarkCard className="p-4">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="font-medium text-white">Распределение по типу тренировок</h2>
                <p className="text-sm text-gray-400">За все время</p>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="h-64">
                <ChartContainer config={{}}>
                  <PieChart>
                    <Pie
                      data={classTypeData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {classTypeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <ChartTooltip />
                  </PieChart>
                </ChartContainer>
              </div>
              
              <div className="grid content-center">
                <h3 className="font-medium mb-3">Распределение по типам занятий</h3>
                <div className="space-y-3">
                  {classTypeData.map((item, index) => (
                    <div key={item.name} className="flex items-center space-x-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      ></div>
                      <span>{item.name}</span>
                      <div className="flex-1 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                        <div 
                          className="h-full rounded-full" 
                          style={{ 
                            width: `${item.value}%`, 
                            backgroundColor: COLORS[index % COLORS.length] 
                          }}
                        ></div>
                      </div>
                      <span className="text-sm">{item.value}%</span>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gray-400 mt-4">
                  Основываясь на 42 посещенных занятиях
                </p>
              </div>
            </div>
          </DarkCard>
        </TabsContent>
        
        {/* Радарная диаграмма навыков */}
        <TabsContent value="skills">
          <DarkCard className="p-4">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="font-medium text-white">Развитие навыков</h2>
                <p className="text-sm text-gray-400">Ваш текущий уровень</p>
              </div>
              <Badge variant="outline" className="bg-yellow-500/10 text-yellow-400 border-yellow-500/30">
                <Award className="h-3 w-3 mr-1" />
                Продвинутый уровень
              </Badge>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="h-80">
                <ChartContainer config={{}}>
                  <RadarChart cx="50%" cy="50%" outerRadius="80%" data={skillsData}>
                    <PolarGrid stroke="#374151" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#6b7280' }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#6b7280' }} />
                    <Radar
                      name="Уровень"
                      dataKey="A"
                      stroke="#8b5cf6"
                      fill="#8b5cf6"
                      fillOpacity={0.6}
                    />
                    <ChartTooltip />
                  </RadarChart>
                </ChartContainer>
              </div>
              
              <div className="grid content-center">
                <h3 className="font-medium mb-3">Рекомендуемые тренировки</h3>
                <div className="space-y-3">
                  <div className="p-3 bg-gray-800 rounded-lg border-l-4 border-purple-500 transition-all hover:translate-x-1">
                    <div className="flex justify-between items-start">
                      <h4 className="font-medium">Силовая тренировка</h4>
                      <Badge>Рекомендовано</Badge>
                    </div>
                    <p className="text-sm text-gray-400 mt-1">
                      Поможет улучшить показатели силы
                    </p>
                  </div>
                  <div className="p-3 bg-gray-800 rounded-lg border-l-4 border-blue-500 transition-all hover:translate-x-1">
                    <h4 className="font-medium">Упражнения на баланс</h4>
                    <p className="text-sm text-gray-400 mt-1">
                      Сфокусируйтесь на улучшении равновесия
                    </p>
                  </div>
                  <div className="p-3 bg-gray-800 rounded-lg border-l-4 border-indigo-500 transition-all hover:translate-x-1">
                    <h4 className="font-medium">Интервальные тренировки</h4>
                    <p className="text-sm text-gray-400 mt-1">
                      Для увеличения скорости и выносливости
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-4 bg-gray-800 p-3 rounded-lg">
              <div className="flex items-center">
                <Dumbbell className="h-5 w-5 text-primary mr-2" />
                <h3 className="font-medium">Персональные рекомендации</h3>
              </div>
              <p className="text-sm text-gray-400 mt-2">
                Основываясь на ваших показателях, мы рекомендуем увеличить количество
                силовых тренировок и добавить упражнения на баланс. Ваша выносливость и гибкость 
                на хорошем уровне, продолжайте в том же духе!
              </p>
            </div>
          </DarkCard>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ClientProgress;
