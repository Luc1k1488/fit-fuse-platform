
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface BaseTabsProps {
  items: string[];
  selectedItem: string;
  setSelectedItem: (item: string) => void;
  className?: string;
  animationDelay?: string;
}

export const BaseTabs = ({ 
  items, 
  selectedItem, 
  setSelectedItem, 
  className = "w-full",
  animationDelay
}: BaseTabsProps) => {
  const animationClass = animationDelay ? `animate-fade-in animation-delay-${animationDelay}` : "";

  return (
    <Tabs defaultValue={selectedItem} value={selectedItem} className={`${className} ${animationClass}`}>
      <TabsList className="w-full overflow-x-auto flex pb-1 bg-gray-800">
        {items.map((item) => (
          <TabsTrigger
            key={item}
            value={item}
            onClick={() => setSelectedItem(item)}
            className="whitespace-nowrap transition-all hover:scale-105"
          >
            {item}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
};
