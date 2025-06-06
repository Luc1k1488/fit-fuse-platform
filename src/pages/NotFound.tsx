
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex flex-col items-center justify-center p-4">
      <div className="text-center max-w-md">
        <h1 className="text-white text-9xl font-bold mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-white mb-4">Страница не найдена</h2>
        <p className="text-slate-300 mb-8">
          Извините, страница, которую вы ищете, не существует или была перемещена.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/">
            <Button className="flex items-center gap-2 w-full">
              <Home className="h-4 w-4" />
              На главную
            </Button>
          </Link>
          <Link to="/app">
            <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-800 w-full">
              В приложение
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
