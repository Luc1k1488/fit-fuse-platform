
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, UserCheck, UserX, Shield } from "lucide-react";

interface UserStatsData {
  total: number;
  active: number;
  blocked: number;
  admins: number;
  partners: number;
  support: number;
  users: number;
}

interface AdminUsersStatsProps {
  stats: UserStatsData;
}

const AdminUsersStats = ({ stats }: AdminUsersStatsProps) => {
  const statCards = [
    {
      title: "Всего пользователей",
      value: stats.total,
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      title: "Активные",
      value: stats.active,
      icon: UserCheck,
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      title: "Заблокированные",
      value: stats.blocked,
      icon: UserX,
      color: "text-red-600",
      bgColor: "bg-red-50"
    },
    {
      title: "Администраторы",
      value: stats.admins,
      icon: Shield,
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {statCards.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <div className={`p-2 rounded-md ${stat.bgColor}`}>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <div className="flex gap-1 mt-2">
              {stat.title === "Всего пользователей" && (
                <>
                  <Badge variant="outline" className="text-xs">
                    Партнеры: {stats.partners}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    Поддержка: {stats.support}
                  </Badge>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default AdminUsersStats;
