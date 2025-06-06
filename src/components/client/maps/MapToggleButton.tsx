
import { Map, List } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MapToggleButtonProps {
  showMap: boolean;
  onToggle: () => void;
}

export const MapToggleButton = ({ showMap, onToggle }: MapToggleButtonProps) => {
  return (
    <Button
      onClick={onToggle}
      variant="outline"
      size="sm"
      className="bg-slate-800/50 border-slate-700 text-slate-300 hover:bg-slate-700/50"
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
