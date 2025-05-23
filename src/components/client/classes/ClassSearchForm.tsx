
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface ClassSearchFormProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  handleSearch: (e: React.FormEvent<HTMLFormElement>) => void;
}

export const ClassSearchForm = ({ searchQuery, setSearchQuery, handleSearch }: ClassSearchFormProps) => {
  return (
    <form onSubmit={handleSearch} className="mb-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        <Input
          type="text"
          placeholder="Поиск занятий, тренеров, залов..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 pr-4 py-2 rounded-lg border-gray-700 bg-gray-800 text-white"
        />
        <Button type="submit" className="absolute right-2 top-1/2 transform -translate-y-1/2 transition-all hover:scale-105">
          Поиск
        </Button>
      </div>
    </form>
  );
};
