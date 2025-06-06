
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface GymSearchFormProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onSearch: (e: React.FormEvent<HTMLFormElement>) => void;
}

export const GymSearchForm = ({ searchQuery, setSearchQuery, onSearch }: GymSearchFormProps) => {
  return (
    <form onSubmit={onSearch} className="flex gap-2 mb-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Поиск залов по названию или району..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-400"
        />
      </div>
      <Button type="submit" className="bg-purple-600 hover:bg-purple-700">
        Найти
      </Button>
    </form>
  );
};
