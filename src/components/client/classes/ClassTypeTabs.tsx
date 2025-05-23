
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ClassTypeTabsProps {
  classTypes: string[];
  selectedType: string;
  setSelectedType: (type: string) => void;
}

export const ClassTypeTabs = ({ classTypes, selectedType, setSelectedType }: ClassTypeTabsProps) => {
  return (
    <Tabs defaultValue={selectedType} value={selectedType} className="w-full animate-fade-in animation-delay-400">
      <TabsList className="w-full overflow-x-auto flex pb-1 bg-gray-800">
        {classTypes.map((type) => (
          <TabsTrigger
            key={type}
            value={type}
            onClick={() => setSelectedType(type)}
            className="whitespace-nowrap transition-all hover:scale-105"
          >
            {type}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
};
