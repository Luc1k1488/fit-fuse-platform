
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { DarkCard } from "@/components/ui/dark-card";
import { Bluetooth, BluetoothConnected, BluetoothOff, Activity } from "lucide-react";
import { toast } from "sonner";

interface FitnessTrackerConnectProps {
  onConnect?: (data: any) => void;
}

// Имитация списка устройств
const mockDevices = [
  { id: "device-1", name: "Fitness Watch Pro", type: "Часы", battery: 75, connected: false },
  { id: "device-2", name: "Health Band 2", type: "Браслет", battery: 90, connected: false },
  { id: "device-3", name: "Smart Tracker X1", type: "Трекер", battery: 50, connected: false },
];

export const FitnessTrackerConnect: React.FC<FitnessTrackerConnectProps> = ({
  onConnect
}) => {
  const [open, setOpen] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [devices, setDevices] = useState(mockDevices);
  const [connectedDevice, setConnectedDevice] = useState<any>(null);
  
  const handleScan = () => {
    setScanning(true);
    
    // Имитация процесса поиска устройств
    setTimeout(() => {
      setScanning(false);
      // Здесь в реальном приложении был бы поиск реальных устройств через Bluetooth API
      toast.success("Поиск завершен", {
        description: `Найдено ${devices.length} устройств`,
      });
    }, 3000);
  };
  
  const handleConnect = (device: any) => {
    // Имитация подключения к устройству
    toast.loading("Подключение...");
    
    setTimeout(() => {
      const updatedDevices = devices.map(d => 
        d.id === device.id ? { ...d, connected: true } : { ...d, connected: false }
      );
      
      setDevices(updatedDevices);
      setConnectedDevice({ ...device, connected: true });
      
      toast.success("Подключено успешно", {
        description: `Устройство ${device.name} подключено`,
      });
      
      if (onConnect) {
        onConnect({ device: { ...device, connected: true } });
      }
      
      setOpen(false);
    }, 2000);
  };
  
  const handleDisconnect = () => {
    if (!connectedDevice) return;
    
    toast.loading("Отключение...");
    
    setTimeout(() => {
      const updatedDevices = devices.map(d => 
        d.id === connectedDevice.id ? { ...d, connected: false } : d
      );
      
      setDevices(updatedDevices);
      setConnectedDevice(null);
      
      toast.success("Устройство отключено");
    }, 1000);
  };
  
  const renderConnectedDevice = () => {
    if (!connectedDevice) {
      return (
        <DarkCard 
          className="p-4 text-center animate-fade-in" 
          variant="intense" 
          gradient 
          hoverEffect="raise"
          onClick={() => setOpen(true)}
        >
          <BluetoothOff className="h-12 w-12 mx-auto text-gray-500 mb-2" />
          <h3 className="font-medium text-white">Нет подключенных устройств</h3>
          <p className="text-sm text-gray-400 mt-1 mb-3">
            Подключите фитнес-трекер или умные часы для синхронизации данных
          </p>
          <Button>Подключить устройство</Button>
        </DarkCard>
      );
    }
    
    return (
      <DarkCard className="p-4 animate-fade-in" gradient>
        <div className="flex items-center mb-3">
          <div className="flex-1">
            <div className="flex items-center">
              <BluetoothConnected className="h-5 w-5 text-primary mr-1.5 animate-pulse-light" />
              <h3 className="font-medium text-white">{connectedDevice.name}</h3>
            </div>
            <p className="text-sm text-gray-400 mt-0.5">
              {connectedDevice.type} • Заряд: {connectedDevice.battery}%
            </p>
          </div>
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleDisconnect}
          >
            Отключить
          </Button>
        </div>
        
        <div className="bg-gray-800 rounded-lg p-3">
          <div className="flex justify-between items-center">
            <span className="text-sm">Последняя синхронизация</span>
            <span className="text-xs text-gray-400">Только что</span>
          </div>
          <div className="flex justify-between items-center mt-2">
            <span className="text-sm">Шаги сегодня</span>
            <span className="text-sm font-medium">8,342</span>
          </div>
          <div className="flex justify-between items-center mt-1">
            <span className="text-sm">Калории сожжено</span>
            <span className="text-sm font-medium">345</span>
          </div>
          <div className="flex justify-between items-center mt-1">
            <span className="text-sm">Активное время</span>
            <span className="text-sm font-medium">1ч 15м</span>
          </div>
        </div>
        
        <Button variant="outline" className="w-full mt-3" onClick={() => setOpen(true)}>
          <Activity className="h-4 w-4 mr-1" />
          Синхронизировать данные
        </Button>
      </DarkCard>
    );
  };
  
  return (
    <>
      {renderConnectedDevice()}
      
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[500px] bg-gray-900 border-gray-800 text-white">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Bluetooth className="h-5 w-5 mr-2" />
              Подключение фитнес-устройств
            </DialogTitle>
            <DialogDescription>
              Подключите свое фитнес-устройство для синхронизации данных активности
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <div className="mb-4">
              <Button 
                variant="outline" 
                className="w-full" 
                onClick={handleScan}
                disabled={scanning}
              >
                {scanning ? (
                  <>
                    <span className="animate-spin h-4 w-4 mr-2 border-2 border-gray-400 rounded-full border-t-transparent"></span>
                    Поиск устройств...
                  </>
                ) : (
                  <>
                    <Bluetooth className="h-4 w-4 mr-1" />
                    Сканировать устройства
                  </>
                )}
              </Button>
            </div>
            
            <h3 className="text-sm font-medium mb-2">Доступные устройства</h3>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {devices.map(device => (
                <div 
                  key={device.id}
                  className={`p-3 rounded-lg border flex items-center justify-between transition-all hover:translate-x-1 ${
                    device.connected 
                      ? 'border-primary bg-primary/10' 
                      : 'border-gray-800 bg-gray-800/50'
                  }`}
                >
                  <div>
                    <div className="flex items-center">
                      {device.connected ? (
                        <BluetoothConnected className="h-4 w-4 text-primary mr-1.5" />
                      ) : (
                        <Bluetooth className="h-4 w-4 mr-1.5" />
                      )}
                      <span className="font-medium">{device.name}</span>
                    </div>
                    <div className="flex items-center text-xs text-gray-400 mt-1">
                      <span>{device.type}</span>
                      <div className="mx-1.5 h-1 w-1 rounded-full bg-gray-600"></div>
                      <span>Заряд: {device.battery}%</span>
                    </div>
                  </div>
                  <Button
                    variant={device.connected ? "outline" : "default"}
                    size="sm"
                    onClick={() => handleConnect(device)}
                    disabled={device.connected}
                  >
                    {device.connected ? "Подключено" : "Подключить"}
                  </Button>
                </div>
              ))}
            </div>
            
            <div className="mt-4">
              <p className="text-xs text-gray-400">
                Примечание: Для подключения убедитесь, что Bluetooth включен на вашем устройстве. 
                Держите устройство в пределах 10 метров для стабильного соединения.
              </p>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Закрыть
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
