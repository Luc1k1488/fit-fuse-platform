
import { Calendar, TrendingUp, Dumbbell, Target } from "lucide-react";

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
  const progress = (stats.totalWorkouts / stats.monthlyGoal) * 100;

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg p-6 animate-fade-in animation-delay-200">
      <h3 className="text-lg font-semibold text-white mb-4">Ваша статистика</h3>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="text-center p-4 bg-slate-700/30 rounded-lg">
          <Dumbbell className="h-6 w-6 mx-auto mb-2 text-purple-400" />
          <p className="text-2xl font-bold text-white">{stats.totalWorkouts}</p>
          <p className="text-sm text-gray-400">Тренировок</p>
        </div>
        
        <div className="text-center p-4 bg-slate-700/30 rounded-lg">
          <TrendingUp className="h-6 w-6 mx-auto mb-2 text-green-400" />
          <p className="text-2xl font-bold text-white">{stats.currentStreak}</p>
          <p className="text-sm text-gray-400">Дней подряд</p>
        </div>
        
        <div className="text-center p-4 bg-slate-700/30 rounded-lg">
          <Calendar className="h-6 w-6 mx-auto mb-2 text-blue-400" />
          <p className="text-2xl font-bold text-white">{stats.favoriteGyms}</p>
          <p className="text-sm text-gray-400">Любимых залов</p>
        </div>
        
        <div className="text-center p-4 bg-slate-700/30 rounded-lg">
          <Target className="h-6 w-6 mx-auto mb-2 text-orange-400" />
          <p className="text-2xl font-bold text-white">{Math.round(progress)}%</p>
          <p className="text-sm text-gray-400">Цель месяца</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Прогресс к цели</span>
          <span className="text-white">{stats.totalWorkouts} / {stats.monthlyGoal}</span>
        </div>
        <div className="w-full bg-slate-700 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-purple-500 to-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${Math.min(progress, 100)}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
