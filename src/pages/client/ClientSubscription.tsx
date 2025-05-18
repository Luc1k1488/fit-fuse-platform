import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, CreditCard, AlertTriangle, Check } from "lucide-react";

const ClientSubscription = () => {
  const [activeTab, setActiveTab] = useState("current");
  
  // Тестовые данные для подписки
  const subscriptionData = {
    currentPlan: {
      name: "Премиум",
      status: "active",
      startDate: "2023-05-01",
      endDate: "2023-08-01",
      price: "2990₽",
      period: "месяц",
      features: [
        "Доступ ко всем залам-партнерам",
        "До 30 посещений в месяц",
        "Групповые тренировки",
        "Бесплатная заморозка до 14 дней",
        "Специальные цены на персональные тренировки"
      ],
      daysLeft: 47,
      totalDays: 92,
      visitsUsed: 18,
      visitsTotal: 30
    },
    history: [
      {
        id: "sub-1",
        name: "Стандарт",
        startDate: "2023-02-01",
        endDate: "2023-05-01",
        price: "1790₽",
        period: "месяц",
        status: "completed"
      },
      {
        id: "sub-2",
        name: "Пробный",
        startDate: "2023-01-15",
        endDate: "2023-02-01",
        price: "990₽",
        period: "2 недели",
        status: "completed"
      }
    ]
  };
  
  // Форматирование даты
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('ru-RU', options);
  };
  
  return (
    <div className="pb-16">
      <h1 className="text-2xl font-bold mb-4">Моя подписка</h1>
      
      <Tabs defaultValue="current" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full grid grid-cols-2 mb-6">
          <TabsTrigger value="current">Текущая</TabsTrigger>
          <TabsTrigger value="history">История</TabsTrigger>
        </TabsList>
        
        {/* Текущая подписка */}
        <TabsContent value="current">
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-xl font-bold">{subscriptionData.currentPlan.name}</h2>
                  <p className="text-gray-500">{subscriptionData.currentPlan.price} / {subscriptionData.currentPlan.period}</p>
                </div>
                <Badge>{subscriptionData.currentPlan.status === "active" ? "Активна" : "Неактивна"}</Badge>
              </div>
              
              <div className="space-y-4 mb-6">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Срок действия:</span>
                    <span className="font-medium">
                      {formatDate(subscriptionData.currentPlan.startDate)} - {formatDate(subscriptionData.currentPlan.endDate)}
                    </span>
                  </div>
                  <Progress value={(subscriptionData.currentPlan.daysLeft / subscriptionData.currentPlan.totalDays) * 100} />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Осталось {subscriptionData.currentPlan.daysLeft} дней</span>
                    <span>{Math.round((subscriptionData.currentPlan.daysLeft / subscriptionData.currentPlan.totalDays) * 100)}%</span>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Посещения в этом месяце:</span>
                    <span className="font-medium">
                      {subscriptionData.currentPlan.visitsUsed} / {subscriptionData.currentPlan.visitsTotal}
                    </span>
                  </div>
                  <Progress value={(subscriptionData.currentPlan.visitsUsed / subscriptionData.currentPlan.visitsTotal) * 100} />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Использовано {subscriptionData.currentPlan.visitsUsed} из {subscriptionData.currentPlan.visitsTotal}</span>
                    <span>{Math.round((subscriptionData.currentPlan.visitsUsed / subscriptionData.currentPlan.visitsTotal) * 100)}%</span>
                  </div>
                </div>
              </div>
              
              <div className="mb-6">
                <h3 className="font-medium mb-2">Включено в подписку:</h3>
                <ul className="space-y-2">
                  {subscriptionData.currentPlan.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-sm">
                      <Check className="h-4 w-4 text-green-500 mr-2" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="space-y-3">
                <Button className="w-full">Продлить подписку</Button>
                <Button variant="outline" className="w-full">Приостановить подписку</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* История подписок */}
        <TabsContent value="history">
          <div className="space-y-4">
            {subscriptionData.history.map((subscription) => (
              <Card key={subscription.id} className="overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{subscription.name}</h3>
                      <p className="text-gray-600 text-sm">{subscription.price} / {subscription.period}</p>
                    </div>
                    <Badge variant="outline">
                      {subscription.status === "completed" ? "Завершена" : "Отменена"}
                    </Badge>
                  </div>
                  
                  <div className="mt-3 flex items-center text-sm text-gray-600">
                    <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                    <span>
                      {formatDate(subscription.startDate)} - {formatDate(subscription.endDate)}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
      
      <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg flex">
        <AlertTriangle className="text-amber-500 h-5 w-5 mr-3 flex-shrink-0" />
        <div>
          <p className="text-sm text-amber-800 font-medium">Автопродление активно</p>
          <p className="text-xs text-amber-600 mt-1">
            Ваша подписка будет автоматически продлена 1 августа 2023. Вы можете отключить автопродление в настройках оплаты.
          </p>
        </div>
      </div>
      
      <div className="mt-6">
        <h2 className="text-lg font-medium mb-3">Способы оплаты</h2>
        <Card>
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <div className="mr-3 bg-gray-100 p-2 rounded-md">
                  <CreditCard className="h-5 w-5 text-gray-600" />
                </div>
                <div>
                  <p className="font-medium">•••• 4832</p>
                  <p className="text-xs text-gray-500">Истекает 06/25</p>
                </div>
              </div>
              <Button variant="ghost" size="sm">
                Изменить
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ClientSubscription;
