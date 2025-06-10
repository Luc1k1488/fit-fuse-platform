
import { useState, useEffect } from "react";
import { Search, MapPin, Star, Filter, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { Gym } from "@/types";
import { toast } from "sonner";
import { GymBookingDialog } from "@/components/booking/GymBookingDialog";

const ClientGyms = () => {
  const [gyms, setGyms] = useState<Gym[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [loading, setLoading] = useState(true);
  const [selectedGym, setSelectedGym] = useState<Gym | null>(null);
  const [bookingDialogOpen, setBookingDialogOpen] = useState(false);

  const cities = ["all", "Москва", "Санкт-Петербург", "Екатеринбург", "Новосибирск"];
  const categories = ["all", "Фитнес", "Тренажерный зал", "Йога", "Бокс", "Бассейн"];

  useEffect(() => {
    fetchGyms();
  }, []);

  const fetchGyms = async () => {
    try {
      const { data, error } = await supabase
        .from('gyms')
        .select('*')
        .order('rating', { ascending: false });

      if (error) {
        console.error('Error fetching gyms:', error);
        toast.error('Ошибка загрузки залов');
        return;
      }

      const typedGyms: Gym[] = (data || []).map(gym => ({
        ...gym,
        description: gym.description || null,
        phone: gym.phone || null,
      }));

      setGyms(typedGyms);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Ошибка загрузки данных');
    } finally {
      setLoading(false);
    }
  };

  const filteredGyms = gyms.filter(gym => {
    const matchesSearch = gym.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         gym.location?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCity = selectedCity === "all" || gym.city === selectedCity;
    const matchesCategory = selectedCategory === "all" || gym.category === selectedCategory;
    
    return matchesSearch && matchesCity && matchesCategory;
  });

  const handleBookGym = (gym: Gym) => {
    setSelectedGym(gym);
    setBookingDialogOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 pb-16">
        <div className="bg-slate-900/50 backdrop-blur-sm border-b border-slate-700 px-4 py-6">
          <h1 className="text-2xl font-bold text-white">Спортивные залы</h1>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 pb-16">
      <div className="bg-slate-900/50 backdrop-blur-sm border-b border-slate-700 px-4 py-6">
        <h1 className="text-2xl font-bold text-white mb-2">Спортивные залы</h1>
        <p className="text-slate-300">Найдите идеальный зал для тренировок</p>
      </div>

      <div className="px-4 space-y-6 py-6">
        {/* Search and Filters */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-4 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Поиск залов по названию или адресу..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-400"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="bg-slate-900/50 border border-slate-600 rounded-md px-3 py-2 text-white"
            >
              <option value="all">Все города</option>
              {cities.slice(1).map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-slate-900/50 border border-slate-600 rounded-md px-3 py-2 text-white"
            >
              <option value="all">Все категории</option>
              {categories.slice(1).map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Results */}
        <div>
          <h2 className="text-lg font-semibold text-white mb-4">
            Найдено {filteredGyms.length} залов
          </h2>

          {filteredGyms.length === 0 ? (
            <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
              <CardContent className="p-8 text-center">
                <Search className="h-12 w-12 mx-auto text-slate-400 mb-4" />
                <h3 className="text-white font-semibold mb-2">Залы не найдены</h3>
                <p className="text-slate-400 mb-4">
                  Попробуйте изменить параметры поиска
                </p>
                <Button onClick={() => {
                  setSearchQuery("");
                  setSelectedCity("all");
                  setSelectedCategory("all");
                }}>
                  Сбросить фильтры
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6">
              {filteredGyms.map((gym, index) => (
                <Card
                  key={gym.id}
                  className="bg-slate-800/50 backdrop-blur-sm border-slate-700 hover:bg-slate-700/50 transition-colors animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <CardTitle className="text-white text-xl mb-2">
                          {gym.name}
                        </CardTitle>
                        <div className="flex items-center gap-2 text-slate-400 mb-2">
                          <MapPin className="h-4 w-4" />
                          <span>{gym.city}, {gym.location}</span>
                        </div>
                        {gym.rating !== undefined && gym.rating > 0 && (
                          <div className="flex items-center gap-2">
                            <Star className="h-4 w-4 text-yellow-500 fill-current" />
                            <span className="text-white">{gym.rating.toFixed(1)}</span>
                            <span className="text-slate-400">
                              ({gym.review_count || 0} отзывов)
                            </span>
                          </div>
                        )}
                      </div>
                      {gym.category && (
                        <Badge variant="secondary" className="bg-purple-600/30 text-purple-300">
                          {gym.category}
                        </Badge>
                      )}
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {gym.main_image && (
                      <div className="aspect-video rounded-lg overflow-hidden">
                        <img
                          src={gym.main_image}
                          alt={gym.name || "Gym"}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}

                    {gym.working_hours && (
                      <div className="flex items-center gap-2 text-slate-400 text-sm">
                        <Clock className="h-4 w-4" />
                        <span>{gym.working_hours}</span>
                      </div>
                    )}

                    {gym.features && gym.features.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {gym.features.slice(0, 4).map((feature, idx) => (
                          <Badge
                            key={idx}
                            variant="outline"
                            className="border-slate-600 text-slate-300"
                          >
                            {feature}
                          </Badge>
                        ))}
                        {gym.features.length > 4 && (
                          <Badge
                            variant="outline"
                            className="border-slate-600 text-slate-300"
                          >
                            +{gym.features.length - 4}
                          </Badge>
                        )}
                      </div>
                    )}

                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleBookGym(gym)}
                        className="bg-purple-600 hover:bg-purple-700 flex-1"
                      >
                        Забронировать
                      </Button>
                      <Button
                        variant="outline"
                        className="border-slate-600 text-slate-300 hover:bg-slate-700/50"
                      >
                        Подробнее
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      {selectedGym && (
        <GymBookingDialog
          open={bookingDialogOpen}
          onOpenChange={setBookingDialogOpen}
          gym={selectedGym}
        />
      )}
    </div>
  );
};

export default ClientGyms;
