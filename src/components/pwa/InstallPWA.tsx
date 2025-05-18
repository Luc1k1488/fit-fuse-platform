
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
};

const InstallPWA = () => {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      // Предотвращаем стандартное поведение браузера
      e.preventDefault();
      
      // Сохраняем событие для использования позже
      setInstallPrompt(e as BeforeInstallPromptEvent);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Проверяем, установлено ли уже приложение
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstallable(false);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!installPrompt) return;
    
    // Показываем пользователю запрос на установку
    installPrompt.prompt();
    
    // Ждем ответа пользователя
    const choiceResult = await installPrompt.userChoice;
    
    // Если пользователь принял предложение, скрываем кнопку
    if (choiceResult.outcome === 'accepted') {
      setIsInstallable(false);
    }
    
    // Сбрасываем сохраненное событие
    setInstallPrompt(null);
  };

  if (!isInstallable) {
    return null;
  }

  return (
    <div className="fixed bottom-20 left-0 right-0 flex justify-center z-20 px-4">
      <Button 
        onClick={handleInstallClick} 
        className="shadow-lg flex items-center justify-center gap-2 px-6 py-3"
      >
        <Download size={18} />
        <span>Установить приложение</span>
      </Button>
    </div>
  );
};

export default InstallPWA;
