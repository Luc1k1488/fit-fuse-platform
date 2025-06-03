
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
import { validateGymData } from "@/utils/gymValidation";
import { useState } from "react";

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
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateField = (fieldName: keyof GymFormData, value: any) => {
    const result = validateGymData({ ...formData, [fieldName]: value });
    if (!result.success) {
      const fieldError = result.error.errors.find(err => err.path[0] === fieldName);
      if (fieldError) {
        setErrors(prev => ({ ...prev, [fieldName]: fieldError.message }));
      } else {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors[fieldName];
          return newErrors;
        });
      }
    } else {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[fieldName];
        return newErrors;
      });
    }
  };

  const handleFieldChange = (fieldName: keyof GymFormData, value: any) => {
    const newData = { ...formData, [fieldName]: value };
    setFormData(newData);
    validateField(fieldName, value);
  };

  const addFeature = (feature: string) => {
    if (feature && !formData.features.includes(feature)) {
      const newFeatures = [...formData.features, feature];
      handleFieldChange('features', newFeatures);
    }
  };

  const removeFeature = (feature: string) => {
    const newFeatures = formData.features.filter(f => f !== feature);
    handleFieldChange('features', newFeatures);
  };

  const getFieldError = (fieldName: string) => errors[fieldName];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Название</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => handleFieldChange('name', e.target.value)}
            className={getFieldError('name') ? 'border-red-500' : ''}
          />
          {getFieldError('name') && (
            <p className="text-sm text-red-500 mt-1">{getFieldError('name')}</p>
          )}
        </div>
        
        <div>
          <Label htmlFor="category">Категория</Label>
          <Input
            id="category"
            value={formData.category}
            onChange={(e) => handleFieldChange('category', e.target.value)}
            className={getFieldError('category') ? 'border-red-500' : ''}
          />
          {getFieldError('category') && (
            <p className="text-sm text-red-500 mt-1">{getFieldError('category')}</p>
          )}
        </div>
        
        <div>
          <Label htmlFor="city">Город</Label>
          <Input
            id="city"
            value={formData.city}
            onChange={(e) => handleFieldChange('city', e.target.value)}
            className={getFieldError('city') ? 'border-red-500' : ''}
          />
          {getFieldError('city') && (
            <p className="text-sm text-red-500 mt-1">{getFieldError('city')}</p>
          )}
        </div>
        
        <div>
          <Label htmlFor="location">Район</Label>
          <Input
            id="location"
            value={formData.location}
            onChange={(e) => handleFieldChange('location', e.target.value)}
            className={getFieldError('location') ? 'border-red-500' : ''}
          />
          {getFieldError('location') && (
            <p className="text-sm text-red-500 mt-1">{getFieldError('location')}</p>
          )}
        </div>
      </div>
      
      <div>
        <Label htmlFor="address">Адрес</Label>
        <Input
          id="address"
          value={formData.address}
          onChange={(e) => handleFieldChange('address', e.target.value)}
          className={getFieldError('address') ? 'border-red-500' : ''}
        />
        {getFieldError('address') && (
          <p className="text-sm text-red-500 mt-1">{getFieldError('address')}</p>
        )}
      </div>
      
      <div>
        <Label htmlFor="working_hours">Часы работы</Label>
        <Input
          id="working_hours"
          value={formData.working_hours}
          onChange={(e) => handleFieldChange('working_hours', e.target.value)}
          placeholder="Пн-Пт: 06:00-24:00, Сб-Вс: 08:00-22:00"
          className={getFieldError('working_hours') ? 'border-red-500' : ''}
        />
        {getFieldError('working_hours') && (
          <p className="text-sm text-red-500 mt-1">{getFieldError('working_hours')}</p>
        )}
      </div>

      <div>
        <Label htmlFor="partner">Партнер</Label>
        <Select 
          value={formData.partner_id} 
          onValueChange={(value) => handleFieldChange('partner_id', value)}
        >
          <SelectTrigger className={getFieldError('partner_id') ? 'border-red-500' : ''}>
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
        {getFieldError('partner_id') && (
          <p className="text-sm text-red-500 mt-1">{getFieldError('partner_id')}</p>
        )}
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
        {getFieldError('main_image') && (
          <p className="text-sm text-red-500 mt-1">{getFieldError('main_image')}</p>
        )}
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
        {getFieldError('images') && (
          <p className="text-sm text-red-500 mt-1">{getFieldError('images')}</p>
        )}
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
        {getFieldError('features') && (
          <p className="text-sm text-red-500 mt-1">{getFieldError('features')}</p>
        )}
      </div>
    </div>
  );
};
