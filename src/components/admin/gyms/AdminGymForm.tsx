
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ImageUploader } from "@/components/ui/image-uploader";
import { Partner } from "@/types";

interface GymFormData {
  name: string;
  location: string;
  address: string;
  city: string;
  category: string;
  working_hours: string;
  features: string[];
  partner_id: string;
  main_image: string;
  images: string[];
}

interface AdminGymFormProps {
  formData: GymFormData;
  setFormData: (data: GymFormData) => void;
  partners: Partner[];
  onMainImageUpload: (file: File) => Promise<string>;
  onAdditionalImageUpload: (file: File) => Promise<string>;
  onRemoveMainImage: () => void;
  onRemoveAdditionalImage: (index: number) => void;
  imageUploading: boolean;
}

export const AdminGymForm = ({
  formData,
  setFormData,
  partners,
  onMainImageUpload,
  onAdditionalImageUpload,
  onRemoveMainImage,
  onRemoveAdditionalImage,
  imageUploading
}: AdminGymFormProps) => {
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

  return (
    <div className="space-y-6">
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
      </div>
      
      <div>
        <Label htmlFor="address">Адрес</Label>
        <Input
          id="address"
          value={formData.address}
          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
        />
      </div>
      
      <div>
        <Label htmlFor="working_hours">Часы работы</Label>
        <Input
          id="working_hours"
          value={formData.working_hours}
          onChange={(e) => setFormData({ ...formData, working_hours: e.target.value })}
          placeholder="Пн-Пт: 06:00-24:00, Сб-Вс: 08:00-22:00"
        />
      </div>

      <div>
        <Label htmlFor="partner">Партнер</Label>
        <Select value={formData.partner_id} onValueChange={(value) => setFormData({ ...formData, partner_id: value })}>
          <SelectTrigger>
            <SelectValue placeholder="Выберите партнера" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="unassigned">Не назначен</SelectItem>
            {partners.filter(p => p.status === 'active').map((partner) => (
              <SelectItem key={partner.id} value={partner.id}>
                {partner.name} ({partner.email})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <ImageUploader
          label="Главное изображение"
          onImageUpload={onMainImageUpload}
          currentImage={formData.main_image}
          onImageRemove={onRemoveMainImage}
          accept="image/*"
          maxSize={5}
        />
      </div>

      <div>
        <Label>Дополнительные изображения</Label>
        <div className="grid grid-cols-3 gap-4 mt-2">
          {formData.images.map((image, index) => (
            <div key={index} className="relative">
              <img
                src={image}
                alt={`Дополнительное изображение ${index + 1}`}
                className="w-full h-24 object-cover rounded border"
              />
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute -top-2 -right-2 h-6 w-6"
                onClick={() => onRemoveAdditionalImage(index)}
              >
                ×
              </Button>
            </div>
          ))}
        </div>
        <ImageUploader
          label="Добавить изображения"
          onImageUpload={onAdditionalImageUpload}
          accept="image/*"
          maxSize={5}
          className="mt-4"
        />
      </div>
      
      <div>
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
  );
};
