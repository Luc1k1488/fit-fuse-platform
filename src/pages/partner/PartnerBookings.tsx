
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, User, MapPin } from "lucide-react";

const PartnerBookings = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Бронирования</h1>
        <p className="text-gray-400">Список бронирований в ваших залах</p>
      </div>

      <div className="space-y-4">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-white">Йога для начинающих</CardTitle>
                <CardDescription className="text-gray-400">Сегодня, 18:00 - 19:30</CardDescription>
              </div>
              <Badge variant="secondary" className="bg-green-600">Подтверждено</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center text-gray-300">
              <User className="h-4 w-4 mr-2" />
              <span className="text-sm">Анна Иванова</span>
            </div>
            <div className="flex items-center text-gray-300">
              <MapPin className="h-4 w-4 mr-2" />
              <span className="text-sm">FitLife Центр</span>
            </div>
            <div className="flex items-center text-gray-300">
              <Calendar className="h-4 w-4 mr-2" />
              <span className="text-sm">Разовое посещение</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-white">Силовая тренировка</CardTitle>
                <CardDescription className="text-gray-400">Завтра, 10:00 - 11:30</CardDescription>
              </div>
              <Badge variant="secondary" className="bg-yellow-600">Ожидает</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center text-gray-300">
              <User className="h-4 w-4 mr-2" />
              <span className="text-sm">Петр Сидоров</span>
            </div>
            <div className="flex items-center text-gray-300">
              <MapPin className="h-4 w-4 mr-2" />
              <span className="text-sm">PowerGym</span>
            </div>
            <div className="flex items-center text-gray-300">
              <Calendar className="h-4 w-4 mr-2" />
              <span className="text-sm">По абонементу</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PartnerBookings;
