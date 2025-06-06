import { useEffect, useRef } from "react";
import { Gym } from "@/types";

interface YandexMapProps {
  gyms: Gym[];
  selectedGym: Gym | null;
  onGymSelect: (gym: Gym) => void;
  height?: string;
}

export const YandexMap = ({ gyms, selectedGym, onGymSelect, height = "400px" }: YandexMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Здесь будет инициализация Яндекс.Карт
    // Пока заглушка
    console.log("Initializing Yandex Map with gyms:", gyms);
  }, [gyms]);

  return (
    <div 
      ref={mapRef} 
      style={{ height }}
      className="w-full bg-slate-700 flex items-center justify-center text-slate-400"
    >
      <div className="text-center">
        <p className="mb-2">🗺️ Карта залов</p>
        <p className="text-sm">Найдено {gyms.length} залов в Махачкале</p>
        {selectedGym && (
          <p className="text-xs mt-2 text-purple-400">
            Выбран: {selectedGym.name}
          </p>
        )}
      </div>
    </div>
  );
};
