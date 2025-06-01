
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MessageCircle, User, Clock } from "lucide-react";

const SupportChats = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Чаты поддержки</h1>
        <p className="text-gray-400">Активные чаты с пользователями</p>
      </div>

      <div className="space-y-4">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div className="flex items-center space-x-3">
                <User className="h-8 w-8 text-gray-400" />
                <div>
                  <CardTitle className="text-white">Анна Иванова</CardTitle>
                  <CardDescription className="text-gray-400">
                    Чат #001 • Проблема с оплатой
                  </CardDescription>
                </div>
              </div>
              <Badge className="bg-green-600">Активен</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-gray-700 p-3 rounded-lg">
              <p className="text-gray-300 text-sm">
                Последнее сообщение: "Спасибо за помощь! Теперь все работает правильно."
              </p>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 text-gray-400 text-sm">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  5 минут назад
                </div>
                <div className="flex items-center">
                  <MessageCircle className="h-4 w-4 mr-1" />
                  12 сообщений
                </div>
              </div>
              <Button size="sm">
                Открыть чат
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div className="flex items-center space-x-3">
                <User className="h-8 w-8 text-gray-400" />
                <div>
                  <CardTitle className="text-white">Петр Сидоров</CardTitle>
                  <CardDescription className="text-gray-400">
                    Чат #002 • Техническая поддержка
                  </CardDescription>
                </div>
              </div>
              <Badge variant="secondary" className="bg-yellow-600">Ожидает</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-gray-700 p-3 rounded-lg">
              <p className="text-gray-300 text-sm">
                Последнее сообщение: "Можете помочь с настройкой уведомлений?"
              </p>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 text-gray-400 text-sm">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  15 минут назад
                </div>
                <div className="flex items-center">
                  <MessageCircle className="h-4 w-4 mr-1" />
                  3 сообщения
                </div>
              </div>
              <Button size="sm">
                Ответить
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div className="flex items-center space-x-3">
                <User className="h-8 w-8 text-gray-400" />
                <div>
                  <CardTitle className="text-white">Мария Петрова</CardTitle>
                  <CardDescription className="text-gray-400">
                    Чат #003 • Вопрос по абонементу
                  </CardDescription>
                </div>
              </div>
              <Badge variant="outline" className="text-gray-400">Завершен</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-gray-700 p-3 rounded-lg">
              <p className="text-gray-300 text-sm">
                Последнее сообщение: "Отлично, вопрос решен. Спасибо за помощь!"
              </p>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 text-gray-400 text-sm">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  2 часа назад
                </div>
                <div className="flex items-center">
                  <MessageCircle className="h-4 w-4 mr-1" />
                  8 сообщений
                </div>
              </div>
              <Button size="sm" variant="outline">
                Просмотр истории
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SupportChats;
