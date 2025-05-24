
import React, { useEffect, useRef } from 'react';
import { Gym } from '@/types';

declare global {
  interface Window {
    ymaps: any;
  }
}

interface YandexMapProps {
  gyms: Gym[];
  selectedGym?: Gym | null;
  onGymSelect?: (gym: Gym) => void;
  height?: string;
}

export const YandexMap = ({ 
  gyms, 
  selectedGym, 
  onGymSelect, 
  height = '400px' 
}: YandexMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const API_KEY = '2c60968a-4c59-44c2-b1e3-84d28d9541d0';

  // Координаты спортзалов в Махачкале
  const gymCoordinates: { [key: string]: [number, number] } = {
    "crossfit-1": [42.9849, 47.5047], // пр. Имама Шамиля, 48
    "gym-1": [42.9765, 47.4985], // ул. Ярагского, 65
    "pool-1": [42.9633, 47.5033], // пр. Петра I, 25
    "yoga-1": [42.9722, 47.5039], // ул. Гагарина, 17
    "box-1": [42.9811, 47.5125], // ул. Коркмасова, 35
    "dance-1": [42.9856, 47.4896] // ул. Дахадаева, 88
  };

  useEffect(() => {
    if (!mapRef.current) return;

    const loadYandexMaps = () => {
      if (window.ymaps) {
        initMap();
        return;
      }

      const script = document.createElement('script');
      script.src = `https://api-maps.yandex.ru/2.1/?apikey=${API_KEY}&lang=ru_RU`;
      script.async = true;
      script.onload = () => {
        window.ymaps.ready(initMap);
      };
      document.head.appendChild(script);
    };

    const initMap = () => {
      if (!mapRef.current || !window.ymaps) return;

      const map = new window.ymaps.Map(mapRef.current, {
        center: [42.9749, 47.5047], // Центр Махачкалы
        zoom: 12,
        controls: ['zoomControl', 'fullscreenControl', 'routeButtonControl']
      });

      mapInstanceRef.current = map;

      // Добавляем маркеры для каждого спортзала
      gyms.forEach((gym) => {
        const coordinates = gymCoordinates[gym.id];
        if (!coordinates) return;

        const placemark = new window.ymaps.Placemark(
          coordinates,
          {
            balloonContentHeader: `<strong>${gym.name}</strong>`,
            balloonContentBody: `
              <div style="max-width: 250px;">
                <p><strong>Адрес:</strong> ${gym.address || gym.location}</p>
                <p><strong>Рейтинг:</strong> ⭐ ${gym.rating}/5 (${gym.review_count} отзывов)</p>
                <p><strong>Категория:</strong> ${gym.category}</p>
                ${gym.working_hours ? `<p><strong>Время работы:</strong> ${gym.working_hours}</p>` : ''}
                ${gym.features ? `<p><strong>Услуги:</strong> ${gym.features.slice(0, 3).join(', ')}</p>` : ''}
              </div>
            `,
            balloonContentFooter: `<a href="/app/gyms/${gym.id}" style="color: #6366f1; text-decoration: none;">Подробнее →</a>`,
            hintContent: gym.name
          },
          {
            preset: getCategoryIcon(gym.category),
            iconColor: getCategoryColor(gym.category)
          }
        );

        placemark.events.add('click', () => {
          if (onGymSelect) {
            onGymSelect(gym);
          }
        });

        map.geoObjects.add(placemark);
      });

      // Если выбран конкретный зал, центрируем карту на нём
      if (selectedGym && gymCoordinates[selectedGym.id]) {
        map.setCenter(gymCoordinates[selectedGym.id], 15);
      }
    };

    loadYandexMaps();

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.destroy();
        mapInstanceRef.current = null;
      }
    };
  }, [gyms, selectedGym]);

  const getCategoryIcon = (category?: string) => {
    switch (category) {
      case 'crossfit':
        return 'islands#redSportIcon';
      case 'gym':
        return 'islands#blueSportIcon';
      case 'pool':
        return 'islands#lightBlueSportIcon';
      case 'yoga':
        return 'islands#greenSportIcon';
      case 'boxing':
        return 'islands#darkOrangeSportIcon';
      case 'dance':
        return 'islands#pinkSportIcon';
      default:
        return 'islands#violetSportIcon';
    }
  };

  const getCategoryColor = (category?: string) => {
    switch (category) {
      case 'crossfit':
        return '#dc2626';
      case 'gym':
        return '#2563eb';
      case 'pool':
        return '#0891b2';
      case 'yoga':
        return '#16a34a';
      case 'boxing':
        return '#ea580c';
      case 'dance':
        return '#ec4899';
      default:
        return '#8b5cf6';
    }
  };

  return (
    <div 
      ref={mapRef} 
      style={{ width: '100%', height }}
      className="rounded-lg border border-slate-700 overflow-hidden"
    />
  );
};
