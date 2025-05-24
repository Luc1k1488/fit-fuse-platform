
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
  bonus?: string;
  dailyCost?: string;
}

const ClientSubscription = () => {
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  const subscriptionPlans: SubscriptionPlan[] = [
    {
      id: "basic",
      name: "Стандарт",
      price: "12 600 ₽",
      period: "90 дней",
      dailyCost: "~140 ₽/день",
      image: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=400&h=300&fit=crop",
      description: "Идеально для начинающих",
      features: [
        "Доступ к 20+ фитнес-центрам Махачкалы",
        "Безлимитные посещения",
        "Онлайн-бронирование",
        "Мобильное приложение",
        "Техническая поддержка"
      ]
    },
    {
      id: "standard",
      name: "Премиум", 
      price: "23 400 ₽",
      period: "180 дней",
      dailyCost: "~130 ₽/день",
      bonus: "+2 месяца",
      image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=300&fit=crop",
      description: "Лучший выбор для активных",
      features: [
        "Доступ ко всем фитнес-центрам",
        "Безлимитные посещения",
        "Приоритетное бронирование", 
        "Персональные консультации",
        "Скидки у партнеров",
        "VIP поддержка 24/7",
        "+2 месяца в подарок"
      ],
      popular: true
    },
    {
      id: "premium",
      name: "Платинум",
      price: "42 000 ₽",
      period: "365 дней", 
      dailyCost: "~115 ₽/день",
      bonus: "+3 месяца",
      image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&h=300&fit=crop",
      description: "Максимальная выгода на весь год",
      features: [
        "Доступ ко всем залам города",
        "Безлимитные посещения",
        "VIP-обслуживание",
        "Персональный менеджер",
        "Максимальные скидки",
        "Эксклюзивные мероприятия",
        "+3 месяца в подарок",
        "Заморозка до 60 дней"
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
    <div className="min-h-screen bg-white">
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
            <CardTitle className="text-lg text-gray-900">Преимущества GoodFit</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">20+</div>
                <div className="text-sm text-gray-600">Фитнес-центров</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">24/7</div>
                <div className="text-sm text-gray-600">Поддержка</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">∞</div>
                <div className="text-sm text-gray-600">Посещения</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">4.9</div>
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
                <DialogTitle className="text-gray-900">{selectedPlan.name}</DialogTitle>
                <DialogDescription className="text-gray-600">
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

                {selectedPlan.bonus && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <div className="text-green-800 font-medium">
                      🎁 Бонус: {selectedPlan.bonus}
                    </div>
                  </div>
                )}

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
                    className="flex-1 bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700"
                    disabled={selectedPlan.current}
                  >
                    {selectedPlan.current ? 'Текущий план' : 'Выбрать план'}
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setShowDetails(false)}
                    className="border-gray-300 text-gray-700 hover:bg-gray-50"
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
