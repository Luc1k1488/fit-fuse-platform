
import { Dumbbell } from "lucide-react";
import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const AdminGymsHeader = () => {
  return (
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <Dumbbell className="h-5 w-5" />
        Управление спортзалами
      </CardTitle>
      <CardDescription>
        Создание, редактирование и управление спортзалами
      </CardDescription>
    </CardHeader>
  );
};

export default AdminGymsHeader;
