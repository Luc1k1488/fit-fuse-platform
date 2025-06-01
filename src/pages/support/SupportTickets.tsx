
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, User, MessageCircle } from "lucide-react";

const SupportTickets = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Тикеты поддержки</h1>
        <p className="text-gray-400">Управляйте обращениями пользователей</p>
      </div>

      <div className="space-y-4">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-white">#001 - Проблема с оплатой</CardTitle>
                <CardDescription className="text-gray-400">
                  Создан 2 часа назад • user@example.com
                </CardDescription>
              </div>
              <Badge variant="destructive">Высокий</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-300">
              Не могу оплатить абонемент, карта не проходит. Помогите разобраться с проблемой.
            </p>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 text-gray-400 text-sm">
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-1" />
                  Анна Иванова
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  2 часа назад
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
              <div>
                <CardTitle className="text-white">#002 - Не работает бронирование</CardTitle>
                <CardDescription className="text-gray-400">
                  Создан 5 часов назад • client@test.com
                </CardDescription>
              </div>
              <Badge variant="secondary" className="bg-yellow-600">Средний</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-300">
              При попытке забронировать занятие получаю ошибку. Браузер Chrome, последняя версия.
            </p>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 text-gray-400 text-sm">
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-1" />
                  Петр Сидоров
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  5 часов назад
                </div>
                <div className="flex items-center">
                  <MessageCircle className="h-4 w-4 mr-1" />
                  1 сообщение
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
              <div>
                <CardTitle className="text-white">#003 - Вопрос по абонементу</CardTitle>
                <CardDescription className="text-gray-400">
                  Создан 1 день назад • info@mail.ru
                </CardDescription>
              </div>
              <Badge variant="outline" className="text-gray-400">Низкий</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-300">
              Можно ли заморозить абонемент на время отпуска? Если да, то как это сделать?
            </p>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 text-gray-400 text-sm">
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-1" />
                  Мария Петрова
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  1 день назад
                </div>
                <div className="flex items-center">
                  <MessageCircle className="h-4 w-4 mr-1" />
                  2 сообщения
                </div>
              </div>
              <Button size="sm">
                Ответить
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SupportTickets;
