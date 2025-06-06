
import { Button } from "@/components/ui/button";

const categories = [
  { id: "all", name: "Все", emoji: "🏋️" },
  { id: "Премиум", name: "Премиум", emoji: "💎" },
  { id: "Фитнес", name: "Фитнес", emoji: "💪" },
  { id: "Йога", name: "Йога", emoji: "🧘" },
  { id: "Кроссфит", name: "Кроссфит", emoji: "🔥" },
  { id: "Бокс", name: "Бокс", emoji: "🥊" },
  { id: "Велнес", name: "Велнес", emoji: "🌿" },
];

interface CategoryTabsProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

export const CategoryTabs = ({ selectedCategory, onCategoryChange }: CategoryTabsProps) => {
  return (
    <div className="overflow-x-auto pb-2">
      <div className="flex gap-2 min-w-max">
        {categories.map((category) => (
          <Button
            key={category.id}
            variant={selectedCategory === category.id ? "default" : "outline"}
            size="sm"
            onClick={() => onCategoryChange(category.id)}
            className={`whitespace-nowrap transition-all ${
              selectedCategory === category.id
                ? "bg-gradient-to-r from-purple-500 to-blue-600 text-white border-transparent"
                : "bg-slate-800/50 border-slate-700 text-slate-300 hover:bg-slate-700/50"
            }`}
          >
            <span className="mr-1">{category.emoji}</span>
            {category.name}
          </Button>
        ))}
      </div>
    </div>
  );
};
