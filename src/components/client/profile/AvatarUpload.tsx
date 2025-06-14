
import { useState, useRef } from "react";
import { useAuth } from "@/contexts/auth_context";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Camera, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AvatarUploadProps {
  currentAvatar?: string;
  onAvatarUpdate: (url: string) => void;
}

const AvatarUpload = ({ currentAvatar, onAvatarUpdate }: AvatarUploadProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    // Проверяем тип файла
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Ошибка",
        description: "Пожалуйста, выберите изображение",
        variant: "destructive",
      });
      return;
    }

    // Проверяем размер файла (максимум 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Ошибка",
        description: "Размер файла не должен превышать 5MB",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      // Загружаем файл в Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Получаем публичный URL
      const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      const avatarUrl = data.publicUrl;

      // Обновляем профиль пользователя
      const { error: updateError } = await supabase.auth.updateUser({
        data: { avatar_url: avatarUrl }
      });

      if (updateError) throw updateError;

      // Обновляем таблицу users
      const { error: profileError } = await supabase
        .from('users')
        .update({ profile_image: avatarUrl })
        .eq('id', user.id);

      if (profileError) throw profileError;

      onAvatarUpdate(avatarUrl);
      
      toast({
        title: "Успех",
        description: "Аватар успешно обновлен",
      });

    } catch (error: any) {
      toast({
        title: "Ошибка",
        description: error.message || "Ошибка загрузки аватара",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="relative">
      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center overflow-hidden">
        {currentAvatar ? (
          <img 
            src={currentAvatar} 
            alt="Аватар"
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-white text-2xl font-bold">
            {user?.user_metadata?.name?.charAt(0).toUpperCase() || 
             user?.email?.charAt(0).toUpperCase() || 'U'}
          </span>
        )}
      </div>
      
      <Button
        size="sm"
        onClick={handleButtonClick}
        disabled={isUploading}
        className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-purple-600 hover:bg-purple-700 p-0"
      >
        {isUploading ? (
          <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
        ) : (
          <Camera className="h-4 w-4" />
        )}
      </Button>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
};

export default AvatarUpload;
