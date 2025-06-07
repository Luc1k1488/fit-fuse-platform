
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/auth_context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

const AdminLoginPage = () => {
  const [email, set_email] = useState("");
  const [password, set_password] = useState("");
  const [error, set_error] = useState("");
  const [is_loading, set_is_loading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handle_submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    set_error("");
    set_is_loading(true);

    console.log("Admin login attempt for:", email);

    try {
      const result = await login(email, password);
      console.log("Login result:", result);
      
      if (result.success) {
        toast({
          title: "Успешный вход",
          description: "Вы успешно вошли в систему",
          variant: "default",
        });
        
        // Небольшая задержка, чтобы состояние auth обновилось
        setTimeout(() => {
          navigate("/admin/dashboard");
        }, 100);
      } else {
        set_error(result.error || "Неверные учетные данные. Пожалуйста, попробуйте снова.");
      }
    } catch (err) {
      console.error("Login error:", err);
      set_error("Неверные учетные данные. Пожалуйста, попробуйте снова.");
    } finally {
      set_is_loading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center text-gray-900">Вход для администраторов</CardTitle>
          <CardDescription className="text-center text-gray-600">
            Введите ваши учетные данные для доступа к панели управления
          </CardDescription>
        </CardHeader>
        <form onSubmit={handle_submit}>
          <CardContent className="space-y-4">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-md text-sm">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-gray-700">
                Email
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => set_email(e.target.value)}
                placeholder="admin@example.com"
                required
                className="bg-white border-gray-300"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Пароль
                </label>
                <Link
                  to="/forgot-password"
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  Забыли пароль?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => set_password(e.target.value)}
                placeholder="••••••••"
                required
                className="bg-white border-gray-300"
              />
            </div>
            <div className="text-sm text-gray-600">
              Для входа в панель администратора используйте:<br/>
              Email: admin@example.com<br/>
              Пароль: admin123
            </div>
          </CardContent>
          <CardFooter>
            <Button
              type="submit"
              className="w-full"
              disabled={is_loading}
            >
              {is_loading ? "Выполняется вход..." : "Войти в систему"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default AdminLoginPage;
