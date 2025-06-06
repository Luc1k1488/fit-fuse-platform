
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface GymGallerySectionProps {
  images: string[];
  mainImage: string | null;
}

export const GymGallerySection = ({ images, mainImage }: GymGallerySectionProps) => {
  const [currentImage, setCurrentImage] = useState(0);
  const allImages = mainImage ? [mainImage, ...images] : images;

  if (!allImages || allImages.length === 0) {
    return (
      <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-white mb-4">Фото</h2>
        <div className="bg-slate-700 rounded-lg h-48 flex items-center justify-center">
          <p className="text-gray-400">Фото пока не добавлены</p>
        </div>
      </div>
    );
  }

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % allImages.length);
  };

  const prevImage = () => {
    setCurrentImage((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg p-6">
      <h2 className="text-xl font-semibold text-white mb-4">Фото ({allImages.length})</h2>
      
      <div className="relative">
        <img 
          src={allImages[currentImage]} 
          alt={`Фото ${currentImage + 1}`}
          className="w-full h-64 object-cover rounded-lg"
        />
        
        {allImages.length > 1 && (
          <>
            <Button
              onClick={prevImage}
              variant="ghost"
              size="sm"
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            <Button
              onClick={nextImage}
              variant="ghost"
              size="sm"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-black/50 rounded-full px-2 py-1">
              <span className="text-white text-sm">
                {currentImage + 1} / {allImages.length}
              </span>
            </div>
          </>
        )}
      </div>

      {allImages.length > 1 && (
        <div className="flex gap-2 mt-4 overflow-x-auto">
          {allImages.map((image, index) => (
            <button
              key={index}
              onClick={() => setCurrentImage(index)}
              className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                index === currentImage ? 'border-purple-500' : 'border-transparent'
              }`}
            >
              <img 
                src={image} 
                alt={`Миниатюра ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
