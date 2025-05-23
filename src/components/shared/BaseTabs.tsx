
import { cn } from "@/lib/utils";

interface BaseTabsProps<T extends string> {
  items: T[];
  selectedItem: T;
  setSelectedItem: (item: T) => void;
  className?: string;
  itemClassName?: string;
  animationDelay?: string;
}

export const BaseTabs = <T extends string>({
  items,
  selectedItem,
  setSelectedItem,
  className,
  itemClassName,
  animationDelay
}: BaseTabsProps<T>) => {
  return (
    <div className={cn("flex w-full overflow-x-auto pb-1 no-scrollbar", className)}>
      <div className="flex gap-2 min-w-max">
        {items.map((item, index) => (
          <button
            key={item}
            onClick={() => setSelectedItem(item)}
            className={cn(
              "px-3 py-1.5 rounded-md text-sm font-medium whitespace-nowrap transition-colors",
              selectedItem === item
                ? "bg-primary text-primary-foreground"
                : "bg-muted hover:bg-muted/80 text-muted-foreground",
              itemClassName,
              animationDelay ? `animate-fade-in animation-delay-${animationDelay}` : 
                               `animate-fade-in animation-delay-${index * 100}ms`
            )}
          >
            {item}
          </button>
        ))}
      </div>
    </div>
  );
};
