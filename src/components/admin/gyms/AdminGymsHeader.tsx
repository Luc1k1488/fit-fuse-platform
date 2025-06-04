
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus } from "lucide-react";

interface AdminGymsHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  totalGyms: number;
  onCreateGym: () => void;
}

export const AdminGymsHeader = ({
  searchQuery,
  onSearchChange,
  totalGyms,
  onCreateGym
}: AdminGymsHeaderProps) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <div>
        <h1 className="text-3xl font-bold">Управление залами</h1>
        <p className="text-muted-foreground">Найдено залов: {totalGyms}</p>
      </div>
      
      <div className="flex gap-4 items-center">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input
            type="text"
            placeholder="Поиск залов..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 w-64"
          />
        </div>
        
        <Button onClick={onCreateGym}>
          <Plus className="h-4 w-4 mr-2" />
          Создать зал
        </Button>
      </div>
    </div>
  );
};
