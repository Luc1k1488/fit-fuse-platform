import { useState } from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Gym } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/auth_context";
import { Search, MoreVertical, Plus, MapPin, Star, StarHalf } from "lucide-react";
import { GymForm } from "@/components/admin/GymForm";

const PartnerGyms = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddGymOpen, setIsAddGymOpen] = useState(false);
  const [selectedGym, setSelectedGym] = useState<Gym | null>(null);
  
  const fetchGyms = async () => {
    let query = supabase.from("gyms").select("*");
    
    // Партнер видит только свои залы
    if (user?.id) {
      query = query.eq("owner_id", user.id);
    }
    
    if (searchQuery) {
      query = query.or(`name.ilike.%${searchQuery}%,location.ilike.%${searchQuery}%,city.ilike.%${searchQuery}%`);
    }
    
    const { data, error } = await query.order("name");
    
    if (error) {
      toast({
        variant: "destructive",
        title: "Ошибка!",
        description: "Не удалось загрузить фитнес-залы: " + error.message,
      });
      throw new Error(error.message);
    }
    
    return data as Gym[];
  };

  const { 
    data: gyms, 
    isLoading, 
    isError, 
    error, 
    refetch 
  } = useQuery({
    queryKey: ["partner-gyms", searchQuery, user?.id],
    queryFn: fetchGyms,
  });

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    refetch();
  };

  const handleAddGym = () => {
    setSelectedGym(null);
    setIsAddGymOpen(true);
  };

  const handleEditGym = (gym: Gym) => {
    setSelectedGym(gym);
    setIsAddGymOpen(true);
  };

  const handleGymSuccess = (gym: Gym) => {
    refetch();
    toast({
      title: "Успешно!",
      description: selectedGym 
        ? "Фитнес-зал успешно обновлен" 
        : "Фитнес-зал успешно добавлен",
    });
  };

  const handleDeleteGym = async (gymId: string) => {
    try {
      const { error } = await supabase
        .from("gyms")
        .delete()
        .eq("id", gymId)
        .eq("owner_id", user?.id); // Для безопасности добавлена проверка владельца

      if (error) {
        toast({
          variant: "destructive",
          title: "Ошибка!",
          description: "Не удалось удалить зал: " + error.message,
        });
        throw error;
      }

      toast({
        title: "Успешно!",
        description: "Фитнес-зал успешно удален",
      });
      
      refetch();
    } catch (error) {
      console.error("Ошибка при удалении зала:", error);
      toast({
        variant: "destructive",
        title: "Ошибка!",
        description: "Не удалось удалить фитнес-зал",
      });
    }
  };
  
  // Функция для отрисовки рейтинга звездами
  const renderRating = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    return (
      <div className="flex items-center">
        {[...Array(fullStars)].map((_, i) => (
          <Star key={i} size={14} className="text-yellow-400 fill-yellow-400" />
        ))}
        {hasHalfStar && <StarHalf size={14} className="text-yellow-400 fill-yellow-400" />}
        <span className="ml-1 text-sm">{rating.toFixed(1)}</span>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Мои фитнес-залы</h1>
        <Button className="gap-2" onClick={handleAddGym}>
          <Plus size={16} />
          Добавить зал
        </Button>
      </div>

      {/* Поиск */}
      <Card>
        <CardHeader>
          <CardTitle>Список моих фитнес-залов</CardTitle>
          <CardDescription>Управление вашими фитнес-залами на платформе</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-2 top-3 h-4 w-4 text-gray-500" />
                <Input 
                  placeholder="Поиск по названию или местоположению..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8"
                />
              </form>
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-10">
              <p>Загрузка фитнес-залов...</p>
            </div>
          ) : isError ? (
            <div className="text-center py-10">
              <p className="text-red-500">Ошибка загрузки данных</p>
              <p className="text-sm text-gray-500">{(error as Error).message}</p>
              <Button onClick={() => refetch()} className="mt-2">
                Попробовать снова
              </Button>
            </div>
          ) : (
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Название</TableHead>
                    <TableHead>Местоположение</TableHead>
                    <TableHead>Категория</TableHead>
                    <TableHead>Рейтинг</TableHead>
                    <TableHead>Особенности</TableHead>
                    <TableHead className="text-right">Действия</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {gyms && gyms.length > 0 ? (
                    gyms.map((gym) => (
                      <TableRow key={gym.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded bg-gray-100 overflow-hidden flex-shrink-0">
                              {gym.main_image ? (
                                <img 
                                  src={gym.main_image} 
                                  alt={gym.name || ""} 
                                  className="h-full w-full object-cover"
                                  onError={(e) => {
                                    // Если изображение не загружается, показываем запасной вариант
                                    (e.target as HTMLImageElement).src = "https://placehold.co/200x200?text=No+Image";
                                  }}
                                />
                              ) : (
                                <div className="h-full w-full bg-gray-200 flex items-center justify-center text-gray-400 text-xs">
                                  Нет фото
                                </div>
                              )}
                            </div>
                            <div>
                              <p className="font-medium">{gym.name || "Без названия"}</p>
                              <p className="text-xs text-gray-500">ID: {gym.id.substring(0, 8)}...</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <MapPin size={12} className="text-gray-500" />
                            <span>{gym.city || "Не указан"}{gym.location ? `, ${gym.location}` : ""}</span>
                          </div>
                          <p className="text-xs text-gray-500">{gym.address || "Адрес не указан"}</p>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{gym.category || "Не указана"}</Badge>
                        </TableCell>
                        <TableCell>
                          {renderRating(gym.rating || 0)}
                          <p className="text-xs text-gray-500">{gym.review_count || 0} отзывов</p>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1 max-w-[200px]">
                            {gym.features && gym.features.length > 0 ? (
                              <>
                                {gym.features.slice(0, 3).map((feature, index) => (
                                  <Badge key={index} variant="secondary" className="text-xs">
                                    {feature}
                                  </Badge>
                                ))}
                                {gym.features.length > 3 && (
                                  <Badge variant="secondary" className="text-xs">
                                    +{gym.features.length - 3}
                                  </Badge>
                                )}
                              </>
                            ) : (
                              <span className="text-xs text-gray-400">Нет особенностей</span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleEditGym(gym)}
                            >
                              Редактировать
                            </Button>
                            <Button 
                              variant="destructive" 
                              size="sm"
                              onClick={() => handleDeleteGym(gym.id)}
                            >
                              Удалить
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-10">
                        У вас пока нет фитнес-залов. Добавьте свой первый зал!
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Модальное окно для добавления/редактирования зала */}
      {isAddGymOpen && (
        <GymForm 
          open={isAddGymOpen}
          onClose={() => setIsAddGymOpen(false)}
          onSuccess={handleGymSuccess}
          initialData={
            selectedGym || 
            (user?.id ? { owner_id: user.id } as Partial<Gym> : undefined)
          }
        />
      )}
    </div>
  );
};

export default PartnerGyms;
