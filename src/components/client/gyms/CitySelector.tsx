
import { Check, MapPin, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface CitySelectorProps {
  cities: string[];
  selectedCity: string;
  setSelectedCity: (city: string) => void;
}

export const CitySelector = ({ cities = [], selectedCity, setSelectedCity }: CitySelectorProps) => {
  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="w-full bg-gray-800 border-gray-700 text-white hover:bg-gray-700 transition-colors">
            <MapPin className="mr-2 h-4 w-4" />
            {selectedCity || "Выберите город"}
            <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="bg-gray-800 border-gray-700 text-white">
          {cities.map((city) => (
            <DropdownMenuItem
              key={city}
              onClick={() => setSelectedCity(city)}
              className="flex items-center justify-between hover:bg-gray-700 transition-colors"
            >
              {city}
              {city === selectedCity && <Check className="h-4 w-4 ml-2 text-primary" />}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
