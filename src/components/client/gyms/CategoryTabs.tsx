
import { BaseTabs } from "@/components/shared/BaseTabs";

interface CategoryTabsProps {
  categories: string[];
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
}

export const CategoryTabs = ({ categories, selectedCategory, setSelectedCategory }: CategoryTabsProps) => {
  return (
    <BaseTabs
      items={categories}
      selectedItem={selectedCategory}
      setSelectedItem={setSelectedCategory}
      className="w-full"
    />
  );
};
