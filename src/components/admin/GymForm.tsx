
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X, Upload, Plus, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Gym } from "@/types";

const gymSchema = z.object({
  name: z.string().min(3, { message: "Название должно содержать минимум 3 символа" }),
  location: z.string().min(3, { message: "Укажите район" }),
  city: z.string().min(2, { message: "Укажите город" }),
  address: z.string().min(5, { message: "Адрес должен содержать минимум 5 символов" }),
  category: z.string().min(1, { message: "Выберите категорию" }),
  working_hours: z.string().optional(),
  features: z.array(z.string()).optional(),
  main_image: z.string().optional(),
});

type GymFormValues = z.infer<typeof gymSchema>;

interface GymFormProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: (gym: Gym) => void;
  initialData?: Partial<Gym>;
}

const categories = ["Премиум", "Фитнес", "Йога", "Кроссфит", "Бокс", "Велнес"];

export const GymForm = ({ open, onClose, onSuccess, initialData }: GymFormProps) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [features, setFeatures] = useState<string[]>(initialData?.features || []);
  const [newFeature, setNewFeature] = useState("");
  const [imageSrc, setImageSrc] = useState<string | null>(initialData?.main_image || null);

  const form = useForm<GymFormValues>({
    resolver: zodResolver(gymSchema),
    defaultValues: {
      name: initialData?.name || "",
      location: initialData?.location || "",
      city: initialData?.city || "",
      address: initialData?.address || "",
      category: initialData?.category || "",
      working_hours: initialData?.working_hours || "9:00 - 22:00",
      features: initialData?.features || [],
      main_image: initialData?.main_image || "",
    },
  });

  const addFeature = () => {
    if (newFeature.trim() && !features.includes(newFeature.trim())) {
      const updatedFeatures = [...features, newFeature.trim()];
      setFeatures(updatedFeatures);
      form.setValue("features", updatedFeatures);
      setNewFeature("");
    }
  };

  const removeFeature = (feature: string) => {
    const updatedFeatures = features.filter((f) => f !== feature);
    setFeatures(updatedFeatures);
    form.setValue("features", updatedFeatures);
  };

  // Функция для отправки формы
  const onSubmit = async (data: GymFormValues) => {
    try {
      setIsLoading(true);
      
      // Обновляем данные формы с актуальными features
      data.features = features;
      
      // Если есть изображение, используем его
      if (imageSrc) {
        data.main_image = imageSrc;
      }
      
      // Создаем запись в базе данных
      const { data: newGym, error } = await supabase
        .from("gyms")
        .insert([
          { 
            ...data,
            rating: 0,
            review_count: 0
          }
        ])
        .select("*")
        .single();
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Успешно!",
        description: "Фитнес-зал успешно добавлен.",
      });
      
      if (onSuccess && newGym) {
        onSuccess(newGym as Gym);
      }
      
      onClose();
    } catch (error) {
      console.error("Ошибка при добавлении зала:", error);
      toast({
        variant: "destructive",
        title: "Ошибка!",
        description: "Не удалось добавить фитнес-зал.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // В реальном приложении здесь должна быть загрузка изображения в хранилище
    // Для демонстрации используем локальную ссылку
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === "string") {
        setImageSrc(reader.result);
        form.setValue("main_image", reader.result);
      }
    };
    reader.readAsDataURL(file);

    // В реальном приложении с Supabase Storage:
    // const uploadImage = async () => {
    //   const { data, error } = await supabase.storage
    //     .from("gym_images")
    //     .upload(`gym-${Date.now()}`, file);
    //   if (data) {
    //     const url = supabase.storage.from("gym_images").getPublicUrl(data.path).data.publicUrl;
    //     setImageSrc(url);
    //     form.setValue("main_image", url);
    //   }
    // };
    // uploadImage();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{initialData ? "Редактировать зал" : "Добавить новый зал"}</DialogTitle>
          <DialogDescription>
            Заполните информацию о фитнес-зале. Все поля, отмеченные звездочкой (*), обязательны для заполнения.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Название зала *</FormLabel>
                  <FormControl>
                    <Input placeholder="Фитнес Элит" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Город *</FormLabel>
                    <FormControl>
                      <Input placeholder="Москва" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Район *</FormLabel>
                    <FormControl>
                      <Input placeholder="Центр" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Полный адрес *</FormLabel>
                  <FormControl>
                    <Input placeholder="ул. Пушкина, 10" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Категория зала *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите категорию" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="working_hours"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Часы работы</FormLabel>
                  <FormControl>
                    <Input placeholder="9:00 - 22:00" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div>
              <FormLabel>Особенности и удобства</FormLabel>
              <div className="flex items-center space-x-2 mt-2">
                <Input
                  value={newFeature}
                  onChange={(e) => setNewFeature(e.target.value)}
                  placeholder="Например: Бассейн"
                  className="flex-1"
                />
                <Button
                  type="button"
                  onClick={addFeature}
                  variant="outline"
                  size="icon"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex flex-wrap gap-2 mt-3">
                {features.map((feature, index) => (
                  <div
                    key={index}
                    className="bg-secondary text-secondary-foreground px-3 py-1 rounded-md flex items-center text-sm"
                  >
                    <span>{feature}</span>
                    <button
                      type="button"
                      onClick={() => removeFeature(feature)}
                      className="ml-2 text-muted-foreground hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <FormLabel>Фото зала</FormLabel>
              <div className="mt-2 flex items-center">
                <label className="cursor-pointer">
                  <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 flex flex-col items-center justify-center">
                    {imageSrc ? (
                      <div className="relative w-full">
                        <img
                          src={imageSrc}
                          alt="Preview"
                          className="h-40 w-full object-cover rounded-md"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setImageSrc(null);
                            form.setValue("main_image", "");
                          }}
                          className="absolute top-1 right-1 bg-white dark:bg-gray-800 p-1 rounded-full"
                        >
                          <Trash className="h-4 w-4 text-destructive" />
                        </button>
                      </div>
                    ) : (
                      <>
                        <Upload className="h-10 w-10 text-gray-400 mb-2" />
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Нажмите для загрузки или перетащите файл
                        </p>
                      </>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                  </div>
                </label>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Рекомендуемый размер: 800x600 пикселей
              </p>
            </div>

            <DialogFooter>
              <Button
                type="button"
                onClick={onClose}
                variant="outline"
                disabled={isLoading}
              >
                Отмена
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Сохранение..." : "Сохранить"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
