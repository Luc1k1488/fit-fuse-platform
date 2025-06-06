
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/auth_context"; 
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Star, Search, RefreshCw, AlertTriangle } from "lucide-react";

interface Review {
  id: string;
  user_id: string | null;
  gym_id: string | null;
  rating: number | null;
  comment: string | null;
  created_at: string | null;
  user_name?: string;
  user_avatar?: string;
  gym_name?: string;
}

interface Gym {
  id: string;
  name: string | null;
}

const PartnerReviews = () => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [partnerGyms, setPartnerGyms] = useState<Gym[]>([]);
  const [filteredReviews, setFilteredReviews] = useState<Review[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("all");

  const fetchPartnerGyms = async () => {
    if (!user) return;

    try {
      const { data: partnerData, error: partnerError } = await supabase
        .from("partners")
        .select("id")
        .eq("user_id", user.id)
        .single();

      if (partnerError || !partnerData) {
        console.error("Error fetching partner data:", partnerError);
        return;
      }

      const partnerId = partnerData.id;

      const { data, error } = await supabase
        .from("gyms")
        .select("id, name")
        .eq("partner_id", partnerId);

      if (error) {
        console.error("Error fetching partner gyms:", error);
        return;
      }

      setPartnerGyms(data || []);
      
      // Загружаем отзывы после получения списка залов
      if (data?.length) {
        await fetchReviews(data.map(gym => gym.id));
      } else {
        setLoading(false);
      }
    } catch (error) {
      console.error("Exception fetching partner gyms:", error);
      setLoading(false);
    }
  };

  const fetchReviews = async (gymIds: string[]) => {
    if (!gymIds.length) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const { data, error } = await supabase
        .from("reviews")
        .select("*")
        .in("gym_id", gymIds)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching reviews:", error);
        toast.error("Не удалось загрузить отзывы");
        return;
      }

      // Загружаем данные о пользователях
      const { data: users, error: usersError } = await supabase
        .from("users")
        .select("id, name, profile_image");

      if (usersError) {
        console.error("Error fetching users:", usersError);
      }

      // Объединяем данные
      const enrichedReviews = data.map(review => ({
        ...review,
        user_name: users?.find(u => u.id === review.user_id)?.name || "Пользователь",
        user_avatar: users?.find(u => u.id === review.user_id)?.profile_image || null,
        gym_name: partnerGyms.find(g => g.id === review.gym_id)?.name || "Зал"
      }));

      setReviews(enrichedReviews);
      setFilteredReviews(enrichedReviews);
    } catch (error) {
      console.error("Exception fetching reviews:", error);
      toast.error("Произошла ошибка при загрузке отзывов");
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    if (partnerGyms.length) {
      fetchReviews(partnerGyms.map(gym => gym.id));
    }
  };

  const handleFilterChange = (value: string) => {
    setFilter(value);
    
    if (value === "all") {
      setFilteredReviews(reviews.filter(review => 
        review.comment?.toLowerCase().includes(searchQuery.toLowerCase()) || 
        searchQuery === ""
      ));
      return;
    }
    
    let filtered = [...reviews];
    
    switch (value) {
      case "positive":
        filtered = filtered.filter(review => (review.rating || 0) >= 4);
        break;
      case "neutral":
        filtered = filtered.filter(review => (review.rating || 0) === 3);
        break;
      case "negative":
        filtered = filtered.filter(review => (review.rating || 0) < 3);
        break;
      default:
        break;
    }
    
    if (searchQuery) {
      filtered = filtered.filter(review => 
        review.comment?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    setFilteredReviews(filtered);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    let filtered = [...reviews];
    
    if (filter !== "all") {
      switch (filter) {
        case "positive":
          filtered = filtered.filter(review => (review.rating || 0) >= 4);
          break;
        case "neutral":
          filtered = filtered.filter(review => (review.rating || 0) === 3);
          break;
        case "negative":
          filtered = filtered.filter(review => (review.rating || 0) < 3);
          break;
        default:
          break;
      }
    }
    
    if (query) {
      filtered = filtered.filter(review => 
        review.comment?.toLowerCase().includes(query.toLowerCase())
      );
    }
    
    setFilteredReviews(filtered);
  };

  // Отрисовка звезд рейтинга
  const renderStars = (rating: number = 0) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? 'fill-yellow-500 text-yellow-500' : 'text-gray-300'
        }`}
      />
    ));
  };

  // Форматирование даты
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "";
    
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('ru-RU', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    }).format(date);
  };

  useEffect(() => {
    fetchPartnerGyms();
  }, [user]);

  useEffect(() => {
    if (reviews.length) {
      handleFilterChange(filter);
    }
  }, [searchQuery, reviews]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-white">Отзывы</h1>
          <p className="text-gray-400">Отзывы о ваших залах</p>
        </div>
        
        <Button onClick={handleRefresh} variant="outline" disabled={loading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Обновить
        </Button>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <Tabs defaultValue="all" value={filter} onValueChange={handleFilterChange}>
          <TabsList className="bg-gray-800">
            <TabsTrigger value="all">Все отзывы</TabsTrigger>
            <TabsTrigger value="positive">Положительные (4-5)</TabsTrigger>
            <TabsTrigger value="neutral">Нейтральные (3)</TabsTrigger>
            <TabsTrigger value="negative">Отрицательные (1-2)</TabsTrigger>
          </TabsList>
        </Tabs>
        
        <div className="relative w-full md:w-auto">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            type="search"
            placeholder="Поиск по отзывам..."
            className="pl-9 bg-gray-800 border-gray-700 w-full md:w-64"
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>
      </div>
      
      {loading ? (
        <div className="flex justify-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : filteredReviews.length > 0 ? (
        <div className="grid gap-4">
          {filteredReviews.map(review => (
            <Card key={review.id} className="bg-gray-800 border-gray-700">
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg text-white">{review.user_name}</CardTitle>
                    <div className="flex mt-1 mb-0.5">
                      {renderStars(review.rating || 0)}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-400">{formatDate(review.created_at)}</div>
                    <div className="text-sm font-medium text-primary mt-1">{review.gym_name}</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">{review.comment}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 bg-gray-800 rounded-lg border border-gray-700">
          <AlertTriangle className="h-12 w-12 text-gray-400 mb-4" />
          {partnerGyms.length > 0 ? (
            <>
              <p className="text-xl font-medium text-gray-300">Нет отзывов</p>
              <p className="text-gray-400 mt-2">Для ваших залов пока нет отзывов</p>
            </>
          ) : (
            <>
              <p className="text-xl font-medium text-gray-300">Нет залов</p>
              <p className="text-gray-400 mt-2">Сначала добавьте залы, чтобы просматривать отзывы</p>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default PartnerReviews;
