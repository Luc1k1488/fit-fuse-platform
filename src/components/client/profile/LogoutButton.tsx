
import { LogOut } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const LogoutButton = () => {
  return (
    <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700 animate-fade-in animation-delay-600">
      <CardContent className="p-0">
        <button className="w-full p-4 flex items-center space-x-3 text-red-400 hover:bg-red-500/10 transition-colors">
          <LogOut className="h-5 w-5 flex-shrink-0" />
          <span className="font-medium">Выйти из аккаунта</span>
        </button>
      </CardContent>
    </Card>
  );
};

export default LogoutButton;
