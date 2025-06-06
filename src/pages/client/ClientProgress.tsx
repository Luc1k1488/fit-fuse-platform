
import { useState } from "react";
import { TrendingUp, Target, Calendar, Award, Activity, Zap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ClientProgress = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("month");

  // Пример данных
  const stats = {
    totalWorkouts: 24,
    currentStreak: 7,
    totalHours: 36,
    caloriesBurned: 4800,
    averageRating: 4.7,
    completedGoals: 3
  };

  const weeklyData = [
    { day: "Пн", workouts: 1, duration: 60 },
    { day: "Вт", workouts: 0, duration: 0 },
    { day: "Ср", workouts: 1, duration: 45 },
    { day: "Чт", workouts: 1, duration: 90 },
    { day: "Пт", workouts: 0, duration: 0 },
    { day: "Сб", workouts: 2, duration: 120 },
    { day: "Вс", workouts: 1, duration: 75 }
  ];

  const achievements = [
    { id: 1, name: "Первая тренировка", description: "Провели первое занятие", earned: true, date: "15.02.2024" },
    { id: 2, name: "Неделя активности", description: "7 дней подряд тренировок", earned: true, date: "22.02.2024" },
    { id: 3, name: "Месяц силы", description: "20 тренировок за месяц", earned: false, progress: 75 },
    { id: 4, name: "Марафонец", description: "50 часов тренировок", earned: false, progress: 30 }
  ];

  const goals = [
    { id: 1, name: "Тренировки в месяц", target: 20, current: 16, unit: "тренировок" },
    { id: 2, name: "Часы активности", target: 40, current: 36, unit: "часов" },
    { id: 3, name: "Сжечь калории", target: 6000, current: 4800, unit: "ккал" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 pb-16">
      {/* Header */}
      <div className="bg-slate-900/50 backdrop-blur-sm border-b border-slate-700 px-4 py-6">
        <h1 className="text-2xl font-bold text-white mb-2">Мой прогресс</h1>
        <p className="text-slate-300">Отслеживайте свои достижения</p>
      </div>

      <div className="px-4 py-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
            <CardContent className="p-4 text-center">
              <TrendingUp className="h-6 w-6 mx-auto mb-2 text-purple-400" />
              <div className="text-2xl font-bold text-white mb-1">{stats.totalWorkouts}</div>
              <div className="text-sm text-slate-400">Всего тренировок</div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
            <CardContent className="p-4 text-center">
              <Zap className="h-6 w-6 mx-auto mb-2 text-orange-400" />
              <div className="text-2xl font-bold text-white mb-1">{stats.currentStreak}</div>
              <div className="text-sm text-slate-400">Дней подряд</div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
            <CardContent className="p-4 text-center">
              <Activity className="h-6 w-6 mx-auto mb-2 text-green-400" />
              <div className="text-2xl font-bold text-white mb-1">{stats.totalHours}</div>
              <div className="text-sm text-slate-400">Часов тренировок</div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
            <CardContent className="p-4 text-center">
              <Award className="h-6 w-6 mx-auto mb-2 text-yellow-400" />
              <div className="text-2xl font-bold text-white mb-1">{stats.caloriesBurned}</div>
              <div className="text-sm text-slate-400">ккал сожжено</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="activity" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-slate-800/50 backdrop-blur-sm border-slate-700">
            <TabsTrigger 
              value="activity"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-blue-600 text-white"
            >
              Активность
            </TabsTrigger>
            <TabsTrigger 
              value="goals"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-blue-600 text-white"
            >
              Цели
            </TabsTrigger>
            <TabsTrigger 
              value="achievements"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-blue-600 text-white"
            >
              Достижения
            </TabsTrigger>
          </TabsList>

          <TabsContent value="activity" className="space-y-4 mt-6">
            {/* Weekly Activity Chart */}
            <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Активность на этой неделе</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-7 gap-2">
                  {weeklyData.map((day) => (
                    <div key={day.day} className="text-center">
                      <div className="text-xs text-slate-400 mb-2">{day.day}</div>
                      <div 
                        className={`w-full rounded-lg flex items-end justify-center text-xs text-white font-medium ${
                          day.workouts > 0 ? 'bg-purple-600' : 'bg-slate-700'
                        }`}
                        style={{ height: `${Math.max(day.duration / 2, 20)}px` }}
                      >
                        {day.workouts > 0 ? day.workouts : ''}
                      </div>
                      <div className="text-xs text-slate-400 mt-1">
                        {day.duration}м
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Workouts */}
            <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Последние тренировки</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { date: "Сегодня", gym: "Фитнес Центр", type: "Силовая", duration: "60 мин" },
                    { date: "Вчера", gym: "Yoga Studio", type: "Йога", duration: "45 мин" },
                    { date: "2 дня назад", gym: "CrossFit Box", type: "Кроссфит", duration: "90 мин" }
                  ].map((workout, index) => (
                    <div key={index} className="bg-slate-700/30 rounded-lg p-3">
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="text-white font-medium">{workout.type}</div>
                          <div className="text-sm text-slate-400">{workout.gym}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-slate-300">{workout.date}</div>
                          <div className="text-xs text-slate-400">{workout.duration}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="goals" className="space-y-4 mt-6">
            {goals.map((goal) => {
              const progress = (goal.current / goal.target) * 100;
              return (
                <Card key={goal.id} className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-white font-medium">{goal.name}</h3>
                      <span className="text-sm text-slate-400">
                        {goal.current} / {goal.target} {goal.unit}
                      </span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2 mb-2">
                      <div 
                        className="bg-gradient-to-r from-purple-500 to-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${Math.min(progress, 100)}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-slate-400">
                      {Math.round(progress)}% выполнено
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </TabsContent>

          <TabsContent value="achievements" className="space-y-4 mt-6">
            {achievements.map((achievement) => (
              <Card key={achievement.id} className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      achievement.earned ? 'bg-yellow-600' : 'bg-slate-600'
                    }`}>
                      <Award className={`h-6 w-6 ${
                        achievement.earned ? 'text-yellow-200' : 'text-slate-400'
                      }`} />
                    </div>
                    <div className="flex-1">
                      <h3 className={`font-medium mb-1 ${
                        achievement.earned ? 'text-white' : 'text-slate-400'
                      }`}>
                        {achievement.name}
                      </h3>
                      <p className="text-sm text-slate-400 mb-2">
                        {achievement.description}
                      </p>
                      {achievement.earned ? (
                        <span className="text-xs text-green-400">
                          Получено {achievement.date}
                        </span>
                      ) : (
                        <div className="space-y-1">
                          <div className="w-full bg-slate-700 rounded-full h-1">
                            <div 
                              className="bg-purple-600 h-1 rounded-full"
                              style={{ width: `${achievement.progress}%` }}
                            ></div>
                          </div>
                          <span className="text-xs text-slate-400">
                            Прогресс: {achievement.progress}%
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ClientProgress;
