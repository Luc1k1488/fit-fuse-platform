
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface AdminGymsHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  totalGyms: number;
}

export const AdminGymsHeader = ({ searchQuery, onSearchChange, totalGyms }: AdminGymsHeaderProps) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-bold">Управление залами</h1>
      <div className="relative w-64">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Поиск залов..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-8"
        />
      </div>
    </div>
  );
};
