
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Stats {
  totalWorkouts: number;
  currentStreak: number;
  favoriteGyms: number;
  monthlyGoal: number;
}

interface StatsCardProps {
  stats: Stats;
}

const StatsCard = ({ stats }: StatsCardProps) => {
  return (
    <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700 animate-fade-in animation-delay-200">
      <CardHeader>
        <CardTitle className="text-lg text-white">Ваша статистика</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-slate-700/30 backdrop-blur-sm rounded-lg border border-slate-600">
            <div className="text-2xl font-bold text-purple-400">{stats.totalWorkouts}</div>
            <div className="text-sm text-slate-300">Всего тренировок</div>
          </div>
          <div className="text-center p-3 bg-slate-700/30 backdrop-blur-sm rounded-lg border border-slate-600">
            <div className="text-2xl font-bold text-green-400">{stats.currentStreak}</div>
            <div className="text-sm text-slate-300">Дней подряд</div>
          </div>
          <div className="text-center p-3 bg-slate-700/30 backdrop-blur-sm rounded-lg border border-slate-600">
            <div className="text-2xl font-bold text-blue-400">{stats.favoriteGyms}</div>
            <div className="text-sm text-slate-300">Избранные залы</div>
          </div>
          <div className="text-center p-3 bg-slate-700/30 backdrop-blur-sm rounded-lg border border-slate-600">
            <div className="text-2xl font-bold text-orange-400">{stats.monthlyGoal}</div>
            <div className="text-sm text-slate-300">Цель на месяц</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatsCard;
