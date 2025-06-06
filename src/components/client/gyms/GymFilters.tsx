
import { CitySelector } from "./CitySelector";
import { CategoryTabs } from "./CategoryTabs";

interface GymFiltersProps {
  cities: string[];
  selectedCity: string;
  selectedCategory: string;
  setSelectedCity: (city: string) => void;
  setSelectedCategory: (category: string) => void;
}

export const GymFilters = ({
  cities,
  selectedCity,
  selectedCategory,
  setSelectedCity,
  setSelectedCategory,
}: GymFiltersProps) => {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Город
        </label>
        <CitySelector
          cities={cities}
          selectedCity={selectedCity}
          onCityChange={setSelectedCity}
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Категория
        </label>
        <CategoryTabs
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />
      </div>
    </div>
  );
};
