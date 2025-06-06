
import { MapPin, Clock, Phone, Globe } from "lucide-react";
import { Gym } from "@/types";

interface GymInfoSectionProps {
  gym: Gym;
}

export const GymInfoSection = ({ gym }: GymInfoSectionProps) => {
  return (
    <div className="space-y-6">
      {/* About */}
      <div>
        <h2 className="text-xl font-semibold text-white mb-4">О зале</h2>
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg p-6">
          {gym.description ? (
            <p className="text-gray-300 leading-relaxed">{gym.description}</p>
          ) : (
            <p className="text-gray-400 italic">Описание зала пока не добавлено</p>
          )}
        </div>
      </div>

      {/* Contact Info */}
      <div>
        <h2 className="text-xl font-semibold text-white mb-4">Контакты</h2>
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg p-6 space-y-4">
          <div className="flex items-center gap-3">
            <MapPin className="h-5 w-5 text-gray-400" />
            <div>
              <p className="text-white font-medium">Адрес</p>
              <p className="text-gray-300">{gym.address}</p>
            </div>
          </div>
          
          {gym.phone && (
            <div className="flex items-center gap-3">
              <Phone className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-white font-medium">Телефон</p>
                <p className="text-gray-300">{gym.phone}</p>
              </div>
            </div>
          )}
          
          {gym.working_hours && (
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-white font-medium">Часы работы</p>
                <p className="text-gray-300">{gym.working_hours}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Features */}
      {gym.features && gym.features.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-white mb-4">Удобства</h2>
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg p-6">
            <div className="grid grid-cols-2 gap-3">
              {gym.features.map((feature, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span className="text-gray-300">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
