
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, CreditCard, Gift } from "lucide-react";
import { toast } from "sonner";

interface SubscriptionManagerProps {
  subscription?: {
    id: string;
    plan_name: string;
    status: string;
    start_date: string;
    end_date: string;
    price: number;
  };
}

export const SubscriptionManager = ({ subscription }: SubscriptionManagerProps) => {
  const handleUpgrade = () => {
    toast.info("Функция обновления подписки в разработке");
  };

  const handleCancel = () => {
    toast.info("Функция отмены подписки в разработке");
  };

  const handleRenew = () => {
    toast.info("Функция продления подписки в разработке");
  };

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(new Date(dateString));
  };

  if (!subscription) {
    return (
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <CreditCard className="h-5 w-5 mr-2" />
            Подписка
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-gray-400 mb-4">У вас нет активной подписки</p>
          <Button onClick={handleUpgrade}>
            <Gift className="h-4 w-4 mr-2" />
            Выбрать план
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center justify-between">
          <span className="flex items-center">
            <CreditCard className="h-5 w-5 mr-2" />
            Подписка
          </span>
          <Badge variant={subscription.status === 'active' ? 'default' : 'secondary'}>
            {subscription.status === 'active' ? 'Активна' : subscription.status}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="font-medium text-white">{subscription.plan_name}</h3>
          <p className="text-sm text-gray-400">{subscription.price} ₽/мес</p>
        </div>
        
        <div className="flex items-center text-sm text-gray-400">
          <Calendar className="h-4 w-4 mr-2" />
          <span>
            {formatDate(subscription.start_date)} - {formatDate(subscription.end_date)}
          </span>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleUpgrade}>
            Обновить план
          </Button>
          <Button variant="outline" size="sm" onClick={handleRenew}>
            Продлить
          </Button>
          <Button variant="destructive" size="sm" onClick={handleCancel}>
            Отменить
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
