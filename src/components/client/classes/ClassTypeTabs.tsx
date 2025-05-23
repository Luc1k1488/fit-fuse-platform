
import { BaseTabs } from "@/components/shared/BaseTabs";

interface ClassTypeTabsProps {
  classTypes: string[];
  selectedType: string;
  setSelectedType: (type: string) => void;
}

export const ClassTypeTabs = ({ classTypes, selectedType, setSelectedType }: ClassTypeTabsProps) => {
  return (
    <BaseTabs
      items={classTypes}
      selectedItem={selectedType}
      setSelectedItem={setSelectedType}
      className="w-full"
      animationDelay="400"
    />
  );
};
