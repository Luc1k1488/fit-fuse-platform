
import { CitySelector } from "./CitySelector";
import { CategoryTabs } from "./CategoryTabs";

interface GymFiltersProps {
  cities: string[];
  categories: string[];
  selectedCity: string;
  selectedCategory: string;
  setSelectedCity: (city: string) => void;
  setSelectedCategory: (category: string) => void;
}

export const GymFilters = ({
  cities,
  categories,
  selectedCity,
  selectedCategory,
  setSelectedCity,
  setSelectedCategory
}: GymFiltersProps) => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-2">
        <CitySelector 
          cities={cities} 
          selectedCity={selectedCity} 
          setSelectedCity={setSelectedCity} 
        />
      </div>
      
      <div className="mb-2 overflow-auto w-full">
        <CategoryTabs
          categories={categories}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
        />
      </div>
    </div>
  );
};
