
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/auth_context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";

const RegisterPage = () => {
  const [name, set_name] = useState("");
  const [phone, set_phone] = useState("");
  const [email, set_email] = useState("");
  const [password, set_password] = useState("");
  const [confirmPassword, set_confirmPassword] = useState("");
  const [error, set_error] = useState("");
  const [is_loading, set_is_loading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handle_submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    set_error("");

    // Валидация
    if (!email || !password || !name) {
      set_error("Пожалуйста, заполните все обязательные поля");
      return;
    }

    if (password !== confirmPassword) {
      set_error("Пароли не совпадают");
      return;
    }

    if (password.length < 6) {
      set_error("Пароль должен содержать минимум 6 символов");
      return;
    }

    set_is_loading(true);

    try {
      const result = await register(email, password, name);
      
      if (result.success) {
        navigate("/login");
      } else {
        set_error(result.error || "Регистрация не удалась. Пожалуйста, попробуйте еще раз.");
      }
    } catch (err) {
      set_error("Регистрация не удалась. Пожалуйста, попробуйте еще раз.");
    } finally {
      set_is_loading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4">
      <div className="max-w-md w-full">
        <div className="mb-6 flex items-center justify-between">
          <Link to="/login" className="flex items-center text-gray-600">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Назад к входу
          </Link>
          <h1 className="text-2xl font-bold text-center">GoodFit</h1>
        </div>
        
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Создать аккаунт</CardTitle>
            <CardDescription className="text-center">
              Введите свои данные для создания аккаунта
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
                <label htmlFor="name" className="text-sm font-medium">
                  Имя и фамилия *
                </label>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => set_name(e.target.value)}
                  placeholder="Иван Иванов"
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Email *
                </label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => set_email(e.target.value)}
                  placeholder="ivan@example.com"
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium">
                  Пароль *
                </label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => set_password(e.target.value)}
                  placeholder="Минимум 6 символов"
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="text-sm font-medium">
                  Подтвердите пароль *
                </label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => set_confirmPassword(e.target.value)}
                  placeholder="Повторите пароль"
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="phone" className="text-sm font-medium">
                  Номер телефона (необязательно)
                </label>
                <Input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => set_phone(e.target.value)}
                  placeholder="+7 (999) 123-45-67"
                />
              </div>
              <div className="text-sm text-gray-600">
                Регистрируясь, вы соглашаетесь с нашими{" "}
                <Link to="/terms" className="text-primary hover:underline">
                  Условиями использования
                </Link>{" "}
                и{" "}
                <Link to="/privacy" className="text-primary hover:underline">
                  Политикой конфиденциальности
                </Link>
                .
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button
                type="submit"
                className="w-full"
                disabled={is_loading}
              >
                {is_loading ? "Создание аккаунта..." : "Создать аккаунт"}
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
