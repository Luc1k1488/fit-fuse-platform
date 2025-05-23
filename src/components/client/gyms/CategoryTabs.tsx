
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface CategoryTabsProps {
  categories: string[];
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
}

export const CategoryTabs = ({ categories, selectedCategory, setSelectedCategory }: CategoryTabsProps) => {
  return (
    <Tabs defaultValue={selectedCategory} value={selectedCategory} className="w-full">
      <TabsList className="w-full overflow-x-auto flex pb-1 mb-2 bg-gray-800">
        {categories.map((category) => (
          <TabsTrigger
            key={category}
            value={category}
            onClick={() => setSelectedCategory(category)}
            className="whitespace-nowrap transition-all hover:scale-105"
          >
            {category}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
};
