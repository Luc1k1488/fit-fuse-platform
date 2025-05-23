
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Home } from "lucide-react";
import { useEffect } from "react";

const NotFound = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Attempt to redirect to login for authenticated routes that 404
    const path = window.location.pathname;
    if (path.startsWith("/app/")) {
      console.log("Detected 404 on app route, redirecting to main app page");
      setTimeout(() => {
        navigate("/app");
      }, 3000);
    }
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-md text-center">
        <h1 className="text-9xl font-bold text-primary mb-4">404</h1>
        <h2 className="text-2xl font-bold mb-6">Страница не найдена</h2>
        
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Извините, страница, которую вы ищете, не существует или была перемещена.
          {window.location.pathname.startsWith("/app/") && 
            " Вы будете перенаправлены на главную страницу через 3 секунды."}
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild>
            <Link to="/">
              <Home className="mr-2 h-4 w-4" />
              На главную
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/app">
              <ArrowLeft className="mr-2 h-4 w-4" />
              В приложение
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
