
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/auth_context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Mail, Lock, User } from "lucide-react";

const RegisterPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    
    // Проверка совпадения паролей
    if (password !== confirmPassword) {
      setError("Пароли не совпадают");
      return;
    }

    // Проверка сложности пароля
    if (password.length < 6) {
      setError("Пароль должен содержать не менее 6 символов");
      return;
    }
    
    setIsLoading(true);

    try {
      const result = await register(email, password, name);
      
      if (result.success) {
        navigate("/app", { replace: true });
      } else {
        setError(result.error || "Ошибка регистрации. Попробуйте еще раз.");
      }
    } catch (err) {
      console.error("Registration error:", err);
      setError("Произошла ошибка при регистрации");
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
            <CardTitle className="text-2xl font-bold text-center">Создайте аккаунт</CardTitle>
            <CardDescription className="text-center">
              Введите данные для регистрации
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
                <label htmlFor="name" className="text-sm font-medium">
                  Имя
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ваше имя"
                    required
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ivan@example.com"
                    required
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium">
                  Пароль
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Создайте пароль"
                    required
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="text-sm font-medium">
                  Подтверждение пароля
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Повторите пароль"
                    required
                    className="pl-10"
                  />
                </div>
              </div>
              <p className="text-xs text-gray-500">
                Регистрируясь, вы соглашаетесь с{" "}
                <Link to="/info/terms" className="text-primary hover:underline">
                  Условиями использования
                </Link>{" "}
                и{" "}
                <Link to="/info/privacy" className="text-primary hover:underline">
                  Политикой конфиденциальности
                </Link>
              </p>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? "Регистрация..." : "Зарегистрироваться"}
              </Button>
              <div className="text-center text-sm">
                Уже есть аккаунт?{" "}
                <Link to="/login" className="text-primary hover:underline">
                  Войти
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default RegisterPage;
