
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, MapPin, Clock, Users } from "lucide-react";

const PartnerGyms = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Мои залы</h1>
          <p className="text-gray-400">Управляйте своими фитнес-залами</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90">
          <Plus className="h-4 w-4 mr-2" />
          Добавить зал
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-white">FitLife Центр</CardTitle>
                <CardDescription className="text-gray-400">Фитнес-центр</CardDescription>
              </div>
              <span className="px-2 py-1 bg-green-600 text-white text-xs rounded">Активен</span>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center text-gray-300">
              <MapPin className="h-4 w-4 mr-2" />
              <span className="text-sm">ул. Пушкина, 10</span>
            </div>
            <div className="flex items-center text-gray-300">
              <Clock className="h-4 w-4 mr-2" />
              <span className="text-sm">6:00 - 23:00</span>
            </div>
            <div className="flex items-center text-gray-300">
              <Users className="h-4 w-4 mr-2" />
              <span className="text-sm">342 участника</span>
            </div>
            <Button variant="outline" className="w-full">
              Управление
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-white">PowerGym</CardTitle>
                <CardDescription className="text-gray-400">Тренажерный зал</CardDescription>
              </div>
              <span className="px-2 py-1 bg-green-600 text-white text-xs rounded">Активен</span>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center text-gray-300">
              <MapPin className="h-4 w-4 mr-2" />
              <span className="text-sm">пр. Ленина, 25</span>
            </div>
            <div className="flex items-center text-gray-300">
              <Clock className="h-4 w-4 mr-2" />
              <span className="text-sm">24/7</span>
            </div>
            <div className="flex items-center text-gray-300">
              <Users className="h-4 w-4 mr-2" />
              <span className="text-sm">278 участников</span>
            </div>
            <Button variant="outline" className="w-full">
              Управление
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PartnerGyms;
