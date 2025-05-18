
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  // Determine where to redirect based on the current path
  const get_return_link = () => {
    if (location.pathname.startsWith("/admin")) {
      return {
        path: "/admin/dashboard",
        text: "Back to Admin Dashboard"
      };
    } else if (location.pathname.startsWith("/app")) {
      return {
        path: "/app",
        text: "Back to Client Dashboard"
      };
    } else {
      return {
        path: "/",
        text: "Back to Home"
      };
    }
  };

  const return_link = get_return_link();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="text-center max-w-md">
        <h1 className="text-9xl font-bold text-primary">404</h1>
        <h2 className="text-2xl font-semibold mt-4 mb-2">Page Not Found</h2>
        <p className="text-gray-600 mb-8">
          We couldn't find the page you were looking for. It might have been moved or doesn't exist.
        </p>
        <div className="space-y-3">
          <Link to={return_link.path}>
            <Button className="w-full">{return_link.text}</Button>
          </Link>
          <Link to="/">
            <Button variant="outline" className="w-full">
              Visit Main Website
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
