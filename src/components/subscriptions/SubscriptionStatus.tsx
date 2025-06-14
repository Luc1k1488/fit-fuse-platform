
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, CreditCard, Gift } from "lucide-react";
import { format } from "date-fns";
import { ru } from "date-fns/locale";

interface Subscription {
  id: string;
  plan_name: string;
  status: string;
  start_date: string;
  end_date: string;
  price: number;
}

interface SubscriptionStatusProps {
  subscription: Subscription | null;
  onUpgrade: () => void;
  onRenew: () => void;
}

export const SubscriptionStatus: React.FC<SubscriptionStatusProps> = ({
  subscription,
  onUpgrade,
  onRenew
}) => {
  if (!subscription) {
    return (
      <Card className="border-dashed border-2">
        <CardContent className="p-8 text-center">
          <CreditCard className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold mb-2">У вас нет активной подписки</h3>
          <p className="text-gray-600 mb-4">
            Выберите подходящий тарифный план для доступа ко всем функциям
          </p>
          <Button onClick={onUpgrade} className="bg-purple-600 hover:bg-purple-700">
            Выбрать план
          </Button>
        </CardContent>
      </Card>
    );
  }

  const isActive = subscription.status === 'active';
  const endDate = new Date(subscription.end_date);
  const daysLeft = Math.ceil((endDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
  const isExpiring = daysLeft <= 7;

  return (
    <Card className={isActive ? 'border-green-200' : 'border-red-200'}>
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Текущая подписка
          </CardTitle>
          <Badge 
            variant={isActive ? 'default' : 'destructive'}
            className={isActive ? 'bg-green-600' : ''}
          >
            {isActive ? 'Активна' : 'Неактивна'}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold text-lg">{subscription.plan_name}</h3>
          <p className="text-2xl font-bold text-purple-600 mt-1">
            {subscription.price.toLocaleString()} ₽
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gray-500" />
            <div>
              <p className="text-gray-500">Начало</p>
              <p className="font-medium">
                {format(new Date(subscription.start_date), "d MMM yyyy", { locale: ru })}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-gray-500" />
            <div>
              <p className="text-gray-500">Окончание</p>
              <p className="font-medium">
                {format(endDate, "d MMM yyyy", { locale: ru })}
              </p>
            </div>
          </div>
        </div>

        {isActive && (
          <div className={`p-3 rounded-lg ${isExpiring ? 'bg-orange-50 border border-orange-200' : 'bg-green-50 border border-green-200'}`}>
            <p className={`text-sm font-medium ${isExpiring ? 'text-orange-800' : 'text-green-800'}`}>
              {isExpiring 
                ? `Подписка истекает через ${daysLeft} дней`
                : `Осталось ${daysLeft} дней до окончания`
              }
            </p>
          </div>
        )}

        <div className="flex gap-2 pt-2">
          <Button
            onClick={onUpgrade}
            variant="outline"
            className="flex-1"
          >
            <Gift className="h-4 w-4 mr-2" />
            Изменить план
          </Button>
          {isActive && isExpiring && (
            <Button
              onClick={onRenew}
              className="flex-1 bg-purple-600 hover:bg-purple-700"
            >
              Продлить
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
