
import { useState } from "react";
import { Calendar, CreditCard, Check, X, Crown, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

const ClientSubscription = () => {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const subscriptionPlans = [
    {
      id: "standard",
      name: "Стандарт",
      price: 1500,
      duration: "1 месяц",
      features: [
        "Доступ ко всем залам",
        "До 12 тренировок в месяц",
        "Отмена за 1 час до занятия",
        "Поддержка приложения",
      ],
      badge: null,
    },
    {
      id: "premium",
      name: "Премиум",
      price: 2500,
      duration: "1 месяц",
      features: [
        "Неограниченное количество тренировок",
        "Доступ к премиум-залам",
        "Отмена за 30 минут до занятия",
        "Приоритетная запись на занятия",
        "Персональная поддержка 24/7",
      ],
      badge: "Популярный",
      recommended: true,
    },
    {
      id: "pro",
      name: "Про",
      price: 3500,
      duration: "1 месяц",
      features: [
        "Все преимущества Премиум",
        "Персональные тренировки (2 в месяц)",
        "Составление индивидуального плана",
        "Консультации с тренером",
        "VIP-доступ к новым залам",
      ],
      badge: "Все включено",
    },
  ];

  const activeSubscription = {
    plan: "Стандарт",
    startDate: "01.05.2024",
    endDate: "01.06.2024",
    status: "active",
    nextPayment: 1500,
    nextPaymentDate: "01.06.2024",
  };

  const handleSelectPlan = (planId: string) => {
    setSelectedPlan(planId);
  };

  const handleSubscribe = () => {
    if (!selectedPlan) return;
    
    const plan = subscriptionPlans.find(p => p.id === selectedPlan);
    if (!plan) return;
    
    toast.success(`Подписка оформлена!`, {
      description: `Вы успешно оформили подписку "${plan.name}"`
    });
  };

  const handleCancelSubscription = () => {
    toast({
      title: "Подписка отменена",
      description: "Подписка будет активна до конца оплаченного периода",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 pb-16">
      {/* Header */}
      <div className="bg-slate-900/50 backdrop-blur-sm border-b border-slate-700 px-4 py-6">
        <h1 className="text-2xl font-bold text-white mb-2">Подписки</h1>
        <p className="text-slate-300">Выберите подходящий план для тренировок</p>
      </div>

      <div className="px-4 py-6 space-y-6">
        <Tabs defaultValue="plans" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-slate-800/50 backdrop-blur-sm border-slate-700">
            <TabsTrigger 
              value="plans"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-blue-600 text-white"
            >
              Планы
            </TabsTrigger>
            <TabsTrigger 
              value="active"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-blue-600 text-white"
            >
              Текущая подписка
            </TabsTrigger>
          </TabsList>

          <TabsContent value="plans" className="space-y-6 mt-6">
            <div className="grid gap-6 md:grid-cols-3">
              {subscriptionPlans.map((plan) => (
                <Card 
                  key={plan.id}
                  className={`bg-slate-800/50 backdrop-blur-sm border-slate-700 relative transition-all ${
                    selectedPlan === plan.id 
                      ? 'border-purple-500 ring-1 ring-purple-500' 
                      : 'hover:border-slate-600'
                  } ${
                    plan.recommended 
                      ? 'ring-2 ring-purple-500'
                      : ''
                  }`}
                >
                  {plan.badge && (
                    <div className="absolute -top-3 right-4 bg-purple-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                      {plan.badge}
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      {plan.name === "Премиум" && <Crown className="h-5 w-5 mr-2 text-yellow-400" />}
                      {plan.name === "Про" && <Star className="h-5 w-5 mr-2 text-purple-400" />}
                      {plan.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-white mb-2">
                      {plan.price} ₽
                      <span className="text-sm font-normal text-slate-400">/{plan.duration}</span>
                    </div>
                    <ul className="space-y-2 mb-6">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-start">
                          <Check className="h-5 w-5 text-green-400 mr-2 shrink-0" />
                          <span className="text-slate-300 text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button
                      onClick={() => handleSelectPlan(plan.id)}
                      className={`w-full ${
                        selectedPlan === plan.id
                          ? 'bg-purple-600 hover:bg-purple-700'
                          : 'bg-slate-700 hover:bg-slate-600'
                      }`}
                    >
                      {selectedPlan === plan.id ? "Выбрано" : "Выбрать"}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Информация о подписке</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-white font-medium mb-2">Выбранный план</h3>
                    {selectedPlan ? (
                      <div className="bg-slate-700/50 rounded-lg p-4">
                        <div className="flex justify-between mb-2">
                          <span className="text-white font-medium">
                            {subscriptionPlans.find(p => p.id === selectedPlan)?.name}
                          </span>
                          <span className="text-white">
                            {subscriptionPlans.find(p => p.id === selectedPlan)?.price} ₽
                          </span>
                        </div>
                        <div className="flex justify-between text-slate-400 text-sm">
                          <span>Длительность</span>
                          <span>{subscriptionPlans.find(p => p.id === selectedPlan)?.duration}</span>
                        </div>
                      </div>
                    ) : (
                      <p className="text-slate-400 text-center py-4">
                        Выберите план подписки выше
                      </p>
                    )}
                  </div>

                  <div className="flex justify-between pt-4 border-t border-slate-700">
                    <span className="text-white font-medium">К оплате</span>
                    <span className="text-white font-bold">
                      {selectedPlan
                        ? `${subscriptionPlans.find(p => p.id === selectedPlan)?.price} ₽`
                        : '0 ₽'
                      }
                    </span>
                  </div>

                  <Button
                    onClick={handleSubscribe}
                    className="w-full bg-purple-600 hover:bg-purple-700"
                    disabled={!selectedPlan}
                  >
                    <CreditCard className="h-4 w-4 mr-2" />
                    Оформить подписку
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="active" className="space-y-6 mt-6">
            {activeSubscription ? (
              <>
                <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-white">Текущая подписка</CardTitle>
                      <span className="bg-green-600/30 text-green-300 px-3 py-1 rounded-full text-xs">
                        Активна
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center pb-4 border-b border-slate-700">
                        <div>
                          <h3 className="text-white font-medium">{activeSubscription.plan}</h3>
                          <p className="text-slate-400 text-sm">Ежемесячная подписка</p>
                        </div>
                        <span className="text-white text-xl font-bold">{activeSubscription.nextPayment} ₽</span>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-slate-400 text-sm">Начало</p>
                          <p className="text-white">{activeSubscription.startDate}</p>
                        </div>
                        <div>
                          <p className="text-slate-400 text-sm">Окончание</p>
                          <p className="text-white">{activeSubscription.endDate}</p>
                        </div>
                      </div>

                      <div>
                        <p className="text-slate-400 text-sm">Следующее списание</p>
                        <div className="flex items-center gap-2 text-white">
                          <Calendar className="h-4 w-4" />
                          <span>{activeSubscription.nextPaymentDate}</span>
                        </div>
                      </div>

                      <Button
                        variant="outline"
                        className="w-full border-red-700 text-red-400 hover:bg-red-900/20"
                        onClick={handleCancelSubscription}
                      >
                        <X className="h-4 w-4 mr-2" />
                        Отменить подписку
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white">История платежей</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="bg-slate-700/30 rounded-lg p-3 flex justify-between items-center">
                        <div>
                          <p className="text-white font-medium">{activeSubscription.plan}</p>
                          <p className="text-slate-400 text-sm">01.05.2024</p>
                        </div>
                        <span className="text-white">{activeSubscription.nextPayment} ₽</span>
                      </div>
                      <div className="bg-slate-700/30 rounded-lg p-3 flex justify-between items-center">
                        <div>
                          <p className="text-white font-medium">{activeSubscription.plan}</p>
                          <p className="text-slate-400 text-sm">01.04.2024</p>
                        </div>
                        <span className="text-white">{activeSubscription.nextPayment} ₽</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
                <CardContent className="p-8 text-center">
                  <CreditCard className="h-12 w-12 mx-auto text-slate-400 mb-4" />
                  <h3 className="text-white font-semibold mb-2">У вас нет активной подписки</h3>
                  <p className="text-slate-400 mb-4">
                    Оформите подписку, чтобы получить доступ ко всем залам сети
                  </p>
                  <Button onClick={() => document.querySelector('[data-state="inactive"][value="plans"]')?.click()}>
                    Выбрать план
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ClientSubscription;
