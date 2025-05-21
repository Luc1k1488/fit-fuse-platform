
import React from "react";
import { PricingCard } from "@/components/pricing/PricingCard";
import { GradientButton } from "@/components/ui/gradient-button";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const PricingPage = () => {
  const navigate = useNavigate();

  const handleSubscribe = (plan: string) => {
    toast.success(`Вы выбрали тариф: ${plan}`);
    navigate("/register");
  };

  const basicFeatures = [
    { text: "Доступ к 20 фитнес-центрам" },
    { text: "3 посещения в неделю" },
    { text: "Стандартные часы посещения" },
    { text: "Онлайн-бронирование" },
    { text: "Базовая поддержка" },
  ];

  const standardFeatures = [
    { text: "Доступ к 50 фитнес-центрам" },
    { text: "5 посещений в неделю" },
    { text: "Расширенные часы посещения" },
    { text: "Приоритетное бронирование" },
    { text: "Персональный тренер (1 раз в месяц)" },
    { text: "Доступ к групповым занятиям" },
    { text: "Приоритетная поддержка" },
  ];

  const premiumFeatures = [
    { text: "Безлимитный доступ ко всем фитнес-центрам" },
    { text: "Неограниченное количество посещений" },
    { text: "Круглосуточный доступ" },
    { text: "VIP-бронирование" },
    { text: "Персональный тренер (4 раза в месяц)" },
    { text: "Доступ ко всем групповым занятиям" },
    { text: "Премиум-поддержка 24/7" },
    { text: "Эксклюзивные мастер-классы" },
    { text: "Специальные скидки на дополнительные услуги" },
  ];

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Хедер */}
      <header className="bg-gray-900/90 backdrop-blur-md py-4 border-b border-gray-800 sticky top-0 z-10">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <a href="/" className="text-2xl font-bold purple-blue-gradient-text">
            GoodFit
          </a>
          <nav className="hidden md:flex items-center space-x-8">
            <a href="/gyms" className="text-gray-300 hover:text-white">Фитнес-залы</a>
            <a href="/pricing" className="text-gray-300 hover:text-white font-medium">Цены</a>
            <a href="/faq" className="text-gray-300 hover:text-white">FAQ</a>
            <a href="/contact" className="text-gray-300 hover:text-white">Контакты</a>
          </nav>
          <div className="flex items-center space-x-4">
            <a href="/login" className="text-white hover:text-primary">Войти</a>
            <GradientButton size="sm" onClick={() => navigate("/register")}>
              Регистрация
            </GradientButton>
          </div>
        </div>
      </header>

      {/* Основной контент */}
      <main>
        {/* Секция заголовка */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-3xl md:text-5xl font-bold purple-blue-gradient-text mb-6">
              Выберите подходящий тариф
            </h1>
            <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto">
              Получите доступ к лучшим фитнес-залам города в одном приложении.
              Тренируйтесь там, где удобно и когда удобно.
            </p>
          </div>
        </section>

        {/* Секция тарифов */}
        <section className="pb-24">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <PricingCard
                title="Базовый"
                price="1 990 ₽"
                period="месяц"
                description="Идеально подходит для начинающих, которые хотят попробовать разные залы."
                features={basicFeatures}
                buttonText="Выбрать тариф"
                onClick={() => handleSubscribe("Базовый")}
              />
              <PricingCard
                title="Стандарт"
                price="3 990 ₽"
                period="месяц"
                description="Оптимальный вариант для регулярных тренировок."
                features={standardFeatures}
                popular={true}
                buttonText="Выбрать тариф"
                onClick={() => handleSubscribe("Стандарт")}
              />
              <PricingCard
                title="Премиум"
                price="7 990 ₽"
                period="месяц"
                description="Максимальные возможности для настоящих энтузиастов фитнеса."
                features={premiumFeatures}
                buttonText="Выбрать тариф"
                onClick={() => handleSubscribe("Премиум")}
              />
            </div>

            <div className="mt-16 text-center">
              <p className="text-gray-400 mb-4">
                Нужен корпоративный тариф для вашей компании?
              </p>
              <GradientButton
                variant="outline"
                onClick={() => navigate("/contact")}
              >
                Свяжитесь с нами
              </GradientButton>
            </div>
          </div>
        </section>

        {/* Секция вопросов */}
        <section className="py-16 bg-gray-900">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl md:text-4xl font-bold purple-blue-gradient-text mb-8">
              Остались вопросы?
            </h2>
            <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
              Наша команда поддержки готова помочь вам с выбором подходящего тарифа и ответить на все ваши вопросы.
            </p>
            <div className="flex flex-col md:flex-row gap-4 justify-center">
              <GradientButton onClick={() => navigate("/faq")}>
                Просмотреть FAQ
              </GradientButton>
              <GradientButton 
                variant="outline" 
                onClick={() => navigate("/contact")}
              >
                Связаться с поддержкой
              </GradientButton>
            </div>
          </div>
        </section>
      </main>

      {/* Футер */}
      <footer className="bg-gray-950 border-t border-gray-800 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <a href="/" className="text-2xl font-bold purple-blue-gradient-text">
                GoodFit
              </a>
              <p className="mt-4 text-gray-400">
                Доступ к лучшим фитнес-залам в одном приложении
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Компания</h3>
              <ul className="space-y-2">
                <li><a href="/about" className="text-gray-400 hover:text-white">О нас</a></li>
                <li><a href="/careers" className="text-gray-400 hover:text-white">Карьера</a></li>
                <li><a href="/blog" className="text-gray-400 hover:text-white">Блог</a></li>
                <li><a href="/partners" className="text-gray-400 hover:text-white">Партнёрам</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Поддержка</h3>
              <ul className="space-y-2">
                <li><a href="/faq" className="text-gray-400 hover:text-white">FAQ</a></li>
                <li><a href="/contact" className="text-gray-400 hover:text-white">Контакты</a></li>
                <li><a href="/help" className="text-gray-400 hover:text-white">Помощь</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Юридическая информация</h3>
              <ul className="space-y-2">
                <li><a href="/terms" className="text-gray-400 hover:text-white">Условия использования</a></li>
                <li><a href="/privacy" className="text-gray-400 hover:text-white">Политика конфиденциальности</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-800 text-center">
            <p className="text-gray-400">
              © 2025 GoodFit. Все права защищены.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PricingPage;
