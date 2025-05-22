
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Star, Search } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const PartnerReviews = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRating, setFilterRating] = useState("all");
  const [filterGym, setFilterGym] = useState("all");
  const [selectedReview, setSelectedReview] = useState<null | any>(null);
  const [replyText, setReplyText] = useState("");
  
  // Mock data for gyms
  const partnerGyms = [
    { id: "gym-1", name: "Фитнес Плюс" },
    { id: "gym-2", name: "СпортМакс" },
    { id: "gym-3", name: "ЗдоровьеПро" },
  ];
  
  // Mock data for reviews
  const reviews = [
    {
      id: "review-1",
      user: {
        name: "Анна К.",
        avatar: null,
      },
      gym_id: "gym-1",
      rating: 5,
      comment: "Отличный зал! Тренеры очень профессиональные и всегда готовы помочь. Оборудование новое и всегда чистое.",
      date: "2023-07-18",
      reply: null,
      has_reply: false
    },
    {
      id: "review-2",
      user: {
        name: "Иван С.",
        avatar: null,
      },
      gym_id: "gym-2",
      rating: 4,
      comment: "Хороший зал, но иногда бывает слишком многолюдно в вечернее время. В целом доволен качеством обслуживания.",
      date: "2023-07-17",
      reply: "Спасибо за отзыв! Мы работаем над решением проблемы с загруженностью в вечерние часы и планируем открыть дополнительные залы для тренировок.",
      has_reply: true
    },
    {
      id: "review-3",
      user: {
        name: "Мария Д.",
        avatar: null,
      },
      gym_id: "gym-1",
      rating: 2,
      comment: "Разочарована качеством оборудования. Некоторые тренажеры не работают, персонал не всегда внимателен.",
      date: "2023-07-16",
      reply: null,
      has_reply: false
    },
    {
      id: "review-4",
      user: {
        name: "Алексей П.",
        avatar: null,
      },
      gym_id: "gym-3",
      rating: 3,
      comment: "Средний зал. Есть все необходимое, но нет ничего выдающегося. Цена соответствует качеству.",
      date: "2023-07-15",
      reply: null,
      has_reply: false
    },
    {
      id: "review-5",
      user: {
        name: "Екатерина В.",
        avatar: null,
      },
      gym_id: "gym-2",
      rating: 5,
      comment: "Прекрасный зал! Очень довольна тренировками и результатами. Особенно нравятся групповые занятия.",
      date: "2023-07-19",
      reply: "Благодарим за высокую оценку! Мы рады, что вам нравятся наши групповые программы. Будем и дальше поддерживать высокий уровень сервиса!",
      has_reply: true
    },
    {
      id: "review-6",
      user: {
        name: "Дмитрий Н.",
        avatar: null,
      },
      gym_id: "gym-3",
      rating: 1,
      comment: "Ужасное обслуживание. Отменили мою тренировку без предупреждения. Больше не пойду в этот зал.",
      date: "2023-07-14",
      reply: null,
      has_reply: false
    }
  ];
  
  const getGymName = (gymId: string) => {
    const gym = partnerGyms.find(g => g.id === gymId);
    return gym ? gym.name : "Неизвестный зал";
  };
  
  // Filter reviews based on search query, rating, and gym
  const filteredReviews = reviews.filter(review => {
    const matchesSearch = 
      review.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      getGymName(review.gym_id).toLowerCase().includes(searchQuery.toLowerCase()) ||
      review.comment.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesRating = 
      filterRating === "all" || 
      (filterRating === "positive" && review.rating >= 4) ||
      (filterRating === "neutral" && review.rating === 3) ||
      (filterRating === "negative" && review.rating <= 2);
      
    const matchesGym =
      filterGym === "all" || review.gym_id === filterGym;
      
    return matchesSearch && matchesRating && matchesGym;
  });
  
  const unrepliedReviews = reviews.filter(review => !review.has_reply);
  
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('ru-RU', options);
  };
  
  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 0; i < rating; i++) {
      stars.push(<Star key={i} className="h-4 w-4 fill-amber-500 text-amber-500" />);
    }
    for (let i = rating; i < 5; i++) {
      stars.push(<Star key={`empty-${i}`} className="h-4 w-4 text-gray-300" />);
    }
    return <div className="flex">{stars}</div>;
  };
  
  const handleSubmitReply = () => {
    if (selectedReview && replyText.trim()) {
      // In a real app, this would send the reply to the backend
      console.log(`Отправлен ответ на отзыв ${selectedReview.id}: ${replyText}`);
      setReplyText("");
      setSelectedReview(null);
    }
  };
  
  const calculateReviewStats = () => {
    if (reviews.length === 0) return { average: 0, count: 0, distribution: [0, 0, 0, 0, 0] };
    
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    const average = sum / reviews.length;
    
    const distribution = [0, 0, 0, 0, 0]; // For ratings 1 to 5
    reviews.forEach(review => {
      distribution[review.rating - 1]++;
    });
    
    // Convert to percentages
    const distributionPercent = distribution.map(count => 
      Math.round((count / reviews.length) * 100)
    );
    
    return {
      average: parseFloat(average.toFixed(1)),
      count: reviews.length,
      distribution: distributionPercent
    };
  };
  
  const stats = calculateReviewStats();
  
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Управление отзывами</h1>
      
      <div className="mb-6">
        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="flex flex-col items-center justify-center">
                <div className="text-5xl font-bold mb-2">{stats.average}</div>
                <div className="flex mb-1">{renderStars(Math.round(stats.average))}</div>
                <p className="text-gray-500">На основе {stats.count} отзывов</p>
                <Button variant="outline" className="mt-4">Экспорт отзывов</Button>
              </div>
              
              <div className="space-y-2">
                {[5, 4, 3, 2, 1].map((rating) => (
                  <div key={rating} className="flex items-center">
                    <div className="w-12 text-sm flex justify-end mr-2">
                      {rating} <Star className="h-4 w-4 inline-block ml-1" />
                    </div>
                    <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-amber-500"
                        style={{ width: `${stats.distribution[rating - 1]}%` }}
                      ></div>
                    </div>
                    <div className="w-12 text-sm ml-2">
                      {stats.distribution[rating - 1]}%
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="all">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center">
          <TabsList className="mb-4 md:mb-0">
            <TabsTrigger value="all">Все отзывы</TabsTrigger>
            <TabsTrigger value="unreplied">
              Без ответа
              <Badge className="ml-1 bg-amber-500">{unrepliedReviews.length}</Badge>
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
            
            <Select value={filterGym} onValueChange={setFilterGym}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Фильтр по залу" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все залы</SelectItem>
                {partnerGyms.map(gym => (
                  <SelectItem key={gym.id} value={gym.id}>{gym.name}</SelectItem>
                ))}
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
                    <ReviewItem 
                      key={review.id} 
                      review={review} 
                      gymName={getGymName(review.gym_id)}
                      onReplyClick={() => {
                        setSelectedReview(review);
                        setReplyText(review.reply || "");
                      }}
                    />
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-gray-500">
                  <h3 className="text-lg font-medium mb-2">Отзывы не найдены</h3>
                  <p>По вашему запросу не найдено отзывов. Попробуйте изменить параметры поиска.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="unreplied" className="mt-6">
          <Card>
            <CardContent className="p-0">
              {unrepliedReviews.length > 0 ? (
                <div className="divide-y">
                  {unrepliedReviews.map(review => (
                    <ReviewItem 
                      key={review.id} 
                      review={review} 
                      gymName={getGymName(review.gym_id)}
                      onReplyClick={() => {
                        setSelectedReview(review);
                        setReplyText("");
                      }}
                    />
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-gray-500">
                  <h3 className="text-lg font-medium mb-2">Нет отзывов без ответа</h3>
                  <p>Вы ответили на все отзывы! Отличная работа!</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <Dialog 
        open={selectedReview !== null} 
        onOpenChange={(open) => !open && setSelectedReview(null)}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Ответить на отзыв</DialogTitle>
          </DialogHeader>
          
          {selectedReview && (
            <div className="space-y-4">
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md">
                <div className="flex justify-between items-start">
                  <div className="flex items-center">
                    <Avatar className="h-10 w-10 mr-3">
                      <AvatarFallback>{selectedReview.user.name.substring(0, 2)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-medium">{selectedReview.user.name}</h3>
                      <div className="flex items-center text-sm text-gray-500">
                        <span>{formatDate(selectedReview.date)}</span>
                        <span className="mx-2">•</span>
                        <span>{getGymName(selectedReview.gym_id)}</span>
                      </div>
                    </div>
                  </div>
                  <div>{renderStars(selectedReview.rating)}</div>
                </div>
                <p className="mt-3">{selectedReview.comment}</p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium mb-2">Ваш ответ:</h4>
                <Textarea 
                  placeholder="Напишите ответ на отзыв..." 
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  rows={4}
                />
              </div>
              
              <div className="flex justify-end space-x-3">
                <Button variant="outline" onClick={() => setSelectedReview(null)}>
                  Отмена
                </Button>
                <Button onClick={handleSubmitReply} disabled={!replyText.trim()}>
                  Опубликовать ответ
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

interface ReviewItemProps {
  review: any;
  gymName: string;
  onReplyClick: () => void;
}

const ReviewItem = ({ review, gymName, onReplyClick }: ReviewItemProps) => {
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('ru-RU', options);
  };
  
  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 0; i < rating; i++) {
      stars.push(<Star key={i} className="h-4 w-4 fill-amber-500 text-amber-500" />);
    }
    for (let i = rating; i < 5; i++) {
      stars.push(<Star key={`empty-${i}`} className="h-4 w-4 text-gray-300" />);
    }
    return <div className="flex">{stars}</div>;
  };
  
  const getRatingClass = (rating: number) => {
    if (rating >= 4) return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
    if (rating === 3) return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300";
    return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
  };
  
  return (
    <div className="p-4">
      <div className="flex justify-between items-start">
        <div className="flex items-center">
          <Avatar className="h-10 w-10 mr-3">
            <AvatarFallback>{review.user.name.substring(0, 2)}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-medium">{review.user.name}</h3>
            <div className="flex items-center text-sm text-gray-500">
              <span>{formatDate(review.date)}</span>
              <span className="mx-2">•</span>
              <span>{gymName}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Badge className={getRatingClass(review.rating)}>
            {review.rating}/5
          </Badge>
          {renderStars(review.rating)}
        </div>
      </div>
      
      <div className="mt-3">
        <p>{review.comment}</p>
      </div>
      
      {review.reply && (
        <div className="mt-3 bg-gray-50 dark:bg-gray-800 p-3 rounded-md">
          <div className="text-sm font-medium mb-1">Ваш ответ:</div>
          <p className="text-gray-700 dark:text-gray-300">{review.reply}</p>
        </div>
      )}
      
      <div className="mt-3 flex justify-end">
        <Button 
          variant={review.has_reply ? "outline" : "default"} 
          size="sm"
          onClick={onReplyClick}
        >
          {review.has_reply ? "Изменить ответ" : "Ответить"}
        </Button>
      </div>
    </div>
  );
};

export default PartnerReviews;
