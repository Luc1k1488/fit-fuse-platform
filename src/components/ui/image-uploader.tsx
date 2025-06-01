
import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, X, ImageIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ImageUploaderProps {
  onImageUpload: (file: File) => Promise<string>;
  currentImage?: string;
  onImageRemove?: () => void;
  label?: string;
  accept?: string;
  maxSize?: number; // in MB
  className?: string;
}

export const ImageUploader = ({
  onImageUpload,
  currentImage,
  onImageRemove,
  label = "Изображение",
  accept = "image/*",
  maxSize = 5,
  className,
}: ImageUploaderProps) => {
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentImage || null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Проверка размера файла
    if (file.size > maxSize * 1024 * 1024) {
      toast({
        title: "Ошибка",
        description: `Размер файла не должен превышать ${maxSize}MB`,
        variant: "destructive",
      });
      return;
    }

    // Проверка типа файла
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Ошибка",
        description: "Выберите файл изображения",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // Создаем превью
      const previewUrl = URL.createObjectURL(file);
      setPreview(previewUrl);

      // Загружаем файл
      await onImageUpload(file);
      
      toast({
        title: "Успешно",
        description: "Изображение загружено",
      });
    } catch (error) {
      console.error("Ошибка загрузки изображения:", error);
      setPreview(null);
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить изображение",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    onImageRemove?.();
  };

  return (
    <div className={className}>
      <Label className="text-sm font-medium">{label}</Label>
      <div className="mt-2">
        {preview ? (
          <div className="relative inline-block">
            <img
              src={preview}
              alt="Preview"
              className="h-32 w-32 object-cover rounded-lg border"
            />
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute -top-2 -right-2 h-6 w-6"
              onClick={handleRemove}
              disabled={loading}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <div
              className="flex h-32 w-32 cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-gray-300 hover:border-gray-400"
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="text-center">
                <ImageIcon className="mx-auto h-8 w-8 text-gray-400" />
                <p className="mt-2 text-sm text-gray-500">Выбрать</p>
              </div>
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              disabled={loading}
            >
              <Upload className="mr-2 h-4 w-4" />
              {loading ? "Загрузка..." : "Загрузить изображение"}
            </Button>
          </div>
        )}
        
        <Input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleFileSelect}
          className="hidden"
        />
        
        <p className="mt-1 text-xs text-gray-500">
          Максимальный размер: {maxSize}MB. Поддерживаемые форматы: JPG, PNG, GIF
        </p>
      </div>
    </div>
  );
};
