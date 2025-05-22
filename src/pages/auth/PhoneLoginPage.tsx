
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/auth_context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";

const PhoneLoginPage = () => {
  const [phone, set_phone] = useState("");
  const [verification_code, set_verification_code] = useState("");
  const [is_code_sent, set_is_code_sent] = useState(false);
  const [error, set_error] = useState("");
  const [is_loading, set_is_loading] = useState(false);
  const { phoneLogin, login_with_phone } = useAuth();
  const navigate = useNavigate();

  const handle_send_code = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    set_error("");
    set_is_loading(true);

    try {
      const result = await phoneLogin(phone);
      
      if (result.success) {
        set_is_code_sent(true);
      } else {
        set_error(result.error || "Не удалось отправить код подтверждения. Пожалуйста, попробуйте еще раз.");
      }
    } catch (err) {
      set_error("Не удалось отправить код подтверждения. Пожалуйста, попробуйте еще раз.");
    } finally {
      set_is_loading(false);
    }
  };

  const handle_verify_code = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    set_error("");
    set_is_loading(true);

    try {
      const result = await login_with_phone(phone, verification_code);
      
      if (result.success) {
        navigate("/app");
      } else {
        set_error(result.error || "Неверный код подтверждения. Пожалуйста, попробуйте еще раз.");
      }
    } catch (err) {
      set_error("Неверный код подтверждения. Пожалуйста, попробуйте еще раз.");
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
            Назад
          </Link>
          <h1 className="text-2xl font-bold text-center">GoodFit</h1>
        </div>
        
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">
              {is_code_sent ? "Введите код подтверждения" : "Вход по номеру телефона"}
            </CardTitle>
            <CardDescription className="text-center">
              {is_code_sent
                ? "Мы отправили код подтверждения на ваш номер"
                : "Введите свой номер телефона для входа или создания аккаунта"}
            </CardDescription>
          </CardHeader>
          
          {!is_code_sent ? (
            <form onSubmit={handle_send_code}>
              <CardContent className="space-y-4">
                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-md text-sm">
                    {error}
                  </div>
                )}
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
              </CardContent>
              <CardFooter className="flex flex-col space-y-4">
                <Button
                  type="submit"
                  className="w-full"
                  disabled={is_loading}
                >
                  {is_loading ? "Отправка кода..." : "Отправить код подтверждения"}
                </Button>
                <div className="text-center text-sm">
                  <Link to="/login" className="text-primary hover:underline">
                    Другие способы входа
                  </Link>
                </div>
              </CardFooter>
            </form>
          ) : (
            <form onSubmit={handle_verify_code}>
              <CardContent className="space-y-4">
                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-md text-sm">
                    {error}
                  </div>
                )}
                <div className="space-y-2">
                  <label htmlFor="code" className="text-sm font-medium">
                    Код подтверждения
                  </label>
                  <Input
                    id="code"
                    type="text"
                    value={verification_code}
                    onChange={(e) => set_verification_code(e.target.value)}
                    placeholder="Введите 6-значный код"
                    maxLength={6}
                    required
                  />
                </div>
              </CardContent>
              <CardFooter className="flex flex-col space-y-4">
                <Button
                  type="submit"
                  className="w-full"
                  disabled={is_loading}
                >
                  {is_loading ? "Проверка..." : "Подтвердить и войти"}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  className="w-full"
                  onClick={() => set_is_code_sent(false)}
                  disabled={is_loading}
                >
                  Вернуться к вводу номера телефона
                </Button>
              </CardFooter>
            </form>
          )}
        </Card>
      </div>
    </div>
  );
};

export default PhoneLoginPage;
