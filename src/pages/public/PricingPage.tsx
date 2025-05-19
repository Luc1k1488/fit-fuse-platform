
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Check, ChevronLeft, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";

const PricingPage = () => {
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "yearly">("monthly");
  
  // Данные о тарифных планах
  const pricingPlans = [
    {
      id: "basic",
      title: "Базовый",
      description: "Для новичков и случайных посетителей",
      monthlyPrice: 1490,
      yearlyPrice: 14900,
      yearlyDiscount: "Экономия 20%",
      features: [
        "Доступ к 50+ залам",
        "4 занятия в месяц",
        "Базовое отслеживание тренировок",
        "Стандартная поддержка",
      ],
      popular: false,
      buttonText: "Начать",
      buttonVariant: "outline" as const
    },
    {
      id: "premium",
      title: "Премиум",
      description: "Для активных спортсменов",
      monthlyPrice: 2990,
      yearlyPrice: 29900,
      yearlyDiscount: "Экономия 25%",
      features: [
        "Доступ к 200+ залам",
        "Безлимитные занятия",
        "Расширенное отслеживание тренировок",
        "Приоритетная поддержка",
        "Привести друга 2 раза в месяц"
      ],
      popular: true,
      buttonText: "Выбрать план",
      buttonVariant: "default" as const
    },
    {
      id: "elite",
      title: "Элитный",
      description: "Максимум возможностей",
      monthlyPrice: 4990,
      yearlyPrice: 49900,
      yearlyDiscount: "Экономия 30%",
      features: [
        "Доступ к 300+ залам",
        "Безлимитные премиум-занятия",
        "Персональные тренировки (2 в месяц)",
        "Расширенное отслеживание прогресса",
        "VIP поддержка клиентов",
        "Привести друга в любое время"
      ],
      popular: false,
      buttonText: "Получить доступ",
      buttonVariant: "outline" as const
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Верхняя панель */}
      <header className="bg-white px-4 py-4 border-b sticky top-0 z-10 flex items-center">
        <Link to="/" className="flex items-center text-primary">
          <ChevronLeft size={20} />
          <span className="ml-1">Назад</span>
        </Link>
        <h1 className="text-lg font-medium text-center flex-grow">Тарифы</h1>
      </header>

      <div className="px-4 py-6 max-w-md mx-auto">
        {/* Заголовок и описание */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold mb-3 gradient-text">Выберите свой абонемент</h2>
          <p className="text-gray-600">
            Доступ к лучшим фитнес-клубам и студиям по единому абонементу
          </p>
        </div>

        {/* Переключатель период оплаты */}
        <div className="mb-8 flex justify-center">
          <div className="bg-gray-100 p-1 rounded-full inline-flex">
            <button
              className={`px-4 py-2 text-sm rounded-full transition-all ${
                billingPeriod === "monthly"
                  ? "bg-white text-primary shadow-sm"
                  : "text-gray-600"
              }`}
              onClick={() => setBillingPeriod("monthly")}
            >
              Ежемесячно
            </button>
            <button
              className={`px-4 py-2 text-sm rounded-full transition-all ${
                billingPeriod === "yearly"
                  ? "bg-white text-primary shadow-sm"
                  : "text-gray-600"
              }`}
              onClick={() => setBillingPeriod("yearly")}
            >
              Ежегодно
            </button>
          </div>
        </div>

        {/* Карточки с тарифами */}
        <div className="space-y-6">
          {pricingPlans.map((plan) => (
            <Card
              key={plan.id}
              className={`overflow-hidden rounded-2xl transition-all hover:shadow-lg ${
                plan.popular ? "card-gradient shadow-md" : ""
              }`}
            >
              {plan.popular && (
                <div className="bg-gradient-primary text-white text-xs font-medium text-center py-1.5">
                  ПОПУЛЯРНЫЙ ВЫБОР
                </div>
              )}
              
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-lg">{plan.title}</h3>
                    <p className="text-sm text-gray-500">{plan.description}</p>
                  </div>
                  {billingPeriod === "yearly" && (
                    <Badge variant="outline" className="bg-accent/30 text-primary border-accent/30">
                      {plan.yearlyDiscount}
                    </Badge>
                  )}
                </div>
              </CardHeader>
              
              <CardContent className="pt-2">
                <div className="flex items-baseline mb-4">
                  <span className="text-3xl font-bold text-primary">
                    {billingPeriod === "monthly"
                      ? plan.monthlyPrice
                      : plan.yearlyPrice}
                  </span>
                  <span className="ml-1 text-primary">₽</span>
                  <span className="ml-1 text-sm text-gray-500">
                    / {billingPeriod === "monthly" ? "месяц" : "год"}
                  </span>
                </div>
                
                <ul className="space-y-2.5 mb-6">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <Check className="mr-2 h-5 w-5 text-secondary flex-shrink-0" />
                      <span className="text-gray-600 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              
              <CardFooter>
                <Button
                  variant={plan.buttonVariant}
                  className={`w-full rounded-xl ${plan.popular ? 'bg-gradient-primary hover:opacity-90 transition-opacity border-0' : 'border-primary text-primary hover:bg-primary/5'}`}
                  asChild
                >
                  <Link to="/register">{plan.buttonText}</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* FAQ секция */}
        <div className="mt-14">
          <h3 className="text-xl font-bold mb-6 text-center gradient-text">Часто задаваемые вопросы</h3>
          
          <div className="space-y-3">
            {[
              {
                question: "Могу ли я отменить подписку?",
                answer: "Да, вы можете отменить подписку в любое время. Подписка будет активна до конца оплаченного периода."
              },
              {
                question: "Есть ли пробный период?",
                answer: "Да, для новых пользователей действует 7-дневный бесплатный пробный период."
              },
              {
                question: "Как выбрать зал или студию?",
                answer: "После оформления подписки вам станет доступен полный список залов и студий в приложении."
              },
              {
                question: "Есть ли ограничения по частоте посещений?",
                answer: "В базовом тарифе доступно 4 занятия в месяц. В премиум и элитном тарифах — без ограничений."
              }
            ].map((item, index) => (
              <details
                key={index}
                className="bg-white rounded-xl border overflow-hidden group transition-all hover:shadow-sm"
              >
                <summary className="flex justify-between items-center p-4 cursor-pointer">
                  <span className="font-medium">{item.question}</span>
                  <ChevronRight className="h-5 w-5 text-gray-500 group-open:rotate-90 transition-transform" />
                </summary>
                <div className="px-4 pb-4">
                  <p className="text-gray-600 text-sm">{item.answer}</p>
                </div>
              </details>
            ))}
          </div>
        </div>

        {/* Контактная информация */}
        <div className="mt-12 text-center">
          <p className="text-gray-500 text-sm">
            Остались вопросы? Свяжитесь с нами
          </p>
          <div className="mt-2">
            <Button variant="link" className="text-primary">
              support@goodfit.ru
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;
