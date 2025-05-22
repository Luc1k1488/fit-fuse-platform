
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Star, StarHalf, Search, CheckCircle, AlertTriangle } from "lucide-react";
import { Review } from "@/types";

const AdminReviews = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRating, setFilterRating] = useState("all");
  const [currentTab, setCurrentTab] = useState("all");
  
  // Mock data for reviews
  const reviews: Review[] = [
    {
      id: "review-1",
      user_id: "user-1",
      gym_id: "gym-1",
      rating: 5,
      comment: "Отличный зал! Тренеры очень профессиональные и всегда готовы помочь. Оборудование новое и всегда чистое.",
      created_at: "2023-07-18T14:32:00Z"
    },
    {
      id: "review-2",
      user_id: "user-2",
      gym_id: "gym-2",
      rating: 4,
      comment: "Хороший зал, но иногда бывает слишком многолюдно в вечернее время. В целом доволен качеством обслуживания.",
      created_at: "2023-07-17T09:15:00Z"
    },
    {
      id: "review-3",
      user_id: "user-3",
      gym_id: "gym-1",
      rating: 2,
      comment: "Разочарован качеством оборудования. Некоторые тренажеры не работают, персонал не всегда внимателен.",
      created_at: "2023-07-16T12:48:00Z"
    },
    {
      id: "review-4",
      user_id: "user-4",
      gym_id: "gym-3",
      rating: 3,
      comment: "Средний зал. Есть все необходимое, но нет ничего выдающегося. Цена соответствует качеству.",
      created_at: "2023-07-15T16:07:00Z"
    },
    {
      id: "review-5",
      user_id: "user-5",
      gym_id: "gym-2",
      rating: 5,
      comment: "Прекрасный зал! Очень доволен тренировками и результатами. Особенно нравятся групповые занятия.",
      created_at: "2023-07-19T10:22:00Z"
    },
    {
      id: "review-6",
      user_id: "user-6",
      gym_id: "gym-4",
      rating: 1,
      comment: "Ужасное обслуживание. Отменили мою тренировку без предупреждения. Больше не пойду в этот зал.",
      created_at: "2023-07-14T11:35:00Z"
    }
  ];
  
  // Mock gym data
  const gyms = {
    "gym-1": { name: "Фитнес Плюс", location: "Москва" },
    "gym-2": { name: "СпортМакс", location: "Санкт-Петербург" },
    "gym-3": { name: "ЗдоровьеПро", location: "Казань" },
    "gym-4": { name: "Атлетик Клуб", location: "Москва" }
  };
  
  // Mock user data
  const users = {
    "user-1": { name: "Анна К.", avatar: null },
    "user-2": { name: "Иван С.", avatar: null },
    "user-3": { name: "Мария Д.", avatar: null },
    "user-4": { name: "Алексей П.", avatar: null },
    "user-5": { name: "Екатерина В.", avatar: null },
    "user-6": { name: "Дмитрий Н.", avatar: null }
  };
  
  // Filtered reviews based on search, rating, and tab
  const filteredReviews = reviews.filter(review => {
    const matchesSearch = 
      users[review.user_id].name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      gyms[review.gym_id].name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      review.comment.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesRating = 
      filterRating === "all" || 
      (filterRating === "positive" && review.rating >= 4) ||
      (filterRating === "neutral" && review.rating === 3) ||
      (filterRating === "negative" && review.rating <= 2);
      
    const matchesTab =
      currentTab === "all" ||
      (currentTab === "reported" && ["review-3", "review-6"].includes(review.id));
      
    return matchesSearch && matchesRating && matchesTab;
  });
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('ru-RU', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    }).format(date);
  };
  
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`star-${i}`} className="h-4 w-4 fill-amber-500 text-amber-500" />);
    }
    
    if (hasHalfStar) {
      stars.push(<StarHalf key="half-star" className="h-4 w-4 fill-amber-500 text-amber-500" />);
    }
    
    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="h-4 w-4 text-gray-300" />);
    }
    
    return <div className="flex">{stars}</div>;
  };
  
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Управление отзывами</h1>
      
      <div className="mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Обзор отзывов</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg text-center">
                <div className="text-2xl font-bold text-green-700 dark:text-green-300">4.2</div>
                <div className="flex justify-center mt-1">{renderStars(4.2)}</div>
                <p className="text-sm text-green-600 dark:text-green-400 mt-1">Средний рейтинг</p>
              </div>
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-center">
                <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">128</div>
                <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">Всего отзывов</p>
              </div>
              <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg text-center">
                <div className="text-2xl font-bold text-amber-700 dark:text-amber-300">85%</div>
                <p className="text-sm text-amber-600 dark:text-amber-400 mt-1">Положительные</p>
              </div>
              <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg text-center">
                <div className="text-2xl font-bold text-red-700 dark:text-red-300">8%</div>
                <p className="text-sm text-red-600 dark:text-red-400 mt-1">Негативные</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs value={currentTab} onValueChange={setCurrentTab}>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <TabsList className="mb-4 md:mb-0">
            <TabsTrigger value="all">Все отзывы</TabsTrigger>
            <TabsTrigger value="reported">
              Жалобы
              <Badge className="ml-2 bg-red-500">2</Badge>
            </TabsTrigger>
          </TabsList>
          
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Поиск по отзывам..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 w-full"
              />
            </div>
            <Select value={filterRating} onValueChange={setFilterRating}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Фильтр по рейтингу" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все рейтинги</SelectItem>
                <SelectItem value="positive">Положительные (4-5)</SelectItem>
                <SelectItem value="neutral">Нейтральные (3)</SelectItem>
                <SelectItem value="negative">Негативные (1-2)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <TabsContent value="all" className="mt-6">
          <Card>
            <CardContent className="p-0">
              {filteredReviews.length > 0 ? (
                <div className="divide-y">
                  {filteredReviews.map(review => (
                    <div key={review.id} className="p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center">
                          <Avatar className="h-10 w-10 mr-3">
                            <AvatarImage src={users[review.user_id].avatar || ""} />
                            <AvatarFallback>{users[review.user_id].name.substring(0, 2)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="flex items-center">
                              <h3 className="font-medium">{users[review.user_id].name}</h3>
                              {["review-3", "review-6"].includes(review.id) && (
                                <Badge variant="outline" className="ml-2 bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300">
                                  Жалоба
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center text-sm text-gray-500">
                              <span>{formatDate(review.created_at)}</span>
                              <span className="mx-2">•</span>
                              <span>{gyms[review.gym_id].name}</span>
                              <span className="mx-2">•</span>
                              <span>{gyms[review.gym_id].location}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center">
                          {renderStars(review.rating)}
                        </div>
                      </div>
                      
                      <div className="mt-3">
                        <p>{review.comment}</p>
                      </div>
                      
                      <div className="mt-4 flex justify-end space-x-2">
                        <Button variant="outline" size="sm">Ответить</Button>
                        <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20">
                          Скрыть
                        </Button>
                        {["review-3", "review-6"].includes(review.id) ? (
                          <Button variant="default" size="sm">Обработать жалобу</Button>
                        ) : (
                          <Button variant="outline" size="sm">Поделиться</Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-gray-500">
                  <AlertTriangle className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium mb-2">Ничего не найдено</h3>
                  <p>По вашему запросу не найдено отзывов. Попробуйте изменить параметры поиска.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="reported" className="mt-6">
          <Card>
            <CardContent className="p-0">
              {filteredReviews.length > 0 ? (
                <div className="divide-y">
                  {filteredReviews.map(review => (
                    <div key={review.id} className="p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center">
                          <Avatar className="h-10 w-10 mr-3">
                            <AvatarImage src={users[review.user_id].avatar || ""} />
                            <AvatarFallback>{users[review.user_id].name.substring(0, 2)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="flex items-center">
                              <h3 className="font-medium">{users[review.user_id].name}</h3>
                              <Badge variant="outline" className="ml-2 bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300">
                                Жалоба
                              </Badge>
                            </div>
                            <div className="flex items-center text-sm text-gray-500">
                              <span>{formatDate(review.created_at)}</span>
                              <span className="mx-2">•</span>
                              <span>{gyms[review.gym_id].name}</span>
                              <span className="mx-2">•</span>
                              <span>{gyms[review.gym_id].location}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center">
                          {renderStars(review.rating)}
                        </div>
                      </div>
                      
                      <div className="mt-3">
                        <p>{review.comment}</p>
                      </div>
                      
                      <div className="mt-4">
                        <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-md p-3">
                          <div className="flex items-start">
                            <AlertTriangle className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
                            <div>
                              <p className="font-medium text-red-800 dark:text-red-300">Причина жалобы:</p>
                              <p className="text-sm text-red-700 dark:text-red-400">
                                Оскорбительный или недостоверный контент в отзыве. Владелец зала считает, что информация не соответствует действительности.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-4 flex justify-end space-x-2">
                        <Button variant="outline" size="sm">Игнорировать жалобу</Button>
                        <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20">
                          Скрыть отзыв
                        </Button>
                        <Button variant="default" size="sm">Связаться с автором</Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-gray-500">
                  <CheckCircle className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium mb-2">Нет жалоб</h3>
                  <p>В настоящее время нет отзывов с жалобами.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminReviews;
