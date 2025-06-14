
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { AdminGymForm } from "./AdminGymForm";
import { validateGymData } from "@/utils/gymValidation";

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

interface AdminGymEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  gym: any;
  partners: any[];
  onGymUpdated: () => void;
}

const AdminGymEditDialog = ({ open, onOpenChange, gym, partners, onGymUpdated }: AdminGymEditDialogProps) => {
  const [formData, setFormData] = useState<GymFormData>({
    name: "",
    location: "",
    address: "",
    city: "",
    category: "",
    working_hours: "",
    features: [],
    partner_id: "",
    main_image: "",
    images: [],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (gym) {
      setFormData({
        name: gym.name || "",
        location: gym.location || "",
        address: gym.address || "",
        city: gym.city || "",
        category: gym.category || "",
        working_hours: gym.working_hours || "",
        features: gym.features || [],
        partner_id: gym.partner_id || "unassigned",
        main_image: gym.main_image || "",
        images: gym.images || [],
      });
    }
  }, [gym]);

  const handleMainImageUpload = async (file: File): Promise<string> => {
    setImageUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `gym-images/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('gym-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('gym-images')
        .getPublicUrl(filePath);

      setFormData(prev => ({ ...prev, main_image: data.publicUrl }));
      return data.publicUrl;
    } catch (error: any) {
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить изображение",
        variant: "destructive",
      });
      throw error;
    } finally {
      setImageUploading(false);
    }
  };

  const handleAdditionalImageUpload = async (file: File): Promise<string> => {
    const url = await handleMainImageUpload(file);
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, url]
    }));
    return url;
  };

  const handleRemoveMainImage = () => {
    setFormData(prev => ({ ...prev, main_image: "" }));
  };

  const handleRemoveAdditionalImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validation = validateGymData(formData);
    if (!validation.success) {
      toast({
        title: "Ошибка валидации",
        description: "Пожалуйста, заполните все обязательные поля",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const gymData = {
        ...formData,
        partner_id: formData.partner_id === "unassigned" ? null : formData.partner_id
      };

      const { error } = await supabase
        .from('gyms')
        .update(gymData)
        .eq('id', gym.id);

      if (error) throw error;

      toast({
        title: "Успех",
        description: "Спортзал успешно обновлен",
      });

      onGymUpdated();
    } catch (error: any) {
      toast({
        title: "Ошибка",
        description: error.message || "Не удалось обновить спортзал",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Редактировать спортзал</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <AdminGymForm
            formData={formData}
            setFormData={setFormData}
            partners={partners}
            onMainImageUpload={handleMainImageUpload}
            onAdditionalImageUpload={handleAdditionalImageUpload}
            onRemoveMainImage={handleRemoveMainImage}
            onRemoveAdditionalImage={handleRemoveAdditionalImage}
            imageUploading={imageUploading}
          />
          
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Отмена
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Сохранение..." : "Сохранить изменения"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AdminGymEditDialog;
