
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";

const RegisterPage = () => {
  const [name, set_name] = useState("");
  const [phone, set_phone] = useState("");
  const [email, set_email] = useState("");
  const [error, set_error] = useState("");
  const [is_loading, set_is_loading] = useState(false);
  const navigate = useNavigate();

  const handle_submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    set_error("");
    set_is_loading(true);

    try {
      // В реальном приложении здесь была бы регистрация через API
      // Для демо имитируем процесс
      await new Promise(resolve => setTimeout(resolve, 1000));
      navigate("/login/phone");
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
          <Link to="/" className="flex items-center text-gray-600">
            <ArrowLeft className="mr-2 h-4 w-4" />
            На главную
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
                  Имя и фамилия
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
                <label htmlFor="phone" className="text-sm font-medium">
                  Номер телефона
                </label>
                <Input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => set_phone(e.target.value)}
                  placeholder="+7 (999) 123-45-67"
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Email (необязательно)
                </label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => set_email(e.target.value)}
                  placeholder="ivan@example.com"
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
