
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/auth_context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft } from "lucide-react";

const MobileLoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await login(email, password);
      if (result.success) {
        toast({
          title: "Успешный вход",
          description: "Вы успешно вошли в систему",
          variant: "default",
        });
        
        // Обычные пользователи всегда направляются в клиентское приложение,
        // а администраторы, партнеры и поддержка - в их соответствующие панели
        if (email === "admin@example.com") {
          navigate("/admin/dashboard");
        } else if (email.includes("partner")) {
          navigate("/admin/partner");
        } else if (email.includes("support")) {
          navigate("/admin/support-portal");
        } else {
          navigate("/app"); // Все обычные пользователи направляются в клиентское приложение
        }
      } else {
        setError(result.error || "Неверные учетные данные. Пожалуйста, попробуйте снова.");
      }
    } catch (err) {
      setError("Неверные учетные данные. Пожалуйста, попробуйте снова.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
      <div className="max-w-md w-full">
        <div className="mb-6 flex items-center justify-between">
          <Link to="/" className="flex items-center text-gray-600 dark:text-gray-300">
            <ArrowLeft className="mr-2 h-4 w-4" />
            На главную
          </Link>
          <h1 className="text-2xl font-bold text-center dark:text-white">GoodFit</h1>
        </div>
        
        <Card className="w-full max-w-md dark:border-gray-700">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center dark:text-white">Вход в мобильное приложение</CardTitle>
            <CardDescription className="text-center dark:text-gray-400">
              Введите ваш email и пароль для входа
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {error && (
                <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 rounded-md text-sm">
                  {error}
                </div>
              )}
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium dark:text-gray-300">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="user@example.com"
                  required
                  className="dark:bg-gray-800 dark:border-gray-700"
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="text-sm font-medium dark:text-gray-300">
                    Пароль
                  </label>
                  <Link
                    to="/forgot-password"
                    className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    Забыли пароль?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="dark:bg-gray-800 dark:border-gray-700"
                />
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Для входа используйте:<br/>
                <strong>Клиент:</strong> user@example.com / password<br/>
                <strong>Админ:</strong> admin@example.com / admin123<br/>
                <strong>Партнер:</strong> partner@example.com / password
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Button
                type="submit"
                className="w-full"
                disabled={loading}
              >
                {loading ? "Выполняется вход..." : "Войти"}
              </Button>
              <div className="text-center text-sm dark:text-gray-300">
                Нет аккаунта?{" "}
                <Link to="/register" className="text-primary hover:underline">
                  Зарегистрироваться
                </Link>
              </div>
              <div className="text-center">
                <Link
                  to="/login/phone"
                  className="text-sm text-primary hover:underline"
                >
                  Войти по номеру телефона
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default MobileLoginPage;
