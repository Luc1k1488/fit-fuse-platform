import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { GymHeader } from "@/components/client/gym-detail/GymHeader";
import { GymInfoSection } from "@/components/client/gym-detail/GymInfoSection";
import { GymGallerySection } from "@/components/client/gym-detail/GymGallerySection";
import { GymClassesSection } from "@/components/client/gym-detail/GymClassesSection";
import { ReviewsList } from "@/components/reviews/ReviewsList";
import { Separator } from "@/components/ui/separator";
import { Gym } from "@/types";

const ClientGymDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [gym, setGym] = useState<Gym | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGymData = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from('gyms')
          .select('*')
          .eq('id', id)
          .single();
          
        if (error) {
          console.error("Error fetching gym details:", error);
        } else {
          setGym(data);
        }
      } catch (error) {
        console.error("Exception fetching gym details:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchGymData();
  }, [id]);
  
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
        <p className="mt-4 text-gray-400">Загрузка информации о зале...</p>
      </div>
    );
  }
  
  if (!gym) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold text-white">Зал не найден</h2>
        <p className="mt-2 text-gray-400">Запрошенный зал не существует или был удален</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-16">
      <GymHeader gym={gym} />
      
      <div className="container mx-auto px-4 py-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <GymInfoSection gym={gym} />
            
            <Separator className="my-8 bg-gray-700" />
            
            <GymClassesSection gymId={gym.id} />
            
            <Separator className="my-8 bg-gray-700" />
            
            <ReviewsList gymId={gym.id} />
          </div>
          
          <div>
            <GymGallerySection images={gym.images || []} mainImage={gym.main_image} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientGymDetail;
