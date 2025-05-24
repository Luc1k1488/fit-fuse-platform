
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
  setSelectedCategory
}: GymFiltersProps) => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-2 mb-2 overflow-auto no-scrollbar">
        <CitySelector 
          cities={cities} 
          selectedCity={selectedCity} 
          setSelectedCity={setSelectedCity} 
        />
      </div>
      
      <div className="mb-2 overflow-auto w-full no-scrollbar">
        <CategoryTabs
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />
      </div>
    </div>
  );
};
