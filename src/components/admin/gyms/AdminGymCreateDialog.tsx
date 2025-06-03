
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AdminGymForm } from "./AdminGymForm";
import { Partner } from "@/types";
import { validateGymData } from "@/utils/gymValidation";
import { toast } from "sonner";

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

interface AdminGymCreateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formData: GymFormData;
  setFormData: (data: GymFormData) => void;
  partners: Partner[];
  onCreate: () => void;
  onMainImageUpload: (file: File) => Promise<string>;
  onAdditionalImageUpload: (file: File) => Promise<string>;
  onRemoveMainImage: () => void;
  onRemoveAdditionalImage: (index: number) => void;
  imageUploading: boolean;
}

export const AdminGymCreateDialog = ({
  open,
  onOpenChange,
  formData,
  setFormData,
  partners,
  onCreate,
  onMainImageUpload,
  onAdditionalImageUpload,
  onRemoveMainImage,
  onRemoveAdditionalImage,
  imageUploading
}: AdminGymCreateDialogProps) => {
  const handleCreate = () => {
    const validationResult = validateGymData(formData);
    if (!validationResult.success) {
      const firstError = validationResult.error.errors[0];
      toast.error(`Ошибка валидации: ${firstError.message}`);
      return;
    }
    onCreate();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Создать новый зал</DialogTitle>
          <DialogDescription>
            Заполните информацию о новом зале
          </DialogDescription>
        </DialogHeader>
        
        <AdminGymForm
          formData={formData}
          setFormData={setFormData}
          partners={partners}
          onMainImageUpload={onMainImageUpload}
          onAdditionalImageUpload={onAdditionalImageUpload}
          onRemoveMainImage={onRemoveMainImage}
          onRemoveAdditionalImage={onRemoveAdditionalImage}
          imageUploading={imageUploading}
        />

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Отмена
          </Button>
          <Button 
            onClick={handleCreate}
            disabled={imageUploading}
          >
            {imageUploading ? 'Загрузка...' : 'Создать зал'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
