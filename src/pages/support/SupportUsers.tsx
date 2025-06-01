
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { User, Mail, Phone, Calendar } from "lucide-react";

const SupportUsers = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Пользователи</h1>
        <p className="text-gray-400">Управление пользователями системы</p>
      </div>

      <div className="space-y-4">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div className="flex items-center space-x-3">
                <User className="h-10 w-10 text-gray-400" />
                <div>
                  <CardTitle className="text-white">Анна Иванова</CardTitle>
                  <CardDescription className="text-gray-400">ID: #12345</CardDescription>
                </div>
              </div>
              <Badge className="bg-green-600">Активен</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center text-gray-300">
                <Mail className="h-4 w-4 mr-2" />
                <span className="text-sm">anna@example.com</span>
              </div>
              <div className="flex items-center text-gray-300">
                <Phone className="h-4 w-4 mr-2" />
                <span className="text-sm">+7 (999) 123-45-67</span>
              </div>
              <div className="flex items-center text-gray-300">
                <Calendar className="h-4 w-4 mr-2" />
                <span className="text-sm">Регистрация: 15.03.2024</span>
              </div>
              <div className="flex items-center text-gray-300">
                <span className="text-sm">Последняя активность: 2 часа назад</span>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button size="sm" variant="outline">
                Просмотр профиля
              </Button>
              <Button size="sm" variant="outline">
                История обращений
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div className="flex items-center space-x-3">
                <User className="h-10 w-10 text-gray-400" />
                <div>
                  <CardTitle className="text-white">Петр Сидоров</CardTitle>
                  <CardDescription className="text-gray-400">ID: #12346</CardDescription>
                </div>
              </div>
              <Badge className="bg-green-600">Активен</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center text-gray-300">
                <Mail className="h-4 w-4 mr-2" />
                <span className="text-sm">peter@test.com</span>
              </div>
              <div className="flex items-center text-gray-300">
                <Phone className="h-4 w-4 mr-2" />
                <span className="text-sm">+7 (999) 987-65-43</span>
              </div>
              <div className="flex items-center text-gray-300">
                <Calendar className="h-4 w-4 mr-2" />
                <span className="text-sm">Регистрация: 20.02.2024</span>
              </div>
              <div className="flex items-center text-gray-300">
                <span className="text-sm">Последняя активность: 1 день назад</span>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button size="sm" variant="outline">
                Просмотр профиля
              </Button>
              <Button size="sm" variant="outline">
                История обращений
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div className="flex items-center space-x-3">
                <User className="h-10 w-10 text-gray-400" />
                <div>
                  <CardTitle className="text-white">Мария Петрова</CardTitle>
                  <CardDescription className="text-gray-400">ID: #12347</CardDescription>
                </div>
              </div>
              <Badge variant="secondary" className="bg-yellow-600">Заблокирован</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center text-gray-300">
                <Mail className="h-4 w-4 mr-2" />
                <span className="text-sm">maria@mail.ru</span>
              </div>
              <div className="flex items-center text-gray-300">
                <Phone className="h-4 w-4 mr-2" />
                <span className="text-sm">+7 (999) 555-33-22</span>
              </div>
              <div className="flex items-center text-gray-300">
                <Calendar className="h-4 w-4 mr-2" />
                <span className="text-sm">Регистрация: 10.01.2024</span>
              </div>
              <div className="flex items-center text-gray-300">
                <span className="text-sm">Последняя активность: 1 неделю назад</span>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button size="sm" variant="outline">
                Разблокировать
              </Button>
              <Button size="sm" variant="outline">
                История обращений
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SupportUsers;
