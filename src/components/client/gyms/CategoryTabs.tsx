
import { BaseTabs } from "@/components/shared/BaseTabs";

interface CategoryTabsProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

export const CategoryTabs = ({ selectedCategory, onCategoryChange }: CategoryTabsProps) => {
  const categories = [
    { id: "all", label: "Все" },
    { id: "crossfit", label: "Кроссфит" },
    { id: "gym", label: "Тренажерный зал" },
    { id: "pool", label: "Бассейн" },
    { id: "yoga", label: "Йога" },
    { id: "boxing", label: "Бокс" },
    { id: "dance", label: "Танцы" }
  ];

  return (
    <BaseTabs
      items={categories.map(cat => cat.label)}
      selectedItem={categories.find(cat => cat.id === selectedCategory)?.label || "Все"}
      setSelectedItem={(label) => {
        const category = categories.find(cat => cat.label === label);
        if (category) {
          onCategoryChange(category.id);
        }
      }}
      className="w-full"
    />
  );
};
