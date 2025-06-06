
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

export interface GymGallerySectionProps {
  images: string[];
  mainImage: string;
}

export const GymGallerySection = ({ images, mainImage }: GymGallerySectionProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  
  // Combine main image with additional images, ensuring no duplicates
  const allImages = [mainImage, ...images.filter(img => img !== mainImage)].filter(Boolean);
  
  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
  };
  
  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  return (
    <div className="space-y-3 sticky top-4">
      <h3 className="text-xl font-bold text-white mb-2">Фотографии</h3>
      
      {allImages.length > 0 ? (
        <>
          <div className="grid gap-2">
            <div 
              className="aspect-video relative overflow-hidden rounded-lg cursor-pointer"
              onClick={() => {
                setCurrentImageIndex(0);
                setLightboxOpen(true);
              }}
            >
              <img 
                src={allImages[0] || '/placeholder.svg'} 
                alt="Main view" 
                className="object-cover w-full h-full transition-transform hover:scale-105"
              />
            </div>
            
            <div className="grid grid-cols-3 gap-2">
              {allImages.slice(1, 4).map((image, index) => (
                <div 
                  key={index}
                  className="aspect-square relative overflow-hidden rounded-lg cursor-pointer"
                  onClick={() => {
                    setCurrentImageIndex(index + 1);
                    setLightboxOpen(true);
                  }}
                >
                  <img 
                    src={image || '/placeholder.svg'} 
                    alt={`View ${index + 1}`} 
                    className="object-cover w-full h-full transition-transform hover:scale-105"
                  />
                </div>
              ))}
              
              {allImages.length > 4 && (
                <div 
                  className="aspect-square relative overflow-hidden rounded-lg cursor-pointer"
                  onClick={() => {
                    setCurrentImageIndex(4);
                    setLightboxOpen(true);
                  }}
                >
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <span className="text-white font-medium">+{allImages.length - 4}</span>
                  </div>
                  <img 
                    src={allImages[4] || '/placeholder.svg'} 
                    alt="More images" 
                    className="object-cover w-full h-full"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Lightbox */}
          <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
            <DialogContent className="max-w-4xl bg-black/95 border-gray-800">
              <div className="relative">
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 text-white z-10"
                  onClick={() => setLightboxOpen(false)}
                >
                  <X className="h-6 w-6" />
                </Button>
                
                <div className="relative py-8">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute left-0 top-1/2 transform -translate-y-1/2"
                    onClick={(e) => {
                      e.stopPropagation();
                      prevImage();
                    }}
                  >
                    <ChevronLeft className="h-8 w-8" />
                  </Button>
                  
                  <AspectRatio ratio={16 / 9}>
                    <img 
                      src={allImages[currentImageIndex]} 
                      alt={`Image ${currentImageIndex + 1}`} 
                      className="object-contain w-full h-full"
                    />
                  </AspectRatio>
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-1/2 transform -translate-y-1/2"
                    onClick={(e) => {
                      e.stopPropagation();
                      nextImage();
                    }}
                  >
                    <ChevronRight className="h-8 w-8" />
                  </Button>
                </div>
                
                <div className="text-center text-sm text-gray-400 mt-2">
                  {currentImageIndex + 1} / {allImages.length}
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </>
      ) : (
        <div className="rounded-lg border border-gray-700 bg-gray-800 aspect-video flex items-center justify-center">
          <p className="text-gray-400">Нет доступных фотографий</p>
        </div>
      )}
    </div>
  );
};
