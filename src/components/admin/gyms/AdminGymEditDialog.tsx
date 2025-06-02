
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
import { Gym, Partner } from "@/types";

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
  selectedGym: Gym | null;
  formData: GymFormData;
  setFormData: (data: GymFormData) => void;
  partners: Partner[];
  onSave: () => void;
  onMainImageUpload: (file: File) => Promise<string>;
  onAdditionalImageUpload: (file: File) => Promise<string>;
  onRemoveMainImage: () => void;
  onRemoveAdditionalImage: (index: number) => void;
  imageUploading: boolean;
}

export const AdminGymEditDialog = ({
  open,
  onOpenChange,
  selectedGym,
  formData,
  setFormData,
  partners,
  onSave,
  onMainImageUpload,
  onAdditionalImageUpload,
  onRemoveMainImage,
  onRemoveAdditionalImage,
  imageUploading
}: AdminGymEditDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Редактировать зал</DialogTitle>
          <DialogDescription>
            Измените информацию о зале
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
            onClick={onSave}
            disabled={imageUploading}
          >
            {imageUploading ? 'Загрузка...' : 'Сохранить'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
