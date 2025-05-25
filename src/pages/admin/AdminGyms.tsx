
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Search, Edit, MapPin, Star, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Gym, Partner } from "@/types";
import { toast } from "sonner";

const AdminGyms = () => {
  const [gyms, setGyms] = useState<Gym[]>([]);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGym, setSelectedGym] = useState<Gym | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    address: "",
    city: "",
    category: "",
    working_hours: "",
    features: [] as string[]
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [gymsResponse, partnersResponse] = await Promise.all([
        supabase.from('gyms').select('*').order('created_at', { ascending: false }),
        supabase.from('partners').select('*')
      ]);

      if (gymsResponse.error) throw gymsResponse.error;
      if (partnersResponse.error) throw partnersResponse.error;

      setGyms(gymsResponse.data || []);
      setPartners(partnersResponse.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Ошибка загрузки данных');
    } finally {
      setLoading(false);
    }
  };

  const getPartnerName = (ownerId: string | null) => {
    if (!ownerId) return 'Не назначен';
    const partner = partners.find(p => p.id === ownerId);
    return partner ? partner.name : 'Неизвестный партнер';
  };

  const handleEditGym = (gym: Gym) => {
    setSelectedGym(gym);
    setFormData({
      name: gym.name || "",
      location: gym.location || "",
      address: gym.address || "",
      city: gym.city || "",
      category: gym.category || "",
      working_hours: gym.working_hours || "",
      features: gym.features || []
    });
    setEditDialogOpen(true);
  };

  const handleSaveGym = async () => {
    if (!selectedGym) return;

    try {
      const { error } = await supabase
        .from('gyms')
        .update({
          name: formData.name,
          location: formData.location,
          address: formData.address,
          city: formData.city,
          category: formData.category,
          working_hours: formData.working_hours,
          features: formData.features
        })
        .eq('id', selectedGym.id);

      if (error) throw error;

      await fetchData();
      setEditDialogOpen(false);
      setSelectedGym(null);
      toast.success('Зал обновлен');
    } catch (error) {
      console.error('Error updating gym:', error);
      toast.error('Ошибка обновления зала');
    }
  };

  const addFeature = (feature: string) => {
    if (feature && !formData.features.includes(feature)) {
      setFormData({
        ...formData,
        features: [...formData.features, feature]
      });
    }
  };

  const removeFeature = (feature: string) => {
    setFormData({
      ...formData,
      features: formData.features.filter(f => f !== feature)
    });
  };

  const filteredGyms = gyms.filter(gym =>
    gym.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    gym.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    gym.city?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatRating = (rating: number | null) => {
    if (!rating) return '-';
    return rating.toFixed(1);
  };

  if (loading) {
    return (
      <div className="p-4">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Управление залами</h1>
        <div className="relative w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Поиск залов..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Список залов ({filteredGyms.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Название</TableHead>
                <TableHead>Локация</TableHead>
                <TableHead>Категория</TableHead>
                <TableHead>Партнер</TableHead>
                <TableHead>Рейтинг</TableHead>
                <TableHead>Отзывы</TableHead>
                <TableHead>Действия</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredGyms.map((gym) => (
                <TableRow key={gym.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{gym.name}</div>
                      <div className="text-sm text-gray-500 flex items-center">
                        <MapPin className="h-3 w-3 mr-1" />
                        {gym.address}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{gym.city}</TableCell>
                  <TableCell>
                    {gym.category && (
                      <Badge variant="outline">{gym.category}</Badge>
                    )}
                  </TableCell>
                  <TableCell>{getPartnerName(gym.owner_id)}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-500 mr-1" />
                      {formatRating(gym.rating)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Users className="h-4 w-4 text-gray-500 mr-1" />
                      {gym.review_count || 0}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditGym(gym)}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Редактировать
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Редактировать зал</DialogTitle>
            <DialogDescription>
              Измените информацию о зале
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Название</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            
            <div>
              <Label htmlFor="category">Категория</Label>
              <Input
                id="category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              />
            </div>
            
            <div>
              <Label htmlFor="city">Город</Label>
              <Input
                id="city"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              />
            </div>
            
            <div>
              <Label htmlFor="location">Район</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              />
            </div>
            
            <div className="col-span-2">
              <Label htmlFor="address">Адрес</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />
            </div>
            
            <div className="col-span-2">
              <Label htmlFor="working_hours">Часы работы</Label>
              <Input
                id="working_hours"
                value={formData.working_hours}
                onChange={(e) => setFormData({ ...formData, working_hours: e.target.value })}
                placeholder="Пн-Пт: 06:00-24:00, Сб-Вс: 08:00-22:00"
              />
            </div>
            
            <div className="col-span-2">
              <Label>Удобства</Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.features.map((feature, index) => (
                  <Badge key={index} variant="secondary" className="cursor-pointer" onClick={() => removeFeature(feature)}>
                    {feature} ×
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2 flex-wrap">
                {['Парковка', 'Душевые', 'Сауна', 'Кондиционер', 'WiFi', 'Раздевалки', 'Тренеры'].map(feature => (
                  <Button
                    key={feature}
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => addFeature(feature)}
                    disabled={formData.features.includes(feature)}
                  >
                    {feature}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Отмена
            </Button>
            <Button onClick={handleSaveGym}>
              Сохранить
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminGyms;
