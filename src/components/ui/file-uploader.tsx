
import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, X, FileIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface FileUploaderProps {
  onFilesUpload: (files: File[]) => Promise<string[]>;
  currentFiles?: string[];
  onFileRemove?: (index: number) => void;
  label?: string;
  accept?: string;
  maxSize?: number; // in MB
  maxFiles?: number;
  multiple?: boolean;
  className?: string;
}

export const FileUploader = ({
  onFilesUpload,
  currentFiles = [],
  onFileRemove,
  label = "Файлы",
  accept = "*/*",
  maxSize = 10,
  maxFiles = 5,
  multiple = true,
  className,
}: FileUploaderProps) => {
  const [loading, setLoading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<string[]>(currentFiles);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    // Проверка количества файлов
    if (uploadedFiles.length + files.length > maxFiles) {
      toast({
        title: "Ошибка",
        description: `Максимальное количество файлов: ${maxFiles}`,
        variant: "destructive",
      });
      return;
    }

    // Проверка размера файлов
    for (const file of files) {
      if (file.size > maxSize * 1024 * 1024) {
        toast({
          title: "Ошибка",
          description: `Файл "${file.name}" превышает максимальный размер ${maxSize}MB`,
          variant: "destructive",
        });
        return;
      }
    }

    setLoading(true);
    try {
      const uploadedUrls = await onFilesUpload(files);
      setUploadedFiles(prev => [...prev, ...uploadedUrls]);
      
      toast({
        title: "Успешно",
        description: `Загружено файлов: ${files.length}`,
      });
    } catch (error) {
      console.error("Ошибка загрузки файлов:", error);
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить файлы",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRemove = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
    onFileRemove?.(index);
  };

  const getFileName = (url: string) => {
    return url.split('/').pop() || 'Файл';
  };

  return (
    <div className={className}>
      <Label className="text-sm font-medium">{label}</Label>
      <div className="mt-2 space-y-3">
        {/* Кнопка загрузки */}
        <div className="flex items-center gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={loading || uploadedFiles.length >= maxFiles}
          >
            <Upload className="mr-2 h-4 w-4" />
            {loading ? "Загрузка..." : "Выбрать файлы"}
          </Button>
          
          <Input
            ref={fileInputRef}
            type="file"
            accept={accept}
            multiple={multiple}
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>

        {/* Список загруженных файлов */}
        {uploadedFiles.length > 0 && (
          <div className="space-y-2">
            {uploadedFiles.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between rounded-lg border p-3"
              >
                <div className="flex items-center gap-3">
                  <FileIcon className="h-4 w-4 text-gray-500" />
                  <span className="text-sm truncate max-w-[200px]">
                    {getFileName(file)}
                  </span>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemove(index)}
                  disabled={loading}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
        
        <p className="text-xs text-gray-500">
          Максимальный размер файла: {maxSize}MB. 
          Максимальное количество файлов: {maxFiles}
          {uploadedFiles.length > 0 && ` (загружено: ${uploadedFiles.length})`}
        </p>
      </div>
    </div>
  );
};
