
import { useState } from "react";
import { CreditCard, Clock, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { SubscriptionCard } from "@/components/client/subscriptions/SubscriptionCard";

interface SubscriptionPlan {
  id: string;
  name: string;
  price: string;
  period: string;
  image: string;
  description: string;
  features: string[];
  popular?: boolean;
  current?: boolean;
}

const ClientSubscription = () => {
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  // Тестовые данные абонементов с изображениями
  const subscriptionPlans: SubscriptionPlan[] = [
    {
      id: "basic",
      name: "Базовый",
      price: "1 990 ₽",
      period: "месяц",
      image: "/placeholder.svg",
      description: "Идеально для начинающих",
      features: [
        "Доступ к 20 фитнес-центрам",
        "3 посещения в неделю",
        "Стандартные часы посещения",
        "Онлайн-бронирование",
        "Базовая поддержка"
      ]
    },
    {
      id: "standard",
      name: "Стандарт",
      price: "3 990 ₽", 
      period: "месяц",
      image: "/placeholder.svg",
      description: "Оптимальный выбор для регулярных тренировок",
      features: [
        "Доступ к 50 фитнес-центрам",
        "5 посещений в неделю",
        "Расширенные часы посещения",
        "Приоритетное бронирование",
        "Персональный тренер (1 раз в месяц)",
        "Доступ к групповым занятиям",
        "Приоритетная поддержка"
      ],
      popular: true
    },
    {
      id: "premium",
      name: "Премиум",
      price: "7 990 ₽",
      period: "месяц", 
      image: "/placeholder.svg",
      description: "Максимальные возможности для энтузиастов",
      features: [
        "Безлимитный доступ ко всем фитнес-центрам",
        "Неограниченное количество посещений",
        "Круглосуточный доступ",
        "VIP-бронирование",
        "Персональный тренер (4 раза в месяц)",
        "Доступ ко всем групповым занятиям",
        "Премиум-поддержка 24/7",
        "Эксклюзивные мастер-классы",
        "Специальные скидки"
      ],
      current: true
    }
  ];

  const handlePlanClick = (plan: SubscriptionPlan) => {
    setSelectedPlan(plan);
    setShowDetails(true);
  };

  const currentPlan = subscriptionPlans.find(plan => plan.current);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Заголовок */}
      <div className="bg-white border-b px-4 py-6">
        <h1 className="text-2xl font-bold text-gray-900">Абонементы</h1>
        <p className="text-gray-600 mt-1">Выберите подходящий тариф</p>
      </div>

      <div className="px-4 py-6 space-y-6">
        {/* Текущий абонемент */}
        {currentPlan && (
          <Card className="bg-gradient-to-r from-purple-500 to-blue-600 text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Текущий абонемент
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-bold">{currentPlan.name}</h3>
                  <p className="text-white/90">{currentPlan.description}</p>
                  <p className="text-white/80 mt-2">
                    <Clock className="h-4 w-4 inline mr-1" />
                    Действует до: 15.03.2025
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold">{currentPlan.price}</p>
                  <p className="text-white/80">/{currentPlan.period}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Доступные планы */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Доступные тарифы
          </h2>
          
          <div className="space-y-4">
            {subscriptionPlans.map((plan) => (
              <SubscriptionCard
                key={plan.id}
                plan={plan}
                onClick={handlePlanClick}
              />
            ))}
          </div>
        </div>

        {/* Преимущества */}
        <Card className="bg-white border-gray-200">
          <CardHeader>
            <CardTitle className="text-lg">Преимущества GoodFit</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">100+</div>
                <div className="text-sm text-gray-600">Фитнес-центров</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">24/7</div>
                <div className="text-sm text-gray-600">Поддержка</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">∞</div>
                <div className="text-sm text-gray-600">Гибкость</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">4.9</div>
                <div className="text-sm text-gray-600">Рейтинг</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Диалог с деталями плана */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="bg-white">
          {selectedPlan && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedPlan.name}</DialogTitle>
                <DialogDescription>
                  {selectedPlan.description}
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                <div className="flex items-baseline">
                  <span className="text-3xl font-bold text-gray-900">
                    {selectedPlan.price}
                  </span>
                  <span className="text-gray-500 ml-1">
                    /{selectedPlan.period}
                  </span>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">
                    Что входит в тариф:
                  </h4>
                  <ul className="space-y-1">
                    {selectedPlan.features.map((feature, index) => (
                      <li key={index} className="text-sm text-gray-600">
                        • {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button 
                    className="flex-1"
                    disabled={selectedPlan.current}
                  >
                    {selectedPlan.current ? 'Текущий план' : 'Выбрать план'}
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setShowDetails(false)}
                  >
                    Закрыть
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ClientSubscription;
