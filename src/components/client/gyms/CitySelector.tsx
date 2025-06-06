
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CitySelectorProps {
  cities: string[];
  selectedCity: string;
  onCityChange: (city: string) => void;
}

export const CitySelector = ({ cities, selectedCity, onCityChange }: CitySelectorProps) => {
  return (
    <Select value={selectedCity} onValueChange={onCityChange}>
      <SelectTrigger className="bg-slate-800/50 border-slate-700 text-white">
        <SelectValue placeholder="Выберите город" />
      </SelectTrigger>
      <SelectContent className="bg-slate-800 border-slate-700">
        {cities.map((city) => (
          <SelectItem key={city} value={city} className="text-white hover:bg-slate-700">
            {city}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
