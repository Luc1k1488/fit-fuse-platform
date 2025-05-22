
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { supabase } from "@/integrations/supabase/client";
import { Gym } from "@/types";
import { useToast } from "@/components/ui/use-toast";
import { useQuery } from "@tanstack/react-query";
import { Search, MoreVertical, Plus, MapPin, Filter, Star, StarHalf } from "lucide-react";

const AdminGyms = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  
  const fetchGyms = async () => {
    let query = supabase.from("gyms").select("*");
    
    if (categoryFilter) {
      query = query.eq("category", categoryFilter);
    }
    
    if (searchQuery) {
      query = query.or(`name.ilike.%${searchQuery}%,location.ilike.%${searchQuery}%,city.ilike.%${searchQuery}%`);
    }
    
    const { data, error } = await query.order("name");
    
    if (error) {
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
    queryKey: ["gyms", searchQuery, categoryFilter],
    queryFn: fetchGyms,
  });

  const categories = ["Премиум", "Фитнес", "Йога", "Кроссфит", "Бокс", "Велнес"];

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    refetch();
  };

  const handleCategoryFilter = (category: string | null) => {
    setCategoryFilter(category);
    refetch();
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
        <h1 className="text-3xl font-bold">Управление фитнес-залами</h1>
        <Button className="gap-2">
          <Plus size={16} />
          Добавить зал
        </Button>
      </div>

      {/* Фильтры и поиск */}
      <Card>
        <CardHeader>
          <CardTitle>Список фитнес-залов</CardTitle>
          <CardDescription>Управление фитнес-залами на платформе</CardDescription>
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
            <div className="flex gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-1">
                    <Filter size={16} />
                    {categoryFilter ? `Категория: ${categoryFilter}` : "Все категории"}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handleCategoryFilter(null)}>
                    Все категории
                  </DropdownMenuItem>
                  {categories.map((category) => (
                    <DropdownMenuItem 
                      key={category} 
                      onClick={() => handleCategoryFilter(category)}
                    >
                      {category}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
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
                              {gym.main_image && (
                                <img 
                                  src={gym.main_image} 
                                  alt={gym.name || ""} 
                                  className="h-full w-full object-cover"
                                />
                              )}
                            </div>
                            <div>
                              <p className="font-medium">{gym.name}</p>
                              <p className="text-xs text-gray-500">ID: {gym.id.substring(0, 8)}...</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <MapPin size={12} className="text-gray-500" />
                            <span>{gym.city}, {gym.location}</span>
                          </div>
                          <p className="text-xs text-gray-500">{gym.address}</p>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{gym.category}</Badge>
                        </TableCell>
                        <TableCell>
                          {renderRating(gym.rating || 0)}
                          <p className="text-xs text-gray-500">{gym.review_count} отзывов</p>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1 max-w-[200px]">
                            {gym.features && gym.features.slice(0, 3).map((feature, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {feature}
                              </Badge>
                            ))}
                            {gym.features && gym.features.length > 3 && (
                              <Badge variant="secondary" className="text-xs">
                                +{gym.features.length - 3}
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreVertical size={16} />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>Просмотр деталей</DropdownMenuItem>
                              <DropdownMenuItem>Редактировать</DropdownMenuItem>
                              <DropdownMenuItem>Управление тренировками</DropdownMenuItem>
                              <DropdownMenuItem className="text-red-500">
                                Удалить зал
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-10">
                        Фитнес-залов не найдено
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminGyms;
