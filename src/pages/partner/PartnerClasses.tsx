
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Calendar, Users, Clock } from "lucide-react";

const PartnerClasses = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Занятия</h1>
          <p className="text-gray-400">Управляйте расписанием занятий</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90">
          <Plus className="h-4 w-4 mr-2" />
          Добавить занятие
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Йога для начинающих</CardTitle>
            <CardDescription className="text-gray-400">FitLife Центр</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center text-gray-300">
              <Calendar className="h-4 w-4 mr-2" />
              <span className="text-sm">Понедельник, Среда, Пятница</span>
            </div>
            <div className="flex items-center text-gray-300">
              <Clock className="h-4 w-4 mr-2" />
              <span className="text-sm">18:00 - 19:30</span>
            </div>
            <div className="flex items-center text-gray-300">
              <Users className="h-4 w-4 mr-2" />
              <span className="text-sm">15/20 участников</span>
            </div>
            <Button variant="outline" className="w-full">
              Редактировать
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Силовая тренировка</CardTitle>
            <CardDescription className="text-gray-400">PowerGym</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center text-gray-300">
              <Calendar className="h-4 w-4 mr-2" />
              <span className="text-sm">Вторник, Четверг</span>
            </div>
            <div className="flex items-center text-gray-300">
              <Clock className="h-4 w-4 mr-2" />
              <span className="text-sm">10:00 - 11:30</span>
            </div>
            <div className="flex items-center text-gray-300">
              <Users className="h-4 w-4 mr-2" />
              <span className="text-sm">8/12 участников</span>
            </div>
            <Button variant="outline" className="w-full">
              Редактировать
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PartnerClasses;
