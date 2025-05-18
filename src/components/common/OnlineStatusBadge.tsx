
import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff } from 'lucide-react';
import { toast } from 'sonner';

const OnlineStatusBadge = () => {
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      toast.success('Соединение восстановлено');
    };
    
    const handleOffline = () => {
      setIsOnline(false);
      toast.warning('Нет подключения к интернету');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline) {
    return null;
  }

  return (
    <div className="bg-yellow-100 text-yellow-800 py-2 px-4 mb-4 rounded-md flex items-center text-sm">
      <WifiOff size={16} className="mr-2" />
      <span>Режим оффлайн. Некоторые функции могут быть недоступны.</span>
    </div>
  );
};

export default OnlineStatusBadge;
