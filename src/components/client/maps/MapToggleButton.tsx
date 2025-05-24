
import React from 'react';
import { Button } from '@/components/ui/button';
import { Map, List } from 'lucide-react';

interface MapToggleButtonProps {
  showMap: boolean;
  onToggle: () => void;
}

export const MapToggleButton = ({ showMap, onToggle }: MapToggleButtonProps) => {
  return (
    <Button 
      variant="outline" 
      size="sm"
      onClick={onToggle}
      className="bg-slate-800/50 backdrop-blur-sm border-slate-700 text-slate-300 hover:bg-slate-700/50"
    >
      {showMap ? (
        <>
          <List className="h-4 w-4 mr-2" />
          Список
        </>
      ) : (
        <>
          <Map className="h-4 w-4 mr-2" />
          Карта
        </>
      )}
    </Button>
  );
};
