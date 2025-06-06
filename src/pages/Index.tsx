
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, Clock, Users, CheckCircle, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  const features = [
    {
      title: "Единый абонемент",
      description: "Доступ ко всем залам сети с одной подпиской",
      icon: "🎯"
    },
    {
      title: "Удобное бронирование",
      description: "Забронируйте занятие в несколько кликов",
      icon: "📱"
    },
    {
      title: "Гибкое расписание",
      description: "Тренируйтесь когда удобно вам",
      icon: "⏰"
    }
  ];

  const gyms = [
    {
      id: 1,
      name: "FitLife Центр",
      location: "ул. Пушкина, 15",
      rating: 4.8,
      image: "/placeholder.svg",
      features: ["Кардио зона", "Силовые тренажеры", "Групповые занятия"]
    },
    {
      id: 2, 
      name: "Power Gym",
      location: "пр. Ленина, 42",
      rating: 4.6,
      image: "/placeholder.svg",
      features: ["Бокс", "Функциональный тренинг", "Персональные тренировки"]
    },
    {
      id: 3,
      name: "Здоровье+",
      location: "ул. Советская, 8",
      rating: 4.9,
      image: "/placeholder.svg", 
      features: ["Йога", "Пилатес", "Массаж"]
    }
  ];

  const testimonials = [
    {
      name: "Анна Петрова",
      text: "Отличное приложение! Очень удобно бронировать занятия и следить за расписанием.",
      rating: 5,
      avatar: "/placeholder.svg"
    },
    {
      name: "Михаил Иванов", 
      text: "Единый абонемент - это супер! Могу ходить в разные залы в зависимости от настроения.",
      rating: 5,
      avatar: "/placeholder.svg"
    },
    {
      name: "Елена Сидорова",
      text: "Приложение помогло мне наконец начать регулярно заниматься спортом. Рекомендую!",
      rating: 5,
      avatar: "/placeholder.svg"
    }
  ];

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 text-white">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-700">
        <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold">GoodFit</div>
          <div className="hidden md:flex space-x-6">
            <button onClick={() => scrollToSection('features')} className="hover:text-blue-400 transition-colors">
              Возможности
            </button>
            <button onClick={() => scrollToSection('gyms')} className="hover:text-blue-400 transition-colors">
              Залы
            </button>
            <button onClick={() => scrollToSection('testimonials')} className="hover:text-blue-400 transition-colors">
              Отзывы
            </button>
            <button onClick={() => scrollToSection('pricing')} className="hover:text-blue-400 transition-colors">
              Тарифы
            </button>
          </div>
          <div className="flex space-x-2">
            <Link to="/login">
              <Button variant="outline" className="border-slate-600 text-white hover:bg-slate-800">
                Войти
              </Button>
            </Link>
            <Link to="/register">
              <Button className="bg-blue-600 hover:bg-blue-700">
                Начать
              </Button>
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Твой фитнес, твои правила
          </h1>
          <p className="text-xl md:text-2xl text-slate-300 mb-8 max-w-3xl mx-auto">
            Единый абонемент на все фитнес-залы города. Тренируйся где хочешь, когда хочешь.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-3">
                Получить доступ
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-slate-600 text-white hover:bg-slate-800 text-lg px-8 py-3"
              onClick={() => scrollToSection('gyms')}
            >
              Посмотреть залы
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Почему выбирают GoodFit?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                <CardHeader>
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <CardTitle className="text-white">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-slate-300">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Gyms Section */}
      <section id="gyms" className="py-16 px-4 bg-slate-900/50">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Популярные залы
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {gyms.map((gym) => (
              <Card key={gym.id} className="bg-slate-800/50 border-slate-700 backdrop-blur-sm overflow-hidden">
                <div className="relative h-48">
                  <img 
                    src={gym.image} 
                    alt={gym.name}
                    className="w-full h-full object-cover"
                  />
                  <Badge className="absolute top-2 right-2 bg-green-600">
                    <Star className="h-3 w-3 mr-1" />
                    {gym.rating}
                  </Badge>
                </div>
                <CardHeader>
                  <CardTitle className="text-white">{gym.name}</CardTitle>
                  <div className="flex items-center text-slate-400">
                    <MapPin className="h-4 w-4 mr-1" />
                    {gym.location}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {gym.features.map((feature, index) => (
                      <Badge key={index} variant="outline" className="border-slate-600 text-slate-300">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-16 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Что говорят наши пользователи
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <img 
                      src={testimonial.avatar} 
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full"
                    />
                    <div>
                      <CardTitle className="text-white text-lg">{testimonial.name}</CardTitle>
                      <div className="flex">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-300">"{testimonial.text}"</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-16 px-4 bg-slate-900/50">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Выберите свой план
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">Базовый</CardTitle>
                <div className="text-3xl font-bold text-blue-400">1,500₽ <span className="text-lg text-slate-400">/мес</span></div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-400 mr-2" />
                    <span className="text-slate-300">До 12 посещений</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-400 mr-2" />
                    <span className="text-slate-300">Доступ к базовым залам</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-400 mr-2" />
                    <span className="text-slate-300">Мобильное приложение</span>
                  </div>
                </div>
                <Button className="w-full" variant="outline">
                  Выбрать план
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-blue-500 backdrop-blur-sm ring-2 ring-blue-500">
              <CardHeader>
                <Badge className="w-fit bg-blue-600">Популярный</Badge>
                <CardTitle className="text-white">Премиум</CardTitle>
                <div className="text-3xl font-bold text-blue-400">2,500₽ <span className="text-lg text-slate-400">/мес</span></div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-400 mr-2" />
                    <span className="text-slate-300">Безлимитные посещения</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-400 mr-2" />
                    <span className="text-slate-300">Все залы сети</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-400 mr-2" />
                    <span className="text-slate-300">Персональные тренировки</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-400 mr-2" />
                    <span className="text-slate-300">Приоритетная поддержка</span>
                  </div>
                </div>
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  Выбрать план
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">Про</CardTitle>
                <div className="text-3xl font-bold text-blue-400">3,500₽ <span className="text-lg text-slate-400">/мес</span></div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-400 mr-2" />
                    <span className="text-slate-300">Все из Премиум</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-400 mr-2" />
                    <span className="text-slate-300">Консультации по питанию</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-400 mr-2" />
                    <span className="text-slate-300">VIP зоны</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-400 mr-2" />
                    <span className="text-slate-300">Индивидуальные программы</span>
                  </div>
                </div>
                <Button className="w-full" variant="outline">
                  Выбрать план
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Готовы начать свой фитнес-путь?
          </h2>
          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
            Присоединяйтесь к тысячам пользователей, которые уже изменили свою жизнь с GoodFit
          </p>
          <Link to="/register">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-3">
              Зарегистрироваться бесплатно
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-slate-700">
        <div className="container mx-auto text-center text-slate-400">
          <p>&copy; 2024 GoodFit. Все права защищены.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
