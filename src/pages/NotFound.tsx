
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 bg-gray-50">
      <div className="w-full max-w-md text-center">
        <h1 className="text-9xl font-bold text-primary mb-4">404</h1>
        <h2 className="text-2xl font-bold mb-6">Страница не найдена</h2>
        
        <p className="text-gray-600 mb-8">
          Извините, страница, которую вы ищете, не существует или была перемещена.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild>
            <Link to="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              На главную
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/contact">Связаться с поддержкой</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
