
import { MapPin, Clock, Check } from "lucide-react";
import { Gym } from "@/types";

interface GymInfoSectionProps {
  gym: Gym;
}

export const GymInfoSection = ({ gym }: GymInfoSectionProps) => {
  // Convert gym data for display
  const gymData = {
    name: gym.name || "Unnamed Gym",
    address: gym.address || "Address not provided",
    workingHours: gym.working_hours || "Hours not provided",
    description: gym.description || "No description available",
    features: gym.features || [],
    phone: gym.phone || "Phone number not provided",
  };

  return (
    <div className="px-4 mb-6">
      <h1 className="text-2xl font-bold mb-1 text-white animate-on-load opacity-0 transition-all duration-500" style={{ transform: 'translateY(10px)' }}>
        {gymData.name}
      </h1>
      <div className="flex items-center text-gray-400 animate-on-load opacity-0 transition-all duration-500" style={{ transform: 'translateY(10px)', transitionDelay: '100ms' }}>
        <MapPin className="h-4 w-4 mr-1" />
        <span>{gymData.address}</span>
      </div>
      <div className="flex items-center text-gray-400 mt-1 animate-on-load opacity-0 transition-all duration-500" style={{ transform: 'translateY(10px)', transitionDelay: '200ms' }}>
        <Clock className="h-4 w-4 mr-1" />
        <span>{gymData.workingHours}</span>
      </div>
      
      <div className="space-y-4 mt-6">
        <div className="animate-on-load opacity-0 transition-all duration-500" style={{ transform: 'translateY(10px)', transitionDelay: '400ms' }}>
          <h3 className="font-medium mb-2 text-white">О зале</h3>
          <p className="text-gray-400">{gymData.description}</p>
        </div>
        
        <div className="animate-on-load opacity-0 transition-all duration-500" style={{ transform: 'translateY(10px)', transitionDelay: '500ms' }}>
          <h3 className="font-medium mb-2 text-white">Удобства и услуги</h3>
          <div className="grid grid-cols-2 gap-2">
            {gymData.features.map((feature, index) => (
              <div key={index} className="flex items-center group">
                <Check className="h-4 w-4 text-primary mr-2 group-hover:scale-110 transition-transform" />
                <span className="text-sm text-gray-300 group-hover:text-white transition-colors">{feature}</span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="animate-on-load opacity-0 transition-all duration-500" style={{ transform: 'translateY(10px)', transitionDelay: '600ms' }}>
          <h3 className="font-medium mb-2 text-white">Контакты</h3>
          <p className="text-gray-400">{gymData.phone}</p>
        </div>
      </div>
    </div>
  );
};
