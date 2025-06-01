
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { gymValidationSchema, type GymFormData } from "@/utils/validation";
import { useFormValidation } from "@/hooks/useFormValidation";
import { useToast } from "@/hooks/use-toast";

interface GymFormValidatedProps {
  onSubmit: (data: GymFormData) => Promise<void>;
  initialData?: Partial<GymFormData>;
  isLoading?: boolean;
}

const categories = [
  "Фитнес-центр",
  "Тренажерный зал", 
  "Йога-студия",
  "Бассейн",
  "Единоборства",
  "Танцы"
];

const features = [
  "Кондиционер",
  "Душевые",
  "Раздевалки",
  "Парковка",
  "Wi-Fi",
  "Кафе",
  "Сауна",
  "Массаж",
  "Персональные тренировки"
];

export const GymFormValidated = ({ onSubmit, initialData, isLoading }: GymFormValidatedProps) => {
  const { validate, getFieldError, clearErrors } = useFormValidation(gymValidationSchema);
  const { toast } = useToast();

  const [formData, setFormData] = useState<GymFormData>({
    name: initialData?.name || "",
    address: initialData?.address || "",
    city: initialData?.city || "",
    category: initialData?.category || "",
    working_hours: initialData?.working_hours || "",
    features: initialData?.features || [],
  });

  const handleInputChange = (field: keyof GymFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFeaturesChange = (feature: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      features: checked 
        ? [...prev.features, feature]
        : prev.features.filter(f => f !== feature)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearErrors();

    if (!validate(formData)) {
      toast({
        title: "Ошибка валидации",
        description: "Пожалуйста, исправьте ошибки в форме",
        variant: "destructive",
      });
      return;
    }

    try {
      await onSubmit(formData);
      toast({
        title: "Успешно",
        description: "Зал сохранен",
      });
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось сохранить зал",
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Название зала</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
            className={getFieldError("name") ? "border-red-500" : ""}
          />
          {getFieldError("name") && (
            <p className="text-sm text-red-500">{getFieldError("name")}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="city">Город</Label>
          <Input
            id="city"
            value={formData.city}
            onChange={(e) => handleInputChange("city", e.target.value)}
            className={getFieldError("city") ? "border-red-500" : ""}
          />
          {getFieldError("city") && (
            <p className="text-sm text-red-500">{getFieldError("city")}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">Адрес</Label>
        <Input
          id="address"
          value={formData.address}
          onChange={(e) => handleInputChange("address", e.target.value)}
          className={getFieldError("address") ? "border-red-500" : ""}
        />
        {getFieldError("address") && (
          <p className="text-sm text-red-500">{getFieldError("address")}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Категория</Label>
          <Select 
            value={formData.category} 
            onValueChange={(value) => handleInputChange("category", value)}
          >
            <SelectTrigger className={getFieldError("category") ? "border-red-500" : ""}>
              <SelectValue placeholder="Выберите категорию" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {getFieldError("category") && (
            <p className="text-sm text-red-500">{getFieldError("category")}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="working_hours">Рабочие часы</Label>
          <Input
            id="working_hours"
            value={formData.working_hours}
            onChange={(e) => handleInputChange("working_hours", e.target.value)}
            placeholder="Например: 6:00 - 23:00"
            className={getFieldError("working_hours") ? "border-red-500" : ""}
          />
          {getFieldError("working_hours") && (
            <p className="text-sm text-red-500">{getFieldError("working_hours")}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label>Особенности</Label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {features.map((feature) => (
            <div key={feature} className="flex items-center space-x-2">
              <Checkbox
                id={feature}
                checked={formData.features.includes(feature)}
                onCheckedChange={(checked) => handleFeaturesChange(feature, !!checked)}
              />
              <Label htmlFor={feature} className="text-sm">
                {feature}
              </Label>
            </div>
          ))}
        </div>
        {getFieldError("features") && (
          <p className="text-sm text-red-500">{getFieldError("features")}</p>
        )}
      </div>

      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? "Сохранение..." : "Сохранить зал"}
      </Button>
    </form>
  );
};
