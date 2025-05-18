import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  CheckCircle, 
  ChevronRight, 
  Menu, 
  X, 
  Star, 
  Calendar,
  ArrowRight,
  Users,
  MessageSquare,
  MapPin
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

// Мок-данные для отзывов
const testimonials = [
  {
    id: 1,
    name: "Алексей Иванов",
    role: "Постоянный пользователь",
    content: "GoodFit полностью изменил мой подход к тренировкам. Теперь я могу заниматься в разных залах города и пробовать разные направления не переплачивая.",
    image: "https://images.unsplash.com/photo-1603415526960-f7e0328c63b1?ixlib=rb-1.2.1&auto=format&fit=crop&w=334&q=80",
    rating: 5
  },
  {
    id: 2,
    name: "Мария Соколова",
    role: "Премиум пользователь",
    content: "Очень удобный сервис! Всегда могу найти зал рядом с работой или домом. Большой выбор занятий и отличная поддержка.",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=334&q=80",
    rating: 4
  },
  {
    id: 3,
    name: "Дмитрий Петров",
    role: "Новый пользователь",
    content: "Регистрация заняла буквально минуту, а через пять минут я уже был на первой тренировке. Все интуитивно понятно и работает без сбоев.",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=334&q=80",
    rating: 5
  }
];

// Мок-данные для фитнес-залов
const featured_gyms = [
  {
    id: "gym1",
    name: "FitZone Центр",
    address: "ул. Ленина, 10, Москва",
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Z3ltfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60",
    classes: ["Кроссфит", "Йога", "Силовые"],
    rating: 4.9,
  },
  {
    id: "gym2",
    name: "Йога Хаус",
    address: "ул. Пушкина, 15, Москва",
    image: "https://images.unsplash.com/photo-1588286840104-8957b019727f?ixlib=rb-4.0.3&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
    classes: ["Хатха-йога", "Кундалини", "Пилатес"],
    rating: 4.8,
  },
  {
    id: "gym3",
    name: "PowerHouse",
    address: "пр. Мира, 28, Москва",
    image: "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fGd5bXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60",
    classes: ["Бокс", "HIIT", "Тяжелая атлетика"],
    rating: 4.7,
  }
];

const LandingPage = () => {
  const [mobile_menu_open, set_mobile_menu_open] = useState(false);
  const isMobile = useIsMobile();
  
  // Автоматически закрывать мобильное меню при переходе на десктоп
  useEffect(() => {
    if (!isMobile && mobile_menu_open) {
      set_mobile_menu_open(false);
    }
  }, [isMobile, mobile_menu_open]);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Навигационная панель */}
      <header className="bg-white sticky top-0 z-20 border-b">
        <div className="container mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <span className="text-xl font-bold text-primary">GoodFit</span>
            </div>
            
            {/* Десктопная навигация */}
            <nav className="hidden md:flex items-center space-x-6">
              <Link to="/gyms" className="text-gray-600 hover:text-gray-900">Залы</Link>
              <Link to="/pricing" className="text-gray-600 hover:text-gray-900">Тарифы</Link>
              <Link to="/faq" className="text-gray-600 hover:text-gray-900">FAQ</Link>
              <Link to="/contact" className="text-gray-600 hover:text-gray-900">Контакты</Link>
            </nav>
            
            <div className="hidden md:flex items-center space-x-3">
              <Link to="/login">
                <Button variant="outline">Войти</Button>
              </Link>
              <Link to="/register">
                <Button>Регистрация</Button>
              </Link>
            </div>
            
            {/* Мобильное меню */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => set_mobile_menu_open(!mobile_menu_open)}
                className="p-2 rounded-md focus:outline-none"
              >
                {mobile_menu_open ? <X /> : <Menu />}
              </button>
            </div>
          </div>
          
          {/* Мобильная навигация */}
          {mobile_menu_open && (
            <nav className="md:hidden py-4 border-t mt-3">
              <ul className="space-y-4">
                <li>
                  <Link 
                    to="/gyms" 
                    className="block py-2 px-3 rounded-lg hover:bg-gray-100"
                    onClick={() => set_mobile_menu_open(false)}
                  >
                    Залы
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/pricing" 
                    className="block py-2 px-3 rounded-lg hover:bg-gray-100"
                    onClick={() => set_mobile_menu_open(false)}
                  >
                    Тарифы
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/faq" 
                    className="block py-2 px-3 rounded-lg hover:bg-gray-100"
                    onClick={() => set_mobile_menu_open(false)}
                  >
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/contact" 
                    className="block py-2 px-3 rounded-lg hover:bg-gray-100"
                    onClick={() => set_mobile_menu_open(false)}
                  >
                    Контакты
                  </Link>
                </li>
                <li className="pt-2 border-t flex flex-col space-y-2">
                  <Link 
                    to="/login" 
                    className="block w-full"
                    onClick={() => set_mobile_menu_open(false)}
                  >
                    <Button variant="outline" className="w-full">Войти</Button>
                  </Link>
                  <Link 
                    to="/register" 
                    className="block w-full"
                    onClick={() => set_mobile_menu_open(false)}
                  >
                    <Button className="w-full">Регистрация</Button>
                  </Link>
                </li>
              </ul>
            </nav>
          )}
        </div>
      </header>

      <main className="flex-grow">
        {/* Главный героический раздел */}
        <section className="bg-gradient-to-b from-gray-50 to-white py-10 md:py-20">
          <div className="container px-4 mx-auto">
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-3xl md:text-5xl font-bold mb-6">
                Единый абонемент для всех фитнес-клубов
              </h1>
              <p className="text-gray-600 text-lg mb-8">
                Доступ к более чем 300 фитнес-залам и студиям в вашем городе. Тренируйтесь где угодно, когда угодно.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                <Link to="/register">
                  <Button size="lg" className="w-full sm:w-auto">
                    Начать бесплатно
                  </Button>
                </Link>
                <Link to="/pricing">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto">
                    Посмотреть тарифы
                  </Button>
                </Link>
              </div>
              <div className="text-sm text-gray-500">
                Уже более 50,000 активных пользователей
              </div>
            </div>
          </div>
        </section>

        {/* Особенности сервиса */}
        <section className="py-12 bg-white">
          <div className="container px-4 mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
              Преимущества GoodFit
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="text-primary w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Гибкое расписание</h3>
                <p className="text-gray-600">
                  Выбирайте любые занятия в любое удобное время. Больше никаких привязок к одному фитнес-клубу.
                </p>
              </div>
              
              <div className="text-center">
                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="text-primary w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold mb-3">300+ локаций</h3>
                <p className="text-gray-600">
                  Тренируйтесь в лучших фитнес-клубах и студиях по всему городу. Всегда найдется зал рядом с вами.
                </p>
              </div>
              
              <div className="text-center">
                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="text-primary w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Лучшие тренеры</h3>
                <p className="text-gray-600">
                  Получите доступ к занятиям с профессиональными инструкторами и разнообразным программам тренировок.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Как это работает */}
        <section className="py-12 bg-gray-50">
          <div className="container px-4 mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
              Как это работает
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-sm text-center">
                <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center mx-auto mb-4">
                  1
                </div>
                <h3 className="font-semibold mb-2">Выберите тариф</h3>
                <p className="text-gray-600 text-sm">
                  Подберите подходящий вам план на основе ваших потребностей
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm text-center">
                <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center mx-auto mb-4">
                  2
                </div>
                <h3 className="font-semibold mb-2">Скачайте приложение</h3>
                <p className="text-gray-600 text-sm">
                  Установите наше мобильное приложение для доступа ко всем возможностям
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm text-center">
                <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center mx-auto mb-4">
                  3
                </div>
                <h3 className="font-semibold mb-2">Найдите занятия</h3>
                <p className="text-gray-600 text-sm">
                  Просмотрите расписание и выберите интересующие вас занятия
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm text-center">
                <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center mx-auto mb-4">
                  4
                </div>
                <h3 className="font-semibold mb-2">Начните тренировки</h3>
                <p className="text-gray-600 text-sm">
                  Просто покажите QR-код в приложении при входе в зал
                </p>
              </div>
            </div>
            
            <div className="text-center mt-10">
              <Link to="/register">
                <Button>
                  Присоединиться сейчас
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Популярные фитнес-клубы */}
        <section className="py-12 bg-white">
          <div className="container px-4 mx-auto">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold">Популярные залы</h2>
              <Link to="/gyms" className="text-primary flex items-center text-sm font-medium">
                Все залы
                <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featured_gyms.map((gym) => (
                <Card key={gym.id} className="overflow-hidden">
                  <div className="h-40 overflow-hidden">
                    <img 
                      src={gym.image} 
                      alt={gym.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium">{gym.name}</h3>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 mr-1" />
                        <span className="text-sm">{gym.rating}</span>
                      </div>
                    </div>
                    <div className="flex items-center text-gray-500 text-xs mb-3">
                      <MapPin className="h-3 w-3 mr-1" />
                      {gym.address}
                    </div>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {gym.classes.map((cls, idx) => (
                        <span key={idx} className="px-2 py-1 bg-gray-100 rounded-full text-xs">
                          {cls}
                        </span>
                      ))}
                    </div>
                    <Button variant="outline" size="sm" className="w-full mt-2">
                      Посмотреть расписание
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Отзывы */}
        <section className="py-12 bg-gray-50">
          <div className="container px-4 mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
              Что говорят наши пользователи
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {testimonials.map((testimonial) => (
                <Card key={testimonial.id} className="overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      <img 
                        src={testimonial.image} 
                        alt={testimonial.name}
                        className="w-12 h-12 rounded-full object-cover mr-4"
                      />
                      <div>
                        <h3 className="font-medium">{testimonial.name}</h3>
                        <p className="text-gray-500 text-sm">{testimonial.role}</p>
                      </div>
                    </div>
                    
                    <div className="flex mb-3">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`h-4 w-4 ${i < testimonial.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`} 
                        />
                      ))}
                    </div>
                    
                    <p className="text-gray-600">"{testimonial.content}"</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-12 bg-primary text-white">
          <div className="container px-4 mx-auto text-center">
            <h2 className="text-2xl md:text-4xl font-bold mb-6">
              Готовы начать тренироваться по-новому?
            </h2>
            <p className="text-white/80 mb-8 max-w-2xl mx-auto">
              Присоединяйтесь к тысячам людей, которые уже изменили свой подход к фитнесу с GoodFit. Первая неделя бесплатно!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register">
                <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                  Бесплатная регистрация
                </Button>
              </Link>
              <Link to="/pricing">
                <Button size="lg" variant="outline" className="w-full sm:w-auto border-white text-white hover:bg-white hover:text-primary">
                  Сравнить тарифы
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Часто задаваемые вопросы - только заголовок для мобильной версии */}
        <section className="py-12 bg-white">
          <div className="container px-4 mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-6">
              Часто задаваемые вопросы
            </h2>
            <p className="text-center mb-8 text-gray-600">
              Не нашли ответ на свой вопрос? <Link to="/contact" className="text-primary">Свяжитесь с нами</Link>
            </p>
            
            <div className="max-w-3xl mx-auto">
              <div className="space-y-4">
                <details className="group border rounded-lg">
                  <summary className="flex justify-between items-center px-4 py-3 cursor-pointer">
                    <span className="font-medium">Как работает единый абонемент GoodFit?</span>
                    <ChevronRight className="h-5 w-5 text-gray-500 group-open:rotate-90 transition-transform" />
                  </summary>
                  <div className="px-4 pb-4">
                    <p className="text-gray-600">
                      Единый абонемент GoodFit даёт вам доступ к сети партнёрских фитнес-клубов и студий. После оформления подписки вы получаете возможность посещать любые доступные занятия в любом из партнёрских заведений через наше приложение.
                    </p>
                  </div>
                </details>
                
                <details className="group border rounded-lg">
                  <summary className="flex justify-between items-center px-4 py-3 cursor-pointer">
                    <span className="font-medium">Есть ли ограничение на количество посещений?</span>
                    <ChevronRight className="h-5 w-5 text-gray-500 group-open:rotate-90 transition-transform" />
                  </summary>
                  <div className="px-4 pb-4">
                    <p className="text-gray-600">
                      Ограничения зависят от выбранного тарифа. В базовом тарифе доступно 4 занятия в месяц. В тарифах "Премиум" и "Элитный" количество занятий не ограничено.
                    </p>
                  </div>
                </details>
                
                <details className="group border rounded-lg">
                  <summary className="flex justify-between items-center px-4 py-3 cursor-pointer">
                    <span className="font-medium">Как отменить запись на занятие?</span>
                    <ChevronRight className="h-5 w-5 text-gray-500 group-open:rotate-90 transition-transform" />
                  </summary>
                  <div className="px-4 pb-4">
                    <p className="text-gray-600">
                      Вы можете отменить запись через приложение не позднее, чем за 2 часа до начала занятия. Для этого перейдите в раздел "Мои записи", найдите нужное занятие и нажмите кнопку "Отменить".
                    </p>
                  </div>
                </details>
                
                <details className="group border rounded-lg">
                  <summary className="flex justify-between items-center px-4 py-3 cursor-pointer">
                    <span className="font-medium">Можно ли поставить подписку на паузу?</span>
                    <ChevronRight className="h-5 w-5 text-gray-500 group-open:rotate-90 transition-transform" />
                  </summary>
                  <div className="px-4 pb-4">
                    <p className="text-gray-600">
                      Да, вы можете приостановить подписку на срок до 30 дней в год. Для этого перейдите в раздел "Профиль" {'>'}  "Подписка" и выберите опцию "Приостановить подписку".
                    </p>
                  </div>
                </details>
                
                <div className="text-center mt-8">
                  <Link to="/faq">
                    <Button variant="outline">
                      Все вопросы и ответы
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Футер */}
      <footer className="bg-gray-900 text-gray-300">
        <div className="container px-4 py-12 mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">О компании</h3>
              <ul className="space-y-2">
                <li><Link to="/about" className="hover:text-white">О нас</Link></li>
                <li><Link to="/careers" className="hover:text-white">Карьера</Link></li>
                <li><Link to="/blog" className="hover:text-white">Блог</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Поддержка</h3>
              <ul className="space-y-2">
                <li><Link to="/contact" className="hover:text-white">Связаться с нами</Link></li>
                <li><Link to="/help" className="hover:text-white">Центр помощи</Link></li>
                <li><Link to="/faq" className="hover:text-white">FAQ</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Правовая информация</h3>
              <ul className="space-y-2">
                <li><Link to="/terms" className="hover:text-white">Условия использования</Link></li>
                <li><Link to="/privacy" className="hover:text-white">Политика конфиденциальности</Link></li>
                <li><Link to="/cookies" className="hover:text-white">Политика cookies</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Контакты</h3>
              <div className="flex space-x-4 mb-4">
                {/* Иконки социальных сетей */}
                <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-primary">
                  <span>VK</span>
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-primary">
                  <span>TG</span>
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-primary">
                  <span>YT</span>
                </a>
              </div>
              <p className="text-sm">support@goodfit.ru</p>
              <p className="text-sm">+7 (800) 123-45-67</p>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center md:text-left">
            <p>&copy; 2023 GoodFit. Все права защищены.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
