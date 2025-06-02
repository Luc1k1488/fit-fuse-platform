
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Gym, Partner } from "@/types";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useConfirmDialog } from "@/hooks/useConfirmDialog";
import { AdminGymsHeader } from "@/components/admin/gyms/AdminGymsHeader";
import { AdminGymsTable } from "@/components/admin/gyms/AdminGymsTable";
import { AdminGymEditDialog } from "@/components/admin/gyms/AdminGymEditDialog";

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

const AdminGyms = () => {
  const [gyms, setGyms] = useState<Gym[]>([]);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGym, setSelectedGym] = useState<Gym | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [imageUploading, setImageUploading] = useState(false);

  const confirmDialog = useConfirmDialog();

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
    images: []
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const { data: gymsData, error: gymsError } = await supabase
        .from('gyms')
        .select('*')
        .order('created_at', { ascending: false });

      if (gymsError) throw gymsError;
      setGyms(gymsData || []);
      
      const { data: partnersData, error: partnersError } = await supabase
        .from('partners')
        .select('*')
        .order('created_at', { ascending: false });

      if (partnersError) throw partnersError;
      setPartners((partnersData || []) as Partner[]);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Ошибка загрузки данных');
    } finally {
      setLoading(false);
    }
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
      features: gym.features || [],
      partner_id: gym.partner_id || "unassigned",
      main_image: gym.main_image || "",
      images: gym.images || []
    });
    setEditDialogOpen(true);
  };

  const handleImageUpload = async (file: File): Promise<string> => {
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

      return data.publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw new Error('Не удалось загрузить изображение');
    } finally {
      setImageUploading(false);
    }
  };

  const handleMainImageUpload = async (file: File): Promise<string> => {
    try {
      const url = await handleImageUpload(file);
      setFormData(prev => ({ ...prev, main_image: url }));
      return url;
    } catch (error) {
      console.error('Error uploading main image:', error);
      throw error;
    }
  };

  const handleAdditionalImageUpload = async (file: File): Promise<string> => {
    try {
      const url = await handleImageUpload(file);
      setFormData(prev => ({ 
        ...prev, 
        images: [...prev.images, url] 
      }));
      return url;
    } catch (error) {
      console.error('Error uploading additional image:', error);
      throw error;
    }
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

  const handleSaveGym = async () => {
    if (!selectedGym) return;

    const confirmed = await confirmDialog.confirm({
      title: "Сохранить изменения?",
      description: "Вы уверены, что хотите сохранить изменения в зале?",
      confirmText: "Сохранить",
      cancelText: "Отмена"
    });

    if (!confirmed) return;

    try {
      const partnerIdToSave = formData.partner_id === 'unassigned' ? null : formData.partner_id;
      
      const { error } = await supabase
        .from('gyms')
        .update({
          name: formData.name,
          location: formData.location,
          address: formData.address,
          city: formData.city,
          category: formData.category,
          working_hours: formData.working_hours,
          features: formData.features,
          partner_id: partnerIdToSave,
          main_image: formData.main_image || null,
          images: formData.images
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

  const filteredGyms = gyms.filter(gym =>
    gym.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    gym.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    gym.city?.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
      <AdminGymsHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        totalGyms={filteredGyms.length}
      />

      <Card>
        <CardHeader>
          <CardTitle>Список залов ({filteredGyms.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <AdminGymsTable
            gyms={filteredGyms}
            partners={partners}
            onEditGym={handleEditGym}
          />
        </CardContent>
      </Card>

      <AdminGymEditDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        selectedGym={selectedGym}
        formData={formData}
        setFormData={setFormData}
        partners={partners}
        onSave={handleSaveGym}
        onMainImageUpload={handleMainImageUpload}
        onAdditionalImageUpload={handleAdditionalImageUpload}
        onRemoveMainImage={handleRemoveMainImage}
        onRemoveAdditionalImage={handleRemoveAdditionalImage}
        imageUploading={imageUploading}
      />

      <ConfirmDialog
        open={confirmDialog.isOpen}
        onOpenChange={confirmDialog.setIsOpen}
        title={confirmDialog.config.title}
        description={confirmDialog.config.description}
        confirmText={confirmDialog.config.confirmText}
        cancelText={confirmDialog.config.cancelText}
        onConfirm={confirmDialog.handleConfirm}
        variant={confirmDialog.config.variant}
        loading={confirmDialog.loading}
      />
    </div>
  );
};

export default AdminGyms;
