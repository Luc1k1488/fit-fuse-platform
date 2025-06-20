
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/auth_context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login, user, is_loading } = useAuth();
  const navigate = useNavigate();

  // Простая проверка загрузки без редиректов
  if (is_loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          <p className="text-gray-600">Загрузка...</p>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    console.log("Attempting login with:", email);

    try {
      const result = await login(email, password);
      
      console.log("Login result:", result);
      
      if (result.success) {
        console.log("Login successful, waiting for user role update...");
        
        // Используем более длительную задержку и проверяем состояние пользователя
        setTimeout(() => {
          // Проверяем текущее состояние пользователя в контексте
          const currentUser = JSON.parse(localStorage.getItem('sb-ymxqdmojesynwqbiiscd-auth-token') || '{}')?.user;
          const userRole = currentUser?.user_metadata?.role;
          
          console.log("Post-login user data:", currentUser);
          console.log("User role for redirection:", userRole);
          
          // Навигация на основе роли
          switch (userRole) {
            case "admin":
              console.log("Redirecting admin to /admin/dashboard");
              navigate("/admin/dashboard", { replace: true });
              break;
            case "partner":
              console.log("Redirecting partner to /partner/dashboard");
              navigate("/partner/dashboard", { replace: true });
              break;
            case "support":
              console.log("Redirecting support to /support/dashboard");
              navigate("/support/dashboard", { replace: true });
              break;
            default:
              console.log("Redirecting regular user to /app");
              navigate("/app", { replace: true });
              break;
          }
        }, 1000); // Увеличиваем задержку до 1 секунды
      } else {
        console.error("Login failed:", result.error);
        setError(result.error || "Неверный email или пароль");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Произошла ошибка при входе");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4">
      <div className="max-w-md w-full">
        <div className="mb-6 flex items-center justify-between">
          <Link to="/" className="flex items-center text-gray-600">
            <ArrowLeft className="mr-2 h-4 w-4" />
            На главную
          </Link>
          <h1 className="text-2xl font-bold text-center">GoodFit</h1>
        </div>
        
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Добро пожаловать</CardTitle>
            <CardDescription className="text-center">
              Войдите в свой аккаунт
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-md text-sm">
                  {error}
                </div>
              )}
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ivan@example.com"
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium">
                  Пароль
                </label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Введите пароль"
                  required
                />
              </div>
              <div className="text-sm text-gray-600">
                Для тестирования используйте:<br/>
                Email: partner@test.com<br/>
                Пароль: partner123
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? "Входим..." : "Войти"}
              </Button>
              <div className="text-center text-sm space-y-2">
                <div>
                  <Link to="/forgot-password" className="text-primary hover:underline">
                    Забыли пароль?
                  </Link>
                </div>
                <div>
                  Нет аккаунта?{" "}
                  <Link to="/register" className="text-primary hover:underline">
                    Зарегистрироваться
                  </Link>
                </div>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;
