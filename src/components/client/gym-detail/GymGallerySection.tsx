
interface GymGallerySectionProps {
  images: string[];
  gymName: string;
}

export const GymGallerySection = ({ images, gymName }: GymGallerySectionProps) => {
  return (
    <div className="grid grid-cols-2 gap-2">
      {images.map((image, index) => (
        <div 
          key={index} 
          className="h-40 overflow-hidden rounded-lg animate-on-load opacity-0 transition-all duration-500 group" 
          style={{ transform: 'translateY(10px)', transitionDelay: `${400 + index * 100}ms` }}
        >
          <img 
            src={image} 
            alt={`Фото ${index + 1} - ${gymName}`} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
          />
        </div>
      ))}
    </div>
  );
};
