
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/auth_context";
import { SubscriptionPlan, Subscription, PromoCode } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  CreditCard, 
  Gift, 
  Tag, 
  Check, 
  Star,
  Clock,
  Users,
  HelpCircle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ClientSubscriptionNew = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [promoCode, setPromoCode] = useState("");
  const [giftEmail, setGiftEmail] = useState("");
  const [giftMessage, setGiftMessage] = useState("");
  const [selectedPlan, setSelectedPlan] = useState<string>("");

  // Получаем планы подписок
  const { data: plans, isLoading: plansLoading } = useQuery({
    queryKey: ["subscription-plans"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("subscription_plans")
        .select("*")
        .eq("is_active", true)
        .order("price", { ascending: true });

      if (error) throw error;
      return data as SubscriptionPlan[];
    },
  });

  // Получаем текущую подписку пользователя
  const { data: currentSubscription } = useQuery({
    queryKey: ["current-subscription", user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      const { data, error } = await supabase
        .from("subscriptions")
        .select("*")
        .eq("user_id", user.id)
        .eq("status", "active")
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data as Subscription | null;
    },
    enabled: !!user?.id,
  });

  const handlePromoCodeCheck = async () => {
    if (!promoCode.trim()) {
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: "Введите промокод",
      });
      return;
    }

    try {
      const { data, error } = await supabase
        .from("promo_codes")
        .select("*")
        .eq("code", promoCode.toUpperCase())
        .eq("active", true)
        .single();

      if (error || !data) {
        toast({
          variant: "destructive",
          title: "Промокод не найден",
          description: "Проверьте правильность введенного промокода",
        });
        return;
      }

      // Проверяем срок действия
      const now = new Date();
      if (data.valid_until && new Date(data.valid_until) < now) {
        toast({
          variant: "destructive",
          title: "Промокод истек",
          description: "Срок действия промокода закончился",
        });
        return;
      }

      if (data.valid_from && new Date(data.valid_from) > now) {
        toast({
          variant: "destructive",
          title: "Промокод неактивен",
          description: "Промокод еще не активен",
        });
        return;
      }

      // Проверяем лимит использования
      if (data.max_uses && data.current_uses >= data.max_uses) {
        toast({
          variant: "destructive",
          title: "Промокод исчерпан",
          description: "Превышен лимит использования промокода",
        });
        return;
      }

      toast({
        title: "Промокод применен!",
        description: `Скидка ${data.discount_percentage ? `${data.discount_percentage}%` : `${data.discount_amount}₽`}`,
      });

    } catch (error) {
      console.error("Error checking promo code:", error);
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: "Не удалось проверить промокод",
      });
    }
  };

  const faqItems = [
    {
      question: "Как работает абонемент?",
      answer: "Абонемент дает доступ к фитнес-залам партнеров в течение выбранного периода. Вы можете посещать любые залы из сети без дополнительной оплаты."
    },
    {
      question: "Можно ли заморозить абонемент?",
      answer: "Да, абонемент можно заморозить на срок до 30 дней. Обратитесь в поддержку для оформления заморозки."
    },
    {
      question: "Что включает в себя Premium абонемент?",
      answer: "Premium включает доступ ко всем залам, персональные тренировки, консультации по питанию и приоритетную поддержку."
    },
    {
      question: "Можно ли вернуть деньги за абонемент?",
      answer: "Возврат возможен в течение 14 дней с момента покупки при условии, что абонемент не использовался."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Абонементы</h1>
          <p className="text-gray-600">Выберите подходящий план и получите доступ к сети фитнес-залов</p>
        </div>

        <Tabs defaultValue="plans" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="plans" className="gap-2">
              <CreditCard className="h-4 w-4" />
              Планы
            </TabsTrigger>
            <TabsTrigger value="promo" className="gap-2">
              <Tag className="h-4 w-4" />
              Промокод
            </TabsTrigger>
            <TabsTrigger value="gift" className="gap-2">
              <Gift className="h-4 w-4" />
              Подарок
            </TabsTrigger>
            <TabsTrigger value="faq" className="gap-2">
              <HelpCircle className="h-4 w-4" />
              FAQ
            </TabsTrigger>
          </TabsList>

          {/* Планы абонементов */}
          <TabsContent value="plans">
            {/* Текущая подписка */}
            {currentSubscription && (
              <Card className="mb-6 border-green-200 bg-green-50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-green-800">
                    <Check className="h-5 w-5" />
                    Активный абонемент
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold">{currentSubscription.plan_name}</p>
                      <p className="text-sm text-gray-600">
                        Действует до: {currentSubscription.end_date && new Date(currentSubscription.end_date).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge className="bg-green-100 text-green-800">
                      {currentSubscription.status === 'active' ? 'Активен' : currentSubscription.status}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {plansLoading ? (
                [...Array(3)].map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <CardContent className="p-6">
                      <div className="h-6 bg-gray-200 rounded mb-4"></div>
                      <div className="h-8 bg-gray-200 rounded mb-4"></div>
                      <div className="space-y-2">
                        <div className="h-3 bg-gray-200 rounded"></div>
                        <div className="h-3 bg-gray-200 rounded"></div>
                        <div className="h-3 bg-gray-200 rounded"></div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                plans?.map((plan, index) => (
                  <Card 
                    key={plan.id} 
                    className={`relative ${index === 1 ? 'border-blue-500 shadow-lg scale-105' : ''}`}
                  >
                    {index === 1 && (
                      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                        <Badge className="bg-blue-500 text-white gap-1">
                          <Star className="h-3 w-3" />
                          Популярный
                        </Badge>
                      </div>
                    )}
                    
                    <CardHeader className="text-center">
                      <CardTitle className="text-xl">{plan.name}</CardTitle>
                      <div className="text-3xl font-bold text-blue-600">
                        {plan.price}₽
                        <span className="text-sm font-normal text-gray-500">
                          /{plan.duration_days} дн.
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm">{plan.description}</p>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        {plan.features?.map((feature, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <Check className="h-4 w-4 text-green-500" />
                            <span className="text-sm">{feature}</span>
                          </div>
                        ))}
                      </div>
                      
                      <div className="pt-4">
                        <Button 
                          className="w-full" 
                          variant={index === 1 ? "default" : "outline"}
                          onClick={() => setSelectedPlan(plan.id)}
                        >
                          {currentSubscription ? 'Сменить план' : 'Выбрать план'}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          {/* Промокод */}
          <TabsContent value="promo">
            <Card className="max-w-md mx-auto">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Tag className="h-5 w-5" />
                  Активировать промокод
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Input
                    placeholder="Введите промокод"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                    className="text-center font-mono text-lg"
                  />
                </div>
                <Button 
                  onClick={handlePromoCodeCheck}
                  className="w-full"
                  disabled={!promoCode.trim()}
                >
                  Применить промокод
                </Button>
                <div className="text-center text-sm text-gray-500">
                  Промокод дает скидку на покупку абонемента
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Подарочный абонемент */}
          <TabsContent value="gift">
            <Card className="max-w-lg mx-auto">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gift className="h-5 w-5" />
                  Подарить абонемент
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Email получателя</label>
                  <Input
                    type="email"
                    placeholder="friend@example.com"
                    value={giftEmail}
                    onChange={(e) => setGiftEmail(e.target.value)}
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium">Сообщение (необязательно)</label>
                  <textarea
                    className="w-full px-3 py-2 border rounded-md resize-none"
                    rows={3}
                    placeholder="Поздравляю с Днем Рождения! Желаю здоровья и отличного настроения!"
                    value={giftMessage}
                    onChange={(e) => setGiftMessage(e.target.value)}
                  />
                </div>

                {plans && (
                  <div>
                    <label className="text-sm font-medium">Выберите план</label>
                    <select
                      className="w-full px-3 py-2 border rounded-md bg-white"
                      value={selectedPlan}
                      onChange={(e) => setSelectedPlan(e.target.value)}
                    >
                      <option value="">Выберите план</option>
                      {plans.map((plan) => (
                        <option key={plan.id} value={plan.id}>
                          {plan.name} - {plan.price}₽
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <Button 
                  className="w-full"
                  disabled={!giftEmail || !selectedPlan}
                >
                  Подарить абонемент
                </Button>

                <div className="text-center text-sm text-gray-500">
                  Получатель получит email с инструкциями по активации
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* FAQ */}
          <TabsContent value="faq">
            <div className="max-w-3xl mx-auto space-y-4">
              <h2 className="text-2xl font-semibold text-center mb-6">Часто задаваемые вопросы</h2>
              
              {faqItems.map((item, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="text-lg">{item.question}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">{item.answer}</p>
                  </CardContent>
                </Card>
              ))}

              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="p-6 text-center">
                  <HelpCircle className="h-12 w-12 text-blue-500 mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">Не нашли ответ?</h3>
                  <p className="text-gray-600 mb-4">Свяжитесь с нашей службой поддержки</p>
                  <Button variant="outline">Написать в поддержку</Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ClientSubscriptionNew;
